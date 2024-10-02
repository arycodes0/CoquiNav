// File contains all main app scripts for CoquiNav website

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

//DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed.');

    // Event listener to handle index Join Us button
    document.addEventListener('click', async (event) => {
      try {
        if (event.target.classList.contains('signup-container')) {
          location.href = window.location.origin + '/signup';
        }
      }
      catch (error) {
        console.error('Signup page could not be fetched.')
      }
    });

    // Event listener to handle log in button
    document.addEventListener('click', async (event) => {
      try {
        if (event.target.classList.contains('loginButton')) {
          location.href = window.location.origin + '/login';
        }
      }
      catch (error) {
        console.error('Log In redirect could not be fetched.')
      }
    });

    // Event listener to handle log in form submit
    let loginForm = document.getElementById("");
    loginForm.addEventListener('submit', (e) => {e.preventDefault();
      const email = document.getElementById('email');
      const password = document.getElementById('pwd');

      //Check if fields are empty
      if (email.value == ''|| password.value == '') {
        // Alert moodal for empty fields
        let warningAlert = document.getElementById('missingInfo');
        warningAlert.style.display = 'flex';
        // Close button for modal
        let closeButton = document.querySelector('.close-btn');
        closeButton.addEventListener('click', function() {
          warningAlert.style.display = 'none;'
        });
        return;
        }

        // Verify user info
        try {
          const verifyData = verifyUserData()
        
        if (!verifyData.ok) {
          throw new Error('Login failed. Check your credentials.')
        }
        const data = verifyData.json()
        // If info is correct, redirect user to homepage
        window.location.href = '/home.html'
      }
      catch (error) {
        console.error("An error occurred during login")
        // Alert modal for wrong user info
        let errorAlert = document.getElementById('wrongInfo');
        errorAlert.textContent = error.message;
        errorAlert.style.display = 'flex';

        let closeButton = document.querySelector('.close-btn');
        closeButton.addEventListener('click', function() {
          errorAlert.style.display = 'none';
        });
        return;
      }
      });

    // Event listener to handle sign up button
    document.addEventListener('click', async (event) => {
      try {
        if (event.target.classList.contains('signupButton')) {
          location.href = window.location.origin + '/signup.html';
        }
      }
      catch (error) {
        console.error('Sign Up redirect could not be fetched.')
      }
  });
  
  $('#login-button').click(function() {
    $('.login-form').toggleClass('open');
  })
})
document.getElementById('login-button').addEventListener('click', function () {
  const loginForm = document.querySelector('.login-form');
  if (loginForm.classList.contains('open')) {
    loginForm.classList.remove('open'); // Close the form if it's already open
  } else {
    loginForm.classList.add('open'); // Open the form
  }
});
