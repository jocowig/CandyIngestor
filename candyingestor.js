var restify = require('restify');
var	port = process.env.PORT || 3000;	
var server = restify.createServer({
	name: 'Candy Ingestor'
});

server.listen(port, () => {
	console.info('Server is running on port ' + port);
});