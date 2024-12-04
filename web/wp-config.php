<?php
/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/** Authentication Unique Keys and Salts. */
define( 'AUTH_KEY', 'ZBSwjbkcwxgNdrMbgmyGlFPZMoQNMNSzlLczvfgoXGvVWfkrUhycJzSbheOkolNt' );
define( 'SECURE_AUTH_KEY', 'HwZdELQFAdYzuERxFrymFitYDjhtMqkNyNSfQyuHykQxHBLuBcXSwaEjOlSMWlWX' );
define( 'LOGGED_IN_KEY', 'GTlGovWsdcMjQGEiZBDaiwrPDxCJbvmEYbStiAFHUyqLblFQbQhKPRfrQQnZPbOn' );
define( 'NONCE_KEY', 'qgslMhblxbgLqRWHLqzSeuWXTAesYSgXcQlLxCrCojhaEYnsQVAxyCBQvHfighah' );
define( 'AUTH_SALT', 'PbACrClVBpnXbZoIKbapBeMVXYZKkxYqsjyUitvJpuQZUKKbcIYWHXeJsuIZOHiI' );
define( 'SECURE_AUTH_SALT', 'NLSDAoqSkfBDMKwkiGwjAMDZGMdIgCPLMWzUseIDRdaJBnJVwOAMLDcqfHCqxEsD' );
define( 'LOGGED_IN_SALT', 'MIIHAGeHKcNytCEJUNOsETFiWAMUUgEpJkQAlulckAcqlqvbYDNHoOZItwLYdhDt' );
define( 'NONCE_SALT', 'iDUNnruOzJsoGVHrQvoLbMNHKpmDzqaGEVtQfxOkALYzhDPhsqTPIopDGGhuYLLX' );

/* Add any custom values between this line and the "stop editing" line. */

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
defined( 'ABSPATH' ) || define( 'ABSPATH', dirname( __FILE__ ) . '/' );

// Include for settings managed by ddev.
$ddev_settings = __DIR__ . '/wp-config-ddev.php';
if ( ! defined( 'DB_USER' ) && getenv( 'IS_DDEV_PROJECT' ) == 'true' && is_readable( $ddev_settings ) ) {
	require_once( $ddev_settings );
}

// Load Composer dependencies.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

/** Include wp-settings.php */
if ( file_exists( ABSPATH . '/wp-settings.php' ) ) {
	require_once ABSPATH . '/wp-settings.php';
}
