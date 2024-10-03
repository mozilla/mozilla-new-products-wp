<?php
/**
 * Bootstraps WordPress theme related functions, most importantly enqueuing javascript and styles.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Managers;

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

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ), 999 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
		add_action( 'admin_init', array( $this, 'register_menus' ) );
		add_action( 'init', array( $this, 'register_options' ) );
		add_action( 'pre_get_posts', array( $this, 'filter_posts' ) );

		add_filter( 'admin_footer_text', array( $this, 'add_admin_footer_credit' ) );

		$this->setup_theme_support();
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

		// Enqueue Vite assets.
		if ( 'production' == WP_ENV ) {
			// Read manifest.json if it exists.
			$manifest_json = file_get_contents( MOZILLA_BUILDERS_THEME_PATH . '/dist/.vite/manifest.json' );
			if ( ! $manifest_json ) {
				return;
			}
			// Enqueue Vite assets.
			$manifest = json_decode( $manifest_json, true );
			foreach ( $manifest as $file ) {
				if ( ! array_key_exists( 'isEntry', $file ) || ! array_key_exists( 'src', $file ) ) {
					continue;
				}
				if ( $file['isEntry'] && 'static/js/app.js' == $file['src'] ) {
					wp_enqueue_script_module( 'vite-js', MOZILLA_BUILDERS_THEME_URL . '/dist/' . $file['file'], array(), MOZILLA_BUILDERS_THEME_VERSION );
				}
				if ( $file['isEntry'] && 'static/scss/app.scss' == $file['src'] ) {
					wp_enqueue_style( 'vite-css', MOZILLA_BUILDERS_THEME_URL . '/dist/' . $file['file'], array(), MOZILLA_BUILDERS_THEME_VERSION );
				}
			}
		} else {
			wp_enqueue_script_module( 'vite-client', VITE_DEV_SERVER_URL . '/@vite/client', array(), MOZILLA_BUILDERS_THEME_VERSION );
			wp_enqueue_script_module( 'vite-js', VITE_DEV_SERVER_URL . '/static/js/app.js', array(), MOZILLA_BUILDERS_THEME_VERSION );
			wp_enqueue_style( 'vite-css', VITE_DEV_SERVER_URL . '/static/scss/app.scss', array(), MOZILLA_BUILDERS_THEME_VERSION );
		}
	}

	/**
	 * Enqueue JS and CSS for WP admin panel
	 *
	 * @return void
	 */
	public function enqueue_admin_scripts() {
		// TODO: fix.
		// wp_enqueue_style( 'admin-styles', MOZILLA_BUILDERS_THEME_URL . '/dist/static/admin.css', array(), MOZILLA_BUILDERS_THEME_VERSION );
		// wp_enqueue_script( 'vendor', MOZILLA_BUILDERS_THEME_URL . '/dist/static/vendor.js', array(), MOZILLA_BUILDERS_THEME_VERSION, false );
		// wp_enqueue_script( 'admin.js', MOZILLA_BUILDERS_THEME_URL . '/dist/static/admin.js', array(), MOZILLA_BUILDERS_THEME_VERSION, false ); .
	}

	/**
	 * Register nav menus
	 *
	 * @return void
	 */
	public function register_menus() {
		register_nav_menus(
			array(
				'nav_topics_menu'     => 'Navigation Topics Menu',
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
