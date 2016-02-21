'use strict'

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
      var title = req.body.title;
      var note = req.body.note;
      if (!title || !note) {
        res.status(400);
        res.send();
      } else {
        connect().then(function(db) {
          db.collection('notes').insert({
            title: title,
            note: note,
            created: new Date(),
            createdBy: req.session.email,
            modified: new Date(),
            modifiedBy: req.session.email
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
