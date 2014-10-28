/* jshint node:true */

// Middleware for scoring and ranking.

var _ = require('underscore');

// Scoring criteria:
// Debut rank (D): Higher rank (lower number) is better.
// Peak rank (P): Higher rank (lower number) is better.
// Duration (M): More is better.

//IDEA: Have 'ranks' optionally be an object { 'debutrank','peakrank','duration' }.

exports.score = function(song) {

	// Now we always assume that .ranks is populated.
	// in the following format: [ debutRank, ascentRank{0,}, peakRank, ...]
	// Ranks are projected geometrically from the finakl two ranks.

	if (!song.ranks) return;
	song.pointRanks = JSON.parse(song.ranks);
	
	song.debutRank = parseFloat(song.pointRanks[0]);
	song.peakRank = parseFloat(_.min(song.pointRanks));
		
	rank0 = parseFloat(song.pointRanks[song.pointRanks.length-1]);
	rank1 = parseFloat(song.pointRanks[song.pointRanks.length-2]);
	scale = rank0/rank1;
	
	while ((rank0 < 100) && (scale > 1.1)) {
		rank0 *= scale;
		song.pointRanks.push(rank0);
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
