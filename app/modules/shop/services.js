define( function( require ) {

	require( 'jquery' );
	require( 'angular' );
	require( 'lodash' );

	var uri = require( 'app/uri' );
	

	return angular.module('shop.services', [] )
	
	/* ------------------------------
		Service: ShopProductsService
	------------------------------  */
	.service( 'ShopProductsService', ['$http', '$state', '$q', '$rootScope', '$filter',
	function( $http, $state, $q, $rootScope, $filter ) {

		var self = this,
			url = uri.get('site.products'),
			_reverse,
			_predicate,
			productsAlteredCache, // Get the product list filtered or ordered
			isFilterActive,
			isOrderActive,
			hash = {
				'products': 'items',
			};

		// Just filtering by min max
		function _filter( products, options ) {

			if( !products ) return;

			var minValue = options && options.min || Number.MIN_VALUE,
				maxValue = options && options.max || Number.MAX_VALUE;

			return _.filter( products, function( product ) {
				return product.amount >= minValue
					&& product.amount <= maxValue;
			});

			return products;
		}

		//
		function _order( products, predicate, noReverse ) {
			var productsOrdered;

			// cached
			_reverse = ( !noReverse && _predicate === predicate ? !_reverse : false );
			_predicate = predicate;

			// Filter by Integer
			if( predicate == 'amount' ) {
				productsOrdered = _.sortBy( products, function( product ) {
					return parseInt( product[predicate] );
				});

			// Fiter by text
			} else {
				productsOrdered = _.sortBy( products, function( product ) {
					return product[predicate] && product[predicate].toLowerCase();
				});
			}

			return _reverse ? productsOrdered.reverse() : productsOrdered;
		}


		function _broadcast( products ) {
			return function() {
				if( products ) {
					$rootScope.$broadcast( 'Shop:productsHaveChanged', products );
					return true;
				}
			}
		}


		function get( params ) {
			if( !_.isObject( params ) ) return;

			_.extend( params, { 'action': 'get' });

			return $http({
				url: url,
				method: 'GET',
				params: params,
			}).then( function( response ) {
				productsAlteredCache = null;
				return response.data.content || response.data;
			});
		}


		function getPartial( products, begin, end, options ) {
			var isValidproducts = _.isObject( products ) || false,
				isValidBegin = parseInt( begin ) >= 0,
				isValidEnd = parseInt( end ) > begin,
				options = options && options['action'] && options['params'] ? options : false,
				action = options && options['action'],
				partialProducts,
				result;

			
			if( isValidproducts && isValidBegin && isValidEnd ) {

				if( options ) {
					switch( options['action'] ) {
						case 'filter':

							if( !options['params']['min'] && !options['params']['max'] ) {
								isFilterActive = false;
								productsAlteredCache = null;
							} else {
								isFilterActive = true;
								productsAlteredCache = products = _filter( products, options['params'] );
							}
							break;

						case 'order':
							if( productsAlteredCache ) {
								productsAlteredCache = products = _order( productsAlteredCache, options['params'] );
							} else {
								productsAlteredCache = products = _order( products, options['params'] );
							}
							isOrderActive = true;
							break;
					}

				} else {

					if( productsAlteredCache ) {
						products = productsAlteredCache;
					}

				}

				try {
					partialProducts = products.slice( begin, end );
				} catch(e) {}

				result = {
					action: action,
					products: {
						length: products.length,
						partial: partialProducts,
					}
				};

				// Broadcast the Shop:productsHaveChanged event!
				// for update in products list
				return {
					products: result,
					broadcast: _broadcast( result )
				}

			}

		}

		/**
		 * [_request for update products: hide, add, remove ]
		 * @param  {[type]} params 
		 * i.e. { action: 'hide', categoryId: 'rings', subcategoryId: 'engagement rings' }
		 * @return {[type]}        promise
		 */
		function _request( params ) {

			if( !_.isObject( params ) || !params['action'] ) return;

			return $http({
				url: url,
				method: 'GET',
				params: params,
			}).then( function( response ) {
				return response.data;
			});
		}


		/**
		 * [_update for update products: hide, add, remove ]
		 * @param  {[type]} params 
		 * i.e. { action: 'hide', categoryId: 'rings', subcategoryId: 'engagement rings' }
		 * @return {[type]}        promise
		 */
		function _update( params ) {
			if( !_.isObject( params ) || !params['action'] ) return;

			return $http({
				url: url,
				method: 'POST',
				data: params,
			}).then( function( response ) {
				return response.data;
			});
		}


		/**
		 * [add description]
		 * @param {[type]} params          [description]
		 * @param {[type]} resultContainer [description]
		 */
		function add( params, resultContainer ) {
			var params = params || {};

			params['action'] = 'add';

			return _request( params ).then( function( response ) {
				if( resultContainer && response.content ) {
					$(resultContainer).html( response.content );
				}

				return response;
			});
		}

		/**
		 * [hide description]
		 * @param  {[type]} params [description]
		 * @return {[type]}        [description]
		 */
		function hide( params ) {
			var params = params || {};
			
			params['action'] = 'hide';

			return _request( params );
		}

		/**
		 * [editProducts description]
		 * @param  {[type]} params [description]
		 * @return {[type]}        [description]
		 */
		function editProducts( params ) {
			var params = params || {};
				
			if( _.isEmpty( params.products ) || _.isEmpty( params.category ) || _.isEmpty( params.subcategory ) )
				return $q.reject({});

			params = { action: 'editProducts',
				products: params.products,
				category: params.category,
				subcategory: params.subcategory
			};

			return _update( params );
		}


		/**
		 * [bestseller description]
		 * @param  {[type]} params [description]
		 * @return {[type]}        [description]
		 */
		function bestseller( params ) {
			var params = params || {};
			
			params['action'] = 'bestseller';

			return _request( params );
		}


		/**
		 * [remove description]
		 * @param  {[type]} params          [description]
		 * @param  {[type]} resultContainer [description]
		 * @return {[type]}                 [description]
		 */
		function remove( params, resultContainer ) {
			var params = params || {};
			
			params['action'] = 'remove';

			return _request( params );
		}


		return {
			add: add,
			hide: hide,
			editProducts: editProducts,
			bestseller: bestseller,
			remove: remove,
			get: get,
			getPartial: getPartial,
		}

	}]);

});