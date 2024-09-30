<?php
/**
 * Manages ACF settings.
 *
 * This file should only be called if ACF is enabled.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Managers;

/** Class */
class ACFManager {
	/**
	 * Runs initialization tasks and filters.
	 *
	 * @return void
	 */
	public function run() {
		add_filter( 'acf/fields/relationship/query', array( $this, 'relationship_query' ), 10, 3 );
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
}
