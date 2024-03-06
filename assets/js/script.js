var currentIndex = 0;
var apiKey = 'rI3KHyjz4y7GNb7pRt6687jSpKbj4MEC';
var eventloaded = false;
var eventName 
var eventLocation 
var eventDate 
var eventTime 
var eventImg
var eventSeatMap
var eventLink
var seatmap = false
var city = document.getElementById('city-input').value;
var placeholder;
// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    displaySearchHistory(); // Display search history when the page is loaded
    if (city === ""){
        $('.carousel').css('background-image', 'url(./assets/images/cm-2.png)');
       
    }
});





document.getElementById('eventdetails').addEventListener('click', function() {
    // Change the URL to the eventDetails.html page
   
   
    if (eventSeatMap === "Seatmap not available"){
        var url = `eventDetails.html?eventName=${eventName}&eventImg=${eventImg}&eventLocation=${eventLocation}&eventDate=${eventDate}&eventTime=${eventTime}&eventLink=${eventLink}`;

    }
    else{
        var url = `eventDetails.html?eventName=${eventName}&eventImg=${eventImg}&eventLocation=${eventLocation}&eventDate=${eventDate}&eventTime=${eventTime}&eventSeatMap=${eventSeatMap}&eventLink=${eventLink}&seatmap=true`;

    }
    
     // Redirect to eventDetails.html
     window.location.href = url;
});

// Function to fetch events based on city
function fetchEvents(city) {
    eventloaded = true
    currentIndex = 0
    var url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
       
            var events = data._embedded.events;
            clearEventInfo();
            // Shuffle the events array
            shuffleArray(events);
            // Display the first event initially
            displayEvent(events[currentIndex]);
            // Show carousel controls
            document.querySelector('.carousel-control-prev').style.display = 'block';
            document.querySelector('.carousel-control-next').style.display = 'block';
            document.querySelector('.moreInfo').style.display = 'block';
            // Event listener for next button
            document.querySelector('.carousel-control-next').addEventListener('click', function() {
                clearEventInfo();
                currentIndex = (currentIndex + 1) % events.length;
                displayEvent(events[currentIndex]);
            });
            // Event listener for previous button
            document.querySelector('.carousel-control-prev').addEventListener('click', function() {
                clearEventInfo();
                currentIndex = (currentIndex - 1 + events.length) % events.length;
                displayEvent(events[currentIndex]);
            });
       
    })
    .catch(error => {
        console.error('Error fetching events:', error);
    });
}
// Function to display a single event
function displayEvent(events)
{
     eventName = events.name;
     eventLocation = events._embedded.venues[0].name;
     eventDate = events.dates.start.localDate;
     eventTime = events.dates.start.localTime;
    clearEventInfo();
    var eventInfo = document.createElement('div');
    eventLink = events.url;
    if (events.seatmap && events.seatmap.staticUrl) {
        eventSeatMap = events.seatmap.staticUrl;
        seatmap = true
    } else {
        // Handle the case where seatmap data is not available
        eventSeatMap = "Seatmap not available";
    }
    eventInfo.classList.add('event-info');

    eventInfo.innerHTML = `
        <h3>${eventName}</h3>
        <p><strong>Location:</strong> ${eventLocation}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
    `;
    checkImageDimensions(events.images, eventInfo);


// Function to check image dimensions
function checkImageDimensions(images, eventInfo) {
    var foundCorrectSize = false;
    
    for (var i = 0; foundCorrectSize = true; i++) {
        if (images[i].width === 1024 && images[i].height === 683) {
            console.log(`Found image with correct dimensions (1024x683): ${images[i].url}`);
            $('.carousel').css('background-image', `url(${images[i].url})`);
            eventImg = images[i].url;
            foundCorrectSize = true;
            break;
        }
    }
    
    if (!foundCorrectSize) {
        console.log('No image with dimensions 1024x683 found for this event.');
        $('.carousel').css('background-color', `#333`);
    }
}

    //$('.carousel').css('background-image', `url(${events.images[0].url})`);

    $('.events-info').append(eventInfo);
    var latitude = parseFloat(events._embedded.venues[0].location.latitude);
    var longitude = parseFloat(events._embedded.venues[0].location.longitude);

    // Update the map with the new location
    updateMap(latitude, longitude);
}
// Shuffle array function
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Retrieve existing search history from local storage
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

document.getElementById('searchBtn').addEventListener('click', function search() {
    city = document.getElementById('city-input').value;

    if (city === '') {
        document.getElementById('modal-alert').style.display = 'block';
        // Close the modal when the 'x' is clicked
        document.getElementsByClassName('close')[0].onclick = function() {
            document.getElementById('modal-alert').style.display = 'none';
        };
        // Close the modal when clicking outside the modal
        window.onclick = function(event) {
            if (event.target == document.getElementById('modal-alert')) {
                document.getElementById('modal-alert').style.display = 'none';
            }
    
        };
    return;
    }
    
    else{
    if (city === '') {
        // Show the modal if the city input is empty
        $('#modal-alert').modal('show');
        return; // Prevent further execution

    }
    }

    fetchEvents(city);
    
    if (!searchHistory.includes(city)) {
        searchHistory.push(city); // Add the city to search history if it's not already there
        displaySearchHistory(); // Update the display
        saveSearchHistory(); // Save the updated search history to local storage
    }
});

// Function to display search history
function displaySearchHistory() {
    var inputContainer = document.getElementsByClassName('input-container')[0]; // Get the first element
    var searchHistoryElement = inputContainer.querySelector('.search-history'); // Find the search history element
    
    if (!searchHistoryElement) {
        searchHistoryElement = document.createElement("div"); // Create a div element
        searchHistoryElement.classList.add('search-history'); // Add a class for styling
        inputContainer.appendChild(searchHistoryElement); // Append the div to inputContainer
        searchHistoryElement.innerHTML = '<h3>Search History</h3>';
    }
    
    // Clear existing search items
    searchHistoryElement.innerHTML = '<h3>Search History</h3>';
    
    // Display unique search items with click event and class
    var uniqueSearchHistory = Array.from(new Set(searchHistory)); // Remove duplicates
    uniqueSearchHistory.forEach(function(city, index) {
        var searchItem = document.createElement('p');
        searchItem.textContent = `${city}`;
        searchItem.classList.add('button-styling'); // Add class 'searchItem'
        searchItem.addEventListener('click', function() {
            fetchEvents(city); // Fetch events for the clicked city
        });
        searchHistoryElement.appendChild(searchItem);
    });
}

// Function to save search history to local storage
function saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to clear search history
function clearSearchHistory() {
    var inputContainer = document.getElementsByClassName('input-container')[0]; // Get the first element
    var searchHistoryElement = inputContainer.querySelector('.search-history'); // Find the search history element
    
    if (searchHistoryElement) {
        inputContainer.removeChild(searchHistoryElement); // Remove the search history element
    }
}
function clearEventInfo() {
    $('.events-info').empty(); // Empty the carousel div
}

function updateMap(lat, lng) {
    var eventMapLocation = new google.maps.LatLng(lat, lng);
    map.setCenter(eventMapLocation);
    map.setZoom(15);

    new google.maps.Marker({
        position: eventMapLocation,
        map: map
    });
}

//google maps api
let map;
let geocoder;
let infowindow;

initMap();
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: {
            lat: 40.72,
            lng: -73.96,
        },
    });
}
window.initMap = initMap;