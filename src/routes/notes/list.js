'use strict'

var q = require('q');
var connect = require('../../db');

module.exports = {
  method: 'get',
  action: function(req, res) {
    var deferred = q.defer();
    if (!req.session.email) {
      deferred.reject(401);
    } else {
      connect().then(function(db) {
        db
        .collection('notes')
        .find({}, {_id:1, title:1, modified:1})
        .toArray(function(err, items) {
          if (err) {
            console.log(err);
            deferred.reject(500);
          } else {
            deferred.resolve(items);
          }
          db.close();
        });
      }, function(err) {
        console.log(err);
        deferred.reject(500);
      });
    }
    return deferred.promise;
  }
};
