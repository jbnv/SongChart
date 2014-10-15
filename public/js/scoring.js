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
		song.timeToPeak = 1 - Math.exp(1 - Math.sqrt(song.debutRank / song.peakRank));

		song.pointRanks = [];
		song.score = 0;
		for (monthIndex = 0; monthIndex < song.duration; monthIndex += 0.25) {

			// Calculate scaled point rank.
			if (monthIndex < song.timeToPeak) {
				R = D + (P-D)*monthIndex/song.timeToPeak;
			} else {
				m0 = monthIndex - song.timeToPeak;
				R = P + 3*m0/(song.duration-song.timeToPeak);
			}

			// Store and use the value.
			song.pointRanks.push({'m':parseFloat(monthIndex), 'value':Math.exp(R)});
			if (R <= 3) {
				song.score += 3-R;
			}
		}
		
		// Find the four weekly ranks for the given month, and average them.
		song.rank = function(m) {
			total = 0;
			for (index in this.pointRanks) {
				prm = this.pointRanks[index].m;
				if ((prm >= m) && (prm < m+1)) {
					total += this.pointRanks[index].value;
				}
			}
			return total/4;
		}
		
	}
	return song;
}

exports.songCollectionScore = function(songArray) {
	score = 0.0;
	for (var index in songArray) {
		song = songArray[index];
		if (song.score) {
			score += parseFloat(song.score);
		}
	}
	return score;
}
