/*jshint node:true*/

var Express = require('express')/*,
	Wikidot = require('./lib/wikidot');*/
var XmlRpc = require('xmlrpc'); //TEMP
var Promises = require('promises');

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

// Data access pages.

function callSite(method,parameters,callback) {
 
	var clientOptions = {
		host: 'www.wikidot.com',
		port: 443,
		path: '/xml-rpc-api.php',
		basic_auth: {
			user: 'jbnv',
			pass: 'w8nk4WBpinduE75nrgbYUFObIJDkNLXs'
		}
	};
	 
	var client = XmlRpc.createSecureClient(clientOptions);
	client.methodCall(method, [parameters], callback);
}
	
//TODO app.get('/scores/decade/:decade', function(request,response) {

app.get('/scores/:year', function(request,response) {
	year = request.params.year;
	
	slug = "calendar:"+year
	
	// Get score data.
	method = 'pages.select';
	param = {
		'site': 'playlists',
		'categories': ['score'],
		'_date' : slug
	};
	callSite(method,param,response.json);
	
});

app.get('/scores/:year/:month', function(request,response) {
	year = request.params.year;
	month = request.params.month;

	slug = "calendar:"+year+"-"+("00"+scoreObject.month).substr(-2,2);
	
	// Get score data.
	method = 'pages.select';
	param = {
		'site': 'playlists',
		'categories': ['score'],
		'_date' : slug
	};
	callSite(method,param, function(error,value) {
		console.log(error);
		response.json(value);
	});
	
});

app.get('/page/:slug', function(request,response) {
	method = 'pages.get_one';
	param = {
		'site': 'playlists',
		'page': request.params.slug
	};
	console.log('/page/'+request.params.slug);
	callSite(method,param, function(error,value) {
		console.log('error',error);
		response.json(value);
	});
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

