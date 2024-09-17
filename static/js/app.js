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