define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );

	var uri = require( 'app/uri' );
	

	return angular.module('blog.services', [] )
	
	/* ------------------------------
		Service: BlogPostServices
	------------------------------  */
	.service( 'BlogPostServices', function( $http, $state ) {

		var url = uri.get('site.blog');
		
		return {
			get: function( params ) {

				var params = _.extend( params || {}, { 'action': 'get' });

				// Workaround to add all attr in public side
				if( params['keys'] ) {
					params['keys'] += ',id,title,content,img,link,author,date';
				}

				return $http({
					method: 'POST',
					url: url,
					data: $.param( params ),
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

				}).then( function( response ) {
					return response.data;

				});

			}

		}

	});

});