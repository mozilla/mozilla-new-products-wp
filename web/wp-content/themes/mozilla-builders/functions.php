<?php
/**
 * WP Theme constants and setup functions
 *
 * @package MozillaBuilders
 */

use MozillaBuilders\Managers;
use MozillaBuilders\Models\Post;
use Timber\Timber;
use Dotenv\Dotenv;

/** Autoloader */
require_once 'vendor/autoload.php';

define( 'MOZILLA_BUILDERS_THEME_URL', get_stylesheet_directory_uri() );
define( 'MOZILLA_BUILDERS_THEME_PATH', dirname( __FILE__ ) . '/' );
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
	new Managers\TaxonomiesManager(),
	new Managers\WordPressManager(),
	new Managers\ContextManager(),
	new Managers\BlockManager(),
);

if ( function_exists( 'acf_add_local_field_group' ) ) {
	$managers[] = new Managers\ACFManager();
}

$theme_manager = new Managers\ThemeManager( $managers );
add_action( 'after_setup_theme', array( $theme_manager, 'setup_theme' ) );

// Set class maps.
add_filter(
	'timber/post/classmap',
	function ( $classmap ) {
		$custom_classmap = array(
			'post' => Post::class,
		);

		return array_merge( $classmap, $custom_classmap );
	}
);

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
