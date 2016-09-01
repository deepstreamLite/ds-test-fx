$(function(){
	window.kot = new KoTools( ko );
	var ds = deepstream( '52.210.144.102:6020' ).login( null, function(){
		ko.applyBindings( new ViewModel( ds ) );
	});
});
