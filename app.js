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


//TODO Refactor routing definitions out to a middleware routes.js
//TODO Routes = require('./public/js/routes');
//TODO Routes.apply(app);

// render index page
app.get('/', function(request,response) {
	res.render("index.html");
});


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

function getSongPageList() {
	console.log("Getting list of song pages.");
	Wikidot.listCategory('s',function(error,list) {
		if (error) {
			console.log('ERROR getSongPageList:',error);
			return;
		}
		for (var index in list) {
			songFullname = list[index];
			if (!/^s:\d+$/.test(songFullname)) continue;
			if (_songs[songFullname]) continue;
			setImmediate(getPage, { 'fullname':songFullname, 'callback':processSongPage });
		} // for list
	}); // Wikidot.listCategory
} // getSongPageList

// p: { 'fullname': fullname of page to get, 'callback': function to process the received content }
function getPage(p) {
	var fullname = p.fullname;  

	Wikidot.getPage(fullname, function(error,content) {
		if (error) {
			setImmediate(getPage,p); // requeue this
			return;
		}
		p.callback(content);
	}); // Wikidot.getPage
}
			
function processSongPage(content) {
	if (_songs[content.fullname]) return; // prevent duplicates

	song = new Wikidot.WikidotPage();
	song.injectContent(content, Wikidot.ContentTypes.DataForm);
	Scoring.score(song);
	//IDEA Push calculated song data back into Wikidot?
	
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
			for (monthIndex = 0; monthIndex < song.duration; monthIndex++) {
				thisSong = _.clone(song);
				if (monthIndex == 0) thisSong.isDebut = true;
				thisSong.monthIndex = monthIndex;
				thisSong.projectedRank = thisSong.rank(monthIndex);
				_calendar.put(thisSong).byMonth(year,month0+monthIndex);
				//IDEA Push song ratings back into Wikidot?
			}
		} 
	} //if
}

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

app.get('/songs', function(request,response) {

	console.log('/songs',request.query);
	
	// Get post parameters.
	var decade = request.query.decade;
	var year   = request.query.year;
	var month  = request.query.month;
	var refresh = request.query.refresh; // can be anything
	var top    = request.query.top; // default: all
	
	//TODO Generalize and add support for multiple fields.
	function orderFn(song) {
		field = request.query.sortField ? request.query.sortField : "-score";
		sign = 1;
		if (field.substr(0,1) == "-") {
			field = field.substr(1);
			sign = -1;
		}
		return sign*song[field];
	}

	if (refresh) {
		 q = Q.fcall(getSongPageList);
	} else {
		q = Q.fcall(function() { return; } );
	}
	
	q.then(function() {
	
		content = {};
		
		if (decade) {
			content = _calendar.get().byDecade();
		} else if (year) {
			if (month) {
				content = _calendar.get().byMonth(year,month);
			} else {
				content = _calendar.get().byYear(year);
			}
		}

		if (content) {
			content = _.sortBy(content,orderFn);
			for (var index in content) {
				song = content[index];
				song.rank = parseInt(index)+1;
			}
			if (top) {
				content = _.first(content,top);
			}
			console.log('Returning songs.',content.length);
		} else {
			console.log('No songs to return!');
		}

		response.json(content);
	})
	
	.catch(function (error) {
		console.log('ERROR',error);
		response.json({}); //TODO Make this more robust.
	})
	
	.done();
});

//TODO /artists/top/:count (also apply this pattern to song scores)
app.get('/artists', function(request,response) {
	console.log('/artists');
	returnArray = _.map(
		_artists,
		function (songArray, artistSlug) {
			return {
				slug: artistSlug,
				songCount: songArray.length,
				score: Scoring.songCollectionScore(songArray)
			};
		}
	); // _.map
	response.json(returnArray);
});

function getPages(list) {
	var promises = list.map(function(slug) {
		return Q.nfcall(Wikidot.getPage, slug);
	});
	return Q.all(promises);
}

app.get('/page/:fullname', function(request,response) {

	console.log('/page',request.params.fullname);
	
    getPages([request.params.fullname])
    .then(
		function(returnValue) { response.json(returnValue); }
	)
	.fail(function (error) {
		console.log('/page',request.params.fullname,'ERROR',error);
	})
	.done();
	
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

// Start server
// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
app.listen(port, host);

// Start application loops.
setImmediate(getSongPageList);
// TODO Make the refresh occur on demand--when the Refresh button is pressed in the application.

// All done.
console.log('Application setup complete.');
// ================================================================================