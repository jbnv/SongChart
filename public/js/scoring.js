/* jshint node:true */

// Middleware for scoring and ranking.

var _ = require('underscore');

// Scoring criteria:
// Debut rank (D): Higher rank (lower number) is better.
// Peak rank (P): Higher rank (lower number) is better.
// Duration (M): More is better.

exports.score = function(song) {

	song.debutRank = parseFloat(song.debutrank);
	song.peakRank  = parseFloat(song.peakrank);
	song.duration  = parseInt(song.months);
	
	if (song.duration > 0) {
	
		e = (song.debutRank - Math.sqrt(
				song.debutRank*song.debutRank - song.peakRank*song.peakRank
			))/song.peakRank;
		song.ascentCoefficient
			= (song.peakRank - song.debutRank*e) / (1/e - e);
		song.descentCoefficient 
			= (song.peakRank - song.debutRank/e) / (e - 1/e);
		
		song.pointRank = function(m) {
			if (isNaN(this.ascentCoefficient) || isNaN(this.descentCoefficient)) {
				value = 0;
			} else {
				e = Math.exp(m * this.duration / 20); // scale this down if numbers are too wild.
				value = this.ascentCoefficient / e + this.descentCoefficient * e;
			};
			return value;
		};
		
		song.rank = function(m) {
			value = (this.pointRank(m) + this.pointRank(m+1)) / 2;
			return value;
		}
		
		// TEMP Calculate total score.
		song.score = song.peakRank/Math.sqrt(song.duration) + song.debutRank/song.duration;
	}
	return song;
}

exports.songCollectionScore = function(songArray) {
	tallies = _.reduce(
		songArray, 
		function(tallies,song) { 
			tallies.debutrank += parseFloat(song.debutrank);
			tallies.peakrank += parseFloat(song.peakrank);
			tallies.duration += parseInt(song.months);
			return tallies;
		},
		{ 'debutrank': 0, 'peakrank': 0, 'duration':0 }
	); // _.reduce;
	return 1; //TODO function(tallies.debutrank,tallies.peakrank,tallies.duration);
}
