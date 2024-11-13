<?php
/**
 * Profile model.
 *
 * @package MozillaBuilders
 */

namespace MozillaBuilders\Models\PostType;

use MozillaBuilders\Services\GitHubService;
use Timber\Post as TimberPost;
use Timber\Timber;
use WP_Post;

/** Class */
class Project extends TimberPost {
	const HANDLE = 'project';

	/**
	 * Register the Resource post type.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Projects',
				'singular_name' => 'Project',
				'not_found'     => 'No Projects Found',
				'add_new'       => 'Add New Project',
				'add_new_item'  => 'Add New Project',
			),
			'public'       => true,
			'menu_icon'    => 'dashicons-portfolio',
			'supports'     => array( 'title', 'thumbnail' ),
			'map_meta_cap' => true,
			'rewrite'      => array(
				'slug'       => 'project',
				'with_front' => false,
			),
		);

		register_post_type( self::HANDLE, $args );

		add_action( 'save_post', array( self::class, 'fetch_github_data' ), 10, 2 );
		add_action( 'admin_notices', array( self::class, 'github_validation_notice' ) );
	}

	/**
	 * Gets the GitHub stars and forks.
	 *
	 * @param int     $post_id ID of the post.
	 * @param WP_Post $post Post data.
	 *
	 * @return void
	 */
	public static function fetch_github_data( int $post_id, WP_Post $post ): void {
		// Make sure this is a published Project (and that ACF exists).
		if ( ! function_exists( 'get_field' ) || self::HANDLE !== $post->post_type || 'publish' !== $post->post_status ) {
			return;
		}

		$github_link = get_field( 'github_link', $post_id );

		if ( empty( $github_link ) ) {
			return;
		}

		$github = new GitHubService( $github_link );

		// If the repo link isn't a valid one, show an error.
		if ( ! $github->is_valid() ) {
			set_transient( 'moz_warning', 'Unable to fetch GitHub stats for the entered GitHub repo URL.', 1 );
			delete_post_meta( $post_id, 'project_github_stars' );
			delete_post_meta( $post_id, 'project_github_forks' );
			return;
		}

		$stars = $github->get_stars();
		$forks = $github->get_forks();

		update_post_meta( $post_id, 'project_github_stars', $stars );
		update_post_meta( $post_id, 'project_github_forks', $forks );
	}

	/**
	 * Set the validation message for the GitHub field.
	 *
	 * @return void
	 */
	public static function github_validation_notice(): void {
		$moz_warning = get_transient( 'moz_warning' );
		delete_transient( 'moz_warning' );

		if ( ! $moz_warning ) {
			return;
		}

		?>
		<div class="notice notice-warning is-dismissible warning">
			<p><?php echo esc_html( $moz_warning ); ?></p>
		</div>
		<?php
	}

	/**
	 * Get the contributors for the project.
	 *
	 * @return array
	 */
	public function contributors() {
		$contributors = $this->meta( 'contributors' );

		if ( empty( $contributors ) ) {
			return array();
		}

		return array_map( fn( $contributor ) => Timber::get_post( $contributor ), $contributors );
	}

	/**
	 * Get the platforms for the project.
	 *
	 * @return array
	 */
	public function platforms() {
		return $this->terms( 'platform' );
	}

	/**
	 * Get the categories for the project.
	 *
	 * @return array
	 */
	public function categories() {
		return $this->terms( 'category' );
	}

	/**
	 * Get the technologies for the project.
	 *
	 * @return array
	 */
	public function technologies() {
		return $this->terms( 'technology' );
	}

	/**
	 * Get 3 other projects to feature on the project page.
	 *
	 * @return array
	 */
	public function other_projects() {
		$args = array(
			'post_type'      => self::HANDLE,
			'post_status'    => 'publish',
			'posts_per_page' => 3,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'post__not_in'   => array( $this->id ),
		);

		return Timber::get_posts( $args )->to_array();
	}

	/**
	 * Returns the GitHub stars for this Project.
	 *
	 * @return int|null
	 */
	public function github_stars(): ?int {
		$stars = get_post_meta( $this->id, 'project_github_stars', true );

		if ( empty( $stars ) ) {
			return null;
		}

		return $stars;
	}

	/**
	 * Returns the GitHub forks for this Project.
	 *
	 * @return int|null
	 */
	public function github_forks(): ?int {
		$forks = get_post_meta( $this->id, 'project_github_forks', true );

		if ( empty( $forks ) ) {
			return null;
		}

		return $forks;
	}
}
