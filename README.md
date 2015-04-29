#jQuery / Bootstrap / AJAX Gallery Group Project

Good Morning

You and your teammates are going to tackle the concepts of a custom gallery with a bit of pagination. We are also going to use the Giantbomb API one last time for this assignment. 

For this assignment, start with the basics that we have already created:
User can input a search,
Use the AJAX call already created for you from earlier this week,
You will work with only 8 results from the query


After you pull in your information, download a new bootstrap theme and integrate it into your project. Once the user has entered in a search into a textbox, they should hit a search button to begin the query. Add a line of text is shown as the user clicks the search button, then is removed when the search comes back successful.

Once the data comes back from a successful search, you will need to use that information to populate a custom gallery you are going to create. The Gallery should display information for one game. The information should include an Image, the title of the game, a short description of the game, as well as what platform(s) the game is available on.

Beneath the information, include “left” and “right” navigation. This implies that the user will have additional information they can navigate through. They will start at the ‘first’ result. This should be visually indicated with a ‘dot’ that is another color from the other dots. These will correspond to which game they are at in the list of the 8 games that you received from the data. Clicking on ‘right’ should change the information displayed in the gallery to the next item. Clicking ‘left’ should navigate to the previous item. If the user is at the first item and navigate left, the gallery should navigate to the back of the gallery. If the user is at the last item of the gallery and click right, they should navigate to the first item. 

The visual indicator mentioned above should update as this navigation happens. There should be 8 ‘dots’ that represent each of the items in the gallery. If you are at the first game, the first visual indicator should be visually different than the others. Clicking right from here should change the first visual indicator to be the same as the others and then the second one should now have the visual distinction. 

#Hard Mode
Add a ‘read more’ button, that when clicked, displays additional information that slides down. Additionally, there should be a ‘collapse’ button that slides the information up when clicked. 

#Pro Mode
Use the thumbnail images that are returned in the image object of the main object. as the base for your visual indicators. The visual distinction should be a border that is applied to the current item.
