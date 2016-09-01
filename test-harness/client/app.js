const http = require( 'http' );
const deepstream = require( 'deepstream.io-client-js' );

const opts = require( '../../shared/options' );
const Control = require( './control' );

global.clientDS = deepstream( opts.CONTROL_DEEPSTREAM_URL ).login({ username: opts.NAME });
global.clientDS.on( 'error', function( msg, type ){
	console.log( 'CLIENT DS ERROR:', type, msg );
});

// health server

const control = new Control( opts.NAME );
