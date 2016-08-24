class ViewModel{
	constructor() {
		this.pricesInLastSecond = ko.observable( 0 );
		this.pricesSent = ko.observable( 0 );
		this.clientsCount = ko.observable( 0 );
		this.providerCount = ko.observable( 0 );
		this.serverCount = ko.observable( 0 );
		this.requestCount = ko.observable( 0 );
		this.lastUpdated = ko.observable( 'NEVER' );
		this._lastUpdateTime = null;
		this._getData();
	}

	_getData() {
		$.getJSON( 'http://localhost:8000', this._onUpdate.bind( this ) );
		setTimeout( this._getData.bind( this ), 1000 );
	}

	_onUpdate( data ) {
		this.pricesInLastSecond( data.prices_received );
		this.clientsCount( data.clients_count );
		this.pricesSent( data.prices_sent );
		this.providerCount( data.provider_count );
		this.requestCount( this.requestCount() + 1 );
	}
}