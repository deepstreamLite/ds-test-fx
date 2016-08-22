$.getJSON( '../shared/rates.json', data => {
	var baseCurrency,
		ds,
		priceGrid = $( '<div id="price-grid"></div>' )[ 0 ],
		prices = [],
		currencies = Object.keys( data.rates ),
		index = 0;

	function createBase() {
		createPrices( currencies[ index ] );
		index++;

		if( false ) {
			setTimeout( createBase, 300 );
		} else {
			$( 'body' ).append( priceGrid );
			setTimeout( render, 100 );
		}
	}

	function createPrices( baseCurrency ) {
		var termCurrency,
			price;

		for( termCurrency in data.rates ) {
			price = new Price( baseCurrency, termCurrency, priceGrid, ds );
			prices.push( price );
		}
	}

	function render() {
		for( var i = 0; i < prices.length; i++ ) {
			if( prices[ i ].needsUpdate ) {
				prices[ i ].update();
			}
			//setTimeout( render, 1000 );
		}
	}

	window.renderFn = render;
	ds = deepstream( 'localhost:6020' ).login( null, createBase );
});