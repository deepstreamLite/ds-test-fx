class Probe{
	constructor( ds, name, viewModel ) {
		this._parent = viewModel;
		this._metricRecord = ds.record.getRecord( 'metrics/' + name );

		this._controlRecord = ds.record.getRecord( 'control/' + name );
		this.name = ko.observable( name );

		this.time = kot.getObservable( this._metricRecord, 'time' );
		this.serverIp = kot.getObservable( this._metricRecord, 'serverIp' );
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
}
