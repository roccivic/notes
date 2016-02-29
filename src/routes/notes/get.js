'use strict'

var mongodb = require('mongodb');
var q = require('q');
var connect = require('../../db');

module.exports = {
  method: 'post',
  action: function(req, res) {
    var deferred = q.defer();
    if (!req.session.email) {
      deferred.reject(401);
    } else if (!req.body) {
      deferred.reject(400);
    } else {
      var id = req.body._id;
      if (!id) {
        deferred.reject(400);
      } else {
        connect().then(function(db) {
          db.collection('notes').find({
            _id: new mongodb.ObjectId(id)
          }).toArray(function(err, items) {
            db.close();
            if (err) {
              console.log(err);
              deferred.reject(500);
            } else if (!items.length) {
              deferred.reject(404);
            } else {
              deferred.resolve(items.pop());
            }
          });
        }, function(err) {
          console.log(err);
          deferred.reject(500);
        });
      }
    }
    return deferred.promise;
  }
};
