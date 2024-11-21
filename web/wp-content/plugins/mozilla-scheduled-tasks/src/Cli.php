<?php
/**
 * Registers WP CLI commands.
 *
 * @package MozillaBuildersScheduledTasks
 */

namespace MozillaBuilders\ScheduledTasks;

use MozillaBuilders\ScheduledTasks\Jobs\RefreshGitHubStats;
use WP_CLI;

class Cli {
	/**
	 * Refresh GitHub.
	 *
	 * ## EXAMPLES
	 *
	 *     wp mozilla tasks refresh-github
	 *
	 * @subcommand refresh-github
	 */
	public function refresh_github() {
		if (!class_exists('\MozillaBuilders\Models\PostType\Project')) {
			WP_CLI::warning('This plugin only works with the Mozilla Builders theme.');
			die;
		}

		RefreshGitHubStats::run();
	}
}
