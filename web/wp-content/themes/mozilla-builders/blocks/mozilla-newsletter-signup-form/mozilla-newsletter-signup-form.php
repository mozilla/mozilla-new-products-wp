<?php
/**
 * Custom block for Mozilla Newsletter Signup Form.
 *
 * @package MozillaBuilders
 * @param array $block The block settings and attributes.
 */

use Timber\Timber;

$alignment = $block['align'] ?? 'wide';

$context                  = Timber::context();
$context['alignclass']    = "align$alignment";
$context['heading']       = get_field( 'newsletter_headline' );
$context['description']   = get_field( 'newsletter_description' );

// See https://github.com/mozilla/protocol/blob/main/assets/js/protocol/newsletter.js.
wp_enqueue_script(
	'mozilla-protocol-newsletter',
	MOZILLA_BUILDERS_THEME_URL . '/blocks/mozilla-newsletter-signup-form/vendor/protocol/js/newsletter.js',
	array(),
	'19.2.0',
	true
);

Timber::render( basename( __DIR__ ) . '/mozilla-newsletter-signup-form.twig', $context );
