'use strict';

const utils = require( '../shared/utils' );
const deepstream = require( 'deepstream.io-client-js' );
const Measure = require( '../shared/measure' );
const opts = require( '../shared/options' );
const measure = new Measure( opts.NAME );

var ds;
var currencyPairIndex = opts.CCY_START;
var sendInterval;

exports.start = function() {
	ds = deepstream( opts.DEEPSTREAM_URL, {
		maxMessagesPerPacket: opts.MAX_MESSAGES_PER_PACKET, 
		timeBetweenSendingQueuedPackages: opts.TIME_BETWEEN_SENDING_QUEUED_PACKAGES
	}).login( null, startSending );
};

function startSending() {
	sendInterval = setInterval( send, opts.DELAY_BETWEEN_PACKETS );
	measure.start();
}

function send() {
	var updatesToSend = opts.UPDATES_PER_SECOND / ( 1000 / opts.DELAY_BETWEEN_PACKETS );

	for( var i = 0; i < updatesToSend; i++  ) {
		currencyPairIndex++;

		if( currencyPairIndex >= opts.CCY_END ) {
			currencyPairIndex = opts.CCY_START;
		}
		measure.count++;
		ds.event.emit( opts.CURRENCY_PAIRS[ opts.CCY_START + currencyPairIndex ], measure.count );
	}

	if( measure.count > opts.TOTAL_UPDATES ) {
		clearInterval( sendInterval );
	}
}