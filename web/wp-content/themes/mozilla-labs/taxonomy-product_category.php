<?php
/**
 * Product category
 *
 * @package MozillaLabs
 */

use MozillaLabs\Models\PostType\Product;
use MozillaLabs\Models\Taxonomy\ProductCategory;
use Timber\Timber;

$context = Timber::context();

global $paged;

/**
 * Get the related archive page.
 *
 * Because the products archive is a custom page template, there's no
 * easy way to relate all categories to this products archive.
 * As such, we're assuming there's only one instance of this products archive.
*/
$archive_page = Timber::get_post(
	array(
		'post_type'   => 'page',
		'post_status' => 'publish',
		'meta_query'  => array(
			array(
				'key'     => '_wp_page_template',
				'value'   => 'page-products.php',
				'compare' => '=',
			),
		),
	)
);

if ( ! $archive_page->meta( 'show_filters' ) ) {
	global $wp_query;
	$wp_query->set_404();
	status_header( 404 );
	nocache_headers();
	include get_query_template( '404' );

	return;


}

$category               = Timber::get_term();
$context['total_count'] = wp_count_posts( Product::HANDLE )->publish;

$context['page']     = $archive_page;
$context['category'] = $category;

$context['categories'] = Timber::get_terms(
	array(
		'taxonomy'   => ProductCategory::HANDLE,
		'hide_empty' => true,
	)
);

$context['posts'] = Timber::get_posts(
	array(
		'post_type'      => Product::HANDLE,
		'post_status'    => 'publish',
		'orderby'        => 'date',
		'order'          => 'DESC',
		'posts_per_page' => 12,
		'tax_query'      => array(
			array(
				'taxonomy' => ProductCategory::HANDLE,
				'field'    => 'id',
				'terms'    => $category->id,
			),
		),
		'paged'          => isset( $paged ) && $paged ? $paged : 1,
	)
);

Timber::render( 'pages/archive-product.twig', $context );
