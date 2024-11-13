<?php
/**
 * Template Name: Accelerator
 *
 * @package MozillaBuilders
 */

use Timber\Timber;

$context  = Timber::context();
$_page    = Timber::get_post();
$_page_id = (int) $_page->ID;

// If page is password protected, render password page.
if ( post_password_required( $_page_id ) ) {
	$cookie_value       = $_COOKIE[ 'wp-postpass_' . md5( get_site_option( 'siteurl' ) ) ];
	$context['error']   = ! isset( $cookie_value ) ? false : 'Password is incorrect.';
	$context['post_id'] = $_page_id;

	Timber::render( 'pages/password.twig', $context );
} else {
	$context['page'] = $_page;

	Timber::render( 'pages/accelerator.twig', $context );
}

