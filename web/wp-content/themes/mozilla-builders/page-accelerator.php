<?php
/**
 * Template Name: Accelerator
 *
 * @package MozillaBuilders
 */

use Timber\Timber;
use MozillaBuilders\Models\Taxonomy\Cohort;

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

	$cohorts_args = array(
		'taxonomy' => Cohort::HANDLE,
	);
	$cohort_ids   = $_page->meta( 'cohorts' )['items'];
	if ( ! empty( $cohort_ids ) ) {
		$cohorts_args['include'] = $cohort_ids;
	}
	$context['cohorts'] = Timber::get_terms( $cohorts_args );

	Timber::render( 'pages/accelerator.twig', $context );
}
