<?php

/**
 *
 * This has to be as the same pattern in Gruntfile htmlSnapshot task
 * htmlSnapshot.options['sanitize']
 *
 * Example:
 * http://localhost/root/piopio/ng-afiliados/es/content/policies/?cl=cookie-policy
 * http://localhost/root/piopio/ng-afiliados/?_escaped_fragment_=/es/content/policies/?cl=cookie-policy
 * 
 * 
 */
if( !empty( $_GET['_escaped_fragment_'] ) ) {

	require_once __DIR__ . '/bootstrap.php';
	$options = require_once ABS_DATA . '/config.php';

	$escaped_fragment  = $_GET['_escaped_fragment_'];
	$escaped_fragment  = preg_replace( '/^\//', '', 		$escaped_fragment ); // remove first slash `/`
	$escaped_fragment  = preg_replace( '/\?/', '', 		$escaped_fragment ); // remove `?`
	$escaped_fragment  = preg_replace( '/[\/=]/', '-', $escaped_fragment ); // replace `/` and `=` for `-`
	$escaped_fragment .= '.html';

	$fragment_path = $options['snapshots_path'] . '/' . $escaped_fragment;
		
	if( is_file( $fragment_path ) ) {
		include( $fragment_path );
		exit;
	}

}


header( 'HTTP/1.0 404 Not Found' );

?>