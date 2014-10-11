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

		D = Math.log(song.debutRank);
		P = Math.log(song.peakRank);
		song.timeToPeak = (song.debutRank-song.peakRank) / 20;

		song.pointRanks = [];
		song.score = 0;
		for (monthIndex = 0; monthIndex < song.duration; monthIndex += 0.25) {

			// Calculate point rank.
			if (monthIndex < song.timeToPeak) {
				pointRank = Math.exp(D + (P-D)*monthIndex/song.timeToPeak);
			} else {
				m0 = monthIndex - song.timeToPeak;
				pointRank = Math.exp(P + 3*m0/(song.duration-song.timeToPeak));
			}

			// Store and use the value.
			song.pointRanks.push({'m':parseFloat(monthIndex), 'value':pointRank});
			song.score += Math.exp(1-pointRank);
		}
		
		song.rank = function(m) {
			value = (
				_.reduce(
					this.pointRanks,
					function(total,pointRank) {
						if (pointRank.m >= m && pointRank.m < m+1) {
							total += pointRank.value;
						}
					},
					0
				)
			)/4;
			return value;
		}
		
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
