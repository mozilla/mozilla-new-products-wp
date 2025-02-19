<?php
/**
 * A custom block for formatting images of interfaces and screenshots..
 *
 * @package MozillaLabs
 * @param array $block The block settings and attributes.
 */

use Timber\Timber;

$alignment = $block['align'] ?? 'center';

$context               = Timber::context();
$context['image']      = get_field( 'image' );
$context['alignclass'] = 'align' . $alignment;

Timber::render( basename( __DIR__ ) . '/interface-image.twig', $context );
