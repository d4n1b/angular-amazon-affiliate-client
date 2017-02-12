/* --------------------------------------------

	URL

-------------------------------------------- */

define( function( require ) {

	require('lodash');


	// Find the base path 
	// no matter the enviroment
	var root = (function() {
		var path = window.location.pathname,
			cutInit = ( path.match(/\/admin\/|\/[a-zA-Z]{2,3}\//) || [] ).join(''),
			protocol = window.location.protocol,
			host = window.location.host,
			hostEndSlice = ( host.match( 'merchanpricing.com|bisuteriaonline.net' ) !== null ? 1 : 4 ), // work in development and prod
			url;

		url = protocol + '//' + host + '/' + ( window.location.pathname.split('/').slice( 1, hostEndSlice ) || [] ).join('/');

		if( url.slice( url.length-1 ) == '/' ) {
			return url.slice( 0, -1 );
		}

		return url;
	})();

	var public = root + '/public';

	var url = {
			root: root,
			public: public,
			lib: public + '/lib',
			site: {
				assets: root + '/assets',
				js: root + '/assets/js',
				ui: root + '/ui?',
				config: root + '/config?',
				products: root + '/product?',
				blog: root + '/blog?',
				ads: root + '/ads?',
				images: root + '/images?',
				auth: root + '/auth?',
				newsletter: root + '/newsletter?',
			},
		};


	return {
		get: function( path ) {
			
			if( path == 'all' ) {
				return url;
			}

			return _.get( url, path, {} )
		}
	}

});
