'use strict'

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/notes';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var MongoClient = require('mongodb').MongoClient;

module.exports = function() {
  var deferred = q.defer();
  MongoClient.connect('mongodb://'+connection_string, function(err, db) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(db);
    }
    return deferred.promise;
  });
};
