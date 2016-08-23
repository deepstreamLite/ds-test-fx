var opts = require( './options' );
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : opts.DB_HOST,
	user     : opts.DB_USER,
	password : opts.DB_PASS,
	database : opts.DB_NAME
});
 
exports.createEntry = function() {
	query(
		`INSERT INTO metrics 
		(node_name, test_case_name, last_interval_duration, last_interval_count, total_count, node_type) 
		VALUES 
		("${opts.NAME}", "${opts.TEST_CASE}", 0, 0, 0, "${opts.RUN_MODE}")`
	);
}

exports.storeMetrics = function( duration, count, total ) {
	query(
		`UPDATE metrics
		SET 
			last_interval_duration=${duration}, 
			last_interval_count=${count}, 
			total_count=${total} 
		WHERE node_name = "${opts.NAME}"`
	);
}

function query( queryString ) {
	connection.query( queryString, function( err ) {
		if( err ) {
			console.log( 'SQL ERROR:', err );
		}
	});
}