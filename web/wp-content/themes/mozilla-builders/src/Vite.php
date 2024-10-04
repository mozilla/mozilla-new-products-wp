<?php
/**
 * Helper class to interact with Vite.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders;

/** Class */
class Vite {

	/**
	 * Gets the Vite manifest.
	 *
	 * @return array|null
	 */
	public static function manifest() {
		$manifest_json = file_get_contents( MOZILLA_BUILDERS_THEME_PATH . '/dist/.vite/manifest.json' );
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
			'app' => array(
				VITE_DEV_SERVER_URL . '/@vite/client',
				VITE_DEV_SERVER_URL . '/static/js/app.js',
			),
			'admin' => array(
				VITE_DEV_SERVER_URL . '/@vite/client',
				VITE_DEV_SERVER_URL . '/static/js/admin.js',
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
			$name = pathinfo( basename( $file['src'] ), PATHINFO_FILENAME );
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
			'app' => array( VITE_DEV_SERVER_URL . '/static/scss/app.scss' ),
			'admin' => array( VITE_DEV_SERVER_URL . '/static/scss/admin.scss' ),
		);
	}
}
