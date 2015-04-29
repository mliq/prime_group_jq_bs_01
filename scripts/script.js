var apikey = '2eb42e716bed1a73379b1ff939133dc62408ceb3'; // Put your API key here
var i, games;
var loadCount = 0;
var loadAnimation; // setInterval()
var currentGame = 0;

// Game object constructor
function Game(name, image, icon, deck, platforms) {
	this.name = name;
	this.image = image;
	this.icon = icon;
	this.deck = deck;
    this.platforms = platforms;
}

// Returns a string that can be appended to a given row
Game.prototype.display = function(){
	$gallery = $('.js-gallery');
	$gallery.empty();
	$gallery.append('<div class="gallery-head">' + this.name + '</div>');
	$gallery.append('<div class="gallery-img"><img src="' + this.image + '"></div>');
    $gallery.append('<div class="gallery-platforms"><h4>Platforms</h4><p>' + this.platforms + '</p></div>');
    $gallery.append('<div class="gallery-desc"><h4>Description</h4><p>' + this.deck + '</p></div>');
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
    selectGameIcon();
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
    selectGameIcon();
}

// Use this function to do stuff with your results. 
// It is called after 'search' is executed.
function searchCallback(results) {
	var image, icon, deck, platformString;
	// Initialize the games array
	games = [];
	console.log(results);
    // Clear array
    $('.js-game-icons').empty();

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

        // Check if platform is array, and if it has multiple items store to platformString
        platformString = "";
        if(!results[i].platforms.length){
            platformString += "N/A";
        } else {
            for (j = 0; j < results[i].platforms.length - 1; j++) {
                platformString += results[i].platforms[j].name + ", ";
            }
            platformString += results[i].platforms[j].name;

        }
		// Make a new game object and add it to the array of games
		games.push(new Game(results[i].name, image, icon, deck, platformString));

        $('.js-game-icons').append("<div class='gameNumber" + i + "'><img src='" + icon + "'></div>");
	}
	// When finished, reset currentGame to the first game in the list and display it
	currentGame = 0;
	games[currentGame].display();
    selectGameIcon();
	$('main').fadeIn();
}

function selectGameIcon(){
    $('.js-game-icons div img').removeClass('selected');
    $('.gameNumber'+currentGame+' img').addClass('selected');
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
	// Hide js-load and gallery
	$('.js-load').hide();
	$('main').hide();

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