
class Price{
	constructor( baseCurrency, termCurrency, parentElement, ds ) {
		this._currencyPair = baseCurrency + termCurrency;
		this._rateNode = document.createTextNode( '0.0000' );
		this._rate = 0;
		this.needsUpdate = false;
		ds.event.subscribe( 'FX/' + this._currencyPair, this._onRateUpdate.bind( this ) );
		parentElement.appendChild( document.createTextNode( ' ' + this._currencyPair  + ' ' ) );
		parentElement.appendChild( this._rateNode );
	}

	update() {
		this.needsUpdate = false;
		this._rateNode.nodeValue = this._rate;
	}

	_onRateUpdate( rate ) {
		this._rate = rate;
		this.needsUpdate = true;
	}
}