define( function( require ) {

	require( 'angular' );
	require( 'angular-router' );
	require( 'angular-sanitize' );
	require( 'angular-cookies' );
	require( 'app/services' );
	require( 'bootstrap' );

	// Modules
	require( 'app/admin/modules/ads/ads' );
	require( 'app/admin/modules/blog/blog' );
	require( 'app/admin/modules/shop/shop' );
	require( 'app/admin/modules/login/login' );
	require( 'app/modules/admin/directives' );
	require( 'app/admin/services' );

	require( 'app/http/transformRequestToParam' )

	var uri = require( 'app/uri' ),
		uiPath = uri.get('site.ui'),
		appConfig = require( 'app/config' );


	angular.module( 'admin', [
		'ui.router',
		'ngSanitize',
		'ngCookies',
		'transformRequestToParam',
		
		'app.services',
		'admin.module.ads',
		'admin.module.blog',
		'admin.module.shop',
		'admin.module.login',
		'admin.directives',
		'admin.services',

	]).config([ '$httpProvider', function( $httpProvider ) {

		// $httpProvider.defaults.withCredentials = true;

		// $httpProvider.interceptors.push( function() {
		// 	return {
		//     'request': function(config) {
		//     	return config;
		//     },

		//    'requestError': function( rejection ) {
		//       if( canRecover( rejection ) ) {
		//         return responseOrNewPromise;
		//       }
		//       return $q.reject( rejection );
		//     },
		//     'response': function( response ) {
		//     	return response;
		//     },
		// 	'responseError': function(rejection) {
		//       if( canRecover( rejection ) ) {
		//         return responseOrNewPromise;
		//       }
		//       return $q.reject( rejection );
		//     }
		//   };
		// });


	// Promise
	// http://stackoverflow.com/questions/28053951/promise-factory-in-angular

	// Angular ui-router
	// -----------------------------------
	// https://github.com/angular-ui/ui-router#get-started
	// http://angular-ui.github.io/ui-router/site/#/api/ui.router
	// https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views
	// https://github.com/angular-ui/ui-router/wiki/Quick-Reference#ui-view
	// https://github.com/angular-ui/ui-router
	// - Resolver stateProvider -
	// http://www.codelord.net/2015/06/02/angularjs-pitfalls-using-ui-routers-resolve/
	// http://learn.ionicframework.com/formulas/data-the-right-way/
	// Use $stateProvider to configure your states.
	// https://medium.com/opinionated-angularjs/advanced-routing-and-resolves-a2fcbf874a1c
	}]).config([ '$stateProvider', '$urlRouterProvider', '$locationProvider',
	function( $stateProvider, $urlRouterProvider, $locationProvider ) {

		$locationProvider.html5Mode(true);

		// Force trailing slash
		$urlRouterProvider.rule(function ($injector, $location) {
			var path = $location.url();

			// check to see if the path already has a slash where it should be			
			if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) return;

			if (path.indexOf('?') > -1) { return path.replace('?', '/?') }

			return path + '/';
		});


		$urlRouterProvider
			.when( /^admin\/(?!\/(edit|add)).*/, '/' )
			.otherwise('/admin/'); // If the url is ever invalid, redirect to '/' aka the home state

		$stateProvider.state( 'admin', {
			url: '/admin/',
			abstract: true,
			templateUrl: uiPath + 'view=admin',
			resolve: {
				user:[ 'authService', '$q'
				, function( authService, $q ) {
					return authService.user || $q.reject({ unAuthorized: true });
				}]
			},
		});


	//
	}]).run([ '$rootScope', '$timeout', '$state', '$stateParams', '$cookieStore', 'authService', 'APP_CONFIG'
	, function( $rootScope, $timeout, $state, $stateParams, $cookieStore, authService, APP_CONFIG ) {

		// Check if logged user
		$rootScope.$on('$stateChangeError', function( event, toState, toParams, fromState, fromParams, error ) {
			if( error.unAuthorized ) {
				$state.go( 'login' );
			} else if( error.authorized ){
				$state.go( 'admin.blog' );
			}
		});

    authService.user = $cookieStore.get( 'user' );

		$rootScope.menus = APP_CONFIG.menus;
		$rootScope.brand = APP_CONFIG.brand;

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.uri = uri.get('all');

		$rootScope.logout = function() {
			authService.logout().then( function() {
				$state.go( 'login' );
			});
		}

	}]);

	// Bootstrap with config
	appConfig.get( function( config ) {
		angular.module('admin').constant( 'APP_CONFIG', config );
		angular.bootstrap( document, ['admin'] );
	});

});