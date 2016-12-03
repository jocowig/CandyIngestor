var restify = require('restify');
var	port = process.env.PORT || 3000;	
var server = restify.createServer({name: 'candy Ingestor'});
var setupController = require('./controllers/setupController.js');
var companyController = require('./controllers/companyController.js');
var candyItemsController = require('./controllers/candyItemsController.js');
var restifyValidator = require('restify-validator');
var mongoose = require('mongoose');
var config = require('./config/dbConnection.js');

mongoose.connect(config.getMongoConnection());
setupController(server, restify, restifyValidator);
companyController(server);
candyItemsController(server);

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

