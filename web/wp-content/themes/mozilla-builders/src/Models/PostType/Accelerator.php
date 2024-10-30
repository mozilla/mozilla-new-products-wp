<?php
/**
 * Accelerator model.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\PostType;

use Timber\Post as TimberPost;

/** Class */
class Accelerator extends TimberPost {
	const HANDLE = 'accelerator';

	/**
	 * Register the Resource post type.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Accelerators',
				'singular_name' => 'Accelerator',
				'not_found'     => 'No Accelerators Found',
				'add_new'       => 'Add New Accelerator',
				'add_new_item'  => 'Add New Accelerator',
			),
			'public'       => true,
			'menu_icon'    => 'dashicons-superhero',
			'supports'     => array( 'title' ),
			'map_meta_cap' => true,
			'rewrite'      => array(
				'slug'       => 'accelerator',
				'with_front' => false,
			),
		);

		register_post_type( self::HANDLE, $args );
	}

}
