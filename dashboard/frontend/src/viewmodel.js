class ViewModel{
	constructor( ds ) {
		this._ds = ds;
		this._ds.record.listen( 'metrics/*', this._onMetric.bind( this ) );
		this._ds.event.subscribe( 'clientError', function(e) {
			console.log('client error: ' + e);
		} );

		this.pricesInLastSecond = ko.observable( 0 );
		this.pricesSent = ko.observable( 0 );
		this.clientsCount = ko.observable( 0 );
		this.providerCount = ko.observable( 0 );
		this.serverCount = ko.observable( 0 );
		this.serverIps = ko.observable( [] );
		this.requestCount = ko.observable( 0 );
		this.lastUpdated = ko.observable( 'NEVER' );
		this.totalProbes = ko.observable( 0 );
		this.activeProbes = ko.observable( 0 );
		this.probes = ko.observableArray();
		this._lastUpdateTime = null;
		this._updateInterval = setInterval( this._updateTotals.bind( this ), 1000 );
		this.enableAllProbes = this.setAllProbes.bind(this, true);
		this.disableAllProbes = this.setAllProbes.bind(this, false);
		this._attachServerUpdate()
	}

	remove( probe ) {
		console.log( 'removing ', probe );
		this.probes.splice( this.probes.indexOf( probe ), 1 );
		probe.destroy();
	}

	setAllProbes( state ) {
		var probes = this.probes();
		for (var i = 0; i < probes.length; i++) {
			probes[i].active(state);
		}

	}

	_attachServerUpdate(){
		var serverRecord = this._ds.record.getRecord( 'servers' );
		serverRecord.subscribe( 'ips', function (ips) {
			this.serverCount( ips.length );
			this.serverIps( ips.join(', ') );

		}.bind(this) );
	}

	_onMetric( metric, isSubscribed, response ) {
		var probe = this.probes().filter( probe => { return `metrics/${probe.name()}` === metric; })[ 0 ];

		if( isSubscribed && !probe ) {
			console.log('metric subscribed = ', metric);
			response.accept();
			this.probes.push( new Probe( this._ds, metric.replace('metrics/', ''), this ));
		}

		if( !isSubscribed && probe ) {
			console.log( 'metric unsubscribed', metric );
			this.remove( probe );
		}
	}


	_updateTotals() {
		var pricesInLastSecond = 0;
		var pricesSent = 0;
		var clientsCount = 0;
		var providerCount = 0;
		var total = 0;
		var active = 0;
		var probes = this.probes();
		var i;

		for( i = 0; i < probes.length; i++ ) {
			total++;

			if( !probes[ i ].active() ) {
				continue;
			}

			active++;

			if( probes[ i ].runMode === 'provider' ) {
				providerCount++;
				pricesSent += probes[ i ].count();
			} else {
				clientsCount++;
				pricesInLastSecond += probes[ i ].count();
			}
		}


		this.pricesInLastSecond( pricesInLastSecond );
		this.clientsCount( clientsCount );
		this.pricesSent( pricesSent );
		this.providerCount( providerCount );
		this.totalProbes( total );
		this.activeProbes( active );
	}
}
