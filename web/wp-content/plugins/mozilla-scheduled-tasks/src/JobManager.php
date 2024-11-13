<?php
/**
 * Manages the scheduled tasks.
 *
 * @package MozillaBuildersScheduledTasks
 */

namespace MozillaBuilders\ScheduledTasks;

use DirectoryIterator;

class JobManager {
    private $job_classes = [];

    public function __construct() {
        $this->load_job_classes();
    }

    public function register_jobs() {
		foreach ($this->job_classes as $class) {
			if (property_exists($class, 'hook') && method_exists($class, 'run')) {
				add_action($class::$hook, array($class, 'run'));
			}
        }

        foreach ($this->job_classes as $class) {
			if (property_exists($class, 'hook') && property_exists($class, 'interval') && !wp_next_scheduled($class::$hook)) {
				wp_schedule_event(time(), $class::$interval, $class::$hook);
			}
        }
    }

    public function deactivate_plugin() {
        $this->unschedule_jobs();
    }

    private function load_job_classes() {
        $dir = new DirectoryIterator(__DIR__ . '/Jobs');
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot() && $fileinfo->isFile() && $fileinfo->getExtension() === 'php') {
                $class_name = '\\MozillaBuilders\\ScheduledTasks\\Jobs\\' . $fileinfo->getBasename('.php');
                if (class_exists($class_name)) {
                    $this->job_classes[] = $class_name;
                }
            }
        }
    }

    private function unschedule_jobs() {
        foreach ($this->job_classes as $class) {
            $timestamp = wp_next_scheduled($class::$hook ?? null);
            if ($timestamp) {
                wp_unschedule_event($timestamp, $class::$hook);
            }
        }
    }
}
