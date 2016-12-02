var restify = require('restify');
var	port = process.env.PORT || 3000;	

var server = restify.createServer({
	name: 'Candy Ingestor'
});

//placeholder collection
var placeholderCollection = {};
var id = 0;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());

function respond(res, next, status, data, http_code){
	var response = {
		'status': status,
		'data': data
	};
	res.setHeader('content-type', 'application/json');
	res.writeHead(http_code);
	res.end(JSON.stringify(response));
	return next();
}

function success(res, next, data) {
	respond(res, next, 'success', data, 200);
}

function failure(res, next, data, http_code){
	respond(res, next, 'failure', data, http_code);
}

server.get('/', function(req, res, next){
	success(res, next, placeholderCollection)
});

server.get('/placeholder/:id', function(req, res, next){
	if (typeof(placeholderCollection[req.params.id]) === 'undefined') {
		failure(res, next, 'The specified placeholder could not be found in the database',404);
	}
	success(res, next, placeholderCollection[parseInt(req.params.id)]);
});

server.post('/placeholder', function(req, res, next){
	var placeholder = req.params;
	id++;
	placeholder.id = id;
	placeholderCollection[placeholder.id] = placeholder;
	success(res, next, placeholder)
});

server.put('/placeholder/:id', function(req, res, next){
	if (typeof(placeholderCollection[req.params.id]) === 'undefined') {
		failure(res, next, 'The specified placeholder could not be found in the database',404);
	}
	var placeholder = placeholderCollection[parseInt(req.params.id)];
	var updates = req.params;
	for (var field in updates){
		placeholder[field] = updates[field]
	}
	success(res, next, placeholder);
});

server.del('/placeholder/:id', function(req, res, next){
	if (typeof(placeholderCollection[req.params.id]) === 'undefined') {
		failure(res, next, 'The specified placeholder could not be found in the database',404);
	}
	delete placeholderCollection[parseInt(req.params.id)];
	success(res, next, [])
});

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

