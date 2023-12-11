class weatherWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
			<style>                
                
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
                   
        let sanDiegoLatitude = this.sanDiegoLatitude;
        let sanDiegoLongitude = this.sanDiegoLongitude;
        let inputLatitude = this.weatherContainer.querySelector('#locLatitude');
        let inputLongitude = this.weatherContainer.querySelector('#locLongitude');      
        this.getWeatherBtn.addEventListener('click', function(event) {        
            // console.log(inputLatitude.value);
            
            getWeather(inputLatitude.value, inputLongitude.value);
        });
        
    }    
}

customElements.define("weather-widget", weatherWidget);

function getWeather(latitude, longitude) {    

    let secondRequest = "";
    // Use fetch API to send the form data
    fetch(`https://api.weather.gov/points/${latitude},${longitude}`, {
        method: 'GET'
        
    })
        .then(response => response.json())
        .then(data => {
            // Display the response                        
            document.getElementById('weatherOutput').textContent = JSON.stringify(data, null, 2);
            // console.log(data.properties);
            secondRequest = data.properties.forecast;
            
            // console.log("Second request on the next line");
            // console.log(secondRequest);
            // console.log("https://api.weather.gov/gridpoints/SGX/57,14/forecast");
            // console.log("Are these equivalent: secondRequest & https://api.weather.gov/gridpoints/SGX/57,14/forecast");
            // console.log(secondRequest === "https://api.weather.gov/gridpoints/SGX/57,14/forecast");
            
            get7dayWeather(secondRequest);
        })
        .catch(error => {
            console.error('Error on initial fetch:', error);
        });    
    

    let weatherMessage = `This is the weather data at location (${latitude}, ${longitude})`;
    
    document.getElementById('weatherMsg').textContent = weatherMessage;
}

function get7dayWeather(request) {
    fetch(request, {
        method: 'GET'
        
    })
        .then(response => response.json())
        .then(data => {
            // Display the response                        
            
            // console.log(data);
            let weatherArray7day = data.properties.periods;
            weatherArray7day.forEach(dayWeather => {
                console.log(dayWeather);
            });
        })
        .catch(error => {
            console.error('Error on second fetch:', error);
        });
}

function getLocationSuccess() {

}

function getLocationFailed() {
    
}