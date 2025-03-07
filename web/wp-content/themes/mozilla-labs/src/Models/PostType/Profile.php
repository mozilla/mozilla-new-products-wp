<?php
/**
 * Profile model.
 *
 * @package MozillaLabs
 */

namespace MozillaLabs\Models\PostType;

use Timber\Timber;
use Timber\Post as TimberPost;
use MozillaLabs\Models\Taxonomy\Cohort;

/** Class */
class Profile extends TimberPost {
	const HANDLE = 'profile';

	/**
	 * Register the Resource post type.
	 *
	 * @return void
	 */
	public static function register(): void {
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


	/**
	 * Get the contacts for the profile.
	 *
	 * @return array
	 */
	public function contacts(): array {
		$contact_data = $this->meta( 'contacts' );

		if ( empty( $contact_data ) ) {
			return array();
		}

		return array_filter(
			array_map(
				function ( $contact ) {
					$type    = $contact['type'] ?? 'Website';
					$website = $contact['url'] ?? null;
					$email   = $contact['email'] ?? null;

					$link = match ( $type ) {
						'Website' => $website,
						'Email' => $email ? 'mailto:' . $contact['email'] : null,
						default => null,
					};

					if ( empty( $link ) ) {
						return null;
					}

					$label = $contact['label'] ?? $link;
					if ( empty( $label ) && 'Email' === $type ) {
						$label = $email;
					}

					return array(
						'label' => $label,
						'link'  => $link,
					);
				},
				$contact_data
			)
		);
	}

	/**
	 * Get the products for the profile.
	 *
	 * @return array
	 */
	public function products() {
		$products = $this->meta( 'products' );
		if ( empty( $products ) ) {
			return array();
		}

		return array_map( fn( $product ) => Timber::get_post( $product ), $products );
	}

	/**
	 * Get the cohorts for the profile.
	 *
	 * @return array
	 */
	public function cohorts() {
		return $this->terms( Cohort::HANDLE );
	}

	/**
	 * Get the 4 latest articles for the profile.
	 *
	 * @return array
	 */
	public function latest_articles() {
		$args = array(
			'post_status'         => 'publish',
			'posts_per_page'      => 4,
			'orderby'             => 'date',
			'order'               => 'DESC',
			'ignore_sticky_posts' => 1,
			'meta_query'          => array(
				array(
					'key'     => 'authors',
					'value'   => $this->id,
					'compare' => 'LIKE',
				),
			),
		);

		return Timber::get_posts( $args )->to_array();
	}
}
