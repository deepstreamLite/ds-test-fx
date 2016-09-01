class Probe{
	constructor( ds, name, viewModel ) {
		this._parent = viewModel;
		this._metricRecord = ds.record.getRecord( 'metrics/' + name );
		this._metricRecord.subscribe( 'heartbeat', this._onHeartbeat.bind( this  ) );
		this._metricRecord.whenReady( function( record ){
			if (!record.get('heartbeat')){
				console.log('removing client without heartbeat');
				//this._parent.remove( this );
			}
		}.bind(this) );

		this._controlRecord = ds.record.getRecord( 'control/' + name );
		this.name = ko.observable( name );

		this.time = kot.getObservable( this._metricRecord, 'time' );
		this.duration = kot.getObservable( this._metricRecord, 'duration' );
		this.count = kot.getObservable( this._metricRecord, 'count' );
		this.total = kot.getObservable( this._metricRecord, 'total' );

		this.runMode = kot.getObservable( this._controlRecord, 'runMode' );
		this.ccyStart = kot.getObservable( this._controlRecord, 'ccyStart' );
		this.ccyEnd = kot.getObservable( this._controlRecord, 'ccyEnd' );
		this.subscriptionsPerStep = kot.getObservable( this._controlRecord, 'subscriptionsPerStep' );
		this.subscriptionInterval = kot.getObservable( this._controlRecord, 'subscriptionInterval' );
		this.updatesPerSecond = kot.getObservable( this._controlRecord, 'updatesPerSecond' );
		this.active = kot.getObservable( this._controlRecord, 'active' );
	}

	destroy() {
		this._metricRecord.discard();
		this._controlRecord.discard();
	}

	_onHeartbeat( timeStamp ) {
		if( Date.now() - timeStamp > 2000  ) {
			console.log('heartbeat timeout');
			//this._parent.remove( this );
		}
	}
}
