var apikey = '2eb42e716bed1a73379b1ff939133dc62408ceb3'; // Put your API key here
var i, games;

// string commonly used in all games
var removeBtn = '<div class="game-remove"><button class="js-btn-remove btn btn-sm btn-success">Remove</button></div>';

// Game object constructor
function Game(name, image, desc) {
	var gameImage = '<div class="game-img hidden-sm hidden-xs"><img src="' + image + '"></div>';
	this.header = '<div class="game-header">' + gameImage + '<p class="lead">' + name + '</p></div>';
	this.desc = '<div class="game-desc"><p>' + desc + '</p></div>';
}

// Returns a string that can be appended to a given row
Game.prototype.display = function(number){
	// Notes: We assign the parent div a data-parent of i so we can find its index on removal
	return ('<div class="col-sm-4" data-parent="' + number +'"><div class="game well well-sm">' + this.header + this.desc + removeBtn + '</div></div>');
};

// Loops through games and displays them all in rows
function displayGames() {
	// Declare row and main; empty main
	var $main = $('main');
	var $row;
	$main.empty();
	for (i=0; i<games.length; i++) {
		// Every 3 columns, make a new row and append it to main
		if (i % 3 == 0) {
			$row = $('<div class="row"></div>').hide();
			$main.append($row);
		}
		// Add the game to the current row and fade it in
		$row.append(games[i].display(i));
		$row.fadeIn("slow");
	}
}

// Use this function to do stuff with your results. 
// It is called after 'search' is executed.
function searchCallback(results) {
	var image, deck;
	// Initialize the games array
	games = [];
	console.log(results);
	// Only get the top 9 results
	for (i=0; i<8; i++){
		// Placeholder images and decks as appropriate
		if (!results[i].image) {
			image = "http://placekitten.com/g/500/500";
		}
		else {
			image = results[i].image.thumb_url;
		}
		if (!results[i].deck) {
			deck = "Description unavailable.";
		}
		else {
			deck = results[i].deck;
		}
		// Make a new game object and add it to the array of games
		games.push(new Game(results[i].name, image, deck));
	}
	// When finished, display all games
	displayGames();
}


// HELPER FUNCTION
// Executes a search using 'query' and runs searchCallback on the results of a success.
function search(query){

	$.ajax ({
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: true,
		jsonp: 'json_callback',
		url: 'http://www.giantbomb.com/api/search/?format=jsonp&resources=game&api_key=' + apikey +'&query=' + encodeURI(query),
		complete: function() {
			console.log('ajax complete');
		},
		success: function(data) {
			searchCallback(data.results);
		}
	});

}

// Do when the document is ready
$(document).ready(function() {

	// Start the search here!
	$('.js-btn-search').click(function(){
		var $query = $('.js-query');
		if ($query.val() != "") {
			search($query.val());
		}
		else {
			alert("Please enter a title to search for first!");
		}
	});

	// Allows you to press enter in order to trigger the search button
	$('.js-query').keyup(function(event) {
		if (event.keyCode == 13) {
			$('.js-btn-search').click();
		}
	});

	// Listen for remove button clicks
	$('main').on('click', '.js-btn-remove', function(){
		$(this).closest('.col-sm-4').fadeOut("slow", function(){
			$this = $(this);
			// Find the element's position in the array and remove it
			games.splice([$this.attr("data-parent")], 1);
			// Remove the element from the DOM
			$(this).remove();
			// Redraw everything
			displayGames();
		});
	});
	
});