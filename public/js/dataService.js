function DataService() {

	//TODO Get song data from playlists site.
	this.songData = [
		{
			artist: 'Extreme',
			title: 'Hole Hearted'
		},{
			artist: 'Karyn White',
			title: 'Romantic'
		},{
			artist: 'Tears for Fears',
			title: "Sowing the Seeds of Love"
		},{
			artist: 'Michael Jackson',
			title: "Black or White"
		}
	];

	//TODO Get score data from playlists site.
	this.scoreData = [
		{ songId: 0, year: 1991, month: 8, score: 90 },
		{ songId: 0, year: 1991, month: 9, score: 100 },
		{ songId: 1, year: 1991, month: 9, score: 99 },
		{ songId: 2, year: 1989, month: 10, score: 100 },
		{ songId: 2, year: 1989, month: 11, score: 100 },
		{ songId: 3, year: 1991, month: 9, score: 80 }
	];
	
}

DataService.prototype.getScoreEntry =  function(scoreId,rank) {
	entry = angular.copy(this.scoreData[scoreId]);
	entry.rank = rank;
	entry.song = this.songData[entry.songId];
	return entry;
}

DataService.prototype.massageScoreEntry =  function(entry,rank) {
	entry.rank = rank;
	entry.song = this.songData[entry.songId];
	return entry;
}