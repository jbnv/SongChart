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
	
		scaleTime = function(m) {
			return song.duration / 2;
		}
	
		e = (song.debutRank + Math.sqrt(
				song.debutRank*song.debutRank - song.peakRank*song.peakRank
			))/song.peakRank;
		song.coefficientConstant = e;
		
		song.ascentCoefficient
			= (song.peakRank - song.debutRank*e) / (1/e - e);
		song.descentCoefficient 
			= (song.peakRank - song.debutRank/e) / (e - 1/e);
		
		song.timeToPeak = Math.log(song.ascentCoefficient/song.descentCoefficient) / (2*scaleTime());

		song.pointRank = function(m) {
			if (isNaN(this.ascentCoefficient) || isNaN(this.descentCoefficient)) {
				value = 0;
			} else {
				e = Math.exp(m*scaleTime()); // scale this down if numbers are too wild.
				value = this.ascentCoefficient / e + this.descentCoefficient * e;
			};
			return value;
		};
		
		song.rank = function(m) {
			value = this.pointRank(m);
			//value = (this.pointRank(m) + this.pointRank(m+1)) / 2;
			return value;
		}
		
		song.pointRanks = [];
		for (monthIndex = 0; monthIndex < song.duration; monthIndex += 0.5) {
			song.pointRanks.push({'m':parseFloat(monthIndex), 'rank':song.pointRank(monthIndex)});
		}
		
		song.score = song.peakRank*song.descentCoefficient + song.debutRank*song.ascentCoefficient;
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
