var restify = require('restify');
var	port = process.env.PORT || 3000;	

var server = restify.createServer({
	name: 'Candy Ingestor'
});

//placeholder collection
var placeholderCollection = {};
var idNum = 0;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());

server.get('/', function(req, res, next){
	res.setHeader('content-type', 'application/json');
	res.writeHead(200);
	res.end(JSON.stringify(placeholderCollection));
	return next();
});

server.post('/placeholder', function(req, res, next){
	var placeholder = req.params;
	idNum++;
	placeholder.id = idNum;
	placeholderCollection[placeholder.id] = placeholder;
	res.setHeader('content-type', 'application/json');
	res.writeHead(200);
	res.end(JSON.stringify(placeholder));
	return next();
});

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

