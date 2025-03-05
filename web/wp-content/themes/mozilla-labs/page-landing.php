<?php
/**
 * Template Name: Landing Page
 *
 * @package MozillaLabs
 */

use Timber\Timber;
use MozillaLabs\Models\Taxonomy\Cohort;

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

	$allowed_tabs = array( 'overview', 'cohorts', 'faqs' );
	$initial_tab  = 'overview';

	if ( isset( $_GET['tab'] ) ) {
		$tab_from_url = sanitize_title( $_GET['tab'] );
		if ( in_array( $tab_from_url, $allowed_tabs ) ) {
			$initial_tab = $tab_from_url;
		}
	}

	$context['initial_tab'] = $initial_tab;

	Timber::render( 'pages/landing.twig', $context );
}
