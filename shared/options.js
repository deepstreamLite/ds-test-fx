'use strict';

const utils = require( './utils' );
const argv = require('minimist')(process.argv.slice(2));
console.log( '=======================' );
console.log( process.env );
console.log( '=======================' );
function _getOption( key, defaultValue, processFn ) {
	var value;
	if( typeof process.env[ key ] !== 'undefined' ) {
		value = process.env[ key ];
	} else if( typeof argv[ key ] !== 'undefined' ) {
		value  = argv[ key ];
	} else {
		value = defaultValue;
	}

	return processFn ? processFn( value ) : value;
}

function _toInt( val ) {
	return typeof val === 'string' ? parseInt( val, 10 ) : val;
}

exports.CURRENCY_PAIRS = utils.getCurrencyPairs();
exports.RUN_MODE = _getOption( 'runMode', 'provider')
exports.DEEPSTREAM_URL = _getOption( 'dsUrl', 'localhost:6021' );
exports.CONTROL_DEEPSTREAM_URL = _getOption( 'controlDsUrl', 'ec2-54-154-140-90.eu-west-1.compute.amazonaws.com:6021' );
exports.CCY_START = _getOption( 'ccyStart' , 0, _toInt );
exports.CCY_END = _getOption( 'ccyEnd' , exports.CURRENCY_PAIRS.length - 1, _toInt);
exports.SUBSCRIPTIONS_PER_STEP = _getOption( 'subscriptionsPerStep', 300, _toInt);
exports.SUBSCRIPTION_INTERVAL = _getOption( 'subscriptionInterval', 800, _toInt);
exports.NAME = _getOption( 'name', exports.RUN_MODE + '_' + Math.round( Math.random()*10000000000000 ));
exports.UPDATES_PER_SECOND = _getOption( 'updatesPerSecond', 10000, _toInt);
exports.DELAY_BETWEEN_PACKETS = _getOption( 'delayBetweenPackets', 100, _toInt);
exports.TOTAL_UPDATES = _getOption( 'totalUpdates', Infinity, _toInt);
exports.MAX_MESSAGES_PER_PACKET = _getOption( 'packetMessages', 200, _toInt);
exports.TIME_BETWEEN_SENDING_QUEUED_PACKAGES = _getOption( 'packetGap', 8, _toInt);
exports.DB_HOST = _getOption( 'dbHost', 'oneb-test-reporting.c3cjz2wd8zfw.eu-west-1.rds.amazonaws.com' );
exports.DB_USER = _getOption( 'dbUser', 'deepstream' );
exports.DB_PASS = _getOption( 'dbPass', 'openpass' );
exports.DB_NAME = _getOption( 'dbName', 'reports' );
exports.TEST_CASE = _getOption( 'testCase', 'default-test-case' );
exports.HTTP_PORT = _getOption( 'PORT', 80, _toInt );
