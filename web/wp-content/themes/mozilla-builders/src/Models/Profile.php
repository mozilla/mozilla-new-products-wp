<?php
/**
 * Profile model.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models;

use Timber\Post as TimberPost;

/** Class */
class Profile extends TimberPost {
	const HANDLE = 'profile';

	/**
	 * Register the Resource post type.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Profiles',
				'singular_name' => 'Profile',
				'not_found'     => 'No Profiles Found',
				'add_new'       => 'Add New Profile',
				'add_new_item'  => 'Add New Profile',
			),
			'public'       => true,
			'menu_icon'    => 'dashicons-id-alt',
			'supports'     => array( 'title', 'thumbnail' ),
			'map_meta_cap' => true,
			'rewrite'      => array(
				'slug'       => 'profile',
				'with_front' => false,
			),
		);

		register_post_type( self::HANDLE, $args );
	}

}
