<?php
/**
 * Model for the Product Category taxonomy.
 *
 * @package MozillaLabs
 */

namespace MozillaLabs\Models\Taxonomy;

use Timber\Timber;
use Timber\Term as TimberTerm;

use MozillaLabs\Models\PostType\Product;

/** Class */
class ProductCategory extends TimberTerm {
	const HANDLE = 'product_category';

	/**
	 * Register the taxonomy.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Product Categories',
				'singular_name' => 'Product Category',
				'not_found'     => 'No Categories Found',
				'add_new_item'  => 'Add New Categories',
			),
			'public'       => true,
			'hierarchical' => true,
			'rewrite'      => array(
				'slug' => 'product-categories',
			),
		);

		register_taxonomy( self::HANDLE, array( Product::HANDLE ), $args );
	}
}
