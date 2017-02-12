define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'angular-router' );
	require( 'lodash' );

	// Blog modules
	require( 'modules/blog/services' );

	var uri = require( 'app/uri' ),
		viewPath = uri.get('site.ui');


	return angular.module('app.module.blog', [
		'ui.router',
		'blog.services',

	]).config( function( $stateProvider, $urlRouterProvider, $locationProvider ) {

		$stateProvider

			.state( 'root.blog', {
				abstract: true,
				url: 'blog/',
				views: {
					'content@': {
						templateUrl: viewPath + 'view=blog',
						controller: 'BlogController',
					}
				}
			})

			.state( 'root.blog.postList', {
				url: '',
				views: {
					'posts@root.blog': {
						templateUrl: viewPath + 'view=blog.post-preview',
						resolve: {
							posts: ['BlogPostServices', '$stateParams', '$q'
							, function( Posts, $stateParams, $q ) {
								return Posts.get({ 'post_id': 'all', 'keys': 'lang:' + $stateParams.locale })
									|| $q.reject();
							}]
						},
						controller: 'BlogPostListController',
					},
				}
			})

			.state( 'root.blog.postSingle', {
				url: '{postId:[0-9a-zA-Z]{1,}}/{postLink:[0-9a-zA-Z\-]{1,}}/',
				views: {
					'posts@root.blog': {
						templateUrl: viewPath + 'view=blog.post-single',
						resolve: {
							post: ['BlogPostServices', '$stateParams', '$q'
							, function( Posts, $stateParams, $q ) {
								return Posts.get({ 'post_id': $stateParams.postId, 'keys': 'lang:' + $stateParams.locale })
									|| $q.reject();
							}]
						},
						controller: 'BlogPostSingleController',
					},
				}
			});


	/* ------------------------------
		Controller: BlogController
	------------------------------  */
	}).controller( 'BlogController', ['$scope', '$rootScope'
	, function( $scope, $rootScope ) {

		$rootScope.$on('$stateChangeStart', function() {
			$('#scrollUp').click();
		});



	/* ------------------------------
		Controller: BlogPostListController
	------------------------------  */
	}]).controller( 'BlogPostListController', ['$scope', 'posts'
	, function( $scope, posts ) {

		var posts = posts && posts.content;

		// Paginator
		$scope.date = new Date();
		$scope.totalItems = posts.length;
		$scope.itemsPerPage = 5;
		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.bigTotalItems = posts.length;
		$scope.bigCurrentPage = 1;
		$scope.posts = posts.slice( 0, $scope.itemsPerPage );

		// Select the items by page
		$scope.selectItems = function() {
			var begin = ( $scope.currentPage - 1 ) * $scope.itemsPerPage,
				end = begin + $scope.itemsPerPage;

			$scope.posts = posts.slice( begin, end );

			// Get the user to top page
			$('#scrollUp').click();
		};
		
		$scope.$watch( 'currentPage', $scope.selectItems );


	/* ------------------------------
		Controller: BlogPostSingleController
	------------------------------  */
	}]).controller( 'BlogPostSingleController', ['$scope', 'post', function( $scope, post ) {

		var post = _.first( _.get( post, 'content', {} ) ); // get the post array

		if( !post ) {
			// redirect 404
		}

		$scope.post = post;
	
	}]);

});