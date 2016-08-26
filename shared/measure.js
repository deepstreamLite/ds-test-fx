'use strict';

//const db = require( './db' );
const MEASURE_INTERVAL = 1000;

var pad = function( input, amount ) {
	input = input.toString();
	var padding = '';

	for( var i = 0; i < amount - input.length; i++ ) {
		padding += ' ';
	}

	return input + padding;
}

module.exports = class Measuring{

	constructor( name ) {
		this.count = 0;
		this._name = name;
		this._lastCount = 0;
		this._lastTime = 0;
		this._interval = null;
	}

	start( ds ) {
    this.metricsRecord = ds.record.getRecord('metrics/' + this._name);
		//db.createEntry();
		console.log( 'STARTING TO MEASURE FOR ' + this._name );
		this.count = 0;
		this._lastCount = 0;
		this._lastTime = 0;
		this._interval = setInterval( this._measure.bind( this ), MEASURE_INTERVAL );
	}

	_measure() {
		var now = Date.now();
		var relTime = now - this._lastTime;
		var relCount = this.count - this._lastCount;

		//db.storeMetrics( relTime, relCount, this.count );
		console.log( `${this._name} time: ${pad(relTime,4)} count: ${pad(relCount,5)} total: ${this.count}` );
		this.metricsRecord.set(
				{
					time: relTime,
					count: relCount,
					total: this.count
				});

		this._lastTime = now;
		this._lastCount = this.count;
	}
}
