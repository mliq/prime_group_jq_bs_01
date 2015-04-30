var apikey = '2eb42e716bed1a73379b1ff939133dc62408ceb3'; // Put your API key here
var i, games;
var loadCount = 0;
var loadAnimation; // setInterval()
var currentGame = 0;

// Game object constructor
function Game(name, image, icon, deck, platforms, description) {
	this.name = name;
	this.image = image;
	this.icon = icon;
	this.deck = deck;
    this.platforms = platforms;
    this.description = description;
}

// Returns a string that can be appended to a given row
Game.prototype.display = function(){
	$gallery = $('.js-gallery-game');
	// Build the new game's information
	$gallery.empty();
	$gallery.append('<div class="gallery-head">' + this.name + '</div>');
	$gallery.append('<div class="gallery-img"><img src="' + this.image + '"></div>');
    $gallery.append('<div class="gallery-platforms"><h4>Platforms</h4><p>' + this.platforms + '</p></div>');
    $gallery.append('<div class="gallery-desc"><h4>Description</h4><p>' + this.deck + '</p><button class="btn btn-default js-btn-read">Show Details</button></div>');
    $gallery.append('<div class="gallery-details hidden">' + this.description + "</div>");
	// Fade in the new game
	$gallery.fadeIn();
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
	selectGameIcon();
	$('.js-gallery-game').fadeOut(function(){
		games[currentGame].display();
	});
}

function showPrevGame() {
	// Check if "previous" index is not going to be invalid
	if (currentGame-1 >= 0) {
		currentGame--;
	}
	else {
		currentGame = games.length-1;
	}
	selectGameIcon();
	$('.js-gallery-game').fadeOut(function(){
		games[currentGame].display();
	});
}

// Use this function to do stuff with your results. 
// It is called after 'search' is executed.
function searchCallback(results) {
	var image, icon, deck, platformString, descriptionString;
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
		if (results[i].deck == null) {
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
        // Check if description is null, if null, use deck, store to descriptionString
        descriptionString = "";
        if (results[i].description == null) {
            descriptionString = "Description unavailable";
        } else {
            descriptionString = results[i].description;
        }
        // Truncate and clean descriptionString
        //descriptionString = descriptionString.replace(/<(?:.|\n)*?>/gm, '');
        //descriptionString = descriptionString.slice(0,150);

        // Make a new game object and add it to the array of games
		games.push(new Game(results[i].name, image, icon, deck, platformString, descriptionString));

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

	// Button that shows detailed description
	$('.js-gallery').on('click', '.js-btn-read', function(){
		var $details = $('.gallery-details');
		if ($details.hasClass("hidden")) {
			$(this).text('Hide Details');
			$details.removeClass('hidden');
		}
		else {
			$(this).text('Show Details');
			$details.addClass('hidden');
		}
	});

	// Allows you to press enter in order to trigger the search button
	$('.js-query').keyup(function(event) {
		if (event.keyCode == 13) {
			$('.js-btn-search').click();
		}
	});

	// Buttons to go to next and previous games
	$('.js-btn-prev').click(function() {
		showPrevGame();
	});
	$('.js-btn-next').click(function() {
		showNextGame();
	});
});