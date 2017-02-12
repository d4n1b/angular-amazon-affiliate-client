define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );

	var uri = require( 'app/uri' );
	

	return angular.module('blog.services', [] )
	
	/* ------------------------------
		Service: BlogService
	------------------------------  */
	.service( 'BlogService', ['$http', '$state', '$q'
	, function( $http, $state, $q ) {

		var url = uri.get('site.blog'),
			promiseRejected = $q.reject({}),
			removePostConfirmMsg = 'Deseas eliminar el post con id `%s`?';


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

		/**
		 * [get description]
		 * @param  {[type]} params [description]
		 * @return {[type]}        [description]
		 */
		function get( params ) {
			params['action'] = 'get';
			return _call( params );
		}

		/**
		 * [setPost description]
		 * @param {[type]} params          [description]
		 * @param {[type]} resultContainer [description]
		 */
		function setPost( params, resultContainer ) {
			if( _.isEmpty( params ) ) return promiseRejected;

			var $resultContainer = resultContainer instanceof jQuery ? resultContainer : $(resultContainer);

			_.extend( params, { 'action': 'set' });

			return _call( params );
		}

		/**
		 * [hidePost description]
		 * @param  {[type]} postId [description]
		 * @return {[type]}        [description]
		 */
		function hidePost( postId ) {
			var params;

			if( !postId ) return promiseRejected;

			params = { 'action': 'hide', 'post_id': postId };

			return _call( params );
		}

		/**
		 * [removePost description]
		 * @param  {[type]} postId [description]
		 * @return {[type]}        [description]
		 */
		function removePost( postId ) {
			var params;

			if( !postId ) return promiseRejected;

			params = { 'action': 'remove', 'post_id': postId };
			
			if( confirm( removePostConfirmMsg.replace( '%s', postId ) ) ) {
				return _call( params );
			}

			return promiseRejected;
		}


		return {
			get: get,
			hidePost: hidePost,
			setPost: setPost,
			removePost: removePost,
		}


	}]);

});