let currentIndex = 0;
var apiKey = 'rI3KHyjz4y7GNb7pRt6687jSpKbj4MEC';

// Function to fetch events based on city
function fetchEvents(city) {
    currentIndex = 0
    var url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var events = data._embedded.events;
        clearEventInfo();
        console.log(events.length);
        // Shuffle the events array
        shuffleArray(events);
        // Display the first event initially
        displayEvent(events[currentIndex]);
        // Show carousel controls
        document.querySelector('.carousel-control-prev').style.display = 'block';
        document.querySelector('.carousel-control-next').style.display = 'block';
        // Event listener for next button
        document.querySelector('.carousel-control-next').addEventListener('click', function() {
            clearEventInfo();
            currentIndex = (currentIndex + 1) % events.length;
            displayEvent(events[currentIndex]);
        });
        console.log(events);
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
function displayEvent(events) {
    var eventName = events.name;
    var eventLocation = events._embedded.venues[0].name;
    var eventDate = events.dates.start.localDate;
    var eventTime = events.dates.start.localTime;
    clearEventInfo();
    var eventInfo = document.createElement('div');
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
                foundCorrectSize = true;
                break;
            }
        }
        
        if (!foundCorrectSize) {
            console.log('No image with dimensions 1024x683 found for this event.');
            $('.carousel').css('background-color', `#333`);
        }
    }

    $('.events-info').append(eventInfo);
    
    //converts the lat and long strings to a float 
    var latitude = parseFloat(events._embedded.venues[0].location.latitude);
    var longitude = parseFloat(events._embedded.venues[0].location.longitude);

    // Updates the map with the new location
    updateMap(latitude, longitude);

}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', function search() {
    var city = document.getElementById('city-input').value;
    clearEventInfo();
    fetchEvents(city);
});

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
