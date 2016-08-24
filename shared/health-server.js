
const http = require('http');
const PORT = 80;

exports.start = function() {
	const server = http.createServer((req, res) => {
		res.setHeader('Content-Type', 'text/text');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.end( 'OK' );
	});

	server.listen( PORT, function(){
		console.log( 'Listening on ', PORT );
	});
}
