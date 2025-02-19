<?php
/**
 * Cta model.
 *
 * @package MozillaLabs
 */

namespace MozillaLabs\Models\PostType;

use Timber\Timber;
use Timber\Post as TimberPost;
use MozillaLabs\Models\Taxonomy\Cohort;

/** Class */
class Cta extends TimberPost {
	const HANDLE = 'cta';

	/**
	 * Register the Resource post type.
	 *
	 * @return void
	 */
	public static function register(): void {
		$args = array(
			'labels'       => array(
				'name'          => 'CTAs',
				'singular_name' => 'CTA',
				'not_found'     => 'No CTAs Found',
				'add_new'       => 'Add New CTA',
				'add_new_item'  => 'Add New CTA',
			),
			'public'       => true,
			'menu_icon'    => 'dashicons-pressthis',
			'supports'     => array( 'title', 'thumbnail' ),
			'map_meta_cap' => true,
			'rewrite'      => array(
				'slug'       => 'cta',
				'with_front' => false,
			),
		);

		register_post_type( self::HANDLE, $args );
	}
}
