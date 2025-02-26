<?php
/**
 * Manages ACF settings.
 *
 * This file should only be called if ACF is enabled.
 *
 * @package MozillaLabs
 */

namespace MozillaLabs\Managers;

/** Class */
class ACFManager {
	/**
	 * Runs initialization tasks and filters.
	 *
	 * @return void
	 */
	public function run() {
		add_filter( 'acf/fields/relationship/query', array( $this, 'relationship_query' ), 10, 3 );
		add_filter( 'acf/fields/wysiwyg/toolbars', array( $this, 'edit_wysiwyg_toolbars' ) );
	}

	/**
	 * Modify ACF relationship field to show most recent posts instead of alpha
	 *
	 * @param array  $args    Args.
	 * @param string $field   Field.
	 * @param int    $post_id Post ID.
	 *
	 * @return array
	 */
	public function relationship_query( $args, $field, $post_id ) {
		// Order returned query collection by date, starting with most recent.
		$args['order']   = 'DESC';
		$args['orderby'] = 'post_date';

		return $args;
	}

	/**
	 * Updates the toolbars available for the ACF wysiwyg editor.
	 * Adds a new simple toolbar which only supports bold, italic, and underline operations.
	 *
	 * @param array $toolbars the default toolbars available.
	 *
	 * @return array the enabled toolbars
	 */
	public function edit_wysiwyg_toolbars( $toolbars ) {
		$toolbars['Bold, Italic, Link']           = array();
		$toolbars['Bold, Italic, Link'][1]        = array( 'bold', 'italic', 'link' );
		$toolbars['Bold, Italic, Link, Lists']    = array();
		$toolbars['Bold, Italic, Link, Lists'][1] = array( 'bold', 'italic', 'link', 'bullist', 'numlist' );

		return $toolbars;
	}
}
