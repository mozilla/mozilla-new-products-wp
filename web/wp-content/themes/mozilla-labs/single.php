<?php
/**
 * Single post / article.
 *
 * @package MozillaLabs
 */

use Timber\Timber;

$context  = Timber::context();
$_post    = Timber::get_post();
$_post_id = (int) $_post->ID;

// If post is password protected, render password page.
if ( post_password_required( $_post_id ) ) {
	$cookie_value       = $_COOKIE[ 'wp-postpass_' . md5( get_site_option( 'siteurl' ) ) ];
	$context['error']   = ! isset( $cookie_value ) ? false : 'Password is incorrect.';
	$context['post_id'] = $_post_id;

	Timber::render( 'pages/password.twig', $context );
} else {
	$context['post'] = $_post;
	Timber::render( array( "pages/{$_post->post_type}.twig", 'pages/article.twig' ), $context );
}
