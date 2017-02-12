/* --------------------------------------------

	URL

-------------------------------------------- */

define( function( require ) {

	var _ = require('lodash');

	// http://stackoverflow.com/questions/25333918/js-deep-map-function
	function deepMap(obj, iterator, context) {
		return _.transform(obj, function(result, val, key) {
			result[key] = _.isObject(val) /*&& !_.isDate(val)*/
				? deepMap(val, iterator, context)
				: iterator.call(context, val, key, obj);
		});
	}

	_.mixin({
		deepMap: deepMap,
	});

});