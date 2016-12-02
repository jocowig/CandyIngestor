var restify = require('restify');
var	port = process.env.PORT || 3000;	
var server = restify.createServer({name: 'Candy Ingestor'});
var setupController = require('./controllers/setupController.js');
var placeholderController = require('./controllers/placeholderController.js');

setupController(server, restify);
placeholderController(server);

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

