'use strict';

const utils = require( '../shared/utils' );
const Measure = require( '../shared/measure' );
const argv = require('minimist')(process.argv.slice(2));

const CURRENCY_PAIRS = utils.getCurrencyPairs();
const DEEPSTREAM_URL = argv.dsUrl || 'localhost:6021';
const CCY_START = argv.ccyStart || 0;
const CCY_END = argv.ccyEnd || CURRENCY_PAIRS.length - 1;
const SUBSCRIPTIONS_PER_STEP = argv.subscriptionsPerStep || 300;
const SUBSCRIPTION_INTERVAL = argv.subscriptionInterval || 800;
const NAME = argv.name || 'receiver';

const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream( DEEPSTREAM_URL, {subscriptionTimeout: 10000 } ).login( null, subscribeToRates );
const measure = new Measure( NAME );

var index = CCY_START;
var totalCurrencyPairSubscriptions = 0;

ds.on( 'error', function( msg, type ){
	console.log( 'ERROR:' + type + ' ' + msg );
});

function onIncomingMessage( total ) {
	measure.count++;
}

function subscribeToRates() {
	var endIndex = Math.min( CCY_END, index + SUBSCRIPTIONS_PER_STEP );
	
	for( index; index < endIndex; index++ ) {
		ds.event.subscribe( CURRENCY_PAIRS[ index ], onIncomingMessage );
		totalCurrencyPairSubscriptions++;
	}

	console.log( 'subscribed to ' + totalCurrencyPairSubscriptions );

	if( index < CCY_END ) {
		setTimeout( subscribeToRates, SUBSCRIPTION_INTERVAL );
	} else {
		measure.start();
	}
}