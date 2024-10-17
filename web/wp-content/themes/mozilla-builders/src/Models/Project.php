<?php
/**
 * Profile model.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models;

use Timber\Post as TimberPost;

/** Class */
class Project extends TimberPost {
	const HANDLE = 'project';

	/**
	 * Register the Resource post type.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Projects',
				'singular_name' => 'Project',
				'not_found'     => 'No Projects Found',
				'add_new'       => 'Add New Project',
				'add_new_item'  => 'Add New Project',
			),
			'public'       => true,
			'menu_icon'    => 'dashicons-portfolio',
			'supports'     => array( 'title', 'thumbnail' ),
			'map_meta_cap' => true,
			'rewrite'      => array(
				'slug'       => 'project',
				'with_front' => false,
			),
		);

		register_post_type( self::HANDLE, $args );
	}

}
