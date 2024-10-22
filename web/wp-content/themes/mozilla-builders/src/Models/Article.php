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
class Article extends TimberPost {

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
}
