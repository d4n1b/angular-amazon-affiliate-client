define( function( require ) {

	require( 'angular' );
	require( 'angular-router' );
	require( 'angular-sanitize' );
	require( 'angular-translate' );
	require( 'angular-translate-interpolation-messageformat' );
	require( 'angular-translate-loader-static-files' );
	require( 'angular-translate-loader-url' );
	require( 'angular-translate-storage-cookie' );
	require( 'angular-translate-storage-local' );
	require( 'angular-cookies' );
	require( 'app/directives' );
	require( 'app/filters' );
	require( 'app/cookie-law' );
	require( 'bootstrap' );
	require( 'ngDialog' );

	// General
	require( 'app/general' );

	// Modules
	require( 'modules/home/home' );
	require( 'modules/blog/blog' );
	require( 'modules/contact/contact' );
	require( 'modules/content/content' );
	require( 'modules/shop/shop' );


	var uri = require( 'app/uri' ),
		uiPath = uri.get('site.ui'),
		appConfig = require( 'app/config' );

	angular.module( 'app', [
		'ui.router',
		'pascalprecht.translate',
		'ngSanitize',
		'ngCookies',
		'ngDialog',

		'app.directives',
		'app.filters',
		'app.services',
		'app.cookie-law',
		'app.module.home',
		'app.module.blog',
		'app.module.contact',
		'app.module.content',
		'app.module.shop',

	// Angular ui-router
	// -----------------------------------
	// https://github.com/angular-ui/ui-router#get-started
	// http://angular-ui.github.io/ui-router/site/#/api/ui.router
	// https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views
	// https://github.com/angular-ui/ui-router/wiki/Quick-Reference#ui-view
	// https://github.com/angular-ui/ui-router
	// - Resolver stateProvider -
	// http://www.codelord.net/2015/06/02/angularjs-pitfalls-using-ui-routers-resolve/
	// http://learn.ionicframework.com/formulas/data-the-right-way/
	// Use $stateProvider to configure your states.
	// https://medium.com/opinionated-angularjs/advanced-routing-and-resolves-a2fcbf874a1c
	]).config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', 'APP_CONFIG'
	, function( $stateProvider, $urlRouterProvider, $locationProvider, APP_CONFIG ) {

		$locationProvider.html5Mode(true);

		// Force trailing slash
		$urlRouterProvider.rule(function ($injector, $location) {
			var path = $location.url();

			// check to see if the path already has a slash where it should be
			if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) return;
			if (path.indexOf('?') > -1) { return path.replace('?', '/?') }
			return path + '/';
		});

		var defaultLang = '/'+ APP_CONFIG.locale.default +'/',
			availableLang = APP_CONFIG.locale.available.join('|'),
			regexNotMatchLang = new RegExp( '^(?!\/('+ availableLang +'))' );

		$urlRouterProvider
			// The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
			// Here we are just setting up some convenience urls.
			.when( '/?', defaultLang )
			.when( regexNotMatchLang, defaultLang )
			// .when( /^(?!\/es)/, defaultLang )
			.otherwise( defaultLang ); // If the url is ever invalid, redirect to '/' aka the home state

		$stateProvider.state( 'root', {
			url: '/{locale:[a-zA-Z]{1,3}}/',
			abstract: true,
			params: {
				title: '',
			}
		});


	// Angular translations
	// -----------------------------------
	// Load by asynchronous system
	// http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
	// http://www.ng-newsletter.com/posts/angular-translate.html
	// http://stackoverflow.com/questions/9682092/databinding-in-angularjs/9693933#9693933
	}]).config([ '$translateProvider', 'APP_CONFIG', function( $translateProvider, APP_CONFIG ) {

		$translateProvider.useLocalStorage();
		$translateProvider.useLoaderCache(true);
		$translateProvider.useSanitizeValueStrategy('escaped');

		$translateProvider.useStaticFilesLoader({
			'prefix': uiPath + 'lang=',
			'suffix': '.json'
		});

		$translateProvider.preferredLanguage( APP_CONFIG.locale.default );


	// It's very handy to add references to $state and $stateParams to the $rootScope
	// so that you can access them from any scope within your applications.For example,
	// <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
	// to active whenever 'contacts.list' or one of its decendents is active.
	}]).run([ '$rootScope', '$timeout', '$state', '$stateParams', '$translate', 'NewsletterService', 'LanguageService', 'APP_CONFIG'
	, function( $rootScope, $timeout, $state, $stateParams, $translate, Newsletter, Language, APP_CONFIG ) {

		$rootScope.ads = APP_CONFIG.ads || {};
		$rootScope.blog = {}; // wait to filter by language
		$rootScope.brand = APP_CONFIG.brand || {};
		$rootScope.mainSlider = APP_CONFIG.mainSlider || [];
		$rootScope.menus = APP_CONFIG.menus || {};

		// Filter hidden categories
		// ---------------------------------------------
		// http://codereview.stackexchange.com/questions/57976/deep-pick-using-lodash-underscore
		// http://elijahmanor.com/reducing-filter-and-map-down-to-reduce/
		// console.log( $rootScope.menus.shop );
		// https://github.com/lodash/lodash/issues/591
		// $rootScope.menus.shop = _.map( APP_CONFIG.menus.shop, function( category ) {
		// 	return _.map( category.items, function( subcategory ) {
		// 		return _.filter( subcategory, function( item ) {
		// 			return item;
		// 			// return item.status == 'visible';
		// 		});
		// 	});
		// });
	
		$rootScope.socials = APP_CONFIG.socials || [];

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.uri = uri.get('all');

		// Translate the page by URL. i.e: `toParams: { locale: 'en' }`
		$rootScope.$on( '$stateChangeSuccess', function( event, toState, toParams, fromState, fromParams ) {

			// Set the titles
			if( fromParams.title !== toParams.title ) {
				var title = ( toParams.title || $rootScope.brand.title ),
					hasTitle = !!title;

				if( hasTitle )
					$rootScope.title = title + ' | ';
			}

			if( fromParams.locale !== toParams.locale ) {
				$translate.use( toParams.locale );

				// Filter blogs by language
				$rootScope.blog = _.pluck( _.filter( APP_CONFIG.blog, function( post ) {
					return post && post[toParams.locale];
				}), toParams.locale );
			}
		});

		// Newsletter.modal( 'first' );

	}]);

	// Bootstrap with config
	appConfig.get( function( config ) {
		angular.module('app').constant( 'APP_CONFIG', config );
		angular.bootstrap( document, ['app'] );
	});

});
