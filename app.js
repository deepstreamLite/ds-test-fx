const opts = require( './shared/options' );
const http = require( 'http' );
const deepstream = require( 'deepstream.io-client-js' );
const Control = require( './shared/control' );

global.clientDS = deepstream( opts.CONTROL_DEEPSTREAM_URL ).login({ username: opts.NAME });
global.clientDS.on( 'error', function( msg, type ){
	console.log( 'CLIENT DS ERROR:' , type , msg );
});

var server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/text');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.end( 'OK' );
});

server.listen( opts.HTTP_PORT, function(){
	console.log( 'Listening on ', opts.HTTP_PORT );
});

const control = new Control( opts.NAME );
