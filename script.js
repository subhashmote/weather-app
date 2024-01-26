
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessConatiner = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initailly variables need

let currentTab = userTab;
const API_KEY = 'cfe690cf6d39cb74d59e7c262ceb1d4d';
currentTab.classList.add("current-tab");
console.log("ya ha tak thik hai");
getfromSessionStorage();

console.log("hey hii");


function switchTab(clickedTab) {
    if (currentTab != clickedTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if (!searchForm.classList.contains("active")) {
            // check kiya ki search form vala container invisible hai.if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessConatiner.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // aab mai your weather tab mai aya hu , toh muzhe mera current loaction ka weather dikhana padega ,so to get current coordinates we search loacl search is there local coordinates are stored there or not.
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})



// check if coordinates are already stored in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // local coordinates nahi mile toh
        grantAccessConatiner.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}



async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grant access container invisible 
    grantAccessConatiner.classList.remove("active");
    // show loading gif
    loadingScreen.classList.add("active");

    // API Call
    try {
        console.log("request gayi bhai");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        if (response.ok) {
            // Request was successful, proceed with handling the response
            const data = await response.json();
            console.log(data);
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            // Request was not successful, handle the error
            console.error('Error:', response.status, response.statusText);
        }

        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        // const data = await response.JSON();
        // console.log("response aa gaya");

    }
    catch (err) {
        loadingScreen.classList.remove("active");
    }
}


function renderWeatherInfo(weatherInfo) {
    // first we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryFlag = document.querySelector("[data-countryFlag]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudyness = document.querySelector("[data-cloudiness]");

    // ?. operator is used to access the properties or methods of the JSON object 
    // if it's null or undefined then return undefined instead of throwing an error
    cityName.innerText = weatherInfo?.name;
    if (weatherInfo?.sys?.country) {
        const countryFlagUrl = `https://flagcdn.com/144x108/${weatherInfo.sys.country.toLowerCase()}.png`;
        countryFlag.src = countryFlagUrl;
    } else {
        console.error('Unable to set country flag URL. Check the weatherInfo object.');
    }


    if (weatherInfo?.weather && weatherInfo.weather.length > 0) {
        const iconCode = weatherInfo.weather[0].icon;
        if (iconCode) {
            const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
            weatherIcon.src = iconUrl;
        } else {
            console.error('Icon code is not defined in the weather data.');
        }
    } else {
        console.error('Unable to set weather icon URL. Check the weatherInfo object.');
    }


    // countryFlag.src = `https://flagcdn.com/144×108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo.weather?.[0].icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudyness.innerText = `${weatherInfo?.clouds?.all} %`;
}


function showPosition(position) {
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("no geolocation support available");
    }
}


// get rant access button
const grantAccessButton = document.querySelector("[data-grantAccess]");

// add click event on grant access button when we click on that button our currentlongitude and latitude are calculated and being stored in session storage.
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    //checking if the input field is empty or not
    if (cityName === "") {
        return;
    }
    else {
        fetchsearchWeatherInfo(cityName);
    }
})

async function fetchsearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessConatiner.classList.remove("active");


    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

        if (response.ok) {
            // const data = await response.json();
            // console.log(data);
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            console.error('Error:', response.status, response.statusText);
        }

        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);

    }
    catch (err) {
        console.log(err);
    }
}






















// const API_key = 'cfe690cf6d39cb74d59e7c262ceb1d4d'; // Replace with your OpenWeatherMap API key
// const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${apiKey}`;



/*
async function showWeather(){
    // let city ="Pune";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_key}`);
    const data = await response.json();

    // console.log("Weather data:",data);

    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} `;

    document.body.appendChild(newPara);


// try {
//   const response = await fetch(apiUrl);
//   if (!response.ok) {
//     throw new Error(`HTTP error! Status: ${response.status}`);
//   }
  
//   const data = await response.json();
//   console.log("Weather data:", data);
// } catch (error) {
//   console.error('Error fetching weather data:', error);
// }
}


showWeather();

*/

/*
const API_key = 'cfe690cf6d39cb74d59e7c262ceb1d4d';


function renderDataOnUI(data,city) {
    let newPara = document.createElement('p');

    newPara.textContent = `${data?.main?.temp?.toFixed(2)} °C`;

    document.body.appendChild(newPara);

    console.log("City Name:", city);
    console.log("Weather information", data);
}

async function fetchWeatherDetails() {

    try {
        let city = "Mumbai";

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data = await response.json();

        renderDataOnUI(data,city); // call renderfunction which d=renders the data on UI
    }
    catch (err) {
        // Here we handle the error.
        console.error('Error fetching weather data:', err);
    }

}


// fetchWeatherDetails();


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("no geolocation support");
    }
}

function showPosition(position){
    let lat = position.coords.latitude;
    let longi = position.coords.longitude;

    console.log(lat);
    console.log(longi);
}

*/