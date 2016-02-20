'use strict'

var createHash = require('sha.js');
var connect = require('../../db');

module.exports = {
  method: 'post',
  action: function(req, res) {
    if (!req.body) {
      res.status(400);
      res.send();
    } else {
      var email = req.body.email;
      var password = req.body.password;
      if (!email || !password) {
        res.status(401);
        res.send();
      } else {
        connect().then(function (db) {
          db.collection('users').find({email:email}).toArray(function(err, items) {
            if (err) {
              res.status(500);
            } else {
              var user = items.pop();
              if (!user) {
                res.status(401);
              } else {
                var dbHash = user.hash;
                var sha256 = createHash('sha256');
                var userHash = sha256.update(user.salt+password, 'utf8').digest('hex');
                if (dbHash !== userHash) {
                  res.status(401);
                } else {
                  req.session.email = email;
                  res.status(200);
                }
              }
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
