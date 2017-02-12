define( function( require ) {

    require( 'jquery' );
    require( 'angular' );
    require( 'lodash' );
    require( 'croppic' );
    require( 'ckeditor' );

    var uri = require( 'app/uri' ),
        utils = require( 'app/utils' );

    return angular.module( 'admin.directives', [

    /* ------------------------------
        Directive: croppic-img

    ------------------------------  */
    ]).directive( 'croppic', [function() {
        
        // Croppic Options
        var cropUrl = uploadUrl = uri.get('site.blog'),
            croppicImageWrapper = '<div id="croppicImageWrapper"></div>',
            defaultHeight = 800,
            defaultWidth = 350,
            cropControlReset = 'i.cropControlReset',
            cropModal = '#croppicModal',
            options = {
                modal: true,
                doubleZoomControls:false,
                rotateControls: false,
                uploadUrl: uploadUrl,
                uploadData: {
                    'action': 'image_upload',
                    'token': '',
                },
                cropUrl: cropUrl,
                cropData: {
                    'action': 'image_crop',
                    'token': '',
                },
            };

        function appendPreloadImage( element, url ) {
            var id = utils.randomString(),
                img = '<img id="'+ id +'" src="'+ url +'" title="'+ url +'">';
    
            if( typeof element.append == 'function' ) {
                element.append( img );
            }
        }

        return {
            restrict: 'A',
            replace: false,
            scope: {
                imgPreload: '=croppicPreload',
            },
            link: function( scope, element, attrs ) {
                var id = utils.randomString(6),
                    imgHeight = attrs.height || defaultHeight,
                    imgWidth = attrs.width || defaultWidth,
                    oldImageUrl = scope.imgPreload || false,
                    cropperHeader;

                element.attr( 'id', id ); // create the id
                element.css({ 'height': imgHeight, 'width': imgWidth, 'position': 'relative' }); // create the id

                if( oldImageUrl ) {
                    appendPreloadImage( element, scope.imgPreload );
                }

                // Update the image data to save in post
                options['onAfterImgCrop'] = function( response ) {
                    if( response && response.status == 'success' ) {
                        scope.$apply( function() {
                            scope.imgPreload = response.url;
                        });
                    }
                };

                // Restore post image if remove new one
                options['onAfterRemoveCroppedImg'] = function() {
                    scope.$apply( function() {
                        scope.imgPreload = oldImageUrl;
                    });
                };

                // Restore post image if remove new one
                options['onReset'] = function() {
                    appendPreloadImage( element, oldImageUrl );
                };

                cropperHeader = new Croppic( id, options ); // create the instance

            }
        }

    /* ------------------------------
        Directive: croppic-img

    ------------------------------  */
    }]).directive( 'ckeditor', [function() {

        function initCkeditor( element, id ) {
            element.attr( 'id', id );
            element.attr( 'data-instance-id', id );
            CKEDITOR.replace( id );
        }

        return {
            restrict: 'A',
            replace: false,
            scope: {
                data: '=ckeditorModel'
            },
            link: function( scope, element, attrs ) {
                var id = utils.randomString(6);

                initCkeditor( element, id );
            }
        }

    }]);


});
