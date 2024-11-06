<?php
/**
 * Profile model.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\PostType;

use Timber\Post as TimberPost;
use Timber\Timber;

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

	/**
	 * Get the contributors for the project.
	 *
	 * @return array
	 */
	public function contributors() {
		$contributors = $this->meta( 'contributors' );

		if ( empty( $contributors ) ) {
			return array();
		}

		return array_map( fn( $contributor ) => Timber::get_post( $contributor ), $contributors );
	}

	/**
	 * Get the platforms for the project.
	 *
	 * @return array
	 */
	public function platforms() {
		return $this->terms( 'platform' );
	}

	/**
	 * Get the categories for the project.
	 *
	 * @return array
	 */
	public function categories() {
		return $this->terms( 'category' );
	}

	/**
	 * Get the technologies for the project.
	 *
	 * @return array
	 */
	public function technologies() {
		return $this->terms( 'technology' );
	}

	/**
	 * Get 3 other projects to feature on the project page.
	 *
	 * @return array
	 */
	public function other_projects() {
		$args = array(
			'post_type' => self::HANDLE,
			'post_status' => 'publish',
			'posts_per_page' => 3,
			'orderby' => 'date',
			'order' => 'DESC',
			'post__not_in' => array( $this->id ),
		);

		return Timber::get_posts( $args )->to_array();
	}
}
