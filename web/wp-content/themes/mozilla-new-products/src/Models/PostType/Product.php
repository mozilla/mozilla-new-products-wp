<?php
/**
 * Product model.
 *
 * @package MozillaNewProducts
 */

namespace MozillaNewProducts\Models\PostType;

use MozillaNewProducts\Services\GitHubService;
use Timber\Post as TimberPost;
use Timber\Timber;
use WP_Post;
use MozillaNewProducts\Models\Taxonomy\ProductCategory;

/** Class */
class Product extends TimberPost {
	const HANDLE = 'product';

	/**
	 * Register the Resource post type.
	 *
	 * @return void
	 */
	public static function register() {
		$args = array(
			'labels'       => array(
				'name'          => 'Products',
				'singular_name' => 'Product',
				'not_found'     => 'No Products Found',
				'add_new'       => 'Add New Product',
				'add_new_item'  => 'Add New Product',
			),
			'public'       => true,
			'menu_icon'    => 'dashicons-portfolio',
			'supports'     => array( 'title', 'thumbnail' ),
			'map_meta_cap' => true,
			'rewrite'      => array(
				'slug'       => 'product',
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
		// Make sure this is a published Product (and that ACF exists).
		if ( ! function_exists( 'get_field' ) || self::HANDLE !== $post->post_type || 'publish' !== $post->post_status ) {
			return;
		}

		$github_link = get_field( 'github_link', $post_id );
		$github      = new GitHubService( $github_link );

		// If the repo link isn't a valid one, remove the GitHub metadata.
		if ( ! $github->is_valid() ) {
			// If the field isn't empty, it means we have a bad URL. Show a warning.
			if ( ! empty( $github_link ) && ! ( defined( 'WP_CLI' ) && WP_CLI ) ) {
				set_transient( 'moz_warning', 'Unable to fetch GitHub stats for the entered GitHub repo URL.', 1 );
			}
			delete_post_meta( $post_id, 'product_github_stars' );
			delete_post_meta( $post_id, 'product_github_forks' );
			return;
		}

		$stars = $github->get_stars();
		$forks = $github->get_forks();

		update_post_meta( $post_id, 'product_github_stars', $stars );
		update_post_meta( $post_id, 'product_github_forks', $forks );
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
	 * Get the contributors for the product.
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
	 * Get the platforms for the product.
	 *
	 * @return array
	 */
	public function platforms() {
		return $this->terms( 'platform' );
	}

	/**
	 * Get the categories for the product.
	 *
	 * @return array
	 */
	public function categories() {
		return $this->terms( ProductCategory::HANDLE );
	}

	/**
	 * Get the technologies for the product.
	 *
	 * @return array
	 */
	public function technologies() {
		return $this->terms( 'technology' );
	}

	/**
	 * Get all related articles.
	 *
	 * @return array
	 */
	public function related_articles() {
		$args = array(
			'post_type'      => Article::HANDLE,
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'meta_query'     => array(
				array(
					'key'     => 'products',
					'value'   => $this->id,
					'compare' => 'LIKE',
				),
			),
		);

		return Timber::get_posts( $args )->to_array();
	}


	/**
	 * Get 3 other products to feature on the product page.
	 *
	 * @return array
	 */
	public function other_products() {
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
	 * Returns the GitHub stars for this Product.
	 *
	 * @return int|null
	 */
	public function github_stars(): ?int {
		$stars = get_post_meta( $this->id, 'product_github_stars', true );

		if ( empty( $stars ) ) {
			return null;
		}

		return $stars;
	}

	/**
	 * Returns the GitHub forks for this Product.
	 *
	 * @return int|null
	 */
	public function github_forks(): ?int {
		$forks = get_post_meta( $this->id, 'product_github_forks', true );

		if ( empty( $forks ) ) {
			return null;
		}

		return $forks;
	}
}
