<?php
/**
 * Plugin Name: Mozilla Scheduled Tasks
 * Description: Enable scheduled tasks.
 * Version: 0.1.0
 * Requires at least: 6.6
 * Requires PHP: 8.2
 * Author: Upstatement
 * Author URI: https://upstatement.com
 *
 * @package MozillaBuildersScheduledTasks
 */

namespace MozillaBuilders\ScheduledTasks;

use MozillaBuilders\ScheduledTasks\Autoloader;
use WP_CLI;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/autoloader.php';
require_once __DIR__ . '/src/JobManager.php';
require_once __DIR__ . '/src/Cli.php';

$autoloader = new Autoloader();
$autoloader->register();

class Plugin {
    private $job_manager;

    public function __construct() {
        $this->job_manager = new JobManager();

        register_deactivation_hook(__FILE__, array($this->job_manager, 'deactivate_plugin'));

		$this->job_manager->register_jobs();
    }
}

new Plugin();

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command( 'mozilla tasks', new Cli() );
}
