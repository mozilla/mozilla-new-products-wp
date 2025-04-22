<?php
/**
 * Template Name: Stories Archive
 *
 * @package MozillaNewProducts
 */

use MozillaNewProducts\Models\PostType\Article;
use Timber\Timber;

$context  = Timber::context();
$_page    = Timber::get_post();
$_page_id = (int) $_page->ID;

global $paged;

// If page is password protected, render password page.
if ( post_password_required( $_page_id ) ) {
	$cookie_value       = $_COOKIE[ 'wp-postpass_' . md5( get_site_option( 'siteurl' ) ) ];
	$context['error']   = ! isset( $cookie_value ) ? false : 'Password is incorrect.';
	$context['post_id'] = $_page_id;

	Timber::render( 'pages/password.twig', $context );
} else {
	$context['page']        = $_page;
	$context['total_count'] = wp_count_posts( Article::HANDLE )->publish;

	$context['posts'] = Timber::get_posts(
		array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'orderby'        => 'date',
			'order'          => 'DESC',
			'posts_per_page' => 12,
			'paged'          => isset( $paged ) && $paged ? $paged : 1,
		)
	);

	$context['categories'] = Timber::get_terms(
		array(
			'taxonomy'   => 'category',
			'hide_empty' => true,
		)
	);

	Timber::render( 'pages/archive-stories.twig', $context );
}
