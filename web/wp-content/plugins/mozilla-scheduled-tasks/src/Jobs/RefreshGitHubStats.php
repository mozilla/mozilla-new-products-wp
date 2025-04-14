<?php
/**
 * Refresh the GitHub stats attached to products.
 *
 * @package MozillaNewProductsScheduledTasks
 */

namespace MozillaNewProducts\ScheduledTasks\Jobs;

use MozillaNewProducts\Models\PostType\Product;

/** Class */
class RefreshGitHubStats {

	public static $interval = 'hourly';
	public static $hook = 'moz_refresh_github_status';

	/**
	 * Run.
	 */
	public static function run() {
		if (!class_exists('\MozillaNewProducts\Models\PostType\Product')) {
			error_log( 'This plugin only works with the Mozilla Labs theme.' );
			return;
		}

		$products = get_posts(
			array(
				'post_type' => 'product',
				'posts_per_page' => -1,
				'post_status' => 'publish'
			)
		);

		if (empty($products)) {
			return;
		}

		foreach ($products as $product ) {
			Product::fetch_github_data( $product->ID, $product );
		}

		delete_transient( 'moz_warning' );
	}
}
