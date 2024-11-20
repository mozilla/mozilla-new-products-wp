<?php
/**
 * Service for getting data from the GitHub API.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Services;

/** Class */
class GitHubService {

	/**
	 * The repo.
	 *
	 * @var string|null
	 */
	private ?string $repo = null;

	/**
	 * Repo data.
	 *
	 * @var array|null
	 */
	private ?array $repo_data = null;

	/**
	 * Initialize a service to fetch data for a repo.
	 *
	 * @param string $repo Link to the GitHub repo.
	 *
	 * @return void
	 */
	public function __construct( string $repo ) {
		if ( preg_match( '/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)$/', $repo, $matches ) ) {
			$this->repo = 'https://api.github.com/repos/' . $matches[1] . '/' . $matches[2];
			$this->fetch_repo_data();
		}
	}

	/**
	 * Fetches the repo data.
	 *
	 * @return void
	 */
	private function fetch_repo_data(): void {
		if ( is_null( $this->repo ) ) {
			return;
		}

		$response = wp_remote_get( $this->repo );

		if ( is_wp_error( $response ) ) {
			return;
		}

		$is_ok = 'OK' === $response['response']['message'];

		if ( ! $is_ok || ! is_array( $response ) ) {
			return;
		}

		$body = json_decode( $response['body'], true );

		if ( $body ) {
			$this->repo_data = $body;
		}
	}

	/**
	 * Check if the passed repo was a valid string.
	 *
	 * @return bool
	 */
	public function is_valid(): bool {
		return ! is_null( $this->repo ) && ! is_null( $this->repo_data );
	}

	/**
	 * Get the number of stars.
	 *
	 * @return int|null
	 */
	public function get_stars(): ?int {
		return $this->repo_data['stargazers_count'] ?? null;
	}

	/**
	 * Get the number of forks.
	 *
	 * @return int|null
	 */
	public function get_forks(): ?int {
		return $this->repo_data['forks'] ?? null;
	}

}
