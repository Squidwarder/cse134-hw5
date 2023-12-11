class weatherWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
			<style>                
                #defaultWeather, .customLocWeather {
                    display: flex;
                    flex-direction: row;
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

			</style>
		`;
        
        this.sanDiegoLatitude = 32.715736;
        this.sanDiegoLongitude = -117.161087;        

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
                let newDailydata = `<div class="weatherEntry">
                <p>Date: ${daily.name}</p>
                <p>Summary: ${daily.shortForecast}</p>
                <p>Max Temperature: ${daily.temperature} ${daily.temperatureUnit}</p>
                </div>`
                defaultList.insertAdjacentHTML("beforeend", newDailydata);
            });
        })

        refreshDefault.addEventListener("click", function(event) {
            console.log("Refresh called");
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
                } else {
                    let customWeatherSection = document.createElement("section");                    
                    customWeatherSection.innerHTML = `
                    <h3>The detailed 7 day weather data</h3>
                    <div class="customLocWeather"></div>
                    `;
                    shadowRoot.appendChild(customWeatherSection);
                    let customList = shadowRoot.querySelector(".customLocWeather")
                    weatherArray7day.forEach(daily => {
                        let newDailydata = `<div class="weatherEntry">
                        <p>Date: ${daily.name}</p>
                        <p>Summary: ${daily.shortForecast}</p>
                        <p>Max Temperature: ${daily.temperature} ${daily.temperatureUnit}</p>
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