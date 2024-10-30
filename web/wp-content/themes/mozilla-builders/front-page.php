<?php
/**
 * Front page.
 *
 * @package MozillaBuilders
 */

use Timber\Timber;

global $paged;

$context = Timber::context();

$_posts = Timber::get_posts(
	array(
		'posts_per_page' => 10,
		'post_status'    => 'publish',
		'paged'          => $paged,
	)
);


$context['posts'] = $_posts;
$context['title'] = 'Latest';

// Render view.
Timber::render( 'pages/archive.twig', $context );
