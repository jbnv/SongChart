var Util = require('util'),
	Wikidot = require('./wikidot'),
	Scoring = require('./scoring'),
	Calendar = require('./calendar'),
	Timespan = require('./timespan'),
	Q = require('q'),
	_ = require('underscore');

	var html = '<p>'+(new Date()).toGMTString()+'</p>';

function processSongPage(content) {

	var message = "";

	try {
		song = new Wikidot.WikidotPage();
		song.injectContent(content, Wikidot.ContentTypes.DataForm);

		// Delete unneeded elements.
		delete song.content;
		delete song.tags;
		delete song.parent_fullname;
		delete song.genre;
		delete song.changeProposals;
		delete song.contentType;

		Scoring.score(song);
		
		// File the song in the appropriate calendar entries.
		debutDateFullname = song.date;
		if (debutDateFullname) {
		
			timespan = new Timespan(debutDateFullname);
			decade = timespan.decade;
			year   = timespan.year;
			month0 = timespan.month;
			if (decade) {
				_calendar.put(song).byDecade(decade);
			} else if (year) {
				_calendar.put(song).byYear(year);
				//! Get decade and year views working again, then do months.
				// if (year && month0) {
					// // In this case, the song will be filed multiple times --
					// // once for each month during its duration.
					// for (monthIndex = 0; monthIndex < song.duration; monthIndex++) {
						// thisSong = _.clone(song);
						// if (monthIndex == 0) thisSong.isDebut = true;
						// thisSong.monthIndex = monthIndex;
						// thisSong.projectedRank = thisSong.rank(monthIndex);
						// _calendar.put(thisSong).byMonth(year,month0+monthIndex);
					// }
				// } 
			}
		} //if song has debut date
	} catch(e) {
		message += "ERROR "+JSON.stringify(e);
	}
	console.log(song.fullname,process.memoryUsage());
	return message;
}

function calendarPromise(fullname,dataFn) {

	// Either return the data given by the Calendar so that we can look at it,
	// or return a message indicating that there was no data to return.
	return Q.fcall(function() {
		var data = dataFn();
		var outboundPromise = {};
		
		if (data.constructor === Array) {
		
			if (data.length > 0) {
		
				content = JSON.stringify(data);
								
				param = {
					'site': Wikidot.site,
					'page': 'data:'+fullname,
					'content': content,
					'revision_comment': 'Store calculated song data for this period.'
				};
				
				outboundPromise =  
					Q.nfcall(Wikidot.call,'pages.save_one',param)
					.then(function(){ return [fullname,"Saved data for "+data.length+" songs."]; })
				;
			} else { 
				outboundPromise =  Q.fcall(function(){ return [fullname,"No data."]; })
			}
				
		} else { 
			// Return what we have to the caller.
			outboundPromise = Q.fcall(function(){ return [fullname,JSON.stringify(data)]; })
		}
		
		return outboundPromise;
		
	});
	
}

function processCalendarData() {
	html += "<p>[359] Generating calendar promises.</p>";
	var promises = [];
	
	// Only return certain song data. Don't include that which we can get from the page itself.
	// Produce an array to reduce the amount of text stored.
	function extractSummary(song) {
		return [
			song.fullname,
			song.title,
			song.artist,
			Math.round(parseFloat(song.score)*100)/100,
			song.debutRank,
			song.peakRank,
			song.duration
		];
	}
	
	//TODO For months, return fullname, total score, month rank and ranks for the four weeks. 
	
	for (var decade = 1970; decade < 2020; decade += 10) {
	
		fullname = 'calendar:'+decade+'s';
		promise = (function(pDecade,pFullName) {
			return new calendarPromise(pFullName, function() { 
				rawData = _calendar.get().byDecade(pDecade);
				return rawData.map(extractSummary);
			})
		})(decade,fullname);
		promises.push(promise);
		
		for (var y = 0; y < 10; y++) {
			year = decade+y;
			fullname = 'calendar:'+year;
			promise = (function(pYear,pFullName) {
				return new calendarPromise(pFullName, function() { 
					rawData =   _calendar.get().byYear(pYear);
					return rawData.map(extractSummary);
				});
			})(year,fullname);
			promises.push(promise);
		} // for year
		
		//TODO: for (m == 1; m <= 12; m++)
	} // for decade		

	html += "<p>[382] Generated "+promises.length+" calendar promises.</p>"; 		
	return 
		Q.all(promises)
		.then(function(dataArray) {
			html += "<p>[385] After calendar promises run: result = "+JSON.stringify(dataArray)+"</p>";	
			if (dataArray) {
				html += "<ul>";
				dataArray.forEach(function (resultArray) {
					html += "<li>"+resultArray[0]+": "+resultArray[1]+"</li>";
				});
				html += "</ul>";
			}
		})
	;
}

module.exports = function(request,response) {

	console.log("[Recalculate] BEGIN");

	Q.nfcall(Wikidot.listCategory,'s')
	.then(function(completePageList) {
		html += "<p>[413] Received "+completePageList.length+" song pages; generating song promises.</p>";
		filteredPageList = completePageList
			.filter(function(fullname) { return /^s:\d+$/.test(fullname);}) // only do numbered pages
			.slice(0,700); //TEMP eliminate, but apparently throwing an error (400 good)
		promiseList = filteredPageList.map(function(slug) {
			p =
				Q.nfcall(Wikidot.getPage, slug)
				.then(processSongPage)
				.then(function(message) { if (message) { html += "<p>[451]"+message+"</p>"; }})
			;
			return p;
		});
		html += "<p>[417] Generated "+promiseList.length+" song promises.</p>"; 
		return Q.all(promiseList);
	})
	.then(processCalendarData)
	.catch(function(error) {
		html += "<p>[489] ERROR "+JSON.stringify(error)+"</p>";
	})
	.done(function() {
		html += "<p>[499] Reached done().</p>";
		response.send(html);
	});

	console.log("[Recalculate] END");

}