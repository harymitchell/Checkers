var express = require('express');
var session = require('express-session')
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var routes = require('./routes');
var users = require('./routes/user');
var http = require('http');
var Checker_board = require ('./ml/checker_board');
var Controller = require ('./controller/controller.js');
var controller = new Controller ();
var Move_generator = require ('./ml/move_generator');
var app = express();

app.use(session({ 
		  secret: 'shazaam',
                  resave: 'false',
                  saveUninitialized: 'false' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;

app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
  console.log('Express server listening on port ' + app.get('port'));
});

