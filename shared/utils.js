const DATA = require( './rates.json' );
const CURRENCIES = Object.keys( DATA.rates );

exports.getCurrencyPairs = function() {
	var i, j, pairs = [];

	for( i = 0; i < CURRENCIES.length; i++ )
	for( j = 0; j < CURRENCIES.length; j++ ){
		pairs.push ( 'FX/' + CURRENCIES[ i ] + CURRENCIES[ j ] );
	}

	return pairs;
};