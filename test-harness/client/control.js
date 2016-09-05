'use strict';
const deepstream = require( 'deepstream.io-client-js' );

const Provider = require( './provider' );
const Client = require( './client' );
const Measure = require( '../../shared/measure' );
const opts = require('../../shared/options');

module.exports = class Control {
	constructor( name ) {
		this._name = name;

		this._node = null;
		this._measure = new Measure( name );

		console.log( 'STARTING CONTROL FOR', this._name );
		global.controlRecord = global.clientDS.record.getRecord( 'control/' + this._name );
		global.metricsRecord = global.clientDS.record.getRecord( 'metrics/' + this._name );
		global.serversRecord = global.clientDS.record.getRecord( 'servers' );

 		global.serversRecord.subscribe( 'ips', function ( ips ) {
 			if ( !this._serverUrl && ips.length !== 0){
 				this._serverUrl = ips[ this._getRandomInt( 0, ips.length - 1 ) ];
 				global.metricsRecord.set( 'serverIp', this._serverUrl );
 				this._updateState( global.controlRecord.get() );
 			} else {
 				global.serversRecord.unsubscribe( 'ips' );
 			}
 		}.bind(this) );

		global.clientDS.on('connectionStateChanged', function( state ){
			if ( state === deepstream.CONSTANTS.CONNECTION_STATE.OPEN ){
				this._resetControlState();
			}
		}.bind(this));

		this._resetControlState();

		global.controlRecord.subscribe( this._updateState.bind( this ) );
	}

	_resetControlState(){
		global.controlRecord.set({
			active               : false,
			runMode              : opts.RUN_MODE,
			ccyStart             : opts.CCY_START,
			ccyEnd               : opts.CCY_END,
			subscriptionsPerStep : opts.SUBSCRIPTIONS_PER_STEP,
			subscriptionInterval : opts.SUBSCRIPTION_INTERVAL,
			updatesPerSecond     : opts.UPDATES_PER_SECOND
		});
	}

	/**
 	 * Returns a random integer between min (inclusive) and max (inclusive)
 	 * Using Math.round() will give you a non-uniform distribution!
 	 */
 	_getRandomInt(min, max) {
 		return Math.floor(Math.random() * (max - min + 1)) + min;
 	}

	_updateState( data ){
		if ( data.active && !this._node && this._serverUrl ) {
			if( data.runMode === 'provider' ) {
				this._node = new Provider( this._measure, this._serverUrl );
			} else if( data.runMode === 'client' ) {
				this._node = new Client( this._measure, this._serverUrl );
			} else {
				throw new Error( 'Unknown runMode ' + data.runMode );
			}
			this._node._testDS.on( 'connectionStateChanged', ( state ) => {
				if( state === 'ERROR' && this._node ) {
					console.log( 'lost connection, so closing' );
					this._node.stop();
					this._node = null;
					global.controlRecord.set( 'active', false );
				}
			} );
		} else if ( !data.active && this._node ) {
			this._node.stop();
			this._node = null;
		}
	}
}
