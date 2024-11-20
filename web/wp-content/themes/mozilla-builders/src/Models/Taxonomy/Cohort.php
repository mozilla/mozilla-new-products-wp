<?php
/**
 * Model for the Cohort taxonomy.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\Taxonomy;

use MozillaBuilders\Models\PostType\Profile;

/** Class */
class Cohort {
	const HANDLE = 'cohort';

	/**
	 * Register the taxonomy.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Cohorts',
				'singular_name' => 'Cohort',
				'not_found'     => 'No Cohorts Found',
				'add_new_item'  => 'Add New Cohort',
			),
			'public'       => true,
			'hierarchical' => false,
			'rewrite'      => array(
				'slug' => 'cohort',
			),
		);

		register_taxonomy( self::HANDLE, array( Profile::HANDLE ), $args );
	}
}
