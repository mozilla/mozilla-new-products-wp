<?php
/**
 * Model for the Cohort taxonomy.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\Taxonomy;

use Timber\Timber;
use Timber\Term as TimberTerm;

use MozillaBuilders\Models\PostType\Profile;

/** Class */
class Cohort extends TimberTerm {
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

	/**
	 * Get the profiles for the cohort.
	 *
	 * @return array
	 */
	public function profiles() {
		$args = array(
			'post_type' => Profile::HANDLE,
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => self::HANDLE,
					'field' => 'id',
					'terms' => $this->ID,
				),
			),
		);

		return Timber::get_posts( $args )->to_array();
	}
}
