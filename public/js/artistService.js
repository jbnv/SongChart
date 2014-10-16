function ArtistService() {

		

}

ArtistService.prototype.bind =  function(entity) {
	return function(data) {
		entity.artistObject = data;
	}
}
