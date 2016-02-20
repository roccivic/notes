'use strict'

var recursive = require('recursive-readdir');
var q = require('q');

function getRoute(name) {
	var route = require('.' + name);
	route.url = name;
	return route;
}

function getRoutes() {
	var deferred = q.defer();
	recursive('routes', ['routes.js'], function (err, files) {
	  if (err) {
	  	deferred.reject(err);
	  } else {
	  	deferred.resolve(files.map(function (file) {
	  		return getRoute(file.slice(6, -3));
	  	}));
	  }
	});
	return deferred.promise;
}

module.exports = {
	init: function(app) {
		var deferred = q.defer();
		getRoutes().then(function (routes) {
			routes.forEach(function (route) {
				app[route.method](
					route.url,
					route.action
				);
			});
			deferred.resolve();
		}, function (err) {
			deferred.reject(err);
		});
		return deferred.promise;
	}
};