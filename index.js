"use strict";
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/newdb';


MongoClient.connect(url, function(err, db) {
  if (err)  console.error(`Ошибка подключения: ${err}`);

  console.log(`Соединение для ${url}`);

	var collection = db.collection('users');

	var user1 = {name: 'a', score: 10};
	var user2 = {name: 'b', score: 11};
	var user3 = {name: 'b', score: 12};

	collection.insert([user1, user2, user3], function(err, result) {
		if (err) console.log(err);
		else {
			collection.find({score: 10}.toArray(function(err, res) {
				if (err) console.log(err);
				else if (res.length) {
					console.log(`Найдены: ${res}`);
				}
				else {
					console.log(`Нет таких документов`);
				}
			});

			collection.update({score: {$gte: 11}}, {'$set': {name: 'abc'}}, {multi: true}, function(err, result) {
				if (err) console.log(err);
				else {
					collection.find({}, {_id: 0}).toArray(function(err, res) {
						if (err) console.log(err);
						else if (res.length) {
							console.log(`Измененный список: ${res}`);
							collection.remove({name: 'abc'});
						}
						else {
							console.log(`Нет таких документов`);
						}
						
						collection.remove();
						db.close();
					});
				}
			});
		}
	});
});
