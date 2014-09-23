function ArtistService() { 

	// Inject $http before using!
	
	var _cache = {};
	
	this.getArtist = function(id) {
		if (_cache[id]) {
			return this.$http.then(function() { return _cache[id]; });
		} else {
			// Get it from the server and store it in the cache.
			return this.$http.get('page/'+id).then(function(result) {
				if (!result.data) {
					name = 'result.data NULL';
				} else if (!result.data.title) {
					name = 'result.data.title NULL';
				} else {
					name = result.data.title;
				}
				returnObject = {
					'name' : name
				}
				_cache[id] = returnObject;
				return returnObject;
			});
		} //if (_cache[id])
	}

}
