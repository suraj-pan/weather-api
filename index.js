const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector(".not-found");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
grantAccessContainer.classList.add("active");

getfromSessionStorage();

function switchTab(newTab){
    if(oldTab !== newTab){
        oldTab.classList.remove("current-tab");

        oldTab = newTab;
        oldTab.classList.add("current-tab");
    

        if(!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        }else{
            searchForm.classList.remove("active");
            userContainer.classList.remove("active");

            getfromSessionStorage();
        }
    }
}


searchTab.addEventListener("click",()=>{
    /// shift to another
    switchTab(searchTab);
})

userTab.addEventListener("click",()=>{
    /// shift to another
    switchTab(userTab);
})



async function fetchUserWeatherInfo(coordinates){

   const {lat,lon} = coordinates;
    notFound.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json()
    // console.log(data)
  
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
   
    renderWeatherInfo(data);
    }catch(err){
        loadingScreen.classList.remove("active");
    }
};

// fetchUserWeatherInfo()


function renderWeatherInfo(data){

    /// puting the data

    const cityName  = document.querySelector("[data-cityName]");
    const flag  = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp =document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const Cloudness = document.querySelector("[data-cloudiness]");

    cityName.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} C`;
    humidity.innerText = `${data?.main?.humidity}%`;
    windSpeed.innerText = `${data?.wind?.speed}m/s`;
    Cloudness.innerText = `${data?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
        alert("no location available");
    }
}


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
  
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
       
    }
}

function showPosition(position){

    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
   fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let cityName  = searchInput.value;

  if(cityName == "") return;
  else{
    fetchSearchWeatherInfo(cityName);
  }
 
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )

        const data = await response.json();
         console.log(response.status);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
       
        if(response.status === 404){
         
            notFound.classList.add("active");
            userInfoContainer.classList.remove("active");
            return
        }
          renderWeatherInfo(data);
    } catch (error) {
      
    }
}