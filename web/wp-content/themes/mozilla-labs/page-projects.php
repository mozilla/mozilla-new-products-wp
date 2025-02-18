<?php
/**
 * Template Name: Projects Archive
 *
 * @package MozillaLabs
 */

use Timber\Timber;

$context  = Timber::context();
$_page    = Timber::get_post();
$_page_id = (int) $_page->ID;

global $paged;

$context['title']      = $_page->title();
$context['subheading'] = 'Projects';

// If page is password protected, render password page.
if ( post_password_required( $_page_id ) ) {
	$cookie_value       = $_COOKIE[ 'wp-postpass_' . md5( get_site_option( 'siteurl' ) ) ];
	$context['error']   = ! isset( $cookie_value ) ? false : 'Password is incorrect.';
	$context['post_id'] = $_page_id;

	Timber::render( 'pages/password.twig', $context );
} else {
	$context['page'] = $_page;

	$args             = array(
		'post_type'      => 'project',
		'orderby'        => 'title',
		'order'          => 'ASC',
		'posts_per_page' => 24,
		'paged'          => isset( $paged ) && $paged ? $paged : 1,
	);
	$context['posts'] = Timber::get_posts( $args );

	Timber::render( 'pages/archive-project.twig', $context );
}
