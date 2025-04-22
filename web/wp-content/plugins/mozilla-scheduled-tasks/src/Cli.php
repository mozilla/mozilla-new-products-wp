<?php
/**
 * Registers WP CLI commands.
 *
 * @package MozillaLabsScheduledTasks
 */

namespace MozillaLabs\ScheduledTasks;

use MozillaLabs\ScheduledTasks\Jobs\RefreshGitHubStats;
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
		if (!class_exists('\MozillaLabs\Models\PostType\Product')) {
			WP_CLI::warning('This plugin only works with the Mozilla New Products theme.');
			die;
		}

		RefreshGitHubStats::run();
	}
}
