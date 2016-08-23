'use strict';

const utils = require( '../shared/utils' );
const deepstream = require( 'deepstream.io-client-js' );
const argv = require('minimist')(process.argv.slice(2));
const Measure = require( '../shared/measure' );


const DEEPSTREAM_URL = argv.dsUrl || 'localhost:6021';
const UPDATES_PER_SECOND = argv.updatesPerSecond || 10000;
const DELAY_BETWEEN_PACKETS = argv.delayBetweenPackets || 100;
const TOTAL_UPDATES = argv.totalUpdates || Infinity;
const CURRENCY_PAIRS = utils.getCurrencyPairs();
const CCY_START = argv.ccyStart || 0;
const CCY_END = argv.ccyEnd || CURRENCY_PAIRS.length - 1;
const NAME = argv.name || 'provider';
const MAX_MESSAGES_PER_PACKET = argv.packetMessages || 200;
const TIME_BETWEEN_SENDING_QUEUED_PACKAGES = argv.packetGap || 8;


const options = {
	maxMessagesPerPacket: MAX_MESSAGES_PER_PACKET, 
	timeBetweenSendingQueuedPackages: TIME_BETWEEN_SENDING_QUEUED_PACKAGES
}
const ds = deepstream( 'localhost:6021', options ).login( null, startSending );

const measure = new Measure( NAME );
var currencyPairIndex = CCY_START;
var sendInterval;

function startSending() {
	sendInterval = setInterval( send, DELAY_BETWEEN_PACKETS );
	measure.start();
}

function send() {
	var updatesToSend = UPDATES_PER_SECOND / ( 1000 / DELAY_BETWEEN_PACKETS );

	for( var i = 0; i < updatesToSend; i++  ) {
		currencyPairIndex++;

		if( currencyPairIndex >= CCY_END ) {
			currencyPairIndex = CCY_START;
		}
		measure.count++;
		ds.event.emit( CURRENCY_PAIRS[ CCY_START + currencyPairIndex ], measure.count );
	}

	if( measure.count > TOTAL_UPDATES ) {
		clearInterval( sendInterval );
	}
}