<?php
/**
 * Custom block for inserting code with syntax highlighting.
 *
 * @package MozillaLabs
 * @param array $block The block settings and attributes.
 */

use Timber\Timber;
use Highlight\Highlighter;

$alignment = $block['align'] ?? 'wide';

$hl       = new Highlighter();
$code     = get_field( 'code' );
$language = get_field( 'language' );

$context               = Timber::context();
$context['language']   = $language;
$context['code']       = array(
	'plain'       => $code,
	'highlighted' => $hl->highlight( $language, $code )->value,
);
$context['filename']   = get_field( 'filename' );
$context['alignclass'] = "align$alignment";

Timber::render( basename( __DIR__ ) . '/advanced-code.twig', $context );
