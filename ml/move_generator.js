// Require
var assert = require ('assert');
var Checker_board = require ('./checker_board');

// MOVE_GENERATOR
module.exports = function move_generator (a_team, a_checker_board){
	this.team = a_team;
	var checker_board = a_checker_board;
	assert (a_team == 'W' || a_team == 'B', 'Team is white or black');

// Basic operations

	move_generator.prototype.random_generated_move = function (a_checker_board){	
		if(arguments.length == 1 && a_checker_board instanceof Checker_board) {
			return this.random_generated_move_i (a_checker_board)
		}
		else {
			console.log ("No checker board passed.");
		}
	}

	move_generator.prototype.print_checker_board = function (){
		console.log ("Move generator checker board: ");		
		console.log (checker_board);
	}
	
// Status Reports

	move_generator.prototype.moves_for_coordinates = function (a_x, a_y){
			// Returns a list of valid moves for given coordinates.
		var moves = new Array
		var search_space = this.search_space (a_x, a_y)
		search_space.forEach(function(entry) {
			if (checker_board.is_valid_move (a_x, a_y, entry[0], entry[1])){
				moves.push (entry)
			}
		});
		return moves;
	}
		
	move_generator.prototype.search_space = function (a_x, a_y) {
			// Returns the list of coordinates available for the given coordinates to move.
		var search_space = [[],[],[],[]]
		var a_x_minus = (a_x == 0) ? (0) : (a_x - 1)
		var a_y_minus = (a_y == 0) ? (0) : (a_y - 1)
		var a_x_plus = (a_x == 7) ? (7) : (a_x + 1)
		var a_y_plus = (a_y == 7) ? (7) : (a_y + 1) 

		search_space[0][0] =  (a_x_plus)
		search_space[0][1] =  (a_y_plus)

		search_space[1][0] =  (a_x_plus)
		search_space[1][1] =  (a_y_minus)

		search_space[2][0] =  (a_x_minus)
		search_space[2][1] =  (a_y_plus)

		search_space[3][0] =  (a_x_minus)
		search_space[3][1] =  (a_y_minus)

		console.log ("search space: ")
		console.log (search_space)
		return search_space
	}

// Setters

	move_generator.prototype.set_team = function (a_team){
		team = a_team;
	}

// Implementation

	move_generator.prototype.random_generated_move_i = function (a_checker_board){
		var generated_moves = this.generated_moves_i (a_checker_board);
		var rand_number =  Math.floor((Math.random() * generated_moves.length - 1) + 1); 
		console.log ("generating random move. length = "+generated_moves.length+". Random number = "+rand_number);
		return generated_moves[rand_number]
	}

	move_generator.prototype.generated_moves_i = function (a_checker_board){	
		// Requirements		
		assert (arguments.length == 1 && a_checker_board instanceof Checker_board, "Has correct arguments.");
		// Do
		console.log ("generating moves");
		var squares = this.squares_for_team (this.team);
		var generated_moves = new Array;
		
		console.log ("squares.legnth:" + squares.length);
		for (i=0; i < squares.length; i++) {
			console.log ("------------------------");
			console.log ("squares at "+i+" = "+squares[i]);
			this.moves_for_coordinates (squares[i][0],squares[i][1]).forEach(function(entry) {
				console.log ("moves for coordinates ("+squares[i][0]+","+squares[i][1]+")");
				console.log (entry);
				generated_moves.push ([[squares[i][0], squares[i][1]],entry]);
			});
		};
		console.log (checker_board)
		console.log ("Generated moves:")
		console.log (generated_moves);
		return generated_moves;
	}

	move_generator.prototype.squares_for_team = function (a_team){
		assert (a_team == 'W' || a_team == 'B', 'Team is white or black');
		var result = new Array ();
		var board = checker_board.Board;
//			console.log ("board length: "+board.length);
		for (i=0; i < board.length; i++) {
//			console.log ("i: "+i);
			for (j=0; j < board[i].length; j++) {
//				console.log ("board_at ("+i+","+j+") = "+checker_board.board_at (i,j));
				if (checker_board.board_at (i,j) == a_team){
					result.push ([i,j]);
				}					
			};
		};
		return result
	}



















} // End class move_generator.
