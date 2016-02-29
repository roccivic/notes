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
      var title = req.body.title;
      var note = req.body.note;
      var modified = req.body.modified;
      if (!id || !title || !note) {
        deferred.reject(400);
      } else {
        connect().then(function(db) {
          db.collection('notes').find({
            _id: new mongodb.ObjectId(id)
          }).toArray(function(err, items) {
            if (err) {
              console.log(err);
              deferred.reject(500);
            } else if (!items.length) {
              deferred.reject(404);
            } else if (items[0].modified > new Date(modified)) {
              deferred.reject(409);
            } else {
              var current = items[0];
              delete current.history;
              db.collection('notes').updateOne({
                _id: new mongodb.ObjectId(id)
              }, {
                '$set': {
                  title: title,
                  note: note,
                  modified: new Date(),
                  modifiedBy: req.session.name
                },
                '$push': {
                  history: current
                }
              }, function(err, result) {
                if (err) {
                  console.log(err);
                  deferred.reject(500);
                } else {
                  db.collection('notes').find({
                    _id: new mongodb.ObjectId(id)
                  }).toArray(function(err, items) {
                    if (err) {
                      console.log(err);
                      deferred.reject(500);
                    } else if (!items.length) {
                      deferred.reject(404);
                    } else {
                      deferred.resolve(items.pop());
                    }
                    db.close();
                  });
                }
              });
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
