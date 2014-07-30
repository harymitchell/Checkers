//
//        NOTE: The views are not yet implemented for this project!
//

/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session')
var RedisStore = require('connect-redis')(session);
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var Checker_board = require ('./ml/checker_board');
var Controller = require ('./controller/controller.js');
var controller = new Controller ();
var Move_generator = require ('./ml/move_generator');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(session({ store: new RedisStore(), secret: 'keyboard cat' }))

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);


app.post('/api/new_game', function (req, res){
	var cb = new Checker_board ();
	req.session.checker_board = new Checker_board ();
	var board_string = controller.checker_board_element_for_board (req.session.checker_board.Board); 
	console.log (req.session.checker_board);
	console.log (req.session.checker_board.is_valid_move (0,0,1,1))
	res.send (board_string);
}); // end new_game post.


app.post('/api/player_move', function (req, res){
	var cb = new Checker_board ();
	cb.Board = req.session.checker_board.Board
	console.log (cb)
	if (cb.is_valid_move (req.body['from_y'], req.body['from_x'], req.body['to_y'], req.body['to_x'])){
		cb.move (req.body['from_y'], req.body['from_x'], req.body['to_y'], req.body['to_x']);
		req.session.checker_board.Board = cb.Board;					
		console.log ("new board: ")
		console.log (req.session.checker_board.Board)
		var board_string = controller.checker_board_element_for_board (req.session.checker_board.Board); 
		res.send (board_string);
	}
	else {
		res.send (false);	
	}
}); // end player_game post.

app.post('/api/generate_move', function (req, res){
	var cb = new Checker_board ();
	cb.Board = req.session.checker_board.Board
	console.log (cb)

	var move_generator = new Move_generator ('B', cb);
	var rand_move = move_generator.random_generated_move (cb);
	console.log ("Random move:" + rand_move);
	cb.move (rand_move[0][0],rand_move[0][1],rand_move[1][0],rand_move[1][1])

	req.session.checker_board.Board = cb.Board;					
	var board_string = controller.checker_board_element_for_board (req.session.checker_board.Board); 
	res.send (board_string);
	
}); // end generate_game post.


http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
