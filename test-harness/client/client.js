'use strict';

const deepstream = require( 'deepstream.io-client-js' );
const opts = require( '../../shared/options' );

module.exports = class NodeClient {
	constructor ( measure, serverUrl ){
				console.log( 'subscribing to', serverUrl)
		this._active = true;
		this._totalCurrencyPairSubscriptions = 0;
		this._index = global.controlRecord.get( 'ccyStart' );
		this._measure = measure;

		this._testDS = deepstream( serverUrl, {
			subscriptionTimeout: 1000000
		}).login( { username: opts.NAME }, function(){
			console.log( 'Logged in succesfully' );
			this._subscribeToRates();
		}.bind( this ) );

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
