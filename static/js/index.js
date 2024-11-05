// Import necessary Firebase functions
import { database, auth } from './firebase-config.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signupFormSubmit, handleLogin, logoutUser, hideMenuItems, getCurrentUserId, getUserId, getAllUsersData } from './auth.js';
import { initMap, getAddressFromCoords, getCurrentLocation, createEvent, getAllEvents } from './app.js';


function redirectUserAuth() {
    const auth = getAuth();
    // Check if the user is logged in when the page loads
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, redirect to the homepage
            const currentPage = window.location.pathname;
            if (currentPage === '/') {
                window.location.href = '/home';
            }
        }
    });    
}

export function displayLoggedInFeatures(user, isHost) {
    // Display menu
    const burgerStack = document.getElementById('menuToggle');
    burgerStack.style.display = 'flex';

    // Display Brand
    const brandingContainer = document.getElementById('brandingContainer');
    brandingContainer.style.display = 'inline-flex';

    // Display Search Bars
    const keywordSearch = document.getElementById('search-container');
    keywordSearch.style.display = 'inline-flex';

    // Display Location Search Bar
    const locationSearch = document.getElementById('location-container');
    locationSearch.style.display = 'inline-flex';

    //Hide Create Event Menu Tab
    const createEventTab = document.querySelector('.hostEvents');
    createEventTab.style.display = 'none';

    // Hide login/signup buttons if they exist
    const loginButton = document.getElementById('login');
    if (loginButton) {
        loginButton.style.display = 'none';
    }
    const signupButton = document.getElementById('signup');
    if (signupButton) {
        signupButton.style.display = 'none';
    }

    // Display host-specific features
    const hostFeatures = document.getElementById('event-adder');
    if (isHost) {
        if (hostFeatures) {
            hostFeatures.style.display = 'inline-flex';
        }
    } else {
        if (hostFeatures) {
            hostFeatures.style.display = 'none';
        }
    }
}

export function hideMenuFeatures() {
    //Hide menu
    const bugerStack = document.getElementById('menuToggle');
    bugerStack.style.display = 'none';

    //Hide Search Bars
    const keywordSearch = document.getElementById('search-container')
    keywordSearch.style.display = 'none';

    //Hide Search Bars
    const locationSearch = document.getElementById('location-container')
    locationSearch.style.display = 'none';

    //Hide Create Event Button
    const eventAdder = document.getElementById('event-adder')
    eventAdder.style.display = 'none';

    // Show login/signup buttons if they exist
    const loginButton = document.getElementById('login');
    if (loginButton) {
        loginButton.style.display = 'inline-flex';
    }
    const signupButton = document.getElementById('signup');
    if (signupButton) {
        signupButton.style.display = 'inline-flex';
    }
}

// Initialize autocomplete for location search on
async function initAutocompleteForEventCreation() {
    const {Autocomplete} = await google.maps.importLibrary("places");
    if (typeof google === 'undefined' || typeof google.maps === 'undefined' || typeof google.maps.places === 'undefined') {
        console.error("Google Maps Places library is not loaded.");
        return;
    }

    const input1 = document.getElementById("locationBox");
    if (input1) {
        const autocomplete1 = new google.maps.places.Autocomplete(input1);
        autocomplete1.setFields(["address_components", "geometry"]);
        autocomplete1.addListener("place_changed", function () {
            onPlaceChanged(autocomplete1, "locationBox");
        });
    } else {
        console.error("Input element with ID 'locationBox' not found.");
    }
}

// Initialize autocomplete for location search on the create events page
async function initAutocompleteForLocationSearch() {
    const {Autocomplete} = await google.maps.importLibrary("places");
    if (typeof google === 'undefined' || typeof google.maps === 'undefined' || typeof google.maps.places === 'undefined') {
        console.error("Google Maps Places library is not loaded.");
        return;
    }

    const input2 = document.getElementById("locationSearch");
    if (input2) {
        const autocomplete2 = new google.maps.places.Autocomplete(input2);
        autocomplete2.setFields(["address_components", "geometry"]);
        autocomplete2.addListener("place_changed", function () {
            onPlaceChanged(autocomplete2, "locationSearch");
        });
    } else {
        console.error("Input element with ID 'locationSearch' not found.");
    }
}

async function onPlaceChanged(autocomplete, inputId) {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
        console.log("No details available for the selected location.");
        return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    if (inputId === "locationBox") {
        // For event creation: store the location
        await handleEventLocation(lat, lng);
    } else if (inputId === "locationSearch") {
        // For location search: display events nearby
        handleSearchLocation(lat, lng);
    }
}

// Function handles the location input on the create events page
async function handleEventLocation(lat, lng) {
    const address = await getAddressFromCoords(lat, lng);
    const eventData = {
        address: address,
        lat: lat,
        lng: lng,
    };
    const userId = await getCurrentUserId();
    await createEvent(userId, eventData);
    console.log("Event created at location:", { lat, lng });
}
// Function handles the location input on home page
function handleSearchLocation(lat, lng) {
    console.log("Displaying events near:", { lat, lng });
    // Initialize the map at the default position
    return;
}
// Handles keyword search
async function handleKeywordSearch() {
    const searchInput = document.getElementById('search-container');
    if (!searchInput) {
        console.error("Keyword search input element not found.");
        return;
    }

    const keyword = searchInput.value.trim();
    if (!keyword) {
        console.error("Keyword search input is empty.");
        return;
    }

    try {
        const events = await getAllEvents();
        const filteredEvents = events.filter(event => event.description.includes(keyword) || event.title.includes(keyword));
        const redirectUser = window.location = '/events';
        redirectUser.populateEventCard(filteredEvents);
    } catch (error) {
        console.error("Error during keyword search:", error);
    }
}

// DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed.');
    hideMenuItems();
    redirectUserAuth();

    // Global Navigation Buttons Setup
    function setupGlobalButtons() {
        const buttons = {
            joinusButton: '/signup',
            signupButton: '/signup',
            loginButton: '/login',
            homeButton: '/home',
            createActButton: '/signup',
            addEvent: '/createEvents'
        };
    
        for (const [className, path] of Object.entries(buttons)) {
            const button = document.querySelector(`.${className}`);
            if (button) {
                button.addEventListener('click', () => {
                    console.log(`${className.replace('Button', '')} button clicked`);
                    location.href = window.location.origin + path;
                });
            }
        }
    }
    setupGlobalButtons();

    // Function to set up the signup form and populate date dropdowns
    function setupSignupForm() {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await signupFormSubmit();
            });

            const monthSelect = document.getElementById("month");
            const daySelect = document.getElementById("day");
            const yearSelect = document.getElementById("year");

            if (!monthSelect || !daySelect || !yearSelect) {
                console.error("One or more date dropdown elements are missing.");
                return;
            }

            // Populate the year dropdown
            function populateYears() {
                const currentYear = new Date().getFullYear();
                const earliestYear = 1900;
                for (let year = currentYear; year >= earliestYear; year--) {
                    const option = document.createElement("option");
                    option.value = year;
                    option.textContent = year;
                    yearSelect.appendChild(option);
                }
            }

            // Populate the days based on the selected month
            function populateDays(month) {
                daySelect.innerHTML = ""; // Clear existing options
                const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                const defaultOption = document.createElement("option");
                defaultOption.textContent = "Day";
                defaultOption.selected = true;
                daySelect.appendChild(defaultOption);

                for (let day = 1; day <= (month === 2 ? 28 : daysInMonth[month - 1]); day++) {
                    const option = document.createElement("option");
                    option.value = day;
                    option.textContent = day;
                    daySelect.appendChild(option);
                }
            }

            // Initialize year dropdown and days for January
            populateYears();
            populateDays(1);

            // Event listener to update days when month changes
            monthSelect.addEventListener("change", () => {
                const selectedMonth = parseInt(monthSelect.value);
                if (selectedMonth >= 1 && selectedMonth <= 12) {
                    populateDays(selectedMonth);
                }
            });
        }
    }

    // Function to show a modal
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Function to hide a modal
    function hideModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Setup close buttons for both modals
    function setupCloseButtons() {
        const closeButtons = document.querySelectorAll('.close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                hideModal(modal);
            });
        });
    }

    // Function to set up login page form
    function setupLoginPage() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
        
                const email = document.getElementById('email').value;
                const password = document.getElementById('pwd').value;
        
                // Check for empty fields
                if (!email || !password) {
                    showModal('missingInfo');
                    setupCloseButtons();
                    return;
                }
        
                try {
                    await handleLogin(email, password);
                    console.log("Redirecting to home page...");
                    window.location.href = "/home";
                } catch (error) {
                    // Handle login errors
                    const errorAlert = document.getElementById('wrongInfo');
                    errorAlert.querySelector('p').textContent = error.message;
                    showModal('wrongInfo');
                    setupCloseButtons();
                }
            });
        }
    }

    // Function to handle menu item clicks
    function setupMenuItems() {
        document.querySelectorAll('#menu li a').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = item.parentElement.className;

                console.log(`${targetId} button clicked`);

                switch (targetId) {
                    case 'home': location.href = window.location.origin + '/home'; break;
                    case 'events': location.href = window.location.origin + '/events'; break;
                    case 'hostEvents': location.href = window.location.origin + '/createEvents'; break;
                    case 'profile': location.href = window.location.origin + '/profile'; break;
                    case 'logout': logoutUser(); break;
                    default: console.error('Unknown menu item:', targetId);
                }
            });
        });
    }

    // Menu setup for all pages
    setupMenuItems();

    const currentPage = window.location.pathname;
    // Only initialize the map if you're on the correct page
    if (currentPage === '/home') {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            // Initialize your Google Map here
            initMap();
        } else {
            console.error('Map container not found.');
        }
    }

    // Function to set up event page form
    function setupEventCreation() {
        const eventForm = document.getElementById('eventCreationForm');
        const locationInput = document.getElementById('locationBox');
        
        if (eventForm) {
            // Autofill location on load
            getCurrentLocation()
                .then(({ latitude, longitude }) => getAddressFromCoords(latitude, longitude))
                .then((address) => {
                    locationInput.value = address; // Autofill location field
                })
                .catch((error) => console.error("Error getting current location:", error));
            
            // Handle form submission
            eventForm.addEventListener('submit', async (e) => {
                e.preventDefault();
    
                const title = document.getElementById('titleBox').value;
                const date = document.getElementById('dateBox').value;
                const time = document.getElementById('timeBox').value;
                const location = locationInput.value;
                const description = document.getElementById('descriptionBox').value;
    
                // Validate form fields
                if (!title || !date || !time || !location || !description) {
                    alert("Please fill out all required fields.");
                    return;
                }
    
                // Get user ID
                const userId = getCurrentUserId();
                if (!userId) {
                    alert("You must be logged in to create an event.");
                    return;
                }
    
                try {
                    // Convert address to coordinates if a location was manually entered
                    const geocoder = new google.maps.Geocoder();
                    const geocodeResult = await new Promise((resolve, reject) => {
                        geocoder.geocode({ address: location }, (results, status) => {
                            if (status === "OK" && results[0]) {
                                const { lat, lng } = results[0].geometry.location;
                                resolve({ latitude: lat(), longitude: lng() });
                            } else {
                                reject(new Error("Unable to retrieve coordinates."));
                            }
                        });
                    });
    
                    // Create event data
                    const eventData = {
                        title,
                        date,
                        time,
                        location, // Address as a string
                        description,
                        coordinates: geocodeResult, // Store coordinates in the database
                    };
    
                    // Create the event in Firestore
                    const eventId = await createEvent(userId, eventData);
                    console.log("Event created with ID:", eventId);
    
                    window.location.href = "/createEvents";
                } catch (error) {
                    console.error("Error creating event:", error);
                }
            });
        }
    }
    async function populateEventCard(events) {
        try {
            const eventContainer = document.getElementById('eventContainer');
    
            if (!events || events.length === 0) {
                eventContainer.innerHTML = '<h2>No events available.</h2>';
                return;
            }
    
            // Get the template
            const template = document.getElementById('eventCard');
            eventContainer.innerHTML = '';
            if (!template) {
                console.error("Template not found");
                return;
            }
            events.forEach((event) => {
                // Clone the template and fill in event data
                const eventCardTemplate = template.cloneNode(true);
                eventCardTemplate.style.display = 'block';
    
                // Populate the title
                const titleSection = eventCardTemplate.querySelector('#eventTitles');
                titleSection.innerHTML = `<h2>${event.title}</h2>`;
    
                // Populate the host name
                const hostSection = eventCardTemplate.querySelector('#eventHost');
                hostSection.innerHTML = `<h5>${event.hostName}</h5>`;
    
                // Populate the description
                const descriptionSection = eventCardTemplate.querySelector('#eventDescription');
                descriptionSection.innerHTML = `<p>${event.description}</p>`;
    
                // Populate the location
                const locationSection = eventCardTemplate.querySelector('#eventLocation');
                locationSection.innerHTML = `<p>${event.location}</p>`;
    
                // Populate the date
                const dateSection = eventCardTemplate.querySelector('#eventDate');
                dateSection.innerHTML = `<p>${event.date}</p>`;
    
                // Populate the time
                const timeSection = eventCardTemplate.querySelector('#eventTime');
                timeSection.innerHTML = `<p>${event.time}</p>`;
    
                // Append the populated template to the container
                eventContainer.appendChild(eventCardTemplate);
            });
    
            eventContainer.classList.add('event-list');
        } catch (error) {
            console.error('An error occurred while populating event cards:', error.message);
        }
    }

    async function displayEvents() {
        try {
            const eventsData = await getAllEvents();
            const eventPage = document.getElementById('eventContainer');
            if (!eventsData || eventsData.length === 0) {
                eventPage.innerHTML = '<h2>No events available.</h2>';
                return;
            }
            // Call the function to populate the event cards
            populateEventCard(eventsData);
        } catch (error) {
            console.error("An error occurred while displaying events:", error);
        }
    }
    // Add event listener for keyword search input submit
    const keywordSearchForm = document.getElementById('keywordSearchForm');
    if (keywordSearchForm) {
        keywordSearchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleKeywordSearch();
        });
    }

    function initializePage() {
        const currentPage = window.location.pathname;
        if (typeof google === 'undefined') {
            window.initMap = initializePage;
            return;
        }
        if (currentPage === '/signup') {
            setupSignupForm();
        } else if (currentPage === '/login') {
            setupLoginPage();
        } else if (currentPage === '/createEvents') {
            setupEventCreation();
            initAutocompleteForEventCreation();
        } else if (currentPage === '/home') {
            initAutocompleteForLocationSearch();
            handleKeywordSearch();
        } else if (currentPage === '/events') {
            onAuthStateChanged(getAuth(), (user) => {
                if (user) {
                    displayEvents();
                } else {
                    console.error("User is not logged in. Unable to display events.");
                }
            });
        }
    }

    window.addEventListener('load', () => {
        initializePage();
        displayLoggedInFeatures();
        hideMenuFeatures();
    });
});
