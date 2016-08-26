$(function(){
	window.kot = new KoTools( ko );
	var ds = deepstream( 'ec2-54-154-140-90.eu-west-1.compute.amazonaws.com:6020' ).login( null, function(){
		ko.applyBindings( new ViewModel( ds ) );
	});
});