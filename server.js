var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var port = process.env.PORT || 3000;

var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: [
    'views/partials/'
  ]
});

var infantData = JSON.parse(fs.readFileSync('infantData.json', 'utf8'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.status(200).render('index', {
    title: "Tiffany's Lops",
    posts: infantData
  });
});

app.get('/faq/', function (req, res) {
  res.status(200).render('faq', {
    title: 'Bunny FAQ'
  });
});

app.get('*', function (req, res) {
  res.status(404).render('404', {
    title: "Flop not found!"
  });
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
