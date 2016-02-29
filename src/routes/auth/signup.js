'use strict'

var createHash = require('sha.js');
var q = require('q');
var srs = require('secure-random-string');
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
      var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;
      if (typeof name !== 'string'
        || typeof email !== 'string'
        || typeof password !== 'string'
        || password.length < 12
      ) {
        deferred.reject(400);
      } else {
        connect().then(function (db) {
          var sha256 = createHash('sha256');
          var salt = srs({
            length: 64
          });
          var hash = sha256.update(salt+password, 'utf8').digest('hex');
          db.collection('users').insert({
            name: name,
            email:email,
            salt: salt,
            hash: hash,
            created: new Date(),
            createdBy: req.session.name
          }, function(err) {
            if (err) {
              console.log(err);
              deferred.reject(500);
            } else {
              deferred.resolve();
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
