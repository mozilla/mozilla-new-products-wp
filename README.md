# Mozilla Builders

A WordPress theme for Mozilla Builders.

## Table of Contents

- [🎁 What's in the Box](#-whats-in-the-box)
- [💻 System Requirements](#-system-requirements)
- [🛠 Installation](#-installation)
- [Activating Plugins](#activating-plugins)
- [🏃‍ Development Workflow](#-development-workflow)
  - [Debugging](#debugging)
  - [Common `wp-cli` commands](#common-wp-cli-commands)
- [🚀 Deployment](#-deployment)
- [🔄 Object-Oriented Approach](#-object-oriented-approach)
- [📰 Gutenberg](#-gutenberg)
- [♿ Accessibility Testing](#-accessibility-testing)
  - [Configuring pa11y](#configuring-pa11y)
- [🌐 Configuring Multisite](#-configuring-multisite)
  - [For Subdirectory](#for-subdomain)
  - [Caveats](#caveats)
- [👨‍👩‍👧‍👦 Contributing](#-contributing)
- [📗 Code of Conduct](#-code-of-conduct)
- [About Upstatement](#about-upstatement)

## 🎁 What's in the Box

- Full [Timber](https://www.upstatement.com/timber/) integration.
- Local development setup with [DDEV](https://ddev.com/).
- Code bundling with [Webpack](https://webpack.js.org/), including:
  - [BrowserSync](https://www.npmjs.com/package/browser-sync-webpack-plugin)
  - [Autoprefixer](https://github.com/postcss/autoprefixer)
  - [PostCSS Easing Gradients](https://github.com/larsenwork/postcss-easing-gradients)
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

3. Duplicate the `auth.json.sample` file and rename it to `auth.json`. Search for this project's auth.json entry in 1Password and copy its contents into your `auth.json` file.

4.  Run the install command

    ```shell
    ./bin/install
    ```

5.  Once the installation script has finished, run the start command

    ```shell
    ./bin/start
    ```

6.  In another terminal tab, run the setup theme command, which will activate your theme and update the seed database

    ```shell
    ./bin/setup-theme
    ```

7.  The site should be up and running with BrowserSync at <http://localhost:3000>, which proxies <https://mozilla-builders.ups.dock> if you're using Ups Dock, or <http://localhost:8888> if you're not.

8.  To access WP admin, visit `/wp-admin`. The default credentials are `admin` / `password` (configurable via `docker-compose.yml`) You may need to click on an 'Update Database' button the first time you log in, defaults are fine here.

To shut down the container and development server, type `Ctrl+C`.

**(Optional)** If you're running an Ups Dock build and you want to re-export the seed database without Ups Dock URLs, run the following command:

```shell
./bin/db-to-no-upsdock
```

## Activating Plugins

Plugins are managed with Composer. See the [Wiki entry on plugins](https://github.com/Upstatement/wordpress-starter-kit/wiki/Plugins) for more information on commonly used plugins, including the Upstatement Editorial plugin and ACF.

## Debugging

- Follow this guide to debug Timber templates: <https://timber.github.io/docs/guides/debugging/#enable-debugging>

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

## Common `wp-cli` commands

The docker containers come configured with [WP CLI](https://developer.wordpress.org/cli/commands/cli/); you can access WP CLI on the docker container while it is running with the [`wp` script](/blob/main/bin/wp).

Start the Docker containers with `./bin/start` and then run any of the following commands in a separate shell:

```shell
./bin/wp [command]
```

To update the local WordPress version:

```shell
./bin/wp core update
```

To export the database:

```shell
./bin/wp db export - > docker/conf/mysql/init-ups-dock.sql
```

To export the database and gzip it:

```shell
./bin/wp db export - | gzip -3 > docker/conf/mysql/init-ups-dock.sql.gz
```

To SSH into the WordPress container:

```shell
docker compose exec wordpress /bin/bash
```

## 🚀 Deployment

When creating a deployment, we recommend generating a new release for your project with an appropriate version bump to the theme's version. This will help facilitate cache-busting for static assets, which receive the theme's version as a query string appended to the end of the path.

You can use the following script to bump the version numbers in this project's `package.json` and the theme's `style.css` (which is where the theme pulls the canonical version from):

```sh
./bin/versionbump [<newversionnumber> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```

By default, running the script with no arguments will result in a patch version bump (so, from `1.0.1` to `1.0.2`). The script utilizes [`npm-version`](https://docs.npmjs.com/cli/v7/commands/npm-version) behind the scenes to define the new version number; see [those docs](https://docs.npmjs.com/cli/v7/commands/npm-version) for more information on the available version options.

## 🔄 Object-Oriented Approach

This theme utilizes an simple but structured object-oriented approach.

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

## 🌐 Configuring Multisite

In our Starter Kit, multisite is configured to run in subdomain mode:

```text
site-1.mozilla-builders.ups.dock
site-2.mozilla-builders.ups.dock
```

If you would like to run multisite in subdirectory mode

```text
mozilla-builders.ups.dock/site-1
mozilla-builders.ups.dock/site-2
```

Make the following changes:

1. Set the following environment variable in `docker-compose.ups-dock-multisite.yml` to 0, or just remove the line entirely.

   ```yaml
   WORDPRESS_MULTISITE_SUBDOMAIN_INSTALL: 0
   ```

2. Update your `VIRTUAL_HOST` environment variable in `docker-compose.ups-dock-multisite.yml` as follows or just remove the line entirely.

   ```yaml
   VIRTUAL_HOST: mozilla-builders.ups.dock,*.mozilla-builders.ups.dock
   ```

3. Update the SSL certificates generated by Ups Dock to include your four level subdomains

   a. Navigate to your local copy of [Ups Dock](https://github.com/Upstatement/ups-dock)

   ```shell
   cd path/to/ups-dock
   ```

   b. Remove the wildcard domain from the `[ alternate_names ]` section in `config/openssl.conf` (if it was channged) as follows:

   ```text
   DNS.1 = ups.dock
   DNS.2 = *.ups.dock
   ```

   c. Regenerate certs and restart Ups Dock

   ```shell
   ./bin/gen-certs.sh
   docker compose up -d
   ```

### Caveats

- Subdomain installs won't work without Ups Dock (or another tool that allows you to map domains to Docker containers) as it will not work when your base domain is `localhost`

For more details about everything these config vars do under the surface, consult [MULTISITE.md](MULTISITE.md).

## 👨‍👩‍👧‍👦 Contributing

We welcome all contributions to our projects! Filing bugs, feature requests, code changes, docs changes, or anything else you'd like to contribute are all more than welcome! More information about contributing can be found in the [contributing guidelines](.github/CONTRIBUTING.md).

### Setup

If you're installing this repository to contribute to this kit, all you need to do next is:

1. Run `nvm install` to ensure you're using the correct version of Node.

2. Duplicate the contents of `.env.sample` into a new `.env` file (see the step 2 in the [🛠 Installation](#-installation) steps to determine what compose file to use).

3. Run the install script:

   ```shell
   ./bin/install
   ```

4. Once the install script succeeds, fire up your site with the start command:

   ```shell
   ./bin/start
   ```

## 📗 Code of Conduct

Upstatement strives to provide a welcoming, inclusive environment for all users. To hold ourselves accountable to that mission, we have a strictly-enforced [code of conduct](CODE_OF_CONDUCT.md).

## About Upstatement

[Upstatement](https://www.upstatement.com/) is a digital transformation studio headquartered in Boston, MA that imagines and builds exceptional digital experiences. Make sure to check out our [services](https://www.upstatement.com/services/), [work](https://www.upstatement.com/work/), and [open positions](https://www.upstatement.com/jobs/)!
