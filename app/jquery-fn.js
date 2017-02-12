define( function( require ) {

	require( 'jquery' );

	// jQuery Extends
	// --------------------------------------------
	$.fn.serializeArrayAll = function() {
		var $form = $(this),
			data;

		// Update CKEDITOR before send
		if( typeof CKEDITOR !== 'undefined'){
			for ( instance in CKEDITOR.instances ){
				CKEDITOR.instances[instance].updateElement();
			}
		}

		data = $form.serializeArray();

		return data;
	}

});