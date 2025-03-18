<?php
/**
 * WP Theme constants and setup functions
 *
 * @package MozillaLabs
 */

use MozillaLabs\Managers;
use MozillaLabs\Models\PostType\Article;
use Timber\Timber;
use Dotenv\Dotenv;

define( 'MOZILLA_BUILDERS_THEME_URL', get_stylesheet_directory_uri() );
define( 'MOZILLA_BUILDERS_THEME_PATH', __DIR__ . '/' );
define( 'MOZILLA_BUILDERS_DOMAIN', get_site_url() );
define( 'MOZILLA_BUILDERS_SITE_NAME', get_bloginfo( 'name' ) );
define( 'MOZILLA_BUILDERS_THEME_VERSION', wp_get_theme()->get( 'Version' ) );

/**
 * Read in a .env file for environment variables.
 */
$dotenv = Dotenv::createImmutable( ABSPATH . '..' )->safeLoad();

/**
 * Set up our global environment constant and load its config first
 * Default: production
 */
define( 'WP_ENV', $_ENV['WP_ENV'] ?? 'production' );

Timber::init();
Timber::$dirname = array( 'templates', 'blocks' );

$managers = array(
	new Managers\WordPressManager(),
	new Managers\ContextManager(),
	new Managers\BlockManager(),
);

if ( function_exists( 'acf_add_local_field_group' ) ) {
	$managers[] = new Managers\ACFManager();
}

$theme_manager = new Managers\ThemeManager( $managers );
add_action( 'after_setup_theme', array( $theme_manager, 'setup_theme' ) );

/**
 * Add a Twig filter to convert WP_Post objects to Article objects
 */
add_filter(
	'timber/twig',
	function ( $twig ) {
		$twig->addFilter(
			new \Twig\TwigFilter(
				'as_article',
				function ( $post ) {
					if ( is_array( $post ) ) {
						return array_map(
							function ( $p ) {
								return Timber::get_post( $p );
							},
							$post
						);
					}
					return Timber::get_post( $post );
				}
			)
		);
		return $twig;
	}
);

/**
 * Customize error reporting settings
 */
function custom_error_reporting() {
	// Set the error reporting level to hide warnings but show other errors.
	error_reporting( E_ALL & ~E_WARNING & ~E_NOTICE & ~E_DEPRECATED );

	// Log errors to a file.
	ini_set( 'error_log', WP_CONTENT_DIR . '/debug.log' );
}
add_action( 'init', 'custom_error_reporting' );

/**
 * Log given values to logs/error.log
 *
 * @param array ...$values values to log.
 */
function print_log( ...$values ): void {
	foreach ( $values as $v ) {
		error_log( print_r( $v, true ) );
	}
}
