<?php
/**
 * Add to global context.
 *
 * @package WordPressStarterKit
 */

namespace WordPressStarterKit\Managers;

use Timber\Menu;

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
	}

	/**
	 * Adds ability to check some global environment variables.
	 *
	 * @param array $context Timber context.
	 *
	 * @return array
	 */
	public function environment( $context ) {
		$context['wp_env'] = WP_ENV;
		$context['theme_version'] = WSK_THEME_VERSION;
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
		$context['nav_topics_menu']     = new Menu( 'nav_topics_menu' );
		$context['nav_pages_menu']      = new Menu( 'nav_pages_menu' );
		$context['primary_footer_menu'] = new Menu( 'primary_footer_menu' );
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
}
