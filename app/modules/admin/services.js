define( function( require ) {

    require( 'jquery' );
    require( 'lodash' );
    require( 'angular' );
    require( 'angular-cookies' );

    var uri = require( 'app/uri' );
    

    return angular.module('admin.services', [
        'ngCookies',

    /* ------------------------------
        Service: AdsServices
    ------------------------------  */
    ]).service( 'authService', ['$http', '$state', '$q', '$cookieStore'
    , function( $http, $state, $q, $cookieStore ) {

        var auth = {},
            authUrl = uri.get( 'site.auth' );

        auth.login = function( username, password ) {
            return $http({
                method: 'POST',
                url: authUrl,
                data: {
                    'username': username,
                    'password': password,
                    'action': 'login'
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

            }).then( function( response, status ) {
                if( _.get( response, 'data.status') ) {
                    if( response.data.status == 'success' ) {
                        auth.user = response.data.content;
                        $cookieStore.put( 'user', auth.user );
                        return response.data.content;
                    }

                    return response.data.content;
                }
            });
        }

        auth.logout = function() {
            return $http.post( authUrl ).then( function( response ) {
                auth.user = undefined;
                $cookieStore.remove( 'user' );
            });
        }

        return auth;

    }]);

});