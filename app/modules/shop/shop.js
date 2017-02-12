define( function( require ) {

	/*
	
	TODO: put paginator in same view within shop.category.html and
	not in partials/products.html

	*/

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );
	require( 'angular-router' );
	require( 'angular-bootstrap' );
	require( 'modules/shop/directives' );

	// Shop modules
	require( 'modules/shop/services' );

	var utils = require( 'app/utils' ),
		uri = require( 'app/uri' ),
		viewPath = uri.get('site.ui');


	return angular.module('app.module.shop', [
		'ui.router',
		'shop.directives',
		'shop.services',
		'ui.bootstrap.pagination',
	
	]).config( function( $stateProvider, $urlRouterProvider ) {

		$stateProvider

			// Shop Category
			.state( 'root.shop', {
				abstract: true,
				url: 'shop/',
				views: {
					'content@': {
						templateUrl: viewPath + 'view=shop',
						controller: 'ShopController',
					},
					'sidebar@root.shop': {
						templateUrl: viewPath + 'view=shop.sidebar',
					},
				},
				data: {
					'emptyProducts': true 
				}
			})

			// @TODO
			// righ now with this url makes the trick
			// asking for all it renders the query with this url /all/?subcategoryId=wedding%20rings&query=asdasd
			// else, render subcategory matching all the products
			// 
			// Shop Category Query
			.state( 'root.shop.query', {
				url: ':categoryId/?subcategory&query',
				views: {
					'products@root.shop': {
						templateUrl: viewPath + 'view=shop.products',
						controller: 'ShopProductsController',
						resolve: {
							'products': ['ShopProductsService', '$stateParams'
							, function( Products, $stateParams ) {
								return Products.get({
									'category': $stateParams.categoryId,
									'subcategory': $stateParams.subcategory,
									'query': $stateParams.query,
								});
							}]
						},
					},
					'pagination@root.shop': {
						templateUrl: viewPath + 'view=shop.products.pagination',
						controller: 'ShopProductsPaginationController',
					},
					'order@root.shop': {
						templateUrl: viewPath + 'view=shop.products.order',
						controller: 'ShopProductsOrderController',
					},
					'filters@root.shop': {
						templateUrl: viewPath + 'view=shop.products.filters',
						controller: 'ShopProductsFiltersController',
					},
				}
			})

			// Shop Category Query Empty
			.state( 'root.shop.query.404', {
				url: '',
				views: {
					'products@root.shop': {
						templateUrl: viewPath + 'view=shop.products.404',
						controller: 'ShopProducts404Controller'
					}
				}
			});

	
	

	/* ------------------------------
		Controller: ShopController
	------------------------------  */
	}).controller( 'ShopController', ['$scope', '$state', '$timeout', '$stateParams'
	, function( $scope, $state, $timeout, $stateParams ) {

		$scope.title = $stateParams.title;

	/* ------------------------------
		Controller: ShopProductsController
	------------------------------  */
	}]).controller( 'ShopProductsController', ['$scope', '$rootScope', '$state', 'products', '$timeout', '$location'
	, function( $scope, $rootScope, $state, products, $timeout, $location ) {

		// Fallback when there's no valid product
		if( _.isEmpty( products ) ) {
			$state.current.data.emptyProducts = true;
			$state.go( 'root.shop.query.404' );
		}

		$scope.products = products;

		$scope.$on( 'Shop:productsHaveChanged', function( event, data ) {
			$state.current.data.emptyProducts = false;
			$scope.products = data.products.partial;
		});

		$timeout( function() {
			$rootScope.$broadcast( 'Shop:productsInit', { 'products': products });
		});


	/* ------------------------------
		Controller: ShopProducts404Controller
	------------------------------  */
	}]).controller( 'ShopProducts404Controller', ['$scope', '$stateParams'
	, function( $scope, $stateParams ) {

		$scope.query = $stateParams.query || $stateParams.subcategory;



	/* ------------------------------
		Controller: ShopProductsOrderController
	------------------------------  */
	}]).controller( 'ShopProductsOrderController', ['$scope', '$rootScope'
	, function( $scope, $rootScope ) {

		$scope.predicate = '';
		$scope.reverse = true;

		$scope.order = function( predicate ) {
			$rootScope.$broadcast( 'Shop:orderHasChanged', { 'predicate': predicate } );
			$scope.reverse = $scope.predicate === predicate ? !$scope.reverse : $scope.reverse;
			$scope.predicate = predicate;
		};



	/* ------------------------------
		Controller: ShopProductsFiltersController
		This controller has been hardcoded to match
		with no formatted Amazon product price
	------------------------------  */
	}]).controller( 'ShopProductsFiltersController', ['$scope', '$rootScope'
	, function( $scope, $rootScope ) {

		$scope.filterActive = false;

		$scope.removeFilter = function() {
			$scope.minPrice = null;
			$scope.maxPrice = null;
			$scope.filter({ min: $scope.minPrice, max: $scope.maxPrice });
		};

		$scope.filter = function( params ) {
			var params = params || {};

			if( !params.min && !params.max ) {
				$scope.filterActive = false;

			} else {
				params.min = params.min * 100;
				params.max = params.max * 100;
				$scope.filterActive = true;
			}

			$rootScope.$broadcast( 'Shop:filtersHasChanged', { 'filter': params } );
		};

	
	/* ------------------------------
		Controller: ShopProductsPaginationController
	------------------------------  */
	}]).controller( 'ShopProductsPaginationController', ['$timeout', '$scope', '$rootScope', 'ShopProductsService'
	, function( $timeout, $scope, $rootScope, Products ) {

		$scope.templateUrl = viewPath + 'view=pagination'; // doesn't compile in shop/partials/products.pagination.html
		$scope.totalItems = _.keys( $scope.products ).length;
		$scope.itemsPerPage = 12;
		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.bigTotalItems = _.keys( $scope.products ).length;
		$scope.bigCurrentPage = 1;

		// Select the items by page
		// modify the 
		$scope.selectItems = function( options ) {

			if( !$scope.products ) return;

			var begin = ( $scope.currentPage - 1 ) * $scope.itemsPerPage,
				end = begin + $scope.itemsPerPage;

			Products.getPartial( $scope.products, begin, end, options ).broadcast();

			$('#scrollUp').click(); // Get the user to top page
		};

		// 
		$scope.$on( 'Shop:productsInit', function( event, data ) {
			$scope.products = data.products;
			$scope.selectItems();
		});

		// Get the items by specific order
		$scope.$on( 'Shop:orderHasChanged', function( event, order ) {
			if( order.predicate ) {
				$scope.selectItems({ action: 'order', params: order.predicate });
			}
		});

		// Get the items by specific filter
		$scope.$on( 'Shop:filtersHasChanged', function( event, filters ) {
			if( filters.filter ) {
				$scope.selectItems({ action: 'filter', params: filters.filter });
			}
		});

		// Bind the new total items changes
		// needed to render the new pagination
		$scope.$on( 'Shop:productsHaveChanged', function( event, data ) {
			$scope.totalItems = data.products.length;
		});

		$scope.$watch( 'currentPage', $scope.selectItems );

	}]);


});