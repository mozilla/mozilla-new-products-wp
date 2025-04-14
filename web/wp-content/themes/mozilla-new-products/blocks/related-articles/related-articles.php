<?php
/**
 * Custom block for inserting a list of Related articles
 *
 * Requires an Related Articles field group with two custom fields:
 * - header_text (Text)
 * - chosen_articles (Repeater) with the following sub field:
 *     - related_article (Post Object)
 * Set this field group if the block is equal to Related Articles
 *
 * @package MozillaNewProducts
 * @param array $block The block settings and attributes.
 */

use Timber\Timber;

$alignment = $block['align'] ?? 'center';

$context                            = Timber::context();
$context['related_articles_header'] = get_field( 'header_text' );
$context['alignclass']              = "align$alignment";
$related_articles                   = get_field( 'chosen_articles' );
$related_articles_ids               = array();

if ( is_array( $related_articles ) && ! empty( $related_articles ) ) {
	foreach ( $related_articles as $article ) {
		if ( ! empty( $article['related_article'] ) ) {
			$related_articles_ids[] = $article['related_article']->ID;
		}
	}
	// Set query args.
	if ( ! empty( $related_articles_ids ) ) {
		$args = array(
			'post_status' => 'publish',
			'post__in'    => $related_articles_ids,
			'orderby'     => 'post__in',
		);

		$context['related_articles'] = Timber::get_posts( $args );
	}
}

Timber::render( basename( __DIR__ ) . '/related-articles.twig', $context );
