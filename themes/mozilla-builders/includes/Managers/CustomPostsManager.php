<?php
/**
 * Bootstraps settings and configurations for custom post types.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Managers;

/** Class */
class CustomPostsManager {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run() {
		add_action( 'init', array( $this, 'register_post_types' ), 1 );
	}


	/**
	 * Register post types in WoPostsrdPress
	 *
	 * @return void
	 */
	public function register_post_types() {
	}
}
