var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id:1,
	description: 'meet ben for lunch',
	completed:false
},{
	id:2,
	description: 'go to maket',
	completed:false
},{
	id:3,
	description: 'get fruits from market',
	completed:false
}];
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function(req, res){
	res.json(todos);
});

app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id);
	var matchedTodo;

	todos.forEach(function(todo){
		if(todoId ===todo.id){
			matchedTodo=todo;
		}
	});

	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
});

// app.get('/todos/:id', function(req, res){
// 	var todoId = req.params.id;
// 	if(res.json(todos)){
// 		console.log('todos accepted')
// 	}else{
// 		res.status(404).send();
// 	}
	


// 	res.send('asking for todo with id of'+ req.params.id);
// });

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});