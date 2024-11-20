<?php
/**
 * Model for the Project Category taxonomy.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\Taxonomy;

use MozillaBuilders\Models\PostType\Project;

/** Class */
class ProjectCategory {
	const HANDLE = 'project_category';

	/**
	 * Register the taxonomy.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Project Categories',
				'singular_name' => 'Project Category',
				'not_found'     => 'No Categories Found',
				'add_new_item'  => 'Add New Categories',
			),
			'public'       => true,
			'hierarchical' => true,
			'rewrite'      => array(
				'slug' => 'project-categories',
			),
		);

		register_taxonomy( self::HANDLE, array( Project::HANDLE ), $args );
	}

}
