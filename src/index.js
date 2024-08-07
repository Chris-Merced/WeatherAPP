import "./style.css";

let tempSwitch;

if (!localStorage.getItem('tempSwitch')){
    setStorage();
    getWeather().then(function(weather){
        initializePage(weather)
        setTempStyle(weather);
        setButton(weather);
        setSearch();
    })}
else {
    getStorage()
    getWeather().then(function(weather){
        initializePage(weather)
        setTempStyle(weather);
        setButton(weather);
        setSearch();
    })}

const addressDiv = document.createElement("div");
const weatherDiv = document.createElement("div");
const body = document.querySelector("body");


async function getWeather(city = "San Jose"){
    try{
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=SWF4YQ79T863KZTK87YYB5BLA&contentType=json`, {mode: 'cors'});
        const weather = await response.json();
        console.log(weather);
        return weather;
    }catch{
        addressDiv.textContent = "invalid location";
    }
};


function initializePage(weather){
    if (weather.resolvedAddress === undefined){
        addressDiv.textContent = "Unknown Location";
        weatherDiv.textContent = "";
        return;
    }
    addressDiv.textContent = weather.resolvedAddress;
    setTempStyle(weather);
    
    body.appendChild(addressDiv)
    body.appendChild(weatherDiv)
    
}
    
function setButton(weather){
    const tempButton = document.createElement("button");
    tempButton.textContent = "Change Temperature Style"
    tempButton.classList = "tempButton";
    
    tempButton.addEventListener("click", () => {
        console.log("hi")
        console.log(tempSwitch);
        if (tempSwitch === 0){
        weatherDiv.textContent = `${(weather.currentConditions.temp*2)+30} F
        and it is ${weather.currentConditions.conditions}`;
        tempSwitch = 1;}
        else{ weatherDiv.textContent = `${weather.currentConditions.temp} C and it is 
        ${weather.currentConditions.conditions}`
        tempSwitch = 0;}
        setStorage();
    })

    body.appendChild(tempButton);
}


function setTempStyle(weather){
    if (tempSwitch === 1){
        weatherDiv.textContent = `${(weather.currentConditions.temp*2)+30} F
        and it is ${weather.currentConditions.conditions}`;}
    else{ weatherDiv.textContent = `${weather.currentConditions.temp} C and it is 
        ${weather.currentConditions.conditions}`}
}

function setSearch(){ 
    const input = document.querySelector("#city");
    input.addEventListener("input", ()=>{
        if (input.validity.patternMismatch){
            input.setCustomValidity("Only Letters You Weirdo");
            input.reportValidity();
        }else{input.setCustomValidity("")}
    })
    
    const searchForm = document.getElementById('search');
    searchForm.addEventListener("submit", ()=>{
        event.preventDefault();
        const city = document.getElementById("city").value
        getWeather(city).then(function(weather){
            updatePage(weather);
            const button = document.querySelector(".tempButton");
            const newButton = button.cloneNode();
            button.parentElement.querySelector(".tempButton").remove();
            setButton(weather);

        })
    })
}

function updatePage(weather){
    try{addressDiv.textContent = weather.resolvedAddress;
    setTempStyle(weather);}
    catch{
        
        addressDiv.textContent = "Unknown Location";
        weatherDiv.textContent = "";
        return;
    
    }
}
function setStorage(){
    localStorage.setItem('tempSwitch', tempSwitch);
}

function getStorage(){
    tempSwitch = parseInt(localStorage.getItem('tempSwitch'));
}