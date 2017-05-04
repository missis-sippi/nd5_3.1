"use strict";

const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();
const url = 'mongodb://localhost:27017/mongoStart';
let database;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.send('test')
});

app.get('/users', function(req, res) {
  //searching in db
  database.collection('users').find().toArray(function(err, items) {
    if(err) res.sendStatus(500)
    res.json(items)
  })
});


app.get('/users/:name', function(req, res) {
  const name = req.params.name;
  //searching in db
  database.collection('users').find({Имя: `${name}`},  function(err, items) {
    if(err) res.sendStatus(500)
    res.json(items);
  })
});

app.post('/users',  function(req, res) {
  const user = {
    name : req.body.name
  }
  // add data to collection
  db.collection('users').insert(user, function(err, result) {
    if(err) res.sendStatus(500)
    res.send(`${req.body.name}: пользователь добавлен`);
  })
});

app.put('/users/:name&:nname', function(req, res) {
  const name = req.params.name;
  const nname = req.params.nname;
	//changing data
  db.collection('users').update({Имя: `${name}`}, {Имя: `${nname}`}, function(err, result) {
  	if(err) res.sendStatus(500)
  	res.send(result);
  })
})


app.use(function(req, res, next) {
  const err = new Error('ошибка: нет такой записи');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});


app.delete('/users/:name', function(req, res) {
  const name = req.params.name;
  //remove data from collection
  database.collection('users').remove({Имя : `${name}`}, function(err, result) {
    if(err) res.sendStatus(500)
    res.send(`${name}: пользователь удален`);
  })
});


MongoClient.connect(url, function(err, db) {
  if (err) console.error('Ошибка: ' + err);
  database = db;
  app.listen(3000,  function() {
  	console.log(`Listening to 3000`)
  });
});
