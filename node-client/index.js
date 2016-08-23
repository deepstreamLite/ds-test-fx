'use strict';

const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream( 'localhost:6021', {subscriptionTimeout: 10000 } ).login( null, subscribeToRates );
const CURRENCIES = Object.keys( require( '../shared/rates.json' ).rates );
var index = 0;
var totalCurrencyPairSubscriptions = 0;
var messagesReceivedInLastSecond = 0;
var lastMeasureTimestamp = 0;
var lastTotal = 0;

ds.on( 'error', function( msg, type ){
	console.log( 'ERROR:' + type + ' ' + msg );
});


function onIncomingMessage( total ) {
	messagesReceivedInLastSecond++;
	lastTotal = total;
}

function subscribeToRates() {
	var baseCurrency = CURRENCIES[ index ];
	var i;

	for( i = 0; i < CURRENCIES.length; i++ ) {
		ds.event.subscribe( 'FX/' + baseCurrency + CURRENCIES[ i ], onIncomingMessage );
		totalCurrencyPairSubscriptions++;
	}

	console.log( 'subscribed to ' + totalCurrencyPairSubscriptions );
	index++;

	if( index < CURRENCIES.length ) {
		setTimeout( subscribeToRates, 800 );
	} else {
		startMeasuring();
	}
}

function startMeasuring() {
	lastMeasureTimestamp = Date.now();
	setInterval( measure, 1000 );
}

function measure() {
	var now = Date.now();
	var timePassed = now - lastMeasureTimestamp;
	console.log( `Received ${messagesReceivedInLastSecond} in last ${timePassed} ms with last ${lastTotal}` );
	lastMeasureTimestamp = now;
	messagesReceivedInLastSecond = 0;
}