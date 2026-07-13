

const weatherApi = "https://api.weather.gov/alerts/active?area=";

// -----------------------------
// DOM references
// -----------------------------
const fetchButton = document.getElementById("fetch-alerts");
const stateInput = document.getElementById("state-input");
const errorMessage = document.getElementById("error-message");
const alertsDisplay = document.getElementById("alerts-display");

// -----------------------------
// Step 1: Fetch Alerts for a State from the API
// -----------------------------
function fetchWeatherAlerts(state) {
  const STATE_ABBR = state.toUpperCase();

  return fetch(`${weatherApi}${STATE_ABBR}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // log for testing, used again in Step 2
      return data;
    })
    .catch((error) => {
      console.log("Error fetching weather alerts:", error);
      throw error; // re-throw so the caller can also react (Step 4)
    });
}

// -----------------------------
// Step 2: Display the Alerts on the Page
// -----------------------------
function displayAlerts(data) {
  clearAlerts(); // make sure the display + error message are reset first

  const alerts = data.features || [];

  const header = document.createElement("h2");
  header.textContent = `Weather Alerts: ${alerts.length}`;
  alertsDisplay.appendChild(header);

  alerts.forEach((alert) => {
    const props = alert.properties;

    const item = document.createElement("div");
    item.textContent = props.headline || props.description || props.event || "";

    alertsDisplay.appendChild(item);
  });
}

// -----------------------------
// Step 3: Clear and Reset the UI
// -----------------------------
function clearAlerts() {
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

// -----------------------------
// Step 4: Implement Error Handling
// -----------------------------
function showError(message) {
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

// -----------------------------
// Wire everything together
// -----------------------------
fetchButton.addEventListener("click", (event) => {
  const state = stateInput.value.trim();

  // Clear the input right away
  stateInput.value = "";

  if (!state) {
    showError("Please enter a state abbreviation.");
    return;
  }

  fetchWeatherAlerts(state)
    .then((data) => displayAlerts(data))
    .catch((error) => {
      showError(error.message);
    });
});