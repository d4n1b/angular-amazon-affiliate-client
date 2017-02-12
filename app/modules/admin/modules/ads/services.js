define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );

	var uri = require( 'app/uri' );
	

	return angular.module('ads.services', [] )
	
	/* ------------------------------
		Service: AdsServices
	------------------------------  */
	.service( 'AdsService', ['$http', '$state', '$q'
	, function( $http, $state, $q ) {

		var url = uri.get('site.ads'),
			promiseRejected = $q.reject({});

		/**
		 * [_call for update products: hide, add, remove ]
		 * @param  {[type]} params 
		 * i.e. { action: 'hide', locationId: 'content', adsIds: [1df35, 43rd2, agfo0] }
		 * @return {[type]}        promise
		 */
		function _call( params ) {
			if( !_.isObject( params ) || !params['action'] ) return promiseRejected;

			return $http({
				url: url,
				method: 'POST',
				data: params,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).then( function( response ) {
				return response.data;
			});
		}


		function get( params ) {
			return _call( params );
		}


		function filter( ads, filter ) {
			return _.get( ads, filter, false );
		}


		function add( params, resultContainer ) {
			if( !params['ads'] || !params['location_id'] ) return promiseRejected;
			// workdaround to avoid 403 for iframe content
			params['ads'] = { 'content': encodeURI( params['ads'] ) };
			params['action'] = 'add';

			return _call( params ).then( function( response ) {
				if( resultContainer && response.content ) {
					$(resultContainer).html( response.content );
				}

				return response;
			});
		}


		function hide( params ) {
			if( !params['ads_ids'] || !params['location_id'] ) return promiseRejected;
			
			params['action'] = 'hide';

			return _call( params );
		}


		function remove( params ) {
			if( !params['ads_ids'] || !params['location_id'] ) return promiseRejected;
			
			params['action'] = 'remove';

			return _call( params );
		}

		return {
			get: get,
			filter: filter,
			hide: hide,
			add: add,
			remove: remove,
		}


	}]);

});