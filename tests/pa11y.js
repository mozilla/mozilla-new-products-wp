/* eslint-disable no-console */
'use strict';

const pa11y = require('pa11y');
const chalk = require('chalk');
const get = require('lodash.get');

const packageJson = require('../package.json');

const testingUrls = packageJson.testing.urls;

let testingPaths = get(packageJson.testing.accessibility, 'paths') || ['/'];
const ignoreCodes = get(packageJson.testing.accessibility, 'ignore.codes') || [];
const ignoreSelectors = get(packageJson.testing.accessibility, 'ignore.selectors') || [];

// Initialize variables
let url;
let key;

// Loop through all the URLs and set the test destination
if (process.argv[2]) {
  for (key in testingUrls) {
    if (key === process.argv[2]) {
      // Set the testing URL
      if (packageJson.testing.urls[key] !== '') {
        url = packageJson.testing.urls[key];
      } else {
        // If the URL object exists, but is empty
        console.log(chalk.red.bold(`✘ Error: Please add a URL for ${key}`));
        console.log('');
        process.exit(1);
      }
    }
  }

  // Target the provided URL if none matches
  if (!url) {
    url = process.argv[2];
    testingPaths = [''];
  }
} else {
  url = packageJson.testing.urls.local;
}

// Set up the pa11y config options
const config = {
  standard: packageJson.testing.accessibility.compliance,
  hideElements: ignoreSelectors.join(', '),
  includeWarnings: true,
  rootElement: 'body',
  threshold: 2,
  timeout: 20000,
  userAgent: 'pa11y',
  width: 1280,
  ignore: ignoreCodes,
  log: {
    debug: console.log.bind(console),
    error: console.error.bind(console),
    info: console.log.bind(console),
  },
  chromeLaunchConfig: {
    ignoreHTTPSErrors: true,
  },
};

/**
 * Run pa11y accessibility tests on
 * provided paths.
 */
async function run() {
  // Track if any tests have failed.
  let errorCount = 0;

  for (const p of testingPaths) {
    const resolvedURL = url + p;

    console.log(chalk.blue.bold('\n----------'));

    await pa11y(resolvedURL, config, (error, results) => {
      if (error) {
        errorCount += 1;
        return console.error(error);
      } else if (results.issues.length) {
        errorCount += 1;
        console.log(results);
      } else {
        console.log(chalk.green(`✔ All accessibility tests for ${resolvedURL} have passed.`));
      }
    });
  }

  const hasError = errorCount > 0;

  if (hasError) {
    console.log(chalk.red.bold(`\n--- ${errorCount} of ${testingPaths.length} tests failed. ---`));
    process.exit(1);
  } else {
    console.log(chalk.green.bold(`\n--- All ${testingPaths.length} tests passed. ----`));
  }
}

run();
