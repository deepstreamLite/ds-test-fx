'use strict';

const opts = require( '../shared/options' );
const deepstream = require( 'deepstream.io-client-js' );


module.exports = class NodeClient {
	constructor ( measure, serverIp ){
		this._active = true;
		this._totalCurrencyPairSubscriptions = 0;
		this._index = global.controlRecord.get( 'ccyStart' );
		this._measure = measure;

		this._testDS = deepstream( serverIp, {
			subscriptionTimeout: 10000
		}).login( { username: opts.NAME }, this._subscribeToRates.bind(this) );

		this._testDS.on( 'error', function( msg, type ){
			console.log( 'TEST DS ERROR:', type, msg );
			global.clientDS.event.emit('clientError', {
				type : type,
				msg  : msg
			});
		});
	}

	stop(){
		console.log( 'stopping client' );
		this._active = false;
		// close connection to server to unsubscribe from all events
		this._testDS.close();
		this._measure.stop();
	}

	_onIncomingMessage( total ) {
		this._measure.count++;
	}

	_subscribeToRates() {
		const ccyEnd = global.controlRecord.get( 'ccyEnd' );
		const subscriptionsPerStep = global.controlRecord.get( 'subscriptionsPerStep' );
		const endIndex = Math.min( ccyEnd, this._index + subscriptionsPerStep );

		for( this._index; this._index < endIndex; this._index++ ) {
			this._testDS.event.subscribe( opts.CURRENCY_PAIRS[ this._index ],
					this._onIncomingMessage.bind(this) );
			this._totalCurrencyPairSubscriptions++;
		}

		console.log( 'subscribed to', this._totalCurrencyPairSubscriptions );

		if( this._index < ccyEnd ) {
			const subscriptionInterval = global.controlRecord.get( 'subscriptionInterval' );
			setTimeout( this._subscribeToRates.bind(this), subscriptionInterval );
		} else {
			this._measure.start();
		}
	}
}
