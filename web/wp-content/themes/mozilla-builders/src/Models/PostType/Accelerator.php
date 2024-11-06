<?php
/**
 * Accelerator model.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\PostType;

use MozillaBuilders\Models\Taxonomy\Cohort;
use Timber\Post as TimberPost;
use Timber\Timber;

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

	/**
	 * Gets the list of profiles associated with the same cohort as the Accelerator.
	 *
	 * @return array
	 */
	public function profiles(): array {
		$cohorts = $this->terms( array( 'taxonomy' => Cohort::HANDLE ) );

		if ( empty( $cohorts ) ) {
			return array();
		}

		$profiles = Timber::get_posts(
			array(
				'post_type'      => Profile::HANDLE,
				'posts_per_page' => -1,
				'tax_query'      => array(
					array(
						'taxonomy' => Cohort::HANDLE,
						'terms'    => array_column( $cohorts, 'id' ),
					),
				),
			)
		);

		return $profiles->to_array();
	}

}
