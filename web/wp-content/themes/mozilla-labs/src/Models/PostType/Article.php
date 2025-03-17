<?php
/**
 * Additional functionality for extending the TimberPost object
 *
 * @package MozillaLabs
 */

namespace MozillaLabs\Models\PostType;

use Timber\Timber;
use Timber\Post as TimberPost;

/** Class */
class Article extends TimberPost {
	const HANDLE = 'post';

	/**
	 * Bylines for a post.
	 *
	 * @return array
	 */
	public function authors(): array {
		$authors = $this->meta( 'authors' );
		if ( empty( $authors ) ) {
			return array();
		}

		return array_map( fn( $author ) => Timber::get_post( $author ), $authors );
	}

	/**
	 * Primary product for the post.
	 *
	 * @return TimberPost|null
	 */
	public function product(): TimberPost|null {
		$products = $this->meta( 'products' );
		if ( empty( $products ) ) {
			return null;
		}

		return Timber::get_post( $products[0] );
	}


	/**
	 * Related articles for a post.
	 *
	 * @return array
	 */
	public function related_articles(): array {
		$selected_articles = $this->meta( 'related_articles' );
		if ( empty( $selected_articles ) ) {
			$selected_articles = array();
		}

		$count = 4 - count( $selected_articles );
		if ( $count > 0 ) {
			$args              = array(
				'post_type'      => 'post',
				'posts_per_page' => $count,
				'post__not_in'   => array_merge( $selected_articles, array( $this->ID ) ),
				'orderby'        => 'date',
				'order'          => 'DESC',
				'tax_query'      => array(
					array(
						'taxonomy' => 'category',
						'terms'    => array_column( $this->categories(), 'id' ),
					),
				),
			);
			$pulled_articles   = Timber::get_posts( $args );
			$selected_articles = array_merge( $selected_articles, $pulled_articles->to_array() );
		}

		return array_map( fn( $article ) => Timber::get_post( $article ), $selected_articles );
	}
}
