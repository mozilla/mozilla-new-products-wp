<?php
/**
 * Refresh the GitHub stats attached to projects.
 *
 * @package MozillaBuildersScheduledTasks
 */

namespace MozillaBuilders\ScheduledTasks\Jobs;

/** Class */
class RefreshGitHubStats {

	public static $interval = 'hourly';
	public static $hook = 'moz_refresh_github_status';

	/**
	 * Run.
	 */
	public static function run() {
		error_log( print_r( 'test', true ));
	}
}
