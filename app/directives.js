define( function( require ) {

    require( 'jquery' );
    require( 'slick-carousel' );
    require( 'magnific-popup' );
    require( 'angular' );
    require( 'lodash' );
    require( 'angular-router' );
    require( 'app/services' );

    var uri = require( 'app/uri' ),
        utils = require( 'app/utils' ),
        tmplPath = uri.get('site.ui'),
        bestsellerDropdown = require( 'app/dropdown' );


    return angular.module( 'app.directives', [
        'ui.router',
        'app.services',
        'shop.services',

    /* ------------------------------
        Directive: header
    ------------------------------  */
    ]).directive( 'header', ['LanguageService', function( Language ) {

        return {
            restrict: 'E',
            replace: false,
            templateUrl: tmplPath + 'view=header',
            scope: '@',
            link: function( scope, element, attrs ) {

                // Bind enter in search input
                //
                element.on( 'keydown', 'input#search-input', function( event ) {
                    if( event.keyCode == 13 ) {
                        event.preventDefault();
                        scope.search.go( scope.search.category, scope.search.query );
                    }
                });


                // Bind mouseenter/mouseleave to see
                // sliders
                // TODO: if siblings li, just open the other without
                // delay like in ebay.es
                var delayTimeDown = 300,
                    delayTimeUp = 10,
                    slideTimeDown = 300,
                    slideTimeUp = 100,
                    dropDown = '.dropdown-menu';
                    dropDownTrigger = 'div#header-nav > ul',

                // header-nav
                element.on( 'mouseenter', dropDownTrigger + ' [data-hover="dropdown"]', function( event ) {
                    $( dropDown, $(this).parent() ).stop(true).delay( delayTimeDown ).slideDown( slideTimeDown );

                }).on( 'mouseleave', dropDownTrigger + ' > li', function( event ) {
                    $(this).children( dropDown ).stop(true).delay( delayTimeUp ).slideUp( slideTimeUp );
                });

                // Language navbar
                // Change icon when select another language
                element.on( 'click', '.language-nav a.language', Language.changeIconByEvent );

            },
            controller: ['$scope', '$rootScope', '$state', '$stateParams', '$translate', 'LanguageService', 'NewsletterService', 'ShopProductsService'
            , function( $scope, $rootScope, $state, $stateParams, $translate, Language, Newsletter, Shop ) {

                $scope.email = '';

                $scope.joinNewsletter = function( email ) {
                    Newsletter.add( email ).then( function( response ) {
                        $scope.email = '';
                    });
                };

                // ----------------------------
                // Languages
                // ----------------------------
                $scope.languages = [
                    { key: 'en', translate: 'english', icon: 'flag-icon flag-icon-gb' },
                    { key: 'es', translate: 'spanish', icon: 'flag-icon flag-icon-es' }
                ];

                $scope.changeLanguage = function( langKey ) {
                    $translate.use( langKey );
                    $state.go( 'root.home', { locale: langKey });
                };

                // Change Selected Iconlanguage when URl start
                $rootScope.$watch( '$state.params.locale', function( newLocale, oldLocale ) {
                    if( newLocale !== oldLocale ) {
                        Language.changeIconByKey( newLocale );
                    }
                });

                // ----------------------------
                // Search section
                // ----------------------------
                $scope.search = {};
                $scope.search.category = 'all';
                $scope.search.query = '';

                $scope.searchCategories = $rootScope.menus.shop.slice();

                $scope.search.go = function( category, query ) {
                    if( query !== '' ) {
                        $state.go( 'root.shop.query', { categoryId: category, query: query });
                    }
                };

                // Get the bestseller data
                $scope.bestseller = {};     
                Shop.get({ 'category': 'all'
                    , 'bestseller': true
                    , 'keys': 'bestseller:1,title,images,detailpageurl'
                }).then( function( data ) {
                    $scope.bestseller = data;
                    bestsellerDropdown();
                });
            }]
        }

    
    /* ------------------------------
        Directive: footer

        Curioso, al desactivar la directiva para el footer
        se daña el la inyeccion de `$rootScope` en el controlador
    ------------------------------  */
    }]).directive( 'footer', function() {

        return {
            restrict: 'E',
            replace: false,
            templateUrl: tmplPath + 'view=footer',
            scope: '@',
        }


    /* ------------------------------
        Directive: ads
    ------------------------------  */
    }).directive( 'ads', function() {
        return {
            replace: false,
            restrict: 'A',
            scope: {
                items: '=adsItems',
            },
            templateUrl: tmplPath + 'view=ads',
        }
    
    /* ------------------------------
        Directive: slider-promo
    ------------------------------  */
    }).directive( 'sliderPromo', ['$timeout', function( $timeout ) {

        var slickOptions = {
                dots: true,
                slidesToShow: 5,
                slidesToScroll: 5,
                autoplay: false,
                autoplaySpeed: 3000,
                responsive: [{
                   breakpoint: utils.screen.getSize('lg'),
                   settings: {
                       slidesToShow: 3,
                       slidesToScroll: 3,
                   }
                }, {
                   breakpoint: utils.screen.getSize('xs'),
                   settings: {
                       slidesToShow: 2,
                       slidesToScroll: 2,
                   }
                }]
            };

        return {
            replace: false,
            restrict: 'E',
            scope: {
                categories: '=items',
            },
            templateUrl: tmplPath + 'view=slider.promo',
            link: function( scope, element, attrs ) {
                scope.$watch( 'categories', function( value ) {
                    if( !_.isEmpty( value ) ) {
                        $timeout( function() {
                            element.find('.slider').slick( slickOptions );
                        });
                    }
                });
            }
        }
    /* ------------------------------
        Directive: slider-main
    ------------------------------  */
    }]).directive( 'sliderMain', ['$timeout', function( $timeout ) {

        var slickOptions = {
                dots: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
            };

        return {
            replace: false,
            restrict: 'E',
            scope: {
                items: '=items',
            },
            templateUrl: tmplPath + 'view=slider.main',
            link: function( scope, element, attrs ) {
                scope.$watch( 'items', function( value ) {
                    if( !_.isEmpty( value ) ) {
                        $timeout( function() {
                            element.find('.slider').slick( slickOptions );
                        });
                    }
                });
            }
        }

    // Handle the dropdown toogle
    // 
    }]).directive( 'toggleDropdownMenu', [function() {
        return {
            link: function( scope, element, attr ) {
                element.on( 'click', function( event ) {
                    event.stopImmediatePropagation();
                    setTimeout( function() {
                        $(event.target).parents('.dropdown-menu').css({ 'display': 'none' });
                    }, 100 );
                });
            }
        }

    }]);

});
