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

exports.getStats = function( callback ) {
	var clientQueryString = `
		SELECT
			SUM(metrics.last_interval_count) AS prices_received,
			COUNT(*) AS clients_count
		FROM reports.metrics
		WHERE
			node_type="client"
			AND last_updated > date_sub(now(), interval 4 minute);`

	var providerQueryString = `
		SELECT
			SUM(metrics.last_interval_count) AS prices_sent,
			COUNT(*) AS provider_count
		FROM reports.metrics
		WHERE
			node_type="provider"
			AND last_updated > date_sub(now(), interval 4 minute);`

	query( clientQueryString, function( clientRows ){
		query( providerQueryString, function( providerRows ){
			callback({
				prices_received: clientRows[ 0 ].prices_received,
				clients_count: clientRows[ 0 ].clients_count,
				prices_sent: providerRows[ 0 ].prices_sent,
				provider_count: providerRows[ 0 ].provider_count,
			});
		});
	});
};

function query( queryString, callback ) {
	connection.query( queryString, function( err, rows, fields  ) {
		if( err ) {
			console.log( 'SQL ERROR:', err );
		} else if ( callback ) {
			callback( rows );
		}
	});
}