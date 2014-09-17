/* jshint node:true */

// Wikidot API library for node.js
// by Jay Bienvenu

var XmlRpc = require('xmlrpc'); // https://www.npmjs.org/package/xmlrpc

module.exports = function() {

	// Parameters.
	this.username = ''; // name of the user holding the API key
	this.apiKey = ''; 

	// next: function(error,value)
	function call(that,method,param,next) {

		clientOptions = { 
			'url': 'https://www.wikidot.com/xml-rpc-api.php',
			'basic_auth': {
				'user': that.appName,
				'pass': that.apiKey
			}
		};
		method = 'blah'; //'system.listMethods'; //TEMP
		param = null; //{"site":"playlists","categories": "score"}; //TEMP
		var client = XmlRpc.createClient(clientOptions);
		client.methodCall(method,[param],next);

	};

	// The following code creates a .<namespace>.<method> method for each namespace and method.

	var namespaces = ['categories', 'files', 'tags', 'pages', 'posts', 'users'];
	var methods = ['select', 'get_meta', 'get_one', 'save_one', 'get', 'get_me'];

	for (var i = 0; i < namespaces.length; i++) {
		namespace = namespaces[i];
		this[namespace] = {};
		for (var j = 0; j < methods.length; j++) {
			method = methods[j];
			var instance = this;
			this[namespace][method] = function(params,callback) {
				call(instance,namespace+'.'+method,params,callback);
			};

		}
	}
	

} //module.exports