// File contains all main app scripts for CoquiNav website
function getDynamicEndpoint(event) {
    // Function to get endpoints dynamically
    const button = event.target;
    const endpointPath = button.getAttribute('data-endpoint');
    console.log('Retrieved endpoint:', endpointPath);
    return endpointPath;
  }
  
function getApiUrl(endpointPath) {
  // Function to dynamically get the API endpoint url
  const apiBaseUrl = window.location.origin;
  return `${apiBaseUrl}/${endpointPath}`;
}

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

  const pathname = window.location.pathname;

    // Event listener to handle button clicks dynamically
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('button')) {
        const endpointPath = getDynamicEndpoint(event);
        if (endpointPath) {
          await handleFetchAndDisplay(endpointPath);
        }
      }
    })
  }