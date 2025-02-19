<?php
/**
 * Model for the Technology taxonomy.
 *
 * @package MozillaLabs
 */

namespace MozillaLabs\Models\Taxonomy;

use Timber\Timber;
use Timber\Term as TimberTerm;

use MozillaLabs\Models\PostType\Project;

/** Class */
class Technology extends TimberTerm {
	const HANDLE = 'technology';

	/**
	 * Register the taxonomy.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Technologies',
				'singular_name' => 'Technology',
				'not_found'     => 'No Technologies Found',
				'add_new_item'  => 'Add New Technology',
			),
			'public'       => true,
			'hierarchical' => false,
			'rewrite'      => array(
				'slug' => 'technology',
			),
		);

		register_taxonomy( self::HANDLE, array( Project::HANDLE ), $args );
	}
}
