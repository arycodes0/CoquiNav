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
  
    const dataValidation = await()//fill when above is completed
    if (dataValidation.ok) {
      //Redirect user to homepage
      location.href = '/home.html';
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
          location.href = window.location.origin + '/signup.html';
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
          location.href = window.location.origin + '/login.html';
        }
      }
      catch (error) {
        console.error('Log In redirect could not be fetched.')
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
  
}