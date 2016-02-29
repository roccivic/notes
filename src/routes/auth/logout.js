'use strict'

var q = require('q');

module.exports = {
  method: 'post',
  action: function(req, res) {
    var deferred = q.defer();
    req.session.email = undefined;
    deferred.resolve();
    return deferred.promise;
  }
};
