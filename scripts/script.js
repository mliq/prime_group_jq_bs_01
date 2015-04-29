var apikey = '2eb42e716bed1a73379b1ff939133dc62408ceb3'; // Put your API key here
var i, games;
var loadCount = 0;
var loadAnimation; // setInterval()
var currentGame = 0;

// Game object constructor
function Game(name, image, icon, deck) {
	this.name = name;
	this.image = image;
	this.icon = icon;
	this.deck = deck;
}

// Returns a string that can be appended to a given row
Game.prototype.display = function(){
	$gallery = $('.js-gallery');
	$gallery.empty();
	$gallery.append('<div class="gallery-head">' + this.name + '</h3>');
	$gallery.append('<div class="gallery-img"><img src="' + this.image + '"></div>');
};

// Button functionality
function showNextGame() {
	// Check if "next" index is not going to be invalid
	if (currentGame+1 < games.length) {
		currentGame++;
	}
	else {
		currentGame = 0;
	}
	games[currentGame].display();
}

function showPrevGame() {
	// Check if "previous" index is not going to be invalid
	if (currentGame-1 >= 0) {
		currentGame--;
	}
	else {
		currentGame = games.length-1;
	}
	games[currentGame].display();
}

// Use this function to do stuff with your results. 
// It is called after 'search' is executed.
function searchCallback(results) {
	var image, icon, deck;
	// Initialize the games array
	games = [];
	console.log(results);
	// Only get the top 9 results
	for (i=0; i<8; i++){
		// Placeholder images and decks as appropriate
		if (!results[i].image) {
			image = "http://placekitten.com/g/500/500";
			icon = "http://placekitten.com/g/16/16";
		}
		else {
			image = results[i].image.small_url;
			icon = results[i].image.tiny_url;
		}
		if (!results[i].deck) {
			deck = "Description unavailable.";
		}
		else {
			deck = results[i].deck;
		}
		// Make a new game object and add it to the array of games
		games.push(new Game(results[i].name, image, icon, deck));
	}
	// When finished, reset currentGame to the first game in the list and display it
	currentGame = 0;
	games[currentGame].display();
}


// HELPER FUNCTION
// Executes a search using 'query' and runs searchCallback on the results of a success.
function search(query){

	// Loading... animation
	$('.js-load').show();
	loadAnimation = setInterval(function(){
		loadCount++;
		if (loadCount == 4) {
			loadCount = 0;
			$('.js-load p').text('Loading');
		}
		else {
			$('.js-load p').append('.');
		}
	}, 750);

	// AJAX function
	$.ajax ({
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: true,
		jsonp: 'json_callback',
		url: 'http://www.giantbomb.com/api/search/?format=jsonp&resources=game&api_key=' + apikey +'&query=' + encodeURI(query),
		complete: function() {
			console.log('ajax complete');
			// Stop load animation and reset the box
			clearInterval(loadAnimation);
			$('.js-load p').text('Loading');
			$('.js-load').hide();
		},
		success: function(data) {
			searchCallback(data.results);
		}
	});

}

// Do when the document is ready
$(document).ready(function() {
	// Hide js-load
	$('.js-load').hide();

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

	$('.js-btn-prev').click(function() {
		showPrevGame();
	});

	$('.js-btn-next').click(function() {
		showNextGame();
	});
});