<?php
/**
 * Bootstraps settings and configurations for taxonomies.
 *
 * @package WordPressStarterKit
 */

namespace WordPressStarterKit\Managers;

/** Class */
class TaxonomiesManager {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run() {
		add_action( 'init', array( $this, 'register_taxonomies' ), 1 );
	}

	/**
	 * Register taxonomies in WordPress
	 *
	 * @return void
	 */
	public function register_taxonomies() {
	}
}
