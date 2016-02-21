'use strict'

var connect = require('../../db');

module.exports = {
  method: 'get',
  action: function(req, res) {
    if (!req.session.email) {
      res.status(401);
      res.send();
    } else {
      connect().then(function(db) {
        db
        .collection('notes')
        .find({}, {_id:1, title:1, modified:1})
        .toArray(function(err, items) {
          if (err) {
            res.status(500);
            res.send();
          } else {
            res.send(items);
          }
          db.close();
        });
      });
    }
  }
};
