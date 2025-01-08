<?php
/**
 * A custom block for formatting images of interfaces and screenshots..
 *
 * @package MozillaBuilders
 * @param array $block The block settings and attributes.
 */

use Timber\Timber;

$context               = Timber::context();
$context['image']      = get_field( 'image' );
$context['alignclass'] = 'align' . ( $block['align'] ? $block['align'] : 'center' );

Timber::render( basename( __DIR__ ) . '/interface-image.twig', $context );
