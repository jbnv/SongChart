/* jshint node:true */

// Middleware for scoring and ranking.

// Scoring criteria:
// Debut rank: Higher rank (lower number) is better.
// Peak rank: Higher rank (lower number) is better.
// Duration: More is better.

exports.annualScore = function(debut,peak,months) {
	//return Math.floor(rankToScore(debut)+months*rankToScore(peak));
	return Math.log(debut)+Math.log(peak)-Math.log(months);
}

// Attempt to project a rank based on the "known" values.

exports.projectedRank = function(debut,peak,totalMonths,monthIndex) {
	if (totalMonths <= 0) return NaN;
	if (monthIndex == 0) {
		value = debut/totalMonths + peak - peak/totalMonths;
	} else {
		value = peak*Math.pow(20,monthIndex/totalMonths);
	}
	return value;
}


