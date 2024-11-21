<?php
/**
 * Add to global context.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Managers;

use Timber\Timber;
use MozillaBuilders\Models\PostType\Project;

/** Class */
class ContextManager {
	/**
	 * Add data to context.
	 *
	 * @return void
	 */
	public function run() {
		add_filter( 'timber/context', array( $this, 'environment' ) );
		add_filter( 'timber/context', array( $this, 'is_home' ) );
		add_filter( 'timber/context', array( $this, 'menus' ) );
		add_filter( 'timber/context', array( $this, 'acf_options' ) );
		add_filter( 'timber/context', array( $this, 'archive_links' ) );

		add_filter( 'timber/twig', array( $this, 'add_number_shorthand_filter' ) );
	}

	/**
	 * Adds ability to check some global environment variables.
	 *
	 * @param array $context Timber context.
	 *
	 * @return array
	 */
	public function environment( $context ) {
		$context['wp_env']        = WP_ENV;
		$context['theme_version'] = MOZILLA_BUILDERS_THEME_VERSION;
		return $context;
	}

	/**
	 * Adds ability to check if we are on the homepage in a twig file.
	 *
	 * @param array $context Timber context.
	 *
	 * @return array
	 */
	public function is_home( $context ) {
		$context['is_home'] = is_home();
		$context['is_front_page'] = is_front_page();

		return $context;
	}

	/**
	 * Registers and adds menus to context
	 *
	 * @param array $context Timber context.
	 *
	 * @return array
	 */
	public function menus( $context ) {
		$context['nav_topics_menu']     = Timber::get_menu( 'nav_topics_menu' );
		$context['nav_pages_menu']      = Timber::get_menu( 'nav_pages_menu' );
		$context['primary_footer_menu'] = Timber::get_menu( 'primary_footer_menu' );
		return $context;
	}

	/**
	 * Adds archive links to context.
	 *
	 * @param array $context Timber context.
	 *
	 * @return array
	 */
	public function archive_links( $context ) {
		$project_archive_args = array(
			'post_type'      => 'page',
			'posts_per_page' => 1,
			'meta_query'     => array(
				array(
					'key'   => '_wp_page_template',
					'value' => 'page-projects.php',
				),
			),
		);
		$project_archive_posts = Timber::get_posts( $project_archive_args )->to_array();
		$project_archive_link  = ! empty( $project_archive_posts ) ? $project_archive_posts[0]->link() : null;

		$accelerator_page_args = array(
			'post_type'      => 'page',
			'posts_per_page' => 1,
			'meta_query'     => array(
				array(
					'key'   => '_wp_page_template',
					'value' => 'page-accelerator.php',
				),
			),
		);
		$accelerator_page_posts = Timber::get_posts( $accelerator_page_args )->to_array();
		$accelerator_page_link  = ! empty( $accelerator_page_posts ) ? $accelerator_page_posts[0]->link() : null;

		$context['archive_links'] = array(
			'posts'    => get_post_type_archive_link( 'post' ),
			'projects' => $project_archive_link,
			'accelerator' => $accelerator_page_link,
			'discord'  => 'https://discord.gg/gydMdRK2zV',
		);
		return $context;
	}

	/**
	 * Adds ability to access array of ACF options fields in a twig field
	 *
	 * @param array $context Timber context.
	 *
	 * @return array
	 */
	public function acf_options( $context ) {
		if ( class_exists( 'acf' ) ) {
			$context['options'] = get_fields( 'option' );
		}
		return $context;
	}

	/**
	 * Add a number shorthand filter to Twig.
	 *
	 * @param \Twig\Environment $twig The Twig environment.
	 * @return \Twig\Environment
	 */
	public function add_number_shorthand_filter( $twig ) {
		$twig->addFilter( new \Twig\TwigFilter( 'number_shorthand', array( $this, 'number_shorthand' ) ) );
		return $twig;
	}

	/**
	 * Format a number with a shorthand (e.g., 500 -> 500, 1000 -> 1K, 1500 -> 1.5K).
	 *
	 * @param string|int $number The number to format.
	 * @return string
	 */
	public function number_shorthand( $number ) {
		$number = intval( $number );
		$k      = $number / 1000;
		if ( $number >= 1000 ) {
			return ( floor( $k ) == $k ? floor( $k ) : number_format( $k, 1 ) ) . 'K';
		} else {
			return strval( $number );
		}
	}
}
