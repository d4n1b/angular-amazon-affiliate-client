define( function( require ) {

	/*
	
	TODO: put paginator in same view within shop.category.html and
	not in partials/products.html

	*/

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );
	require( 'magnific-popup' );
	require( 'angular-router' );
	require( 'app/admin/modules/ads/services' );

	var utils = require( 'app/utils' ),
		uri = require( 'app/uri' ),
		viewPath = uri.get('site.ui');


	return angular.module('admin.module.ads', [
		'ui.router',
		'ads.services',
	
	]).config(['$stateProvider', '$urlRouterProvider'
	, function( $stateProvider, $urlRouterProvider ) {


		$stateProvider

			// Ads
			.state( 'admin.ads', {
				url: 'ads/',
				views: {
					'main@admin': {
						templateUrl: viewPath + 'view=admin.ads'
					},
					'sidebar@admin.ads': {
						templateUrl: viewPath + 'view=admin.ads.sidebar',
						controller: 'AdsSidebarController',
						resolve: {
							'sidebar': ['AdsService', function( Ads ) {
								return Ads.get({ 'action': 'get', 'location_id': 'all' });
							}],
						}
					},
				},
			})

			// Ads location
			.state( 'admin.ads.list', {
				url: ':locationId/',
				views: {
					'content@admin.ads': {
						templateUrl: viewPath + 'view=admin.ads.list',
						controller: 'AdsListController',
					},
					'controllers@admin.ads': {
						templateUrl: viewPath + 'view=admin.ads.controllers',
						controller: 'AdsControllersController',
					},
				}
			})

			// Ads Ad
			.state( 'admin.ads.list.ad', {
				views: {
					'list@admin.ads.list': {
						templateUrl: viewPath + 'view=admin.ads.ad',
						controller: 'AdsAdController',
					}
				}
			})

			// Ads 404
			.state( 'admin.ads.list.404', {
				views: {
					'list@admin.ads.list': {
						templateUrl: viewPath + 'view=admin.ads.404',
					}
				}
			});
	
	
	/* ------------------------------
		Controller: AdsSidebarController
	------------------------------  */
	}]).controller( 'AdsSidebarController', ['$scope', '$rootScope', '$state', '$stateParams', 'sidebar'
	, function( $scope, $rootScope, $state, $stateParams, sidebar ) {

		if( sidebar.content ) {
			$scope.sidebar = sidebar.content;
		}


	/* ------------------------------
		Controller: AdsListController
	------------------------------  */
	}]).controller( 'AdsListController', ['$scope', '$state', '$timeout', '$stateParams', 'AdsService'
	, function( $scope, $state, $timeout, $stateParams, Ads ) {

		function getAdsByLocation( locationId, adId ) {
			var adId = adId || null,
				updateAdById = adId && $scope.location && _.isArray( $scope.location.items ) || false;

			// Get the ads by current location
			Ads.get({ 'action': 'get', 'location_id': locationId, 'ad_id': adId })
			.then( function( response ) {
				var currentLocation = response && response.content;

				if( currentLocation ) {
					var emptyItems = _.isEmpty( currentLocation.items );

					// Just update one ad
					if( updateAdById ) {
						for( var i=0, length=$scope.location.items.length; i<length; i++ ) {
							if( $scope.location.items[i].id == adId ) {
								$scope.location.items[i] = response.content.items;
							}
						}
					} else {
						$scope.location = currentLocation;
					}

					if( emptyItems ) {
						$state.go( 'admin.ads.list.404' );
					} else {
						$state.go( 'admin.ads.list.ad' );
					}
				}
			});
		}

		// Update the ads when change
		$scope.$on( 'Ads:adsHaveChanged', function( event, data ) {
			var data = data || {};
			getAdsByLocation( $stateParams.locationId, data.adId );
		});

		// Load the ads
		getAdsByLocation( $stateParams.locationId );

	/* ------------------------------
		Controller: AdsAdController
	------------------------------  */
	}]).controller( 'AdsAdController', ['$scope', '$rootScope', '$state', '$stateParams', 'AdsService'
	, function( $scope, $rootScope, $state, $stateParams, Ads ) {

		// Hide Ads
		$scope.hideAd = function( adId ) {
			if( adId ) {
				Ads.hide({ location_id: $stateParams.locationId
					, ads_ids: adId })
				.then( function( response ) {
					if( response && response.status == 'success' ) {
						$rootScope.$broadcast( 'Ads:adsHaveChanged', { adId: adId });
					}
				});
			}
		};

		// Remove Ads
		$scope.removeAd = function( adId ) {
			Ads.remove({ location_id: $stateParams.locationId
				, ads_ids: adId })
			.then( function( response ) {
				if( response && response.status == 'success' ) {
					$rootScope.$broadcast( 'Ads:adsHaveChanged' );
				}
			});
		};


	/* ------------------------------
		Controller: AdsControllersController
	------------------------------  */
	}]).controller( 'AdsControllersController', ['$scope', '$compile', '$state', '$stateParams', 'AdsService'
	, function( $scope, $compile, $state, $stateParams, Ads ) {

		var addAdPath = viewPath + 'view=admin.ads.add-popup';
		$scope.adsSrc = '';

		// Add new products
		$scope.addAds = function( adsSrc ) {
			if( adsSrc ) {
				Ads.add({ location_id: $stateParams.locationId
					, ads: adsSrc }, '.ads-add-result' )
				.then( function( response ) {
					if( response && response.status == 'success' ) {
						$scope.adsSrc = ''; // reset textarea
						$state.go( 'admin.ads.list', { locationId: $stateParams.locationId }, { reload: true });
					}
				});
			}
		};

		// Show add product popup
		$scope.showAddAdPopup = function() {
			$.get( addAdPath, function( content ) {
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

	}]);


});