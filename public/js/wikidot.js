/* jshint node:true */

// Wikidot API library for node.js
// by Jay Bienvenu

var XmlRpc = require('xmlrpc');  // https://www.npmjs.org/package/xmlrpc

exports.username = ''; // name of the user holding the API key

exports.apiKey = '';

exports.site = ''; // optional

// next: function(error,value)
exports.call = function(method,parameters,next) {

	clientOptions = { 
		'host': 'www.wikidot.com',
		'port': 443,
		'path': '/xml-rpc-api.php',
		'basic_auth': {
			'user': exports.username,
			'pass': exports.apiKey
		}
	};
	var client = XmlRpc.createSecureClient(clientOptions);
	client.methodCall(method,[parameters],next);

};

// The following code creates a .<namespace>.<method> method for each namespace and method
// defined on http://www.wikidot.com/doc:api
var namespaces = ['categories', 'files', 'tags', 'pages', 'posts', 'users'];
var methods = [
	'categories.select',
	'files.select','files.get_meta','files.get_one','files.save_one',
	'tags.select',
	'pages.select','pages.get_meta','pages.get_one','pages.save_one',
	'posts.select','posts.get',
	'users.get_me'
];

for (var i = 0; i < namespaces.length; i++) {
	namespace = namespaces[i];
	exports[namespace] = {};
}

for (var j = 0; j < methods.length; j++) {
	methodArray = methods[j].split('.');
	namespace = methodArray[0];
	method = methodArray[1];
	exports[namespace][method] = function(params,callback) {
		exports.call(methods[j],params,callback);
	};
}
	
// Some convenience functions.
// For each function, callback: function(error,value)

exports.listCategory = function(category,callback) {
	exports.call('pages.select',{
		'site': exports.site,
		'categories': [category]		
	}, callback);
};

exports.getPage = function(fullname,callback) {
	exports.call('pages.get_one',{
		'site': exports.site,
		'page': fullname
	}, callback);
};