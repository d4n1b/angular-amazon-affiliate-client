define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'angular-router' );
	require( 'lodash' );

	var uri = require( 'app/uri' );

	return angular.module('app.module.contact', [
		'ui.router',

	]).config( function( $stateProvider, $urlRouterProvider, $locationProvider ) {

		var viewPath = uri.get('site.ui');

		$stateProvider

			.state( 'contact', {
				url: '/contact/',
				views: {
					'content': {
						templateUrl: viewPath + 'view=contact',
						controller: 'ContactController',
					}
				}
			});


	/* ------------------------------
		Controller: ContactController
	------------------------------  */
	}).controller( 'ContactController', function( $scope ) {

	});

});