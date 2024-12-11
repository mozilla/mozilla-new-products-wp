<?php
/**
 * Bootstraps WordPress theme related functions, most importantly enqueuing javascript and styles.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Managers;

use MozillaBuilders\Models\PostType\Article;
use MozillaBuilders\Models\PostType\Profile;
use MozillaBuilders\Models\PostType\Project;
use MozillaBuilders\Models\Taxonomy\Cohort;
use MozillaBuilders\Models\Taxonomy\Platform;
use MozillaBuilders\Models\Taxonomy\ProjectCategory;
use MozillaBuilders\Models\Taxonomy\Technology;
use MozillaBuilders\Vite;

use Timber\Timber;

/** Class */
class ThemeManager {

	/**
	 * Array of managers.
	 *
	 * @var array
	 */
	private $managers = array();

	/**
	 * Constructor
	 *
	 * @param array $managers Array of managers.
	 */
	public function __construct( array $managers ) {
		$this->managers = $managers;
	}

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function setup_theme() {
		if ( count( $this->managers ) > 0 ) {
			foreach ( $this->managers as $manager ) {
				$manager->run();
			}
		}

		add_filter( 'script_loader_tag', array( $this, 'add_module_to_vite_scripts' ), 10, 2 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ), 999 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin' ) );
		add_action( 'admin_init', array( $this, 'register_menus' ) );
		add_action( 'init', array( $this, 'register_options' ) );
		add_action( 'init', array( $this, 'register_post_types' ), 1 );
		add_action( 'init', array( $this, 'register_taxonomies' ), 1 );
		add_filter( 'timber/post/classmap', array( $this, 'set_post_classmap' ) );
		add_filter( 'timber/term/classmap', array( $this, 'set_term_classmap' ) );
		add_action( 'pre_get_posts', array( $this, 'filter_posts' ) );
		add_filter( 'admin_footer_text', array( $this, 'add_admin_footer_credit' ) );

		// Yoast SEO.
		add_filter( 'wpseo_meta_author', array( $this, 'set_yoast_author' ) );
		add_filter( 'wpseo_enhanced_slack_data', array( $this, 'set_yoast_slack_data' ) );
		add_filter( 'wpseo_opengraph_author_facebook', '__return_false' );
		add_filter( 'wpseo_schema_person_user_id', '__return_false' );

		// Filetype allowances.
		add_filter( 'upload_mimes', array( $this, 'manage_mime_types' ) );

		$this->setup_theme_support();
	}

	/**
	 * Add `type="module"` to Vite scripts
	 *
	 * @param string $tag The script tag.
	 * @param string $handle The script handle.
	 * @return string
	 */
	public function add_module_to_vite_scripts( $tag, $handle ) {
		if ( str_starts_with( $handle, 'vite:' ) ) {
			return str_replace( 'type="text/javascript"', 'type="module"', $tag );
		}
		return $tag;
	}

	/**
	 * Enqueue javascript using WordPress
	 *
	 * @return void
	 */
	public function enqueue() {
		// Remove default Gutenberg CSS.
		wp_deregister_style( 'wp-block-library' );

		// Remove global inline styles.
		wp_dequeue_style( 'global-styles' );

		// Enqueue JS assets.
		$js_assets = Vite::js_assets();
		if ( array_key_exists( 'app', $js_assets ) ) {
			foreach ( $js_assets['app'] as $asset ) {
				$key     = pathinfo( basename( $asset ), PATHINFO_FILENAME );
				$version = 'production' === WP_ENV ? MOZILLA_BUILDERS_THEME_VERSION : null;
				wp_enqueue_script( 'vite:' . $key, $asset, array(), $version );
			}
		}

		// Enqueue CSS assets.
		$css_assets = Vite::css_assets();
		if ( array_key_exists( 'app', $css_assets ) ) {
			foreach ( $css_assets['app'] as $asset ) {
				$key = pathinfo( basename( $asset ), PATHINFO_FILENAME );
				wp_enqueue_style( $key, $asset, array(), MOZILLA_BUILDERS_THEME_VERSION );
			}
		}
	}

	/**
	 * Enqueue JS and CSS for WP admin panel
	 *
	 * @return void
	 */
	public function enqueue_admin() {
		// Enqueue JS assets.
		$js_assets = Vite::js_assets();
		if ( array_key_exists( 'admin', $js_assets ) ) {
			foreach ( $js_assets['admin'] as $asset ) {
				$key = pathinfo( basename( $asset ), PATHINFO_FILENAME );
				wp_enqueue_script_module( 'vite:' . $key, $asset, array(), MOZILLA_BUILDERS_THEME_VERSION );
			}
		}

		// Enqueue CSS assets.
		$css_assets = Vite::css_assets();
		if ( array_key_exists( 'admin', $css_assets ) ) {
			foreach ( $css_assets['admin'] as $asset ) {
				$key = pathinfo( basename( $asset ), PATHINFO_FILENAME );
				wp_enqueue_style( $key, $asset, array(), MOZILLA_BUILDERS_THEME_VERSION );
			}
		}
	}

	/**
	 * Register nav menus
	 *
	 * @return void
	 */
	public function register_menus() {
		register_nav_menus(
			array(
				'nav_pages_menu'      => 'Navigation Pages Menu',
				'primary_footer_menu' => 'Primary Footer Menu',
			)
		);
	}

	/**
	 * Add ACF options page to WordPress
	 *
	 * @return void
	 */
	public function register_options() {
		if ( function_exists( 'acf_add_options_page' ) ) {
			acf_add_options_page(
				array(
					'page_title' => 'Site Settings',
					'menu_title' => 'Site Settings',
					'menu_slug'  => 'site-settings',
				)
			);
		}
	}

	/**
	 * Adds ability to access array of ACF options fields in a twig field
	 *
	 * @param array $context Timber context.
	 *
	 * @return array
	 */
	public function add_acf_options_to_context( $context ) {
		if ( class_exists( 'acf' ) ) {
			$context['options'] = get_fields( 'option' );
		}
		return $context;
	}

	/**
	 * Resgisers post types.
	 *
	 * @return void
	 */
	public function register_post_types() {
		Profile::register();
		Project::register();
	}

	/**
	 * Sets classmap for posts.
	 *
	 * @param array $classmap The classmap.
	 */
	public function set_post_classmap( array $classmap ): array {
		$custom_classmap = array(
			'post'              => Article::class,
			Profile::HANDLE     => Profile::class,
			Project::HANDLE     => Project::class,
		);

		return array_merge( $classmap, $custom_classmap );
	}

	/**
	 * Resgisers taxonomies.
	 *
	 * @return void
	 */
	public function register_taxonomies() {
		// Register custom post types.
		Cohort::register();
		Platform::register();
		ProjectCategory::register();
		Technology::register();
	}

	/**
	 * Sets the classmap for taxonomies.
	 *
	 * @param array $classmap The classmap.
	 */
	public function set_term_classmap( array $classmap ): array {
		$custom_classmap = array(
			Cohort::HANDLE => Cohort::class,
			Platform::HANDLE => Platform::class,
			ProjectCategory::HANDLE => ProjectCategory::class,
			Technology::HANDLE => Technology::class,
		);
		return array_merge( $classmap, $custom_classmap );
	}

	/**
	 * Exclude password protected and unpublished posts from post results
	 *
	 * @param \WP_Query $query The WP_Query instance (passed by reference).
	 *
	 * @return void
	 */
	public function filter_posts( $query ) {
		// if not admin, single post, or page, then filter out password protected posts.
		if ( ! is_admin() && ! is_single() && ( ! is_page() || is_front_page() ) ) {
			$query->set( 'has_password', false );
			$query->set( 'post_status', 'publish' );
		}
	}

	/**
	 * Adds Upstatement credit to the admin footer.
	 *
	 * @return string
	 */
	public function add_admin_footer_credit() {
		return '<span id="footer-thankyou">Made by <a href="https://upstatement.com/" target="_blank">Upstatement</a></span>';
	}

	/**
	 * Set the Yoast SEO author meta.
	 *
	 * @param string $author The author.
	 *
	 * @return string|false
	 */
	public function set_yoast_author( $author ) {
		$post = Timber::get_post();
		if ( $post instanceof Article ) {
			$authors = $post->authors();
			if ( count( $authors ) > 0 ) {
				return implode( ', ', array_map( fn( $author ) => $author->name, $authors ) );
			}
		}
		return false;
	}

	/**
	 * Set the Yoast SEO enhanced Slack data.
	 *
	 * @param array $data The data.
	 *
	 * @return array
	 */
	public function set_yoast_slack_data( $data ) {
		$post = Timber::get_post();
		if ( $post instanceof Article ) {
			$authors = $post->authors();
			if ( count( $authors ) > 0 ) {
				$data['Written by'] = implode( ', ', array_map( fn( $author ) => $author->name, $authors ) );
			} else {
				unset( $data['Written by'] );
			}
		} else {
			unset( $data['Written by'] );
		}
		return $data;
	}


	/**
	 * Update the allowed file types.
	 *
	 * @param array $mimes Mime types.
	 *
	 * @return array
	 */
	public function manage_mime_types( array $mimes ): array {
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
	}

	/**
	 * Configure features for the editor. Note that this should be called as part of the `after_setup_theme` hook.
	 *
	 * @see https://developer.wordpress.org/block-editor/developers/themes/theme-support/
	 * @see https://developer.wordpress.org/reference/functions/add_theme_support/
	 *
	 * @return void
	 */
	private function setup_theme_support() {
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_theme_support( 'align-wide' );
	}
}
