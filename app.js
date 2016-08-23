var provider = require( './node-provider' );
var client = require( './node-client' );
var opts = require( './shared/options' );

if( opts.RUN_MODE === 'provider' ) {
	provider.start();
} else if( opts.RUN_MODE === 'client' ) {
	client.start();
} else {
	throw new Error( 'Unknown runMode ' + opts.RUN_MODE );
}