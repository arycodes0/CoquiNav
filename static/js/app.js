// File contains all main app scripts for CoquiNav website
//Verify user data 
async function verifyUserData(userId, email, password) {
  const userRef = doc(database, 'users', userId);

  try {
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error("Error verifying user data:", error);
      return false;
  }
}


//Signup button onclick

//Sign up send input
async function signupFormSubmit() {
  const signupForm = document.getElementById('signup')
  signupForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const userData = object.formEntries(
      formData.entries());

    //Send user data to backend
    //Route needed
  
    const dataValidation = await verifyUserData()//fill when above is completed
    if (dataValidation.ok) {
      //Redirect user to homepage
      location.href = '/home';
    }
    else {
      //Dialog popup when user info matches database
      var dialogPopup = document.getElementById('dialog')
      var span = document.getElementById('close') [0];
      span.onclick = function(){
        modal.style.display = 'none';
      }
    }
  })
}

//Get user id by email
async function getUserIdByEmail(email) {
  const usersRef = collection(database, 'users');
  const q = query(usersRef, where('email', '==', email));

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id; // Return userId
  } else {
    throw new Error("User not found. Please sign up.");
  }
}

//Handle login
async function handleLogin(email, password) {
  try {
    const userId = await getUserIdByEmail(email);
    const userExists = await verifyUserData(userId, email, password);
    const auth = getAuth();

    if (userExists) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          window.location.href = "/home.html"; // Redirect to home/modify with url later
        }
      });
    } else {
      throw new Error("Login failed. Check your credentials.");
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
    throw error; // Re-throw the error to handle it outside
  }
}

//Home Page
// Initialize and add the map
let map;

async function initMap() {
  console.log("initMap called");
  // The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });
}



//Event Page


//DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed.');
  initMap();
    // Event listener for the Join Us button
    const joinusButton = document.querySelector('.joinusButton');
    console.log(joinusButton);
    if (joinusButton) {
      joinusButton.addEventListener('click', async (event) => {
        console.log('Join Us button clicked');
        try {
          location.href = window.location.origin + '/signup';
        } catch (error) {
          console.error('Signup page could not be fetched.');
        }
      });
    }

    // Event listener to handle sign up button
    const signupButton = document.querySelector('.signupButton');
    console.log('Sign up button:', signupButton);
    if (signupButton) {
      signupButton.addEventListener('click', async (event) => {
        console.log('Sign up button clicked');
        try {
          location.href = window.location.origin + '/signup';
        } catch (error) {
          console.error('Sign Up redirect could not be fetched.');
        }
      });
    }


    // Event listener to handle log in button
    const loginButton = document.querySelector('.loginButton');
    console.log('Log in button:', loginButton);
    if (loginButton) {
      loginButton.addEventListener('click', async (event) => {
        console.log('Log in button clicked');
        try {
          location.href = window.location.origin + '/login';
        } catch (error) {
          console.error('Log In redirect could not be fetched.');
        }
      });
    }
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('pwd').value;
  
        // Check if fields are empty
        if (email === '' || password === '') {
          let warningAlert = document.getElementById('missingInfo');
          warningAlert.style.display = 'flex';
  
          let closeButton = document.querySelector('.close-btn');
          closeButton.addEventListener('click', function () {
            warningAlert.style.display = 'none';
          });
          return;
        }
  
        // Handle user login
        try {
          await handleLogin(email, password);
        } catch (error) {
          console.error('An error occurred during login', error);
          let errorAlert = document.getElementById('wrongInfo');
          errorAlert.textContent = error.message;
          errorAlert.style.display = 'flex';
  
          let closeButton = document.querySelector('.close-btn');
          closeButton.addEventListener('click', function () {
            errorAlert.style.display = 'none';
          });
        }
      });
    }
    // Event listener to handle sign up button
    const createAccount = document.querySelector('.sign-up');
    console.log('Sign up button:', createAccount);
    if (createAccount) {
      createAccount.addEventListener('click', async (event) => {
        console.log('Sign up button clicked');
        try {
          location.href = window.location.origin + '/signup';
        } catch (error) {
          console.error('Sign Up redirect could not be fetched.');
        }
      });
    }

  // Menu item click event listener
  const menuItems = document.querySelectorAll('#menu li a');

  menuItems.forEach(item => {
      item.addEventListener('click', (event) => {
          event.preventDefault();
          const targetId = item.parentElement.className;

          console.log(`${targetId} button clicked`);

          // Redirect based on the clicked menu item
          switch (targetId) {
              case 'home':
                  location.href = window.location.origin + '/home';
                  break;
              case 'events':
                  location.href = window.location.origin + '/events';
                  break;
              case 'hostEvents':
                  location.href = window.location.origin + '/createEvents';
                  break;
              case 'profile':
                  location.href = window.location.origin + '/profile';
                  break;
              case 'logout': //Placeholder for the time being
                  console.log('Logging out...');
                  location.href = '/logout';
                  break;
              default:
                  console.error('Unknown menu item:', targetId);
          }
      });
  });

  // Get references to the month, day, and year dropdowns
  const monthSelect = document.getElementById("month");
  const daySelect = document.getElementById("day");
  const yearSelect = document.getElementById("year");

  // Function to populate the year dropdown
  function populateYears() {
      const currentYear = new Date().getFullYear();
      const earliestYear = 1900;

      for (let year = currentYear; year >= earliestYear; year--) {
          let option = document.createElement("option");
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
      }
  }

  // Function to populate the days based on the selected month
  function populateDays(month) {
      daySelect.innerHTML = ""; // Clear existing options
      let daysInMonth = 31; // Default to 31 days

      // Adjust the number of days based on the selected month
      if (month === 2) { // February
          daysInMonth = 28; // Adjust for February
          // Consider adding logic for leap years if needed
      } else if ([4, 6, 9, 11].includes(month)) { // April, June, September, November
          daysInMonth = 30; // Adjust for months with 30 days
      }

      // Add default "Day" option
      let defaultOption = document.createElement("option");
      defaultOption.textContent = "Day";
      defaultOption.selected = true;
      daySelect.appendChild(defaultOption);

      // Populate the days dynamically
      for (let day = 1; day <= daysInMonth; day++) {
          let option = document.createElement("option");
          option.value = day;
          option.textContent = day;
          daySelect.appendChild(option);
      }
  }

  // Populate days with default 31 on page load for January
  populateDays(1); // Default to January

  // Event listener to update the days when the month changes
  monthSelect.addEventListener("change", () => {
      const selectedMonth = parseInt(monthSelect.value);
      // Only call populateDays if a valid month is selected
      if (selectedMonth >= 1 && selectedMonth <= 12) {
          populateDays(selectedMonth);
      }
  });

  // Populate years on page load
  populateYears();

})
