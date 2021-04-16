var express = require('express');
var bodyparser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todosnextId =1;

app.use(bodyparser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function(req, res){
	var queryparams = req.query;
	var filtertodos = todos;

	if(queryparams.hasOwnProperty('completed') && queryparams.completed === 'true'){
		filtertodos = _.where(filtertodos, {completed: true});
	}else if(queryparams.hasOwnProperty('completed') && queryparams.completed === 'false'){
		filtertodos = _.where(filtertodos, {completed: false});
	}

	if(queryparams.hasOwnProperty('q') && queryparams.q.length > 0){
		filtertodos = _.filter(filtertodos, function(todo) {
			return todo.description.indexOf	(queryparams.q) > -1;
		});
	}
	res.json(filtertodos);
});

app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
});

app.post('/todos', function(req,res){
	var body= _.pick( req.body , 'description','completed')


	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return(res.status(400).send());
	}

	body.description = body.description.trim();
	body.id= todosnextId++;

	//push body
	todos.push(body);
	//console.log('description'+ body.description);

	res.json(body);	

});

app.delete('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		res.status(404).json({"error": "no todo found with that matching id"});
		}else{
			todos=_.without(todos, matchedTodo);
			res.json(matchedTodo);
		}
});

app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});



app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});