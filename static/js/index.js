// Import necessary Firebase functions
import { database, auth } from './firebase-config.js';
import { getUserData, verifyUserCredentials, generateUniqueId, addUserToDatabase, signupFormSubmit, handleLogin, signupError } from './auth.js';
import { initMap } from './app.js';

// DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed.');
    
    const currentPage = window.location.pathname;

    // Global Navigation Buttons Setup
    function setupGlobalButtons() {
        const joinusButton = document.querySelector('.joinusButton');
        if (joinusButton) {
            joinusButton.addEventListener('click', () => {
                console.log('Join Us button clicked');
                location.href = window.location.origin + '/signup';
            });
        }

        const signupButton = document.querySelector('.signupButton');
        if (signupButton) {
            signupButton.addEventListener('click', () => {
                console.log('Sign up button clicked');
                location.href = window.location.origin + '/signup';
            });
        }

        const loginButton = document.querySelector('.loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                console.log('Login button clicked');
                location.href = window.location.origin + '/login';
            });
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


    // Function to set up login page form
    function setupLoginPage() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('pwd').value;

                if (!email || !password) {
                    const warningAlert = document.getElementById('missingInfo');
                    warningAlert.style.display = 'flex';
                    document.querySelector('.close-btn').addEventListener('click', () => {
                        warningAlert.style.display = 'none';
                    });
                    return;
                }

                try {
                    await handleLogin(email, password);
                } catch (error) {
                    const errorAlert = document.getElementById('wrongInfo');
                    errorAlert.textContent = error.message;
                    errorAlert.style.display = 'flex';
                    document.querySelector('.close-btn').addEventListener('click', () => {
                        errorAlert.style.display = 'none';
                    });
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
                    case 'logout': console.log('Logging out...'); location.href = '/logout'; break;
                    default: console.error('Unknown menu item:', targetId);
                }
            });
        });
    }

    // Page-specific setup
    if (currentPage === '/signup') {
        setupSignupPage();
        setupSignupForm();
    } else if (currentPage === '/login') {
        setupLoginPage();
    }

    // Menu setup for all pages
    setupMenuItems();

    // Only initialize the map if you're on the correct page
    if (currentPage === '/home') { // Change '/map' to the actual path where the map should appear
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            // Initialize your Google Map here
            initMap();
        } else {
            console.error('Map container not found.');
        }
    }
});
