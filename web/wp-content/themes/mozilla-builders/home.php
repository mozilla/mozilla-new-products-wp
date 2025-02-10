<?php
/**
 * Home page (a.k.a page for posts).
 *
 * @package MozillaBuilders
 */

use Timber\Timber;

$context = Timber::context();

$_posts = Timber::get_posts();

$context['posts']      = $_posts;
$context['pagination'] = $_posts->pagination( array( 'mid_size' => 2 ) );
$context['title']      = 'Latest';

// Render view.
Timber::render( 'pages/home.twig', $context );
