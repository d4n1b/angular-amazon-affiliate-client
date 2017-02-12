define( function( require ) {

    require( 'angular' );
    require( 'angular-cookie-law' );

    // http://stackoverflow.com/questions/31316832/any-angular-directive-for-handling-cookie-law-compliance

    // Nuestra página web hace uso de cookies para asegurarnos de que disfrutas de la mejor
    // experiencia posible en nuestra página web. Al continuar navegando por nuestra página
    // web, das tu consentimiento a nuestro uso de cookies.
    // aceptar
    // y mas informacion

    return angular.module( 'app.cookie-law', [
        'angular-cookie-law',

    ]).run(['$rootScope', '$filter', function( $rootScope, $filter ) {

        var cookieHtml = '',
            cookieAcceptText = 'Entendido';

        cookieHtml = 'Las cookies nuestras y de terceros nos permiten ofrecer nuestros servicios. '
            + 'Al utilizar nuestros servicios, aceptas el uso que hacemos de las cookies. '
            + '<a ui-sref="root.content({ contentId: \'policies\' })" class="btn btn-empty">M&aacute;s informaci&oacute;n</a>';

        // Old
        // ----------
        // cookieHtml = 'Nuestra página web hace uso de cookies para asegurarnos '
        //     + 'de que disfrutas de la mejor experiencia posible en nuestra página web. '
        //     + 'Al continuar navegando por nuestra página web, das tu consentimiento a nuestro uso de '
        //     + 'cookies. <a ui-sref="root.content({ contentId: \'policies\' })" class="btn btn-default">M&aacute;s informaci&oacute;n</a>';

        $rootScope.cookieMessage = cookieHtml;
        $rootScope.cookieAcceptText = cookieAcceptText;

    }]);

});