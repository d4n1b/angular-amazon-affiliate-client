define( function( require ) {

	require( 'jquery' );

	var $window = $(window),
		utils = {};

	// Screen
	// doc: http://getbootstrap.com/2.3.2/scaffolding.html
	utils.screen = ( function() {

		var sizes = {
				xl: '1400',
				lg: '1200',
				md: '768',
				sm: '767',
				xs: '480'
			};

		function getScreenSize() {
			var windowWidth = getScreenWidth();

			return windowWidth >= sizes.xl ? 'xl'
				: windowWidth >= sizes.lg && windowWidth < sizes.xl ? 'lg'
				: windowWidth >= sizes.md && windowWidth < sizes.lg ? 'md'
				: windowWidth >= sizes.sm && windowWidth < sizes.md ? 'sm'
				:'xs';
		}

		function getSize( size ) {
			return sizes[size] || false;
		}

		function getScreenWidth() {
			return $window.width();
		}

		function getScreenHeight() {
			return $window.height();
		}

		return {
			getWidth: getScreenWidth, 
			getHeight: getScreenHeight,
			getScreenSize: getScreenSize,
			getSize: getSize,
		}

	})();


	// Element
	utils.element = {
		collapse: function( $item ) {
			$item.removeClass('in').addClass('collapse');
		},
		uncollapse: function( $item ) {
			$item.removeClass('collapse').addClass('in');
		}
	};


	// Random string
	utils.randomString = function( length ) {
		var invalidNumber = !parseInt( length ),
			start = 2,
			end = ( invalidNumber || length + start >= 16 ? 16 : length + start );

		return Math.random().toString(36).substring(start, end);
	};


	return {
		screen: utils.screen,
		element: utils.element,
		randomString: utils.randomString,
	}


});