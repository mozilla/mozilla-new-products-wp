<?php
/**
 * Category
 *
 * @package MozillaNewProducts
 */

use MozillaNewProducts\Models\PostType\Article;
use Timber\Timber;

$context = Timber::context();

global $paged;

/**
 * Get the related archive page.
 *
 * Because the stories archive is a custom page template, there's no
 * easy way to relate all categories to this stories archive.
 * As such, we're assuming there's only one instance of this stories archive.
*/
$archive_page = Timber::get_post(
	array(
		'post_type'   => 'page',
		'post_status' => 'publish',
		'meta_query'  => array(
			array(
				'key'     => '_wp_page_template',
				'value'   => 'page-stories.php',
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
$context['total_count'] = wp_count_posts( Article::HANDLE )->publish;

$context['page']     = $archive_page;
$context['category'] = $category;

$context['categories'] = Timber::get_terms(
	array(
		'taxonomy'   => 'category',
		'hide_empty' => true,
	)
);

$context['posts'] = Timber::get_posts(
	array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'orderby'        => 'date',
		'order'          => 'DESC',
		'posts_per_page' => 12,
		'category__in'   => array( $category->id ),
		'paged'          => isset( $paged ) && $paged ? $paged : 1,
	)
);


Timber::render( 'pages/archive-stories.twig', $context );
