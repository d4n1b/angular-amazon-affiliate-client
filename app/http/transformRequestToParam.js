define( function( require ) {

  require( 'angular' );

  return angular.module( 'transformRequestToParam', [] ).config(['$httpProvider'
  , function( $httpProvider ) {

  	// Thanks to:
  	// http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
  	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  	$httpProvider.defaults.transformRequest = [function( data ) {
  		if( data === undefined ) return data;
  		return $.param(data);
  	}];

  }]);

});