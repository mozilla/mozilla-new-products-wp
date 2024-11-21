<?php
/**
 * Custom autoloader for the plugin.
 *
 * @package MozillaBuildersScheduledTasks
 */

namespace MozillaBuilders\ScheduledTasks;

class Autoloader {
    /**
     * Register the autoloader.
     */
    public function register() {
        spl_autoload_register(array($this, 'load_class'));
    }

    /**
     * Load a class.
     *
     * @param string $class_name The name of the class to load.
     */
    public function load_class($class_name) {
        if (strpos($class_name, 'MozillaBuilders\\ScheduledTasks') === 0) {
            $file_path = __DIR__ . '/src' . str_replace('\\', DIRECTORY_SEPARATOR, substr($class_name, strlen('MozillaBuilders\\ScheduledTasks'))) . '.php';
            if (file_exists($file_path)) {
                require_once $file_path;
            }
        }
    }
}
