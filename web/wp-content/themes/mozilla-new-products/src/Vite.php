<?php
/**
 * Helper class to interact with Vite.
 *
 * @package MozillaNewProducts
 */

namespace MozillaNewProducts;

/** Class */
class Vite {
	/**
	 * Gets the Vite development server port.
	 *
	 * @return int
	 */
	public static function dev_server_port() {
		$port_path = MOZILLA_BUILDERS_THEME_PATH . '.vite/tmp/port';
		if ( ! file_exists( $port_path ) ) {
			return 5173;
		}
		$port_string = file_get_contents( $port_path );
		if ( ! $port_string ) {
			return 5173;
		}
		return (int) $port_string;
	}

	/**
	 * Gets the Vite development server URL.
	 *
	 * @return string
	 */
	public static function dev_server_url() {
		return 'http://localhost:' . self::dev_server_port() . parse_url( get_stylesheet_directory_uri(), PHP_URL_PATH );
	}

	/**
	 * Gets the Vite manifest.
	 *
	 * @return array|null
	 */
	public static function manifest() {
		// Check if file exists.
		$manifest_path = MOZILLA_BUILDERS_THEME_PATH . '/dist/.vite/manifest.json';
		if ( ! file_exists( $manifest_path ) ) {
			return null;
		}
		// Get file contents.
		$manifest_json = file_get_contents( $manifest_path );
		if ( ! $manifest_json ) {
			return null;
		}
		return json_decode( $manifest_json, true );
	}

	/**
	 * Gets the Vite JS assets.
	 *
	 * @return array
	 */
	public static function js_assets() {
		if ( 'production' === WP_ENV ) {
			return self::production_js_assets();
		} else {
			return self::development_js_assets();
		}
	}

	/**
	 * Gets the Vite production JS assets.
	 *
	 * @return array
	 */
	public static function production_js_assets() {
		$manifest = self::manifest();
		if ( ! $manifest ) {
			return array();
		}
		$assets = array();
		foreach ( $manifest as $file ) {
			if ( ! array_key_exists( 'isEntry', $file ) || ! $file['isEntry'] || ! array_key_exists( 'name', $file ) ) {
				continue;
			}
			$assets[ $file['name'] ] = array( MOZILLA_BUILDERS_THEME_URL . '/dist/' . $file['file'] );
		}
		return $assets;
	}

	/**
	 * Gets the Vite development JS assets.
	 *
	 * @return array
	 */
	public static function development_js_assets() {
		return array(
			'app'   => array(
				self::dev_server_url() . '/@vite/client',
				self::dev_server_url() . '/static/js/app.js',
			),
			'admin' => array(
				self::dev_server_url() . '/@vite/client',
				self::dev_server_url() . '/static/js/admin.js',
			),
		);
	}

	/**
	 * Gets the Vite CSS assets.
	 *
	 * @return array
	 */
	public static function css_assets() {
		if ( 'production' === WP_ENV ) {
			return self::production_css_assets();
		} else {
			return self::development_css_assets();
		}
	}

	/**
	 * Gets the Vite production CSS assets.
	 *
	 * @return array
	 */
	public static function production_css_assets() {
		$manifest = self::manifest();
		if ( ! $manifest ) {
			return array();
		}
		$assets = array();
		foreach ( $manifest as $file ) {
			if ( ! array_key_exists( 'isEntry', $file ) || ! $file['isEntry'] || ! array_key_exists( 'src', $file ) ) {
				continue;
			}
			$name            = pathinfo( basename( $file['src'] ), PATHINFO_FILENAME );
			$assets[ $name ] = array( MOZILLA_BUILDERS_THEME_URL . '/dist/' . $file['file'] );
		}
		return $assets;
	}

	/**
	 * Gets the Vite development CSS assets.
	 *
	 * @return array
	 */
	public static function development_css_assets() {
		return array(
			'app'   => array( self::dev_server_url() . '/static/scss/app.scss' ),
			'admin' => array( self::dev_server_url() . '/static/scss/admin.scss' ),
		);
	}
}
