<?php
/**
 * Model for the Platform taxonomy.
 *
 * @package MozillaLabs
 */

namespace MozillaLabs\Models\Taxonomy;

use Timber\Timber;
use Timber\Term as TimberTerm;

use MozillaLabs\Models\PostType\Product;

/** Class */
class Platform extends TimberTerm {
	const HANDLE = 'platform';

	/**
	 * Register the taxonomy.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Platforms',
				'singular_name' => 'Platform',
				'not_found'     => 'No Platforms Found',
				'add_new_item'  => 'Add New Platform',
			),
			'public'       => true,
			'hierarchical' => false,
			'rewrite'      => array(
				'slug' => 'platform',
			),
		);

		register_taxonomy( self::HANDLE, array( Product::HANDLE ), $args );
	}
}
