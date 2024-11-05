<?php
/**
 * Model for the Technology taxonomy.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\Taxonomy;

use MozillaBuilders\Models\PostType\Project;

/** Class */
class Technology {
	const HANDLE = 'technology';

	/**
	 * Register the taxonomy.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Technologies',
				'singular_name' => 'Technology',
				'not_found'     => 'No Technologies Found',
				'add_new_item'  => 'Add New Technology',
			),
			'public'       => true,
			'hierarchical' => false,
			'rewrite'      => array(
				'slug' => 'technology',
			),
		);

		register_taxonomy( self::HANDLE, array( Project::HANDLE ), $args );
	}

}
