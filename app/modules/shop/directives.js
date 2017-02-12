define( function( require ) {

	require( 'jquery' );
	require( 'angular' );

	var uri = require( 'app/uri' ),
		utils = require( 'app/utils' );
	

	return angular.module('shop.directives', [] )
	
	/* ------------------------------
      Directive: SideBar
  	------------------------------  */
	.directive( 'shopSidebarMenu', function() {
      
      return {
          replace: true,
          restrict: 'A',
          scope: {
              sidebar: '=items',
          },
          templateUrl: uri.get('site.ui') + 'view=shop.sidebar.menu',

          link: function( scope, element, attrs ) {

              // Bind collapse/uncollapse menu
              element.on('click', 'h4.panel-title', function(e) {
                  e.stopImmediatePropagation();

                  var $this = $(e.target),
                      $accordion = $this.parents( $this.attr('data-parent') ),
                      $panel = $accordion.find( $this.attr('data-toggle') ),
                      isPanelCollapsed = $panel.hasClass('collapse');

                  if( isPanelCollapsed ) {
                      utils.element.uncollapse( $panel );
                  } else {
                      utils.element.collapse( $panel );
                  }
              });
          },
          controller: function( $scope, $rootScope, $state, $timeout ) {

              // Start uncollapsed sidebar item
              // ------------------------------
              $timeout( function() {
                  if( $state.params.categoryId ) {
                      $item = $('#' + $state.params.categoryId);
                      utils.element.uncollapse( $item );
                  }
              });
          }
          
      }
      
  });

});