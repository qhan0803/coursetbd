var mongo = require('mongodb').MongoClient;

var dbConnectionUrl = 'mongodb://localhost:27017/test';

var collections = {};

mongo.connect(dbConnectionUrl, function (err, db) {
  if (err) {
    console.log('Can not connect to MongoDB. Did you run it?');
    console.log(err.message);
    return;
  }

  collections.users = db.collection('users');
  collections.friends = db.collection('friends');
  collections.courses = db.collection('courses');
  collections.TA = db.collection('TA');
  collections.notification = db.collection('notification');
  collections.announcement = db.collection('announcement');
  collections.pending = db.collection('pending');
  collections.events = db.collection('events');
  
});


module.exports = collections;
