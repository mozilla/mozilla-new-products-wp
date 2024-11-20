<?php
/**
 * Front page.
 *
 * @package MozillaBuilders
 */

use Timber\Timber;

use MozillaBuilders\Models\PostType\Profile;
use MozillaBuilders\Models\PostType\Project;

global $paged;

$context         = Timber::context();
$_page           = Timber::get_post();
$context['page'] = $_page;

$topper            = $_page->meta( 'topper' );
$context['topper'] = $topper;

$featured_post_ids = $topper['featured_articles'];
if ( empty( $featured_post_ids ) ) {
	$featured_post_ids = array();
}
$_posts                    = Timber::get_posts(
	array(
		'post_type'      => 'post',
		'posts_per_page' => 6,
		'post_status'    => 'publish',
		'post__in'       => $featured_post_ids,
		'orderby'        => 'post__in',
	)
);
$context['featured_posts'] = $_posts;

$builders            = $_page->meta( 'builders' );
$context['builders'] = $builders;

$featured_people_ids = $builders['people'];
if ( empty( $featured_people_ids ) ) {
	$featured_people_ids = array();
}
$_people                    = Timber::get_posts(
	array(
		'post_type'      => Profile::HANDLE,
		'posts_per_page' => 6,
		'post_status'    => 'publish',
		'post__in'       => $featured_people_ids,
		'orderby'        => 'post__in',
	)
);
$context['featured_people'] = $_people;

$collaborations            = $_page->meta( 'collaborations' );
$context['collaborations'] = $collaborations;

$secondary_post_ids = $_page->meta( 'secondary_featured_articles' );
if ( empty( $secondary_post_ids ) ) {
	$context['secondary_posts'] = array();
} else {
	$context['secondary_posts'] = Timber::get_posts(
		array(
			'post_type'      => 'post',
			'posts_per_page' => 4,
			'post_status'    => 'publish',
			'post__in'       => $secondary_post_ids,
			'orderby'        => 'post__in',
		)
	);
}

$featured_project_ids = $collaborations['projects'];
if ( empty( $featured_project_ids ) ) {
	$featured_project_ids = array();
}
$_projects                    = Timber::get_posts(
	array(
		'post_type'      => Project::HANDLE,
		'posts_per_page' => 4,
		'post_status'    => 'publish',
		'post__in'       => $featured_project_ids,
		'orderby'        => 'post__in',
	)
);
$context['featured_projects'] = $_projects;

$_latest_posts             = Timber::get_posts(
	array(
		'post_type'      => 'post',
		'posts_per_page' => 12,
		'post_status'    => 'publish',
		'orderby'        => 'date',
		'order'          => 'DESC',
	)
);
$context['latest_posts']   = $_latest_posts;

// Render view.
Timber::render( 'pages/front-page.twig', $context );
