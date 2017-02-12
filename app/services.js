define( function( require ) {

    require( 'jquery' );
    require( 'angular' );
    require( 'lodash' );
    require( 'angular-cookies' );
    require( 'ngDialog' );

    var uri = require( 'app/uri' ),
        viewPath = uri.get('site.ui');

    return angular.module( 'app.services', [
        'ngCookies',
        'ngDialog',

    ]).service('LanguageService', [function() {

        var localeIconSelected = '#locale-icon-selected',
            localeIcons = '.locale-icon',
            localeIconById = '#locale-icon-';

        function _changeSelectedIcon( localeSelectedIcon, localeIconClass ) {
            var $localeSelectedIcon = $( localeSelectedIcon );
            $localeSelectedIcon.attr( 'class', localeIconClass );
        }

        return {
            changeIconByEvent: function( event ) {
                var event = event || false;

                if( event ) {
                    var localeIconClass = $(event.target).find( localeIcons ).attr('class');
                    _changeSelectedIcon( localeIconSelected, localeIconClass );
                }
            },
            changeIconByKey: function( locale ) {
                var locale = locale || false,
                    localeIconIdSelected =  localeIconById + locale;

                if( locale ) {
                    var localeIconClass = $( localeIconIdSelected ).attr('class');
                    _changeSelectedIcon( localeIconSelected, localeIconClass );
                }
            }
        }


    }]).service('NewsletterService', ['ngDialog', '$http', '$q', '$cookies', 'APP_CONFIG'
    , function( ngDialog, $http, $q, $cookies, app ) {

        var url = uri.get('site.newsletter'),
            cookieActionTookName = 'np_modal',
            cookieActionTookValue = 1, 
            modalActiontaken = $cookies.get(cookieActionTookName),
            modal;

        // $cookies.remove(cookieActionTookName);

        function setActionTakenCookieValue() {
            $cookies.put(cookieActionTookName, cookieActionTookValue);
            return true;
        }
        
        function showModal( id ) {
            var options = {
                'className': 'ngdialog-theme-default ngdialog-theme-custom'
            };

            // If actions took, skip popup
            if( id == 'first' ) {
                if( modalActiontaken ) return;

                options['templateUrl'] = viewPath + 'view=modal.landing.first',
                options['controller'] = ['$scope', function( $scope ) {
                    // @TODO
                    // Should be a way to inherit from parent scope
                    // with scope: $scope, but it doesn't work
                    // $scope.secondBanner = app.modal.landing.second;

                    $scope.user = {};
                    $scope.firstBanner = app.modal.landing.first;

                    $scope.joinNewsletter = function( email ) {
                        addEmail( email );
                    };

                    $scope.closeModal = function() {
                        setActionTakenCookieValue();
                        $scope.closeThisDialog();
                    };

                }];

                setTimeout( function() {
                    modal = ngDialog.open( options );
                }, app.modal.landing.delay );

                return true;

            } else if( id == 'second' ) {

                // Show second landing modal
                if( modal && modal.id ) {
                    ngDialog.close( modal.id );
                }

                options['templateUrl'] = viewPath + 'view=modal.landing.second',
                options['controller'] = ['$scope', function( $scope ) {
                    $scope.secondBanner = app.modal.landing.second;
                }];

                ngDialog.open( options );

                return true;
            }

            return false;
        }

        function addEmail( email ) {
            if( !email ) return $q.reject();

            var data = { 'email': email, 'action': 'add' };

            return $http({
                url: url,
                method: 'POST',
                data: $.param( data ),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then( function( response ) {
                if( response.data.status == 'success' ) {
                    setActionTakenCookieValue();
                    showModal( 'second' );
                }

                return response.data;
            });
        }

        return {
            modal: showModal,
            add: addEmail
        }

    }]);

});