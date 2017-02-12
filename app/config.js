define( function( require ) {

	require( 'jquery' );
	require( 'lodash' );

	var uri = require( 'app/uri' );

	return {
		get: function( callback ) {
			var isCallback = _.isFunction( callback ),
				url = uri.get('site.config'),
				data = { config: 'config', token: 'token' };
			
			$.get( url, data, function( response ) {
				if( isCallback ) {
					callback( response.content );
				}
			});
		}
	}


});