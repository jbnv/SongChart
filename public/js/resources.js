function Resources($resource) {
	return {
		'songs': $resource(
			'/songs', 
			{ // parameters
				'decade':'@decade',
				'year':'@year',
				'month':'@month',
				'refresh':'@refresh',
				'top':'@top',
				'artist':'@artist',
				'sortField':'@sortField'
			}
		),
		'artists': $resource(
			'/artists', 
			{ // parameters
				'refresh':'@refresh',
				'top':'@top',
				'sortField':'@sortField'
			}
		)
	};
}