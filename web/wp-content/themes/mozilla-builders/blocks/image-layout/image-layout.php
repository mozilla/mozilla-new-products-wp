<?php
/**
 * Custom block for creating image layouts
 *
 * Requires an Image Layout field group with three custom fields:
 * - imageLayoutImages (Gallery)
 * - imageLayoutLayout (Select) with the following choices
 *     - symmetrical : Symmetrical Grid (max 6 assets)
 *     - asymmetrical : Asymmetrical Grid  (max 3 assets)
 *     - row : Row (max 4 assets)
 * - imageLayoutCrop (True / False)
 * Set this field group if the block is equal to Image Layout
 *
 * @package MozillaBuilders
 * @param array $block The block settings and attributes.
 */

use Timber\Timber;

$alignment = $block['align'] ?? 'wide';

$context['layout']             = get_field( 'imageLayoutLayout' );
$context['crop_to_same_ratio'] = get_field( 'imageLayoutCrop' );
$context['alignclass']         = "align$alignment";

$images = get_field( 'imageLayoutImages' );

if ( is_array( $images ) ) {
	$context['images'] = array_map(
		function ( array $image ) {
			return Timber::get_image( $image['id'] );
		},
		$images
	);
}

$templates = array( basename( __DIR__ ) . '/image-layout.twig' );

Timber::render( $templates, $context );
