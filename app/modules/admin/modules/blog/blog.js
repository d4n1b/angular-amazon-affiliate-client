define( function( require ) {

	/*
	
	TODO: put paginator in same view within shop.category.html and
	not in partials/products.html

	*/

	require( 'jquery' );
	require( 'jquery-fn' );
	require( 'angular' );
	require( 'lodash' );
	require( 'lodash-mixins' );
	require( 'angular-router' );
	require( 'app/admin/modules/blog/services' );


	var utils = require( 'app/utils' ),
		uri = require( 'app/uri' ),
		viewPath = uri.get('site.ui'),
		blogPath = uri.get('site.blog');


	return angular.module('admin.module.blog', [
		'ui.router',
		'blog.services'
	]).config(['$stateProvider', '$urlRouterProvider'
	, function( $stateProvider, $urlRouterProvider ) {


		$stateProvider

			// Blog
			.state( 'admin.blog', {
				url: '',
				views: {
					'main@admin': {
						templateUrl: viewPath + 'view=admin.blog',
						controller: 'BlogController',
					},
					'sidebar@admin.blog': {
						templateUrl: viewPath + 'view=admin.blog.sidebar',
						controller: 'BlogSidebarController',
						resolve: {
							'posts': ['BlogService', function( Blog ) {
								return Blog.get({ 'show_hidden': true
									, 'post_id': 'all'
									, 'keys': 'lang:es,title,id'
									, 'type': 'object' });
							}]
						}
					},
				}
			})


			// Blog add
			.state( 'admin.blog.add', {
				url: 'add/',
				views: {
					'content@admin.blog': {
						templateUrl: viewPath + 'view=admin.blog.post-form',
						controller: 'BlogPostSetController',
						resolve: {
							'post': ['BlogService', '$stateParams'
							, function( Blog, $stateParams ) {
								return Blog.get({ 'show_hidden': true
									, 'post_id': 'map' });
							}],
						}
					},
				}
			})


			// Blog Edit
			.state( 'admin.blog.edit', {
				url: 'edit/{postId:[A-Za-z0-9]{6}}/',
				views: {
					'content@admin.blog': {
						templateUrl: viewPath + 'view=admin.blog.post-form',
						controller: 'BlogPostSetController',
						resolve: {
							'post': ['BlogService', '$stateParams'
							, function( Blog, $stateParams ) {
								return Blog.get({ 'show_hidden': true
									, 'post_id': $stateParams.postId });
							}],
						}
					},
				}
			});
	
	/* ------------------------------
		Controller: BlogController
	------------------------------  */
	}]).controller( 'BlogController', ['$scope', '$rootScope', '$state', '$timeout', '$stateParams'
	, function( $scope, $rootScope, $state, $timeout, $stateParams ) {



	/* ------------------------------
		Controller: BlogSidebarController
	------------------------------  */
	}]).controller( 'BlogSidebarController', ['$scope', '$state', '$stateParams', 'BlogService', 'posts'
	, function( $scope, $state, $stateParams, Blog, posts ) {

		$scope.noPosts = false;

		if( posts.content ) {
			$scope.sidebar = posts.content;

			if( _.isEmpty( $scope.sidebar ) ) {
				$scope.noPosts = true;
			}
		}

		// Remove Post
		$scope.removePost = function( postId ) {
			Blog.removePost( postId ).then( function( response ) {
				if( response && response.status == 'success' ) {
					// If removing when editing, redirect to admin.blog
					if( $state.params.postId == postId ) {
						$state.go( '^', {}, { reload: true });
					} else {
						$state.go( $state.current.name, {}, { reload: true });
					}
				}
			});
		};


	/* ------------------------------
		Controller: BlogPostSetController
	------------------------------  */
	}]).controller( 'BlogPostSetController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'BlogService', 'post'
	, function( $scope, $rootScope, $http, $state, $stateParams, Blog, post ) {

		var $formPostSet = $('form#post-set-form'),
			$formResult = $('#blog-set-result'),
			timer = 2000,
			currentState = $state.current.name,
			formData;

		if( post.status && post.status == 'success' && post.content ) {

			if( _.isEmpty( post.content ) ) {
				$state.go('^'); // has to redirect to 404
			} else {
				$scope.post = post.content;
				$scope.tabselected = _.first( $scope.post ).lang;
			}
		}

		// Restore data
		$scope.restoreData = function() {
			$state.go( currentState, {}, { reload: true });
		};

		// Save post
		$scope.savePost = function() {
			formData = $formPostSet.serializeArrayAll();
				
			Blog.setPost( formData ).then( function( response ) {
				if( response && response.content ) {
					$formResult.html( response.content );

					if( response.status == 'success' ) {
						setTimeout( function() {
							$state.go( currentState, {}, { reload: true });
						}, timer );
					}
				}
			});

		};

	}]);


});