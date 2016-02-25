'use strict'

var createHash = require('sha.js');
var srs = require('secure-random-string');
var connect = require('../../db');

module.exports = {
  method: 'post',
  action: function(req, res) {
    if (!req.session.email) {
      res.status(401);
      res.send();
    } else if (!req.body) {
      res.status(400);
      res.send();
    } else {
      var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;
      if (typeof name !== 'string'
        || typeof email !== 'string'
        || typeof password !== 'string'
        || password.length < 12
      ) {
        res.status(400);
        res.send();
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
          }, function(err, result) {
            if (err) {
              res.status(500);
            }
            db.close();
            res.send();
          });
        }, function (err) {
          res.status(500);
          res.send();
        });
      }
    }
  }
};
