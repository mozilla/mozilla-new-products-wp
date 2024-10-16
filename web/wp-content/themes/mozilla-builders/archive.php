<?php
/**
 * The template for displaying Archive pages.
 *
 * Used to display archive-type pages if nothing more specific matches a query.
 * For example, puts together date-based pages if no date.php file exists.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package MozillaBuilders
 */

use Timber\Timber;

$context = Timber::context();

$context['title'] = 'Archive';

$query_args = false;

/* Day archive */
if ( is_day() ) {
	$context['title'] = 'Archive: ' . get_the_date( 'M d Y' );
} elseif ( is_month() ) { // Month archive.
	$context['title'] = 'Archive: ' . get_the_date( 'M Y' );
} elseif ( is_year() ) { // Year archive.
	$context['title'] = 'Archive: ' . get_the_date( 'Y' );
} elseif ( is_tag() ) { // Tag archive.
	$context['title'] = single_tag_title( '', false );
} elseif ( is_category() ) { // Category archive.
	$context['title']   = single_cat_title( '', false );
	$context['is_post'] = true;
} elseif ( isset( $wp_query->query['authors'] ) ) { // Author archive.
	$author_slug = $wp_query->query['authors'];
	$query_args  = array(
		'tax_query' => array(
			array(
				'taxonomy' => 'author',
				'field'    => 'slug',
				'terms'    => array( $author_slug ),
			),
		),
	);

	$author = get_term_by( 'slug', $author_slug, 'author' );

	if ( $author instanceof WP_Term ) {
		$context['title'] = 'Latest from ' . $author->name;
	}
} elseif ( is_post_type_archive() ) { // Post type archive.
	$context['title'] = post_type_archive_title( '', false );
} elseif ( is_tax() ) { // Taxonomy archive.
	$context['title'] = single_term_title( '', false );
}

/* Set the posts that should appear on the archive page. */
$_posts = Timber::get_posts( $query_args );

$context['posts']      = $_posts;
$context['pagination'] = $_posts->pagination( array( 'mid_size' => 2 ) );

Timber::render( 'pages/archive.twig', $context );
