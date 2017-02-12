define( function( require ) {

	require( 'jquery' );
	require( 'jquery-scrollup' );
	require( 'lodash' );
	require( 'angular' );
	require( 'angular-router' );

	var utils = require( 'app/utils' ),
		uri = require( 'app/uri' ),
		viewPath = uri.get('site.ui');


	return angular.module('app.module.content', [
		'ui.router',
	
	]).config(['$stateProvider', '$urlRouterProvider'
	, function( $stateProvider, $urlRouterProvider ) {

		$stateProvider

			// Content
			.state( 'root.content', {
				url: 'content/:contentId/?:cl',
				views: {
					'content@': {
						templateUrl: function( $stateParams ) {
							return viewPath + 'content=' + $stateParams.contentId;
						},
						controller: 'ContentController'
					},
				},
			});	

	}]).controller( 'ContentController', ['$stateParams', function( $stateParams ) {
		
		var slideTime = 500,
			marginTop = -40;

		if( $stateParams.cl ) {
			$('body').animate({
	        scrollTop: $('[data-cl="' + $stateParams.cl + '"]').offset().top + marginTop
	    }, slideTime );
		}

	}]);

});