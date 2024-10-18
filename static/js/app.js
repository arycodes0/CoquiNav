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

//DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed.');

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
})
