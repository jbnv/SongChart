/*jshint node:true*/

var Express = require('express'),
	Wikidot = require('./public/js/wikidot');

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

//TODO app.get('/scores/decade/:decade', function(request,response) {

app.get('/scores/:year', function(request,response) {
	year = request.params.year;
	
	parameters = {
		'site': Wikidot.site,
		'categories': ['s'],
		'tags_all': ['_'+ year]
	};
	console.log('parameters',parameters);
	
	callback = function(error,value) {
		console.log('/scores/:year error',error);
		response.json(value);
		//TODO Process the year data before sending to the client.
	}
	
	Wikidot.call('pages.select',parameters,callback);
	
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

