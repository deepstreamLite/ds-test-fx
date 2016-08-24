const db = require( '../../shared/db' );
const http = require('http');
const PORT = 8000;
const server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	db.getStats(function( data ){
		res.end( JSON.stringify( data ) );
	});
});


server.listen( PORT, function(){
	console.log( 'Listening on ', PORT );
});