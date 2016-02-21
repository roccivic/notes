'use strict'

var connect = require('../../db');
var mongodb = require('mongodb');

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
      var id = req.body._id;
      if (!id) {
        res.status(400);
        res.send();
      } else {
        connect().then(function(db) {
          db.collection('notes').remove({
            _id: new mongodb.ObjectId(id)
          }, function(err, result) {
            if (err) {
              res.status(500);
            }
            db.close();
            res.send();
          });
        }, function(err) {
          res.status(500);
          res.send();
        });
      }
    }
  }
};
