define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );
	require( 'angular-router' );
	require( 'modules/shop/services' );
	require( 'app/filters' );
	require( 'magnific-popup' );

	var utils = require( 'app/utils' ),
		uri = require( 'app/uri' ),
		viewPath = uri.get('site.ui');


	return angular.module('admin.module.shop', [
		'ui.router',
		'shop.services',
		'app.filters',

	]).config(['$stateProvider', '$urlRouterProvider'
	, function( $stateProvider, $urlRouterProvider ) {


		$stateProvider

			// Shop
			.state( 'admin.shop', {
				url: 'shop/',
				views: {
					'main@admin': {
						templateUrl: viewPath + 'view=admin.shop'
					},
					'sidebar@admin.shop': {
						templateUrl: viewPath + 'view=admin.shop.sidebar',
						controller: 'ShopSidebarController',
					},
				}
			})

			// Product List
			.state( 'admin.shop.subcategory', {
				url: ':categoryId/:subcategoryId/',
				views: {
					'content@admin.shop': {
						templateUrl: viewPath + 'view=admin.shop.product',
						controller: 'ShopListController',
						resolve: {
							'products': ['ShopProductsService', '$stateParams',
							function( Products, $stateParams ) {
								return Products.get({ 'action': 'getAll'
									, 'category': $stateParams.categoryId
									, 'subcategory': $stateParams.subcategoryId
									, 'hidden': true });
							}]
						},
					},
					'controllers@admin.shop': {
						templateUrl: viewPath + 'view=admin.shop.products.controllers',
						controller: 'ShopProductsControllersController',
					},
				}
			})

			// Product not found
			.state( 'admin.shop.subcategory.404', {
				url: '',
				views: {
					'content@admin.shop': {
						templateUrl: viewPath + 'view=admin.shop.products.404',
					},
				}
			});

	
	/* ------------------------------
		Controller: ShopController
	------------------------------  */
	}]).controller( 'ShopContentController', ['$scope', '$rootScope', '$state', '$stateParams'
	, function( $scope, $rootScope, $state, $stateParams ) {



	/* ------------------------------
		Controller: ShopProductsControllersController
	------------------------------  */
	}]).controller( 'ShopProductsControllersController', ['$scope', '$compile', '$rootScope', '$state', '$stateParams', 'ShopProductsService'
	, function( $scope, $compile, $rootScope, $state, $stateParams, Products ) {

		var addProductPath = viewPath + 'view=admin.shop.products.add-popup';

		$scope.newProducts = [];

		// Show add product popup
		$scope.showAddProductPopup = function() {
			$.get( addProductPath, function( content ) {
				if( content ) {
					$.magnificPopup.open({
						items: {
							src: content,
							type: 'inline',
						},
						callbacks: {
							open: function() {
								$compile(this.content)($scope);
								$scope.$digest();
							},
						}
					});
				}
			});
		};

		// Add new products
		$scope.addProducts = function( productsIds ) {
			if( productsIds ) {
				Products.add({ category: $stateParams.categoryId
					, subcategory: $stateParams.subcategoryId
					, products_ids: productsIds }, '.products-add-result' )
				.then( function( response ) {
					if( response && response.status == 'success' ) {
						$scope.productsIds = '';
						$state.go( 'admin.shop.subcategory', $stateParams, { reload: true });
					}
				});
			}
		};

	/* ------------------------------
		Controller: ShopListController
	------------------------------  */
	}]).controller( 'ShopListController', ['$scope', '$rootScope', '$state', '$stateParams', 'products', 'ShopProductsService'
	, function( $scope, $rootScope, $state, $stateParams, products, Products ) {

		// Redirect if there's no products
		if( _.isEmpty( products ) )
			$state.go( 'admin.shop.subcategory.404' );

		$scope.products = products;
		$scope.productsToEdit = {};
		$scope.hasResult = false;
		$scope.result = '';

		$scope.addProductToEdit = function( id, title, description ) {
			$scope.productsToEdit[id] = { title: title, description: description };
		};

		// Helper to check is product id is ready to edit
		$scope.productHasChange = function( id ) {
			return $scope.productsToEdit && $scope.productsToEdit[id];
		};

		// Edit products
		$scope.editProducts = function() {
			Products.editProducts({ category: $stateParams.categoryId
					, subcategory: $stateParams.subcategoryId
					, products: $scope.productsToEdit
			}).then( function( response ) {
				if( response && response.status == 'success' ) {
					$scope.hasResult = true;
					$scope.result = response.content;
				}
			});
		};

		$scope.hideProduct = function( productId ) {
			if( productId ) {
				Products.hide({ category: $stateParams.categoryId
					, subcategory: $stateParams.subcategoryId
					, product_id: productId })
				.then( function( response ) {
					if( response && response.status == 'success' ) {
						$scope.products = response.content;
					}
				});
			}
		};

		$scope.bestsellerProduct = function( productId ) {
			if( productId ) {
				Products.bestseller({ category: $stateParams.categoryId
					, subcategory: $stateParams.subcategoryId
					, product_id: productId })
				.then( function( response ) {
					if( response && response.status == 'success' ) {
						$scope.products = response.content;
					}
				});
			}
		};

		$scope.removeProduct = function( productId ) {
			if( productId ) {
				Products.remove({ category: $stateParams.categoryId
					, subcategory: $stateParams.subcategoryId
					, product_id: productId })
				.then( function( response ) {
					if( response && response.status == 'success' ) {
						if( !response.content.length ) {
							$state.go( 'admin.shop.subcategory.404' );
						} else {
							$scope.products = response.content;
						}
					}
				});
			}
		};

		$scope.$on( 'Shop:productsHaveChanged', function( e, data ) {
			$scope.products = data.products;
		});

	/* ------------------------------
		Controller: ShopSidebarController
	------------------------------  */
	}]).controller( 'ShopSidebarController', ['$scope', '$rootScope', '$state', '$stateParams', 'ShopProductsService'
	, function( $scope, $rootScope, $state, $stateParams, Products ) {

		$scope.sidebar = $rootScope.menus.shop;

		// 
		$scope.togglePanel = function( event ) {
			event.preventDefault();

			var $this = $(event.target),
			$accordion = $this.parents( $this.attr('data-parent') ),
			$panel = $accordion.find( $this.attr('data-toggle') ),
			isPanelCollapsed = $panel.hasClass('collapse');

			if( isPanelCollapsed ) {
				utils.element.uncollapse( $panel );
			} else {
				utils.element.collapse( $panel );
			}
		}

		// TODO:
		$scope.hideSubcategory = function( params ) {
			Products.hide({ category: params.category
				, subcategory: params.subcategory })
			.then( function( response ) {
				if( response && response.status == 'success' ) {
					$rootScope.$broadcast( 'Shop:productsHaveChanged', { products: response.content });
				}
			});
		};


	}]);



});