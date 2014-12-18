/* jshint node:true */

// Middleware for testing and code validation.

exports.run = function() {

	var
		_ = require('underscore'),
		J = require('../lib/jasmine'),
		Scoring = require('./scoring')
	;
	
	J.describe("Scoring", function(){

		song = { fullname: '', title: 'Jasmine test' };
		scoringOptions = { noProjectOut: true };

		// Validate hold command.
		
		J.it ('should transform [<count>] into a hold for <count>+1 weeks', function(){
			song.ranks = "[20,1,[3]]";
			console.log(song.ranks);
			Scoring.score(song,scoringOptions);
			J.expect(song.projectedRanks).toEqual([20,1,1,1,1]);
		});

		J.it ('should ignore [0]', function(){
			song.ranks = JSON.stringify([20,1,[0]]);
			console.log(song.ranks);
			Scoring.score(song,scoringOptions);
			J.expect(song.projectedRanks).toEqual([20,1]);
		});

		J.it ('should ignore [-<count>]', function(){
			song.ranks = JSON.stringify([20,1,[-1]]);
			console.log(song.ranks);
			Scoring.score(song,scoringOptions);
			J.expect(song.projectedRanks).toEqual([20,1]);
		});
		
		// Validate increment command.

		J.it ('should transform [<increment>,<count>] into an increment over the following <count> weeks', function(){
			song.ranks = "[20,1,[0.2,3]]";
			console.log(song.ranks);
			Scoring.score(song,scoringOptions);
			J.expect(song.projectedRanks).toEqual([20,1,1.2,1.4,1.6]);
		});

		J.it ('should ignore [<increment>,0]', function(){
			song.ranks = "[20,1,[0.2,0]]";
			console.log(song.ranks);
			Scoring.score(song,scoringOptions);
			J.expect(song.projectedRanks).toEqual([20,1]);
		});

		J.it ('should ignore [<increment>,-<count>]', function(){
			song.ranks = '[20,1,[0.2,-1]]';
			console.log(song.ranks);
			Scoring.score(song,scoringOptions);
			J.expect(song.projectedRanks).toEqual([20,1]);
		});
	
	}); // Scoring
		
	console.log("Tests defined; now run them.");
	var jEnv = J.jasmine.getEnv();
	var reporter = new J.jasmine.JsApiReporter();
	jEnv.updateInterval = 1000;
	jEnv.addReporter(reporter);
	jEnv.execute();
	console.log('Tests complete.',reporter);
	return reporter.results(); // return results to caller

}