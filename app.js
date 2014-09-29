/*jshint node:true*/

var Express = require('express'),
	Wikidot = require('./public/js/wikidot'),
	Scoring = require('./public/js/scoring'),
	Q = require('q');

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

// Convert calendar slug to date value.
// 1950-01 = 0
function yearMonthToInteger(y,m) {
	return (parseInt(y)-1950)*12+(m?parseInt(m):0);
}

function calendarSlugToDate(slug) {
	if (/^calendar:\d\d\d\ds$/.test(slug)) {
		decade = slug.match(/\d\d\d\d/)[0];
		return { 'type':'d', 'value': yearMonthToInteger(decade) };
	} else if (/^calendar:\d\d\d\d$/.test(slug)) {
		year = slug.match(/\d\d\d\d/)[0];
		return { 'type':'y', 'value': yearMonthToInteger(year) };
	} else if (/^calendar:\d\d\d\d-\d\d$/.test(slug)) {
		numbers = slug.match(/\d+/);
		return { 'type':'m', 'value': yearMonthToInteger(numbers[0],numbers[1]) };
}


//TODO Cache the songs that have been downloaded.
//TODO var _years = [];
//TODO var _songs = {};

function downloadSongList(params) {
	songListP = {
		'site': Wikidot.site,
		'categories': ['s'],
		'tags_all': ['_'+params.year]
	};
	return Q.nfcall(Wikidot.call, 'pages.select', songListP);
}

function getPages(list) {
	var promises = list.map(function(slug) {
		return Q.nfcall(Wikidot.getPage, slug);
	});
	return Q.all(promises);
}

//TODO app.get('/scores/decade/:decade', function(request,response) {

app.get('/scores/:year', function(request,response) {

    downloadSongList(request.params)
    .then(getPages)
	.then(
		function(allResults) {
			returnValue = [];
			for (var index in allResults) {
				song = new Wikidot.WikidotPage();
				song.injectContent(allResults[index], Wikidot.ContentTypes.DataForm);
				song.score = Scoring.annualScore(parseFloat(song.debutrank),parseFloat(song.peakrank),parseInt(song.months));
				//TODO Get artist.
				returnValue.push(song);
			}
			return returnValue;
		}
    ).then(
		function(returnValue) { response.json(returnValue); }
	).done();
});

app.get('/scores/:year/:month', function(request,response) {

	month = request.params.month;

    downloadSongList(request.params)
    .then(getPages)
    .then(
		function(allResults) {
			returnValue = [];
			for (var index in allResults) {
				song = new Wikidot.WikidotPage();
				song.injectContent(allResults[index], Wikidot.ContentTypes.DataForm);
				song.projectedRank = 0;
				//TODO parse song date
				if (/^calendar:\d\d\d\d-\d\d$/.test(song.date)) {
					month0 = parseInt(song.date.split('-')[1]);
					if (month0 == month) {
						song.isDebut = true;
					}
					if (month0 <= month) {
						song.projectedRank = Scoring.projectedRank(
							parseFloat(song.debutrank),parseFloat(song.peakrank),
							parseInt(song.months), month-month0
						);
					}
				}
				if (song.projectedRank > 0) {
					//TODO Get artist.
					returnValue.push(song);
				}
			}
			return returnValue;
		}
    ).then(
		function(returnValue) { response.json(returnValue); }
	).done();
});

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