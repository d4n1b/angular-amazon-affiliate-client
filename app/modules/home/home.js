define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );
	require( 'angular-router' );
	require( 'slick-carousel' );
	require( 'modules/shop/directives' );

	var utils = require( 'app/utils' ),
		uri = require( 'app/uri' );


	return angular.module('app.module.home', [
		'ui.router',
	
	]).config( function( $stateProvider, $urlRouterProvider ) {

		var viewPath = uri.get('site.ui');


		// Resolver stateProvider
		// http://www.codelord.net/2015/06/02/angularjs-pitfalls-using-ui-routers-resolve/
		// http://learn.ionicframework.com/formulas/data-the-right-way/
		// Use $stateProvider to configure your states.
		$stateProvider

			// Home
			.state( 'root.home', {
				url: '',
				views: {
					'content@': {
						templateUrl: viewPath + 'view=home',
						controller: 'HomeController',
					}
				},
			});

	
	/* ------------------------------
		Controller: HomeController
	------------------------------  */
	}).controller( 'HomeController', ['$scope', '$rootScope', '$state', '$timeout', '$stateParams', 'ShopProductsService'
	, function($scope, $rootScope, $state, $timeout, $stateParams, Shop ) {

		// Get the bestseller data
		$scope.bestseller = {};

		Shop.get({ 'category': 'all'
			, 'bestseller': true
			, 'keys': 'bestseller:1,title,images,detailpageurl'
		}).then( function( data ) {

			var keys = _.keys( data ),
				// Get the half part for top and the other
				// for bottom home page
				adsHalfIndex = Math.ceil( keys.length / 2 );
				adsTopIndex = keys.slice( 0, adsHalfIndex ),
				adsBottomIndex = keys.slice( adsHalfIndex );

			$scope.bestsellerTop = _.pick( data, adsTopIndex );
			$scope.bestsellerBottom = _.pick( data, adsBottomIndex );

		});

	}]);

});