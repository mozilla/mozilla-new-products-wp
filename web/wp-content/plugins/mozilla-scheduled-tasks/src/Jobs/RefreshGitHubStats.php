<?php
/**
 * Refresh the GitHub stats attached to projects.
 *
 * @package MozillaBuildersScheduledTasks
 */

namespace MozillaBuilders\ScheduledTasks\Jobs;

use MozillaBuilders\Models\PostType\Project;

/** Class */
class RefreshGitHubStats {

	public static $interval = 'hourly';
	public static $hook = 'moz_refresh_github_status';

	/**
	 * Run.
	 */
	public static function run() {
		if (!class_exists('\MozillaBuilders\Models\PostType\Project')) {
			error_log( 'This plugin only works with the Mozilla Builders theme.' );
			return;
		}

		$projects = get_posts(
			array(
				'post_type' => 'project',
				'posts_per_page' => -1,
				'post_status' => 'publish'
			)
		);

		if (empty($projects)) {
			return;
		}

		foreach ($projects as $project ) {
			Project::fetch_github_data( $project->ID, $project );
		}

		delete_transient( 'moz_warning' );
	}
}
