define( function( require ) {

	require( 'angular' );
	require( 'angular-router' );
	require( 'app/controllers' );

	return angular.module( 'app', [
		'app.controllers',
		'ui.router',

	]).config( function( $routeProvider, $locationProvider ) {
		$routeProvider.otherwise({redirectTo: '/view1'});
	});


});