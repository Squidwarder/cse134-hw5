class weatherWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
			<style>                
                #defaultWeather, .customLocWeather {
                    max-width: 100vw;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }

                .weatherEntry {
                    border: 2px solid #1a8cff;
                    border-radius: 2vw;
                    padding: 1vh 1vw 1vh 1vw;
                    margin: 1vh 1vw 1vh 1vw;
                    color: #1a8cff;
                    background-color: white;
                    min-width: 240px;      
                }

                .weatherEntry:hover {
                    color: white;
                    background-color: #005ce6;
                }

				button.weatherButton {                                 
                    font-size: 15px;
					cursor: pointer;
                    color: #ff3385;
                    text-shadow: #ff80ff 1px 0 10px;
                    border: 2px solid #ff3385;
                    background-color: white;           
				}
                

                button.weatherButton:hover {
                    color: white;
                    background-color: #ff3385;                    
                }
                
                picture img {
                    max-width: 230px;
                    border-radius: 1vw;
                }

			</style>
		`;
        
        this.sanDiegoLatitude = 32.71571;
        this.sanDiegoLongitude = -117.16472;

        this.weatherContainer = document.createElement("div");
        this.weatherContainer.innerHTML = `
        <section>
        <h3>The detailed 7 day weather data for San Diego (default)</h3>
        <button class="weatherButton" id="refreshDefault" name="refreshBtn">Refresh default</button>
        <div id="defaultWeather"></div>
        </section>
        <label for="locLatitude">Latitude</label>
        <input type="text" id="locLatitude"name="locationLatitude" value="${this.sanDiegoLatitude}" required></input>
        <label for="locLongitude">Longitude</label>
        <input type="text" id="locLongitude"name="locationLongitude" value="${this.sanDiegoLongitude}" required></input>
        <button class="weatherButton" id="getWeatherBtn" name="weatherButton">Get weather Data</button>    
        `;
        
        this.getWeatherBtn = this.weatherContainer.querySelector('#getWeatherBtn');    
        this.shadowRoot.appendChild(this.weatherContainer);
    }

    connectedCallback() {
        //console.log("Custom weather widget connected!");
        let shadowRoot = this.shadowRoot;
        let sanDiegoLatitude = this.sanDiegoLatitude;
        let sanDiegoLongitude = this.sanDiegoLongitude;
        let refreshDefault = this.weatherContainer.querySelector('#refreshDefault');

        //* Fill out default San Diego weather data
        let sanDiego7day = getWeather(sanDiegoLatitude, sanDiegoLongitude);
        sanDiego7day.then(weatherArray7day => {
            let defaultList = shadowRoot.querySelector('#defaultWeather');
            console.log(weatherArray7day);
            weatherArray7day.forEach(daily => {
                const startDate = new Date(daily.startTime);
                const year = startDate.getFullYear();
                const month = startDate.getMonth() + 1;
                const day = startDate.getDate();
                const hour = startDate.getHours();
                let formattedDate = `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}
                                            ${hour < 12 ? hour : hour - 12}${hour < 12 ? "AM" : "PM"}`;

                let newDailydata = `<div class="weatherEntry">
                <p>${daily.name}</p>
                <p>${formattedDate}</p>
                <p>${daily.shortForecast}</p>
                <picture>
                <img src="${daily.icon}" alt="Weather Icon">
                </picture>
                <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                <p>Humidity: ${daily.relativeHumidity.value} %</p>
                <p>Wind: ${daily.windSpeed} to ${daily.windDirection}</p>
                </div>`
                defaultList.insertAdjacentHTML("beforeend", newDailydata);
            });
        })

        refreshDefault.addEventListener("click", function(event) {
            console.log("Refresh called");

            let sanDiego7day = getWeather(sanDiegoLatitude, sanDiegoLongitude);
            sanDiego7day.then(weatherArray7day => {
                let defaultList = shadowRoot.querySelector('#defaultWeather');
                defaultList.innerHTML = "";
                console.log(weatherArray7day);
                weatherArray7day.forEach(daily => {
                    const startDate = new Date(daily.startTime);
                    const year = startDate.getFullYear();
                    const month = startDate.getMonth() + 1;
                    const day = startDate.getDate();
                    const hour = startDate.getHours();
                    let formattedDate = `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}
                                                ${hour < 12 ? hour : hour - 12}${hour < 12 ? "AM" : "PM"}`;

                    let newDailydata = `<div class="weatherEntry">
                    <p>${daily.name}</p>
                    <p>${formattedDate}</p>
                    <p>${daily.shortForecast}</p>
                    <picture>
                    <img src="${daily.icon}" alt="Weather Icon">
                    </picture>
                    <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                    <p>Humidity: ${daily.relativeHumidity.value} %</p>
                    <p>Wind: ${daily.windSpeed} to ${daily.windDirection}</p>
                    </div>`
                    defaultList.insertAdjacentHTML("beforeend", newDailydata);
                });
                console.log("Refresh worked");
            })

            
        })

        let inputLatitude = this.weatherContainer.querySelector('#locLatitude');
        let inputLongitude = this.weatherContainer.querySelector('#locLongitude');      
        this.getWeatherBtn.addEventListener('click', function(event) {        
            // console.log(inputLatitude.value);
            
            let weather7Day = getWeather(inputLatitude.value, inputLongitude.value);
            weather7Day.then(weatherArray7day => {
                // console.log(weatherArray7day);
                let el = shadowRoot.querySelector('.customLocWeather');
			    if (el) {
                    let customList = shadowRoot.querySelector(".customLocWeather")
                    console.log("The custom Location Weather list is already added");
                    customList.innerHTML = "";

                    weatherArray7day.forEach(daily => {
                        const startDate = new Date(daily.startTime);
                        const year = startDate.getFullYear();
                        const month = startDate.getMonth() + 1;
                        const day = startDate.getDate();
                        const hour = startDate.getHours();
                        let formattedDate = `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}
                                                    ${hour < 12 ? hour : hour - 12}${hour < 12 ? "AM" : "PM"}`;

                        let newDailydata = `<div class="weatherEntry">
                        <p>${daily.name}</p>
                        <p>${formattedDate}</p>
                        <p>${daily.shortForecast}</p>
                        <picture>
                        <img src="${daily.icon}" alt="Weather Icon">
                        </picture>
                        <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                        <p>Humidity: ${daily.relativeHumidity.value} %</p>
                        <p>Wind: ${daily.windSpeed} to ${daily.windDirection}</p>
                        </div>`
                        customList.insertAdjacentHTML("beforeend", newDailydata);
                    })

                    console.log("The update worked");

                } else {
                    let customWeatherSection = document.createElement("section");                    
                    customWeatherSection.innerHTML = `
                    <h3>The detailed 7 day weather data</h3>
                    <div class="customLocWeather"></div>
                    `;
                    shadowRoot.appendChild(customWeatherSection);
                    let customList = shadowRoot.querySelector(".customLocWeather")
                    weatherArray7day.forEach(daily => {
                        const startDate = new Date(daily.startTime);
                        const year = startDate.getFullYear();
                        const month = startDate.getMonth() + 1;
                        const day = startDate.getDate();
                        const hour = startDate.getHours();
                        let formattedDate = `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}
                                                    ${hour < 12 ? hour : hour - 12}${hour < 12 ? "AM" : "PM"}`;

                        let newDailydata = `<div class="weatherEntry">
                        <p>${daily.name}</p>
                        <p>${formattedDate}</p>
                        <p>${daily.shortForecast}</p>
                        <picture>
                        <img src="${daily.icon}" alt="Weather Icon">
                        </picture>                        
                        <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                        <p>Humidity: ${daily.relativeHumidity.value} %</p>
                        <p>Wind: ${daily.windSpeed} to ${daily.windDirection}</p>
                        </div>`
                        customList.insertAdjacentHTML("beforeend", newDailydata);
                    })
                }
            })
            
        });
        
    }    
}
customElements.define("weather-widget", weatherWidget);

function getWeather(latitude, longitude) {    

    // Use fetch API to send the get request
    return fetch(`https://api.weather.gov/points/${latitude},${longitude}`, {
        method: 'GET'
        
    })
        .then(response => response.json())
        .then(data => {
            // Display the response                        
            document.getElementById('weatherOutput').textContent = JSON.stringify(data, null, 2);
            // console.log(data.properties);
            let secondRequest = data.properties.forecast;

            let weatherMessage = `This is the weather data at location (${latitude}, ${longitude})`;    
            document.getElementById('weatherMsg').textContent = weatherMessage;
            
            return get7dayWeather(secondRequest);            
        })
        .catch(error => {
            console.error('Error on initial fetch:', error);
        });        
    
}

function get7dayWeather(request) {
    return fetch(request, {
        method: 'GET'
        
    })
        .then(response => response.json())
        .then(data => {
            // Display the response                        
            
            // console.log(data);
            let weatherArray7day = data.properties.periods;
            for (let i = 0; i < weatherArray7day.length; i++) {
                // console.log(weatherArray7day[i]);
            }
            // console.log(weatherArray7day);
            return weatherArray7day;
        })
        .catch(error => {
            console.error('Error on second fetch:', error);
        });
}