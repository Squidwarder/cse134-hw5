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

                let imgPath = forecastToIcon(daily.shortForecast, hour);
                // console.log(imgPath);
                let newDailydata = `<div class="weatherEntry">
                <p>${daily.name}</p>
                <p>${formattedDate}</p>
                <p>${daily.shortForecast}</p>
                <picture>
                <img src="${imgPath}" alt="Weather Icon">
                </picture>
                <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                <p>Humidity: ${daily.relativeHumidity.value} %</p>
                <p>Wind: ${daily.windSpeed} from ${daily.windDirection}</p>
                </div>`
                defaultList.insertAdjacentHTML("beforeend", newDailydata);
            });
        })

        refreshDefault.addEventListener("click", function(event) {
            console.log("Refresh called");
            this.textContent = "Refreshing...";

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

                    let imgPath = forecastToIcon(daily.shortForecast, hour);
                    let newDailydata = `<div class="weatherEntry">
                    <p>${daily.name}</p>
                    <p>${formattedDate}</p>
                    <p>${daily.shortForecast}</p>
                    <picture>
                    <img src="${imgPath}" alt="Weather Icon">
                    </picture>
                    <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                    <p>Humidity: ${daily.relativeHumidity.value} %</p>
                    <p>Wind: ${daily.windSpeed} from ${daily.windDirection}</p>
                    </div>`
                    defaultList.insertAdjacentHTML("beforeend", newDailydata);
                });
                console.log("Refresh worked");
                
                this.textContent = "Refresh";
            })

            
        })

        let inputLatitude = this.weatherContainer.querySelector('#locLatitude');
        let inputLongitude = this.weatherContainer.querySelector('#locLongitude');      
        this.getWeatherBtn.addEventListener('click', function(event) {         

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

                        let imgPath = forecastToIcon(daily.shortForecast, hour);
                        let newDailydata = `<div class="weatherEntry">
                        <p>${daily.name}</p>
                        <p>${formattedDate}</p>
                        <p>${daily.shortForecast}</p>
                        <picture>
                        <img src="${imgPath}" alt="Weather Icon">
                        </picture>
                        <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                        <p>Humidity: ${daily.relativeHumidity.value} %</p>
                        <p>Wind: ${daily.windSpeed} from ${daily.windDirection}</p>
                        </div>`
                        customList.insertAdjacentHTML("beforeend", newDailydata);
                    })

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

                        let imgPath = forecastToIcon(daily.shortForecast, hour);
                        let newDailydata = `<div class="weatherEntry">
                        <p>${daily.name}</p>
                        <p>${formattedDate}</p>
                        <p>${daily.shortForecast}</p>
                        <picture>
                        <img src="${imgPath}" alt="Weather Icon">
                        </picture>
                        <p>Max Temp: ${daily.temperature} °${daily.temperatureUnit}</p>
                        <p>Humidity: ${daily.relativeHumidity.value} %</p>
                        <p>Wind: ${daily.windSpeed} from ${daily.windDirection}</p>
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
            let weatherMessage = "";
            if (latitude === 32.71571 && longitude === -117.16472) {
                weatherMessage = `This is the weather data at location (${latitude}, ${longitude}) which is the default, San Diego`;
            } else {                
                weatherMessage = `This is the weather data at location (${latitude}, ${longitude})`;
            }
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

function forecastToIcon(forecast, time) {
    const forecastArray = forecast.split("then");
    let isDay = true;
    if (time > 12) {
        isDay = false;
    }
    // console.log(forecastArray[0]);

    let representWeather = forecastArray[0];

    if (representWeather.includes("Sunny")) {
        if (representWeather.includes("Mostly")) {
            return "Weather_Icons/mostly_sunny.png";
        }

        return "Weather_Icons/sunny.png";
    }

    if (representWeather.includes("Clear")) {
        if (representWeather.includes("Mostly")) {
            if (isDay) {
                return "Weather_Icons/few.jpg";
            } else {
                return "Weather_Icons/nfew.jpg";
            }
        }

        if (isDay) {
            return "Weather_Icons/skc.jpg";
        } else {
            return "Weather_Icons/nskc.jpg";
        }
    }

    if (representWeather.includes("Cloudy")) {
        if (representWeather.includes("Mostly")) {
            if (isDay) {
                return "Weather_Icons/bkn.jpg";
            } else {
                return "Weather_Icons/nbkn.jpg";
            }
        }
        
        if (representWeather.includes("Few")) {
            if (isDay) {
                return "Weather_Icons/few.jpg";
            } else {
                return "Weather_Icons/nfew.jpg";
            }
        }

        if (representWeather.includes("Partly")) {
            if (isDay) {
                return "Weather_Icons/sct.jpg";
            } else {
                return "Weather_Icons/nsct.jpg";
            }
        }
    }

    if (representWeather.includes("Overcast")) {
        if (isDay) {
            return "Weather_Icons/ovc.jpg";
        } else {
            return "Weather_Icons/novc.jpg";
        }
    }

    if (representWeather.includes("Smoke")) {
        return "Weather_Icons/smoke.jpg";
    }

    if (representWeather.includes("Fog")) {
        if (isDay) {
            return "Weather_Icons/fg.jpg";
        } else {
            return "Weather_Icons/nfg.jpg";
        }
    }

    if (representWeather.includes("Freez")) {        
        return "Weather_Icons/fzra.jpg";
    }

    if (representWeather.includes("Ice") || representWeather.includes("Hail")) {        
        return "Weather_Icons/ip.jpg";
    }

    if (representWeather.includes("Freez") && representWeather.includes("Snow")) {
        if (isDay) {
            return "Weather_Icons/mix.jpg";
        } else {
            return "Weather_Icons/nmix.jpg";
        }
    }

    if (representWeather.includes("Rain") && representWeather.includes("Ice")) {
        return "Weather_Icons/raip.jpg";
    }

    if (representWeather.includes("Rain") && representWeather.includes("Snow")) {
        if (isDay) {
            return "Weather_Icons/rasn.jpg";
        } else {
            return "Weather_Icons/nrasn.jpg";
        }
    }

    if (representWeather.includes("Showers")) {
        return "Weather_Icons/shra.jpg";
    }

    if (representWeather.includes("Thunderstorm") || representWeather.includes("storm")) {
        if (isDay) {
            return "Weather_Icons/tsra.jpg";
        } else {
            return "Weather_Icons/ntsra.jpg";
        }
    }

    if (representWeather.includes("Snow")) {
        if (isDay) {
            return "Weather_Icons/sn.jpg";
        } else {
            return "Weather_Icons/nsn.jpg";
        }
    }

    if (representWeather.includes("Windy")) {
        if (isDay) {
            return "Weather_Icons/wind.jpg";
        } else {
            return "Weather_Icons/nwind.jpg";
        }
    }

    if (representWeather.includes("Shower") && representWeather.includes("Vicinity")) {
        if (isDay) {
            return "Weather_Icons/hi_shwrs.jpg";
        } else {
            return "Weather_Icons/hi_nshwrs.jpg";
        }
    }

    if (representWeather.includes("Thunderstorm") && representWeather.includes("Vicinity")) {
        if (isDay) {
            return "Weather_Icons/hi_tsra.jpg";
        } else {
            return "Weather_Icons/hi_ntsra.jpg";
        }
    }

    if (representWeather.includes("Light Rain") || representWeather.includes("Drizzle")) {
        if (isDay) {
            return "Weather_Icons/ra1.jpg";
        } else {
            return "Weather_Icons/nra.jpg";
        }
    }

    if (representWeather.includes("Rain")) {
        if (isDay) {
            return "Weather_Icons/ra.jpg";
        } else {
            return "Weather_Icons/nra.jpg";
        }
    }

    if (representWeather.includes("Funnel") || representWeather.includes("Tornado")) {
        return "Weather_Icons/nsvrtsra.jpg"
    }

    if (representWeather.includes("Dust")) {
        return "Weather_Icons/dust.jpg"
    }

    if (representWeather.includes("Haze")) {
        return "Weather_Icons/mist.jpg"
    }

    //? Some default value in case everything else fails
    return "Weather_Icons/sunny.png"
    
}