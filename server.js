var fs = require('fs');
var path = require('path');
var assert = require('assert');
var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var port = process.env.PORT || 3000;

var mongoClient = require('mongodb').MongoClient;
var mongoURL = process.env.MONGO_URL || 'mongodb://cs290_frederij:apple@classmongo.engr.oregonstate.edu/cs290_frederij';
var mongoConnection;

var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: [
    'views/partials/'
  ]
});

mongoClient.connect(mongoURL, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  mongoConnection = db;

  app.listen(port, function () {
    console.log("== Server is listening on port", port);
  });
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  mongoConnection.collection('babies').find({}).toArray(function(err, docs) {
    if (err) {
      res.status(500).send('MongoDB failure!');
    }

    console.log("Found " + docs.length + " babies.");
    res.status(200).render('index', {
      title: "Tiffany's Lops",
      posts: docs
    });
  });
});

app.get('/bunny/:bunnyid', function (req, res, next) {
  mongoConnection.collection('babies').find({}).toArray(function(err, docs) {
    if (err) {
      res.status(500).content('MongoDB failure!');
    }

    if (!(docs[req.params.bunnyid])) {
      next();
      return;
    }

    console.log("Found " + docs.length + " babies.");
    res.status(200).render('index', {
      title: "Tiffany's Lops",
      posts: [docs[req.params.bunnyid]]
    });
  });
});

app.get('/faq/', function (req, res) {
  res.status(200).render('faq', {
    title: 'Bunny FAQ'
  });
});

app.get('/contact/', function (req, res) {
  res.status(200).render('contact', {
    title: 'Bunny Contact'
  });
});

app.get('/blog/', function (req, res, next) {
  mongoConnection.collection('blogPosts').find({}).sort({$natural: -1}).toArray(function(err, docs) {
    if (err) {
      res.status(500).send('MongoDB failure!');
    }

    console.log("Found " + docs.length + " blog posts.");
    res.status(200).render('blog', {
      title: 'Bunny Blog',
      bloggers: docs
    });
  });
});

app.post('/blog', function(req, res){
  
    if(req.body && req.body.blogTitle && req.body.blogBody && req.body.blogDate){
      console.log("== Client added a blog post containing:");
      console.log("== title:", req.body.blogTitle);
      console.log("== info:", req.body.blogBody);
      console.log("== date:", req.body.blogDate);
  
      var blogCollection = mongoConnection.collection('blogPosts');
    
      blogCollection.insertOne(
        {date: req.body.blogDate,
        info: req.body.blogBody,
        postTitle: req.body.blogTitle
        },
        function(err, result){
          if(err){
            res.status(500).send("Error");
          }
          else{
            res.status(200).send("Success");
          }
        }
      );
    } 
    else{
    res.status(400).send("Request body needs all fields");
    }
  });


app.get('*', function (req, res) {
  res.status(404).render('404', {
    title: "Flop not found!"
  });
});
