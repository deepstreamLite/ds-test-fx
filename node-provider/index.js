'use strict';

const utils = require( '../shared/utils' );
const opts = require( '../shared/options' );
const deepstream = require( 'deepstream.io-client-js' );

module.exports = class NodeProvider {
	constructor( measure ){
		this._active = true;
		this._currencyPairIndex = opts.CCY_START;
		this._sendInterval;
		this._measure = measure;

		this._testDS = deepstream( opts.DEEPSTREAM_URL, {
			maxMessagesPerPacket             : opts.MAX_MESSAGES_PER_PACKET,
			timeBetweenSendingQueuedPackages : opts.TIME_BETWEEN_SENDING_QUEUED_PACKAGES
		}).login( null, this._startSending.bind( this ) );
		this._testDS.on( 'error', function( msg, type ){
			console.log( 'TEST DS ERROR:', type, msg );
			global.clientDS.event.emit('clientError', {
				type : type,
				msg  : msg
			});
		});
	}

	stop() {
		console.log( 'stopping provider' );
		clearInterval( this._sendInterval );
		this._active = false;
		this._testDS.close();
		this._measure.stop();
	}

	_startSending() {
		this._sendInterval = setInterval( this._send.bind( this ), opts.DELAY_BETWEEN_PACKETS );
		this._measure.start();
	}

	_send() {
		if ( !this._active ) {
			return;
		}

		let updatesPerSecond = global.controlRecord.get( 'updatesPerSecond' );
		let updatesToSend = updatesPerSecond / ( 1000 / opts.DELAY_BETWEEN_PACKETS );

		for( var i = 0; i < updatesToSend; i++  ) {
			this._currencyPairIndex++;

			let ccyStart = global.controlRecord.get( 'ccyStart' );
			let ccyEnd   = global.controlRecord.get( 'ccyEnd' );

			if( this._currencyPairIndex >=  ccyEnd ) {
				this._currencyPairIndex = ccyStart;
			}
			this._measure.count++;
			this._testDS.event.emit( opts.CURRENCY_PAIRS[ ccyStart + this._currencyPairIndex ], this._measure.count );
		}

		if( this._measure.count > opts.TOTAL_UPDATES ) {
			this.stop();
		}
	}
}
