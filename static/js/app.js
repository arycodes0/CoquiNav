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

$("#signupButton").on("submit", function(event){
  eventpreventDefault();
  //Gather user data
  var signupForm = {
    firstName: $('#first-name').val(),
    lastName: $('#last-name').val(),
    email: $('#email').val(),
    password: $('#pwd').val(),
    month: $('#month').val(),
    day: $('#day').val(),
    year: $('#year').val()
  };

  //Validate data againts User database
  var validateForm = validateUser()
  if (signupForm) == validateForm{
    try:
      $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        position: {
          my: "center",
          at: "center"
        }
      })
  }
})