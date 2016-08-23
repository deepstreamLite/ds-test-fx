'use strict';

const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream( 'localhost:6021' ).login( null, startSending );
const CURRENCIES = Object.keys( require( '../shared/rates.json' ).rates );
const UPDATES_PER_SECOND = 10000;
const DELAY_BETWEEN_PACKETS = 100;
const TOTAL_UPDATES = Infinity;
const currencyPairs = getCurrencyPairs();

var updatesSend = 0;
var updatesSendLast = 0;
var lastMeasureTimestamp = 0;
var currencyPairIndex = 0;
var sendInterval;

function getCurrencyPairs() {
	var i, j, pairs = [];

	for( i = 0; i < CURRENCIES.length; i++ )
	for( j = 0; j < CURRENCIES.length; j++ ){
		pairs.push ( 'FX/' + CURRENCIES[ i ] + CURRENCIES[ j ] );
	}

	return pairs;
}


function startSending() {
	lastMeasureTimestamp = Date.now();
	sendInterval = setInterval( send, DELAY_BETWEEN_PACKETS );
	setInterval( measure, 1000 );
}

function send() {
	var updatesToSend = UPDATES_PER_SECOND / ( 1000 / DELAY_BETWEEN_PACKETS );

	for( var i = 0; i < updatesToSend; i++  ) {
		currencyPairIndex++;

		if( currencyPairIndex >= currencyPairs.length ) {
			currencyPairIndex = 0;
		}
		updatesSend++;
		ds.event.emit( 'FX/GBPUSD', updatesSend );
	}

	if( updatesSend > TOTAL_UPDATES ) {
		clearInterval( sendInterval );
	}
}

function measure() {
	var now = Date.now();
	var timePassed = now - lastMeasureTimestamp;
	var updatesSendInLastSecond = updatesSend - updatesSendLast;
	console.log( `Send ${updatesSendInLastSecond} in last ${timePassed} ms total ${updatesSend}` );
	lastMeasureTimestamp = now;
	updatesSendLast = updatesSend;
}