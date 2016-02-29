'use strict'

var createHash = require('sha.js');
var q = require('q');
var connect = require('../../db');

module.exports = {
  method: 'post',
  action: function(req, res) {
    var deferred = q.defer();
    if (!req.body) {
      deferred.reject(400);
    } else {
      var email = req.body.email;
      var password = req.body.password;
      if (!email || !password) {
        deferred.reject(401);
      } else {
        connect().then(function (db) {
          db.collection('users').find({email:email}).toArray(function(err, items) {
            if (err) {
              console.log(err);
              deferred.reject(500);
            } else {
              var user = items.pop();
              if (!user) {
                deferred.reject(401);
              } else {
                var dbHash = user.hash;
                var sha256 = createHash('sha256');
                var userHash = sha256.update(user.salt+password, 'utf8').digest('hex');
                if (dbHash !== userHash) {
                  deferred.reject(401);
                } else {
                  req.session.name = user.name;
                  req.session.email = email;
                  deferred.resolve(200);
                }
              }
            }
            db.close();
          });
        }, function (err) {
          console.log(err);
          deferred.reject(500);
        });
      }
    }
    return deferred.promise;
  }
};
