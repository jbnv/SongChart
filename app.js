/*jshint node:true*/

var Express = require('express'),
	Wikidot = require('./public/js/wikidot'),
	Scoring = require('./public/js/scoring'),
	Calendar = require('./public/js/calendar'),
	Timespan = require('./public/js/timespan'),
	Q = require('q'),
	_ = require('underscore');

// setup middleware
var app = Express();
app.use(Express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views
app.engine('html', require('ejs').renderFile);




// render index page
app.get('/', function(request,response) {
	res.render("index.html");
});

// New idea: Preload the score data at app startup.
// Then load associated data on demand.

Wikidot.username = 'jbnv';
Wikidot.apiKey = 'w8nk4WBpinduE75nrgbYUFObIJDkNLXs';
Wikidot.site = 'playlists';

var deferred = Q.defer();

// Utility functions.


function pushSong(pArray,pSlug,pSong) {
	if (pArray[pSlug]) {
		pArray[pSlug].push(pSong);
	} else {
		pArray[pSlug] = [pSong];
	}
}

// Cache the songs that have been downloaded.
var _songs = {};
var _calendar = new Calendar();
var _artists = {};

songListP = { 'site': Wikidot.site, 'categories': ['s'] };
Q.nfcall(Wikidot.call, 'pages.select', songListP)
.then(
	function(list) {
		console.log("Getting pages.");
		var promises = list.map(function(slug) {
			return Q.nfcall(Wikidot.getPage, slug);
		});
		return Q.all(promises);
	}
).then(
	function(allResults) {
		console.log("Transforming song data.");
		returnValue = [];
		for (var index in allResults) {
			song = new Wikidot.WikidotPage();
			song.injectContent(allResults[index], Wikidot.ContentTypes.DataForm);

			debutRank = parseFloat(song.debutrank);
			peakRank  = parseFloat(song.peakrank);
			duration  = parseInt(song.months);
			
			song.score = Scoring.annualScore(debutRank,peakRank,duration);
			
			_songs[song.fullname] = song;
			pushSong(_artists,song.artist,song);
			
			// File the song in the appropriate calendar entries.
			slug = song.date;
			timespan = new Timespan(slug);
			decade = timespan.decade;
			year   = timespan.year;
			month0 = timespan.month;
			if (decade) {
				_calendar.put(song).byDecade(decade);
			} else if (year) {
				_calendar.put(song).byYear(year);
				if (year && month0) {
					// In this case, the song will be filed multiple times --
					// once for each month during its duration.
					for (monthIndex = 0; monthIndex < duration; monthIndex++) {
						thisSong = _.clone(song);
						thisSong.projectedRank = Scoring.projectedRank(debutRank,peakRank,duration,monthIndex);
						_calendar.put(thisSong).byMonth(year,month0+monthIndex);
					}
				} 
			} //if
		} //for
	} //function
).then(
	function() {
/*		console.log('Counts:',
			"_songs",Object.keys(_songs).length,
			"_calendar",Object.keys(_calendar).length,
			"_artists",Object.keys(_artists).length
		);
*/	}
).done();

app.get('/scores/artist/:slug', function(request,response) {
	response.json(_artists[request.params.slug]);
});

// Rank filter: All songs with projected peak at or above the given rank.
rankFn = function(someRank) { return function(song) { return parseFloat(song.peakrank) <= parseFloat(someRank); }; };
app.get('/scores/rank/:rank', function(request,response) {
	subset = _.filter(_songs, rankFn(request.params.rank));
	response.json(subset);
});

// Duration filter: All songs with projected duration at or above a given number.
durationFn = function(someAmount) { return function(song) { return parseFloat(song.months) >= parseFloat(someAmount); }; };
app.get('/scores/duration/:duration', function(request,response) {
	subset = _.filter(_songs, durationFn(request.params.duration));
	response.json(subset);
});


app.get('/scores/decade/:decade', function(request,response) {
	response.json(_calendar.get().byDecade(request.params.decade));
});

app.get('/scores/:year', function(request,response) {
	response.json(_calendar.get().byYear(request.params.year));
});

app.get('/scores/:year/:month', function(request,response) {
	response.json(_calendar.get().byMonth(request.params.year,request.params.month));
});

function getPages(list) {
	var promises = list.map(function(slug) {
		return Q.nfcall(Wikidot.getPage, slug);
	});
	return Q.all(promises);
}

app.get('/page/:fullname', function(request,response) {

    getPages([request.params.fullname])
    .then(
		function(returnValue) { response.json(returnValue); }
	).done();
	
});

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('App started on port ' + port);