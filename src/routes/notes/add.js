'use strict'

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
      var title = req.body.title;
      var note = req.body.note;
      if (!title || !note) {
        deferred.reject(400);
      } else {
        connect().then(function(db) {
          db.collection('notes').insert({
            title: title,
            note: note,
            created: new Date(),
            createdBy: req.session.name,
            modified: new Date(),
            modifiedBy: req.session.name
          }, function(err) {
            if (err) {
              console.log(err);
              deferred.reject(500);
            } else {
              deferred.resolve();
            }
            db.close();
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
