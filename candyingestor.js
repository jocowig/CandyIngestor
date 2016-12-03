var restify = require('restify');
var	port = process.env.PORT || 3000;	
var server = restify.createServer({name: 'Candy Ingestor'});
var setupController = require('./controllers/setupController.js');
var placeholderController = require('./controllers/placeholderController.js');
var restifyValidator = require('restify-validator');
var mongoose = require('mongoose');
var config = require('./config/dbConnection.js');

mongoose.connect(config.getMongoConnection());
setupController(server, restify, restifyValidator);
placeholderController(server);

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

