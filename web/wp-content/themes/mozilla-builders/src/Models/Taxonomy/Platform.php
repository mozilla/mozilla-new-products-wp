<?php
/**
 * Model for the Platform taxonomy.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\Taxonomy;

use MozillaBuilders\Models\PostType\Project;

/** Class */
class Platform {
	const HANDLE = 'platform';

	/**
	 * Register the taxonomy.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Platforms',
				'singular_name' => 'Platform',
				'not_found'     => 'No Platforms Found',
				'add_new_item'  => 'Add New Platform',
			),
			'public'       => true,
			'hierarchical' => false,
			'rewrite'      => array(
				'slug' => 'platform',
			),
		);

		register_taxonomy( self::HANDLE, array( Project::HANDLE ), $args );
	}

}
