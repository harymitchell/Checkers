
$(document).ready(function(){

	$('input#new_game').on('click', function() {
		jQuery.post("/api/new_game", {}, function (data, textStatus, jqXHR) {
			console.dir(data);
			$('div#board_container').html(data);
			do_draggable(); 
		});

	}); // end new_game on_click.

	$('input#generate_move').on('click', function() {
		jQuery.post("/api/generate_move", {}, function (data, textStatus, jqXHR) {
			console.dir(data);
			$('div#board_container').html(data); 
			do_draggable();
		});

	}); // end generate_move on_click.

	function do_draggable() {
		$(".draggable").draggable({
			helper: "original",
			scroll: false,
			start: function (event, ui) {
			        console.log ("dragging");
			},
			revert: true,
		});

		$( ".droppable" ).droppable({
			tolerance: "touch",
			// activeClass: "ui-state-highlight",
			drop: function( event, ui ) {
			jQuery.post("/api/player_move", {from_x: $(ui.draggable).parent().index(), from_y: $(ui.draggable).parent().parent().index(), to_x: $(this).parent().index(), to_y: $(this).parent().parent().index()}, function (data, textStatus, jqXHR) {
				console.dir("new_board: ")
				console.dir (data)
				if (data) $('div#board_container').html(data); 
				do_draggable();
			});				
			}
		});
	} // end do_draggable

	$(document).on('click', '.cell', function() {
//		$(this).css("background-color", "#E5E4E2");
//		console.log ("click")
//		alert('My position in table is: '+this.cellIndex+'x'+this.parentNode.rowIndex);
	}); // end on_click.

}); // end document.ready
