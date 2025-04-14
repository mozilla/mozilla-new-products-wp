<?php
/**
 * Registers WP CLI commands.
 *
 * @package MozillaNewProductsScheduledTasks
 */

namespace MozillaNewProducts\ScheduledTasks;

use MozillaNewProducts\ScheduledTasks\Jobs\RefreshGitHubStats;
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
		if (!class_exists('\MozillaNewProducts\Models\PostType\Product')) {
			WP_CLI::warning('This plugin only works with the Mozilla Labs theme.');
			die;
		}

		RefreshGitHubStats::run();
	}
}
