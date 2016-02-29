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
  recursive('src/routes', ['routes.js'], function (err, files) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(files.map(function (file) {
        return getRoute(file.slice(10, -3));
      }));
    }
  });
  return deferred.promise;
}

function getAction(route) {
  return function(req, res) {
    route.action(req, res)
    .then(function(response) {
      res.send(response);
    }, function(code) {
      res.status(code);
      res.send();
    });
  };
}

module.exports = {
  init: function(app) {
    var deferred = q.defer();
    getRoutes().then(function (routes) {
      routes.forEach(function (route) {
        app[route.method](
          route.url,
          getAction(route)
        );
      });
      deferred.resolve();
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
};
