<?php
/**
 * Category
 *
 * @package MozillaLabs
 */

use MozillaLabs\Models\PostType\Article;
use Timber\Timber;

$context = Timber::context();

/**
 * Get the related archive page.
 *
 * Because the stories archive is a custom page template, there's no
 * easy way to relate all categories to this stories archive.
 * As such, we're assuming there's only one instance of this stories archive.
*/
$archive_page           = Timber::get_post(
	array(
		'post_type'  => 'page',
		'meta_query' => array(
			array(
				'key'     => '_wp_page_template',
				'value'   => 'page-stories.php',
				'compare' => '=',
			),
		),
	)
);
$category               = Timber::get_term();
$context['total_count'] = wp_count_posts( Article::HANDLE )->publish;

$context['page']     = $archive_page;
$context['category'] = $category;

$context['categories'] = Timber::get_terms(
	array(
		'taxonomy'   => 'category',
		'hide_empty' => true,
	)
);

$context['posts'] = Timber::get_posts(
	array(
		'post_type'      => 'post',
		'posts_per_page' => -1,
		'cat'            => $category->id,
	)
);

Timber::render( 'pages/archive-stories.twig', $context );
