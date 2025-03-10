<?php
/**
 * Template Name: People Archive
 *
 * @package MozillaLabs
 */

use Timber\Timber;

use MozillaLabs\Models\Taxonomy\Cohort;

$context  = Timber::context();
$_page    = Timber::get_post();
$_page_id = (int) $_page->ID;

global $paged;

$context['title']      = $_page->title();
$context['subheading'] = 'Products';

// If page is password protected, render password page.
if ( post_password_required( $_page_id ) ) {
	$cookie_value       = $_COOKIE[ 'wp-postpass_' . md5( get_site_option( 'siteurl' ) ) ];
	$context['error']   = ! isset( $cookie_value ) ? false : 'Password is incorrect.';
	$context['post_id'] = $_page_id;

	Timber::render( 'pages/password.twig', $context );
} else {
	$context['page'] = $_page;

	$cohorts_args       = array(
		'taxonomy' => Cohort::HANDLE,
	);
	$context['cohorts'] = Timber::get_terms( $cohorts_args );

	Timber::render( 'pages/archive-people.twig', $context );
}
