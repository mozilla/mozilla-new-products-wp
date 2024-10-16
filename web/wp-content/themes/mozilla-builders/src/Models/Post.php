<?php
/**
 * Additional functionality for extending the TimberPost object
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models;

use Timber\Timber;
use Timber\Post as TimberPost;

/** Class */
class Post extends TimberPost {

	/**
	 * Bylines for a post.
	 *
	 * @return array
	 */
	public function bylines() {
		// If the ups-blocks plugin is enabled, we can use the bylines function from there.
		if ( function_exists( 'Upstatement\Editorial\get_post_authors' ) ) {
			$author_terms = \Upstatement\Editorial\get_post_authors();

			if ( is_array( $author_terms ) ) {
				$author_terms = array_map( fn( $term ) => Timber::get_term( $term ), $author_terms );
			}

			return $author_terms;
		}

		global $post;

		return array( Timber::get_user( $post->post_author ) );
	}

	/**
	 * Get post overline.
	 *
	 * @return \Timber\Term|bool Category term for post overline
	 */
	public function overline() {
		if ( function_exists( 'Upstatement\Editorial\get_post_overline' ) ) {
			$overline            = \Upstatement\Editorial\get_post_overline( $this->id );
			$assigned_categories = get_the_category( $this->id );
			$first_category      = $assigned_categories[0] ?? false;

			if ( $overline && $overline->name ) {
				return Timber::get_term( $overline->term_id );
			}

			// If there is no overline set, use the first category that is not "Uncategorized".
			if ( $first_category && 1 !== $first_category->term_id ) {
				return Timber::get_term( $assigned_categories[0]->term_id );
			}
		}

		return false;
	}
}
