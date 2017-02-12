define( function( require ) {

    require( 'angular' );
    require( 'lodash' );


    return angular.module( 'app.filters', [])

        // Link filter:
        // change the string to a valid link one
        .filter( 'link', function() {

            return function( string, delimiter ) {
                var delimiter = delimiter || '-';

                return string
                    .toLowerCase()
                    .replace( /[^a-zA-Z0-9\s]/g, '' )
                    .trim()
                    .replace( /[\/_|+ -]+/g, delimiter );
            }


        }).filter( 'currencyLocale', function() {

            return function( amount, currencySymbol ) {
                var currencySymbol = currencySymbol || '€';

                return currencySymbol + ' ' + amount;
            }


        }).filter( 'ellipsis', ['$sce', function( $sce ){

            return function( text, maxLength, breakOnWord, customEllipsis ) {
                var text = text || '',
                    breakOnWord = breakOnWord || true,
                    customEllipsis = customEllipsis || '...';

                if( text.length <= maxLength ) return $sce.trustAsHtml( text );

                text = text.slice( 0, maxLength );

                if( breakOnWord ) {
                    var lastspace = text.lastIndexOf(' ');
                    if( lastspace !== -1 ) {
                        text = text.substr( 0, lastspace );
                    }
                } else {
                    text = text.slice( 0, maxLength );
                }

                text += customEllipsis;

                return $sce.trustAsHtml( text );
            };

        
        }]).filter( 'htmlToPlainText', function() {
            return function( text ) {
                return new String( text )
                    .replace( /<[^>]+>/gm, '')
                    .replace( '&euro;', '\u20ac' )
                    .replace( '&nbsp;', ' ' );
            }


        }).filter( 'htmlTrusted', ['$sce', function( $sce ) {
            return function( html ) {
                return $sce.trustAsHtml( html );
            }
        }]);

});
