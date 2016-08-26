var provider = require( './node-provider' );
var client = require( './node-client' );
var opts = require( './shared/options' );
var http = require( 'http' );
var deepstream = require( 'deepstream.io-client-js' );

var ds = deepstream( opts.CONTROL_DEEPSTREAM_URL ).login();

var server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/text');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.end( 'OK' );
});

server.listen( opts.HTTP_PORT, function(){
	console.log( 'Listening on ', opts.HTTP_PORT );
});

if( opts.RUN_MODE === 'provider' ) {
	provider.start( ds );
} else if( opts.RUN_MODE === 'client' ) {
	client.start( ds );

} else {
	throw new Error( 'Unknown runMode ' + opts.RUN_MODE );
}
