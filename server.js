var fs = require('fs');
var path = require('path');
var assert = require('assert');
var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var ObjectId = require('mongodb').ObjectID;
var port = process.env.PORT || 3000;
var mongodb = require('mongodb');
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

app.delete('/breeder/:bunnyid', function(req, res){
    console.log(req.body.id)
    if(req.body && req.body.id){
      var blogCollection = mongoConnection.collection('breeders');

      blogCollection.deleteOne(
        { "_id" : ObjectId(req.body.id) },
        function(err, result){
          if(err){
            res.status(500).send("Error");
          }
          else{
            res.status(200).send("Success");
          }
      });
    }
    else{
      res.status(400).send("Something went wrong");
    }
  });

app.delete('/bunny/:bunnyid', function(req, res){
    console.log(req.body.id)
    if(req.body && req.body.id){
      var blogCollection = mongoConnection.collection('babies');

      blogCollection.deleteOne(
        { "_id" : ObjectId(req.body.id) },
        function(err, result){
          if(err){
            res.status(500).send("Error");
          }
          else{
            res.status(200).send("Success");
          }
      });
    }
    else{
      res.status(400).send("Something went wrong");
    }
  });

app.get('/bunny/:bunnyid', function (req, res, next) {
    mongoConnection.collection('babies').find({_id: mongodb.ObjectID(req.params.bunnyid)}).toArray(function(err, docs) {
    if (err) {
      res.status(500).content('MongoDB failure!');
    }

    if (!(docs[0])) {
      next();
      return;
    }
	var fatherName = null;
	var motherName = null;
	mongoConnection.collection('breeders').find({_id: mongodb.ObjectID((docs[0].father != '' ? docs[0].father : '111111111111111111111111'))}).toArray(function(err, father){
			if(father[0]){
				fatherName = father[0].name;
			}
			mongoConnection.collection('breeders').find({_id: mongodb.ObjectID((docs[0].mother != '' ? docs[0].mother : '111111111111111111111111'))}).toArray(function(err, mother){
				if(mother[0]){
					motherName = mother[0].name;
				}
   				 console.log("Found " + docs.length + " babies.");
   				 res.status(200).render('bunnyDets', {
      			title: "Tiffany's Lops",
      			price: docs[0].price,
      			image: docs[0].image,
				description: docs[0].description,
      			longDescription: docs[0].longDescription,
				father: docs[0].father,
				mother: docs[0].mother,
				birthdate: docs[0].birthdate,
				fatherName: fatherName,
				motherName: motherName,
				available: docs[0].available

			});
		});
     });
  });
});

app.get('/breeder/', function(req, res, next) {
  mongoConnection.collection('breeders').find({}).toArray(function(err, docs){
    if(err) {
      res.status(500).content('MongoDB failure!');
    }
    console.log("Found " + docs.length + " breeders.");
    res.status(200).render('breeders', {
      title: "Tiffany's Lops",
      posts: docs
    });
  });
});

app.get('/breeder/:bunnyid', function(req, res, next) {
	mongoConnection.collection('breeders').find({_id: mongodb.ObjectID(req.params.bunnyid)}).toArray(function(err, docs){
		if(err) {
			res.status(500).content('MongoDB failure!');
		}
		if(!(docs[0])){
			next();
			return;
		}
		var fatherName = null;
		var motherName = null;
			mongoConnection.collection('breeders').find({_id: mongodb.ObjectID((docs[0].father != '' ? docs[0].father : '111111111111111111111111'))}).toArray(function(err, father){
				if(father[0]){
					fatherName = father[0].name;
				}
				mongoConnection.collection('breeders').find({_id: mongodb.ObjectID((docs[0].mother != '' ? docs[0].mother : '111111111111111111111111'))}).toArray(function(err, mother){
				if(mother[0]){
					motherName = mother[0].name;
				}
				console.log("Found " + docs.length + " breeders");
				res.status(200).render('breederDets', {
					title: "Tiffany's Lops",
					image: docs[0].image,
					name: docs[0].name,
					father: docs[0].father,
					mother: docs[0].mother,
					birthdate: docs[0].birthdate,
					longDescription: docs[0].longDescription,
					breed: docs[0].breed,
					motherName: motherName,
					fatherName: fatherName
				});
			});
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

app.get('/addBreeder/', function (req, res) {
  mongoConnection.collection('breeders').find({}).toArray(function(err, docs){
    if(err) {
      res.status(500).content('MongoDB failure!');
    }
    console.log("Found " + docs.length + " breeders.");
    res.status(200).render('addBreeder', {
      title: 'Add Bunny Breeder',
      parents: docs
    });
  });
});

app.post('/addBreeder', function(req, res){

  if (req.body) {
    console.log("== Client added a breeder containing:");
    console.log("== name:", req.body.name);
    console.log("== birthdate:", req.body.birthdate);
    console.log("== image:", req.body.image);
    console.log("== description:", req.body.description);
    console.log("== mother:", req.body.mother);
    console.log("== father:", req.body.father);
    console.log("== isCurrent:", req.body.isCurrent);
    console.log("== breed:", req.body.breed);

    var breederCollection = mongoConnection.collection('breeders');

    breederCollection.insertOne(
      {
        name: req.body.name,
        birthdate: req.body.birthdate,
        image: req.body.image,
        longDescription: req.body.description,
        mother: req.body.mother,
        father: req.body.father,
        isCurrent: req.body.isCurrent,
        breed: req.body.breed
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

app.post('/addInfant', function(req, res){

  if (req.body) {
    console.log("== Client added an infant containing:");
    console.log("== price:", req.body.price);
    console.log("== birthdate:", req.body.birthdate);
    console.log("== image:", req.body.image);
    console.log("== shortdescription:", req.body.shortdescription);
    console.log("== longdescription:", req.body.longdescription);
    console.log("== mother:", req.body.mother);
    console.log("== father:", req.body.father);
    console.log("== available:", req.body.available);

    var infantCollection = mongoConnection.collection('babies');

    infantCollection.insertOne(
      {
        price: req.body.price,
        birthdate: req.body.birthdate,
        image: req.body.image,
        description: req.body.shortdescription,
        longDescription: req.body.longdescription,
        mother: req.body.mother,
        father: req.body.father,
        available: req.body.available
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

app.post('/buyBunny', function(req, res){

  if (req.body && req.body.id) {
    console.log("== Client bought an infant:");
    console.log("== id:", req.body.id);

    var infantCollection = mongoConnection.collection('babies');

    infantCollection.findAndModify({_id: ObjectId(req.body.id) }, [['_id','asc']], {$set: {available: false}},
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

app.get('/addInfant/', function (req, res) {
  mongoConnection.collection('breeders').find({}).toArray(function(err, docs){
    if(err) {
      res.status(500).content('MongoDB failure!');
    }
    console.log("Found " + docs.length + " breeders.");
    res.status(200).render('addInfant', {
      title: 'Add Bunny Infant',
      parents: docs
    });
  });
});

app.delete('/blog', function(req, res){
  console.log(req.body.id)
  if(req.body && req.body.id){
    var blogCollection = mongoConnection.collection('blogPosts');

    blogCollection.deleteOne(
      { "_id" : ObjectId(req.body.id) },
      function(err, result){
        if(err){
          res.status(500).send("Error");
        }
        else{
          res.status(200).send("Success");
        }
    });
  }
  else{
    res.status(400).send("Something went wrong");
  }
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
