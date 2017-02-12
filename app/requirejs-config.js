require.config({
	waitSecond: 10,
	baseUrl: '.',
	paths: {

		// Build paths
		// 'app': './',
		// 'requirejs': '../bower_components/requirejs/require',

		// Bower libraries
		'angular': 'bower_components/angular/angular.min',
		'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
		'angular-cookie-law': 'bower_components/angular-cookie-law/dist/angular-cookie-law.min',
		'angular-cookies': 'bower_components/angular-cookies/angular-cookies.min',
		'angular-router': 'bower_components/ui-router/release/angular-ui-router.min',
		'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize.min',
		'angular-translate': 'bower_components/angular-translate/angular-translate.min',
		'angular-translate-interpolation-messageformat': 'bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.min',
		'angular-translate-loader-static-files': 'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min',
		'angular-translate-loader-url': 'bower_components/angular-translate-loader-url/angular-translate-loader-url.min',
		'angular-translate-storage-cookie': 'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min',
		'angular-translate-storage-local': 'bower_components/angular-translate-storage-local/angular-translate-storage-local.min',
		'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
		'croppic': 'bower_components/croppic/croppic.min',
		'jquery': 'bower_components/jquery/dist/jquery.min',
		'jquery-ui': 'bower_components/jquery-ui/jquery-ui.min',
		'jquery-menu-aim': 'bower_components/jQuery-menu-aim/jquery.menu-aim',
		'jquery-prettyphoto': 'bower_components/pretty-photo/js/jquery.prettyPhoto.min',
		'jquery-scrollup': 'bower_components/scrollup/dist/jquery.scrollUp.min',
		'lodash': 'bower_components/lodash/lodash.min',
		'magnific-popup': 'bower_components/magnific-popup/dist/jquery.magnific-popup.min',
		'ngDialog': 'bower_components/ngDialog/js/ngDialog.min',
		'slick-carousel': 'bower_components/slick-carousel/slick/slick.min',

		// App libraries
		'ckeditor': 'app/lib/ckeditor/ckeditor',

		// Custom
		'lodash-mixins': 'app/lodash-mixins',
		'jquery-fn': 'app/jquery-fn',

		'js': 'assets/js',
		'modules': 'app/modules',

		'app/admin': 'app/modules/admin',

	},
	shim: {
		'angular': {
			deps: ['jquery'],
		},
		'angular-ellipsis': {
			deps: ['angular'],
		},
		'angular-bootstrap': {
			deps: ['angular'],
		},
		'angular-cookie-law': {
			deps: ['angular'],
		},
		'angular-cookies': {
			deps: ['angular'],
		},
		'ngDialog': {
			deps: ['angular'],
		},
		'angular-router': {
			deps: ['angular'],
		},
		'angular-sanitize': {
			deps: ['angular'],
		},
		'angular-translate': {
			deps: ['angular'],
		},
		'angular-translate-interpolation-messageformat': {
			deps: ['angular', 'angular-translate'],
		},
		'angular-translate-loader-static-files': {
			deps: ['angular', 'angular-translate'],
		},
		'angular-translate-loader-url': {
			deps: ['angular', 'angular-translate'],
		},
		'angular-translate-storage-cookie': {
			deps: ['angular', 'angular-translate'],
		},
		'angular-translate-storage-local': {
			deps: ['angular', 'angular-translate'],
		},
		'ckeditor': {
			deps: ['jquery'],
		},
		'croppic': {
			deps: ['jquery'],
		},
		'bootstrap': {
			deps: ['jquery'],
		},
		'jquery-fn': {
			deps: ['jquery'],
		},
		'jquery-menu-aim': {
			deps: ['jquery'],
		},
		'jquery-ui': {
			deps: ['jquery'],
		},
		'jquery-prettyphoto': {
			deps: ['jquery'],
		},
		'jquery-scrollup': {
			deps: ['jquery'],
		},
		'slick-carousel': {
			deps: ['jquery'],
		},
	}
});
