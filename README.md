# Mozilla New Products

A new WordPress theme for Mozilla New Products.

## Table of Contents

- [🎁 What's in the Box](#-whats-in-the-box)
- [💻 System Requirements](#-system-requirements)
- [🛠 Installation](#-installation)
- [Plugins](#plugins)
- [Command Line](#command-line)
  - [Project scripts](#project-scripts)
  - [DDEV commands](#ddev-commands)
  - [Using composer](#using-composer)
  - [Using WP-CLI](#using-wp-cli)
- [Debugging](#debugging)
  - [Twig Functions](#twig-functions)
  - [Error Logs](#error-logs)
  - [Debug Bar & Timber Debug Bar Plugins](#debug-bar-timber-debug-bar-plugins)
- [🚀 Deployment](#-deployment)
- [📰 Gutenberg](#-gutenberg)
- [♿ Accessibility Testing](#-accessibility-testing)

## 🎁 What's in the Box

- Full [Timber](https://www.upstatement.com/timber/) integration.
- Local development setup with [DDEV](https://ddev.com/).
- Code bundling with [Webpack](https://webpack.js.org/), including:
  - [BrowserSync](https://www.npmjs.com/package/browser-sync-webpack-plugin)
  - [Autoprefixer](https://github.com/postcss/autoprefixer)
  - [CSS Extraction](https://www.npmjs.com/package/mini-css-extract-plugin)
  - [Environment Variable Injection](https://www.npmjs.com/package/dotenv-webpack)
- Linting and testing
  - JS, CSS, and PHP linting thanks to [Prettier](https://github.com/prettier/prettier), [ESLint](https://eslint.org/), and [phpcs](https://github.com/squizlabs/PHP_CodeSniffer)
  - Static analysis of PHP code with [PHPStan](https://phpstan.org/)
  - Accessibility testing with [pa11y](https://github.com/pa11y/pa11y)
  - Bundle size limiting with [bundlesize](https://github.com/siddharthkp/bundlesize)
  - [Husky](https://github.com/typicode/husky) to automatically run these lints and tests!
- CI setup with [GitHub Actions](https://help.github.com/en/actions)

## 💻 System Requirements

This project assumes that you have the following installed globally:

- [NVM](https://github.com/creationix/nvm) to manage your Node environment.

You'll also need a way to run a LAMP/LEMP (Linux, Apache/nginx, MySQL, PHP) stack on your machine. This project comes configured to run with [DDEV](https://ddev.com/), a docker-based development environment.

1. Install [Docker Desktop for Mac](https://www.docker.com/docker-mac): >= version 4

2. Install **DDEV** with Homebrew with `brew install ddev/ddev/ddev`. (If you don't have Homebrew, you can also use the [Get Started guide](https://ddev.com/get-started/) on the DDEV website for alternative installation methods.)

## 🛠 Installation

Note that these installation steps assume that you're using the DDEV configuration.

1. Run `nvm install` to ensure you're using the correct version of Node.

2. Duplicate the contents of `.env.sample` into a new `.env` file.

3. Duplicate the `web/auth.json.sample` file and rename it to `web/auth.json`. Search for this project's auth.json entry in 1Password and copy its contents into your `auth.json` file.

4. Run the install/setup command

   ```shell
   npm run setup
   ```

5. Once the installation script has finished, run the start command

   ```shell
   npm run start
   ```

6. The site should be up and running with BrowserSync at <http://localhost:3000>, which proxies <https://mozilla-new-products-wp.ddev.site>.

7. To access WP admin, visit https://mozilla-new-products-wp.ddev.site/wp-admin. The default credentials are `admin` / `password`. You may need to click on an 'Update Database' button the first time you log in; the defaults are fine here.

To shut down the container and development server, run `npm run stop`.

> Note that DDEV doesn't work very well with other similar packages, like Lando or Ups Dock. If you run into issues with the setup script around a port already being allocated, try stopping other environment tools to see if that clears up the issue.
>
> If you'd like to stop the DDEV tool, you can use the command `ddev poweroff`.

## Plugins

Plugins are managed with Composer. See the [Wiki entry on plugins](https://github.com/Upstatement/wordpress-starter-kit/wiki/Plugins) for more information on commonly used plugins, including the Upstatement Editorial plugin and ACF.

## Command line

This project has a few command line scripts that can be used to perform common actions, like starting all aspects of the development server or exporting/importing the database. In addition, DDEV provides a [number of commands](https://ddev.readthedocs.io/en/stable/users/usage/commands/) that can be used to interact with the local environment directly.

### Project scripts

The following scripts are helpers that wrap a number of commands around a common task.

#### Set up the environment for the first time

```shell
npm run setup
```

#### Start the environment

This command starts the containers with DDEV and starts the local development server for static assets.

```shell
npm run start
```

#### Lint

```shell
# Lint or fix JavaScript
npm run lint:js
npm run fix:js

# Lint or fix PHP
npm run lint:php
npm run fix:php
```

#### View PHP error logs

```shell
npm run phplogs
```

#### Export the database

```shell
npm run export-db
```

### DDEV commands

The following lists our a few common DDEV commands that can be useful for developers:

#### SSHing into the container

```shell
ddev ssh
```

### Using composer

PHP dependencies, including WordPress plugins available in the public plugin directory, are managed with composer. You can interact with composer via ddev:

#### Install from `composer.json`:

```shell
ddev composer install
```

#### Require a new WordPress plugin package:

```shell
ddev composer require wpackagist-plugin/wordpress-seo
```

### Using WP-CLI

The environment comes configured with [WP CLI](https://developer.wordpress.org/cli/commands/cli/); you can run WP CLI commands via the [`ddev wp` command](https://ddev.readthedocs.io/en/stable/users/usage/commands/#wp).

Make sure that your container is started with `ddev start`.

To update the local WordPress version:

```shell
ddev wp core update
```

## Debugging

Follow this guide to debug Timber templates: <https://timber.github.io/docs/guides/debugging/#enable-debugging>

### Twig Functions

In twig files, there are two common function you can use to print variables to the page: `dump()` and `print_r`.

```html
<pre>
  {{ dump(your_variable) }}
</pre>

{{ your_variable | print_r }}
```

### Error Logs

The gitignored `logs/error.log` file is a good place to look when hitting “critical error” screens during development. You can print to them using the `error_log` function, and can track updates to them in realtime using the following command:

```shell
./bin/logs
```

### Debug Bar & Timber Debug Bar Plugins

For more in-depth information like showing query, cache, and other helpful debugging information, you can install and enable the [Debug Bar](https://wordpress.org/plugins/debug-bar/) and [Timber Debug Bar](https://wordpress.org/plugins/debug-bar-timber/) plugins.

## 🚀 Deployment

When creating a deployment, we recommend generating a new release for your project with an appropriate version bump to the theme's version. This will help facilitate cache-busting for static assets, which receive the theme's version as a query string appended to the end of the path.

You can use the following script to bump the version numbers in this project's `package.json` and the theme's `style.css` (which is where the theme pulls the canonical version from):

```sh
./bin/versionbump [<newversionnumber> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```

By default, running the script with no arguments will result in a patch version bump (so, from `1.0.1` to `1.0.2`). The script utilizes [`npm-version`](https://docs.npmjs.com/cli/v7/commands/npm-version) behind the scenes to define the new version number; see [those docs](https://docs.npmjs.com/cli/v7/commands/npm-version) for more information on the available version options.

## 📰 Gutenberg

This theme has built-in support for building custom blocks. The wiki article on [Building Blocks](https://github.com/Upstatement/wordpress-starter-kit/wiki/Building-Blocks) in the Starter Kit repo has more documentation around the different methods for creating blocks and how to build them.

## ♿ Accessibility Testing

[Pa11y](https://pa11y.org/) is an automated tool that audits our website's pages for accessibility issues according to [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) standards. This tool captures machine detectable errors such as missing alt text, wrong heading order, browser errors, etc. For issues such as color contrast, keyboard navigation, or VoiceOver functionality, manual testing is advised.

To run the tests, run the following command:

```sh
npm run test:a11y <url>
```

where `<url>` is a valid URL, or one of `local`, `staging` or `live`. Running the command without specifying the url will default to `local`.

### Configuring pa11y

The `package.json` file has preset configurations for pa11y under `testing.accessibility`.

- `paths` (array): Paths appended to the specified URL.
- `ignore.codes` (array): WCAG codes to ignore
- `ignore.selectors` (array): CSS selectors to ignore
