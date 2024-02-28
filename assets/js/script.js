
// Function to fetch events based on city
function fetchEvents(city) {
    var apiKey = 'rI3KHyjz4y7GNb7pRt6687jSpKbj4MEC';
    var url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var events = data._embedded.events;
            var eventContainer = document.getElementById('events-container');

            // Shuffle the events array
            shuffleArray(events);

            // Display the first event initially
            let currentIndex = 0;
            displayEvent(events[currentIndex]);

            // Show carousel controls
            document.querySelector('.carousel-control-prev').style.display = 'block';
            document.querySelector('.carousel-control-next').style.display = 'block';

            // Event listener for next button
            document.querySelector('.carousel-control-next').addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % events.length;
                displayEvent(events[currentIndex]);
            });

            // Event listener for previous button
            document.querySelector('.carousel-control-prev').addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + events.length) % events.length;
                displayEvent(events[currentIndex]);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
}

// Function to display a single event
function displayEvent(event) 
{
    

    var eventName = event.name;
    var eventLocation = event._embedded.venues[0].name;
    var eventDate = event.dates.start.localDate;
    var eventTime = event.dates.start.localTime;

    var eventInfo = document.createElement('div');
    eventInfo.classList.add('event-info');
    eventInfo.innerHTML = `
        <h3>${eventName}</h3>
        <p><strong>Location:</strong> ${eventLocation}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
    `;

    var eventContainer = document.getElementById('events-container');
    eventContainer.innerHTML = " ";


    eventContainer.appendChild(eventInfo);
}


// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', function() {

    var city = document.getElementById('city-input').value;
    fetchEvents(city);
});