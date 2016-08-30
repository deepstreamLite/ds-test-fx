'use strict';
const Provider = require( '../node-provider' );
const Client = require( '../node-client' );
const Measure = require( '../shared/measure' );
const opts = require('./options')

module.exports = class Control{
	constructor( name ) {
		this._name = name;

		this._node = null;
		this._measure = new Measure( name );

		console.log( 'STARTING CONTROL FOR ' + this._name );
		global.controlRecord = global.clientDS.record.getRecord( 'control/' + this._name );
		global.metricsRecord = global.clientDS.record.getRecord( 'metrics/' + this._name );

		global.controlRecord.set({
			active               : false,
			runMode              : opts.RUN_MODE,
			ccyStart             : opts.CCY_START,
			ccyEnd               : opts.CCY_END,
			subscriptionsPerStep : opts.SUBSCRIPTIONS_PER_STEP,
			subscriptionInterval : opts.SUBSCRIPTION_INTERVAL,
			updatesPerSecond     : opts.UPDATES_PER_SECOND
		});

		global.controlRecord.subscribe( this._updateState.bind( this ) );
	}

	_updateState( data ){
		if ( data.active && !this._node ) {
			if( data.runMode === 'provider' ) {
				this._node = new Provider( this._measure );
			} else if( data.runMode === 'client' ) {
				this._node = new Client( this._measure );
			} else {
				throw new Error( 'Unknown runMode ' + data.runMode );
			}
		} else if ( !data.active && this._node ) {
			this._node.stop();
			this._node = null;
		}
	}
}
