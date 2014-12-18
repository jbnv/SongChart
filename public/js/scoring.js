/* jshint node:true */

// Middleware for scoring and ranking.

var _ = require('underscore');

// Scoring criteria:
// Debut rank (D): Higher rank (lower number) is better.
// Peak rank (P): Higher rank (lower number) is better.
// Duration (M): More is better.

exports.score = function(song,scoringOptions) {

	if (!scoringOptions) { scoringOptions = {}; }
	song.pointRanks = [];

	// Now we always assume that .ranks, if populated, is proper JSON
	// in the following format: [ debutRank, ascentRank{0,}, peakRank, ...]
	// Ranks are projected geometrically from the final two ranks.

	if (!song.ranks) return;
	try {
		rawRanks = JSON.parse(song.ranks);
	} catch (ex) {
		console.log('Song %s (%s) has an invalid ranks field \'%s\'.',song.fullname,song.title,song.ranks);
		return;
	}
	
	// Look for embedded arrays.
	// [ number ]: Hold at the previous rank for <number> weeks.
	// [ increment, number ]: Apply <increment> to the rank for <number> weeks.
	previousRank = NaN;
	for (var index in rawRanks) {
		currentRank = rawRanks[index];
		if ((index = 0) || (isNaN(previousRank))) { // these should always be both true or both false
			song.pointRanks.push(currentRank);
			previousRank = currentRank;
		} else if (_.isArray(currentRank)) {
			switch (currentRank.length()) {
				case 1: // [ count ]
					count = currentRank[0];
					for (i = 0; i < count; i++) {
						song.pointRanks.push(previousRank);						
					}
					break;
				case 2: // [ increment, count ]
					increment = currentRank[0];
					count = currentRank[1];
					rank = previousRank;
					for (i = 0; i < count; i++) {
						rank += increment;
						song.pointRanks.push(rank);						
					}
					previousRank = rank;
					break;
				// anything else: do nothing (invalid)
			}
		} else {
			song.pointRanks.push(currentRank);
			previousRank = currentRank;
		}
	}

	song.debutRank = parseFloat(song.pointRanks[0]);
	song.peakRank = parseFloat(_.min(song.pointRanks));
	
	function round00(n) {
		return Math.round(parseFloat(n)*100)/100;
	}
	
	if (!scoringOptions.noProjectOut) {
		rank0 = parseFloat(song.pointRanks[song.pointRanks.length-1]);
		rank1 = parseFloat(song.pointRanks[song.pointRanks.length-2]);
		scale = rank0/rank1;
		if (scale < 1.25) { scale = 1.25; } // prevent slow descents
		
		while (!((rank0 > 50) && (song.pointRanks.length % 4 == 0))) {
			rank0 *= scale;
			song.pointRanks.push(round00(rank0));
		}
	}
	
	song.duration = song.pointRanks.length/4;

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
	song.score = 0;
	for (var index in song.pointRanks) {
		S = Math.log(song.pointRanks[index]);
		if (S < 3) { song.score += (3-S); }
	}
	song.score = round00(song.score);
		
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
