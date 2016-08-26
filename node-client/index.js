'use strict';

const Measure = require( '../shared/measure' );
const opts = require( '../shared/options' );
const deepstream = require( 'deepstream.io-client-js' );
const measure = new Measure( opts.NAME );

var ds;
var measureDs;
var index = opts.CCY_START;
var totalCurrencyPairSubscriptions = 0;

exports.start = function( _ds ) {
	measureDs = _ds;

	ds = deepstream( opts.DEEPSTREAM_URL, {
		subscriptionTimeout: 10000
	}).login( null, subscribeToRates );

	ds.on( 'error', function( msg, type ){
		console.log( 'ERROR:' + type + ' ' + msg );
	});
};

function onIncomingMessage( total ) {
	measure.count++;
}

function subscribeToRates() {
	var endIndex = Math.min( opts.CCY_END, index + opts.SUBSCRIPTIONS_PER_STEP );

	for( index; index < endIndex; index++ ) {
		ds.event.subscribe( opts.CURRENCY_PAIRS[ index ], onIncomingMessage );
		totalCurrencyPairSubscriptions++;
	}

	console.log( 'subscribed to ' + totalCurrencyPairSubscriptions );

	if( index < opts.CCY_END ) {
		setTimeout( subscribeToRates, opts.SUBSCRIPTION_INTERVAL );
	} else {
		measure.start( measureDs );
	}
}
