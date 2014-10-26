/* jshint node:true */

// Middleware for scoring and ranking.

var _ = require('underscore');

// Scoring criteria:
// Debut rank (D): Higher rank (lower number) is better.
// Peak rank (P): Higher rank (lower number) is better.
// Duration (M): More is better.

//IDEA: Have 'ranks' optionally be an object { 'debutrank','peakrank','duration' }.

exports.score = function(song) {

	song.debutRank = parseFloat(song.debutrank);
	song.peakRank  = parseFloat(song.peakrank);
	song.duration  = parseFloat(song.months);
	song.pointRanks = [];
	song.score = 0;
	
	if (song.ranks) {

		song.pointRanks = JSON.parse(song.ranks);
		song.debutRank = parseFloat(song.pointRanks[0]);
		song.peakRank = parseFloat(_.min(song.pointRanks));
		song.duration = song.pointRanks.length/4;

	} else 
	if (song.duration > 0) {

		D = Math.log(song.debutRank);
		P = Math.log(song.peakRank);
		song.timeToPeak = 1 - Math.exp(1 - Math.sqrt(song.debutRank / song.peakRank));

		for (monthIndex = 0, R = 0; R < Math.log(100); monthIndex += 0.25) {

			// Calculate scaled point rank.
			if (monthIndex < song.timeToPeak) {
				R = D + (P-D)*monthIndex/song.timeToPeak;
			} else {
				m0 = monthIndex - song.timeToPeak;
				R = P + 3*m0/(song.duration-song.timeToPeak);
			}

			// Store and use the value.
			song.pointRanks.push(Math.floor(Math.exp(R)*10)/10);
		}
		
	}

	// Find the four weekly ranks for the given month, and average them.
	// Note: m is a month index, but the index of pointRanks[] is a week index.
	song.rank = function(m) {
		total = 0;
		for (index = m*4; index < m*4+4; index++) {
			total += parseFloat(this.pointRanks[index]);
		}
		return total/4;
	}
	
	// Calculate score from point ranks.
	for (var index in song.pointRanks) {
		S = Math.log(song.pointRanks[index]);
		if (S < 3) { song.score += (3-S); }
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
