define( function( require ) {

	/*
	
	TODO:
	http://www.sitepoint.com/implementing-authentication-angular-applications/
	http://brewhouse.io/blog/2014/12/09/authentication-made-simple-in-single-page-angularjs-applications.html

	*/

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );
	require( 'angular-router' );
	require( 'app/admin/services' );

	var utils = require( 'app/utils' ),
		uri = require( 'app/uri' ),
		viewPath = uri.get('site.ui');


	return angular.module('admin.module.login', [
		'ui.router',
		'admin.services',
	
	]).config(['$stateProvider', '$urlRouterProvider'
	, function( $stateProvider, $urlRouterProvider ) {


		$stateProvider

			// Login
			.state( 'login', {
				url: '/login/',
				templateUrl: viewPath + 'view=admin.login',
				controller: 'LoginController',
				resolve: {
					user: ['authService', '$q',function( authService, $q ) {
						if( authService.user ){
							return $q.reject({ authorized: true });
						}
					}]
				},
			});
	
	
	/* ------------------------------
		Controller: LoginController
	------------------------------  */
	}]).controller( 'LoginController', ['$scope', '$rootScope', '$state', '$stateParams', 'authService'
	, function( $scope, $rootScope, $state, $stateParams, authService ) {

		$scope.submitText = 'Login';
		$scope.invalidLogin = false;

		$scope.login = function( username, password ){

			$scope.submitText = 'Logueando...';

			authService.login( username, password )
				.then( function( data ) {
					$state.go( 'admin.blog' );

				}, function( err ) {
					$scope.invalidLogin = true;
					$scope.loginMessage = err.data.content;

				}).finally( function() {
					$scope.submitText = 'Login';
				});
		}

	}]);


});