<?php
/**
 * A custom block for inserting a side by side header and text.
 *
 * @package MozillaLabs
 * @param array $block The block settings and attributes.
 */

use Timber\Timber;

$context                  = Timber::context();
$context['size']          = get_field( 'block_size' );
$context['header_text']   = get_field( 'header_text' );
$context['text_content']  = get_field( 'text_content' );
$context['heading_level'] = get_field( 'heading_level' );

Timber::render( basename( __DIR__ ) . '/header-text.twig', $context );
