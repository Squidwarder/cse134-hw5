class ratingWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
			<style>
                div {
                    display: flexbox;                                       
                    left: 0;
                }
                input.ratingStar {
                    display: none;
                }
				label.ratingStar {                                 
                    font-size: 30px;
					cursor: pointer;
                    color: brown;
                    transition: all 0.2s;
				}
                input.ratingStar:checked ~ label.ratingStar:before {
                    content: '★';
                    transition: all 0.2s;
                }

                label.ratingStar:before {
                    content: '☆';        
                }

                input#star-1:checked ~ label.ratingStar:before {
                    color: red; 
                    text-shadow: black 1px 0 10px;
                }

                input#star-5:checked ~ label.ratingStar:before {
                    color: #33cc33;
                    text-shadow: #00ff55 1px 0 10px;
                }

			</style>
		`;
        

        // ★
        this.ratingContainer = document.createElement("form");
        this.ratingContainer.innerHTML = `
        <label for="rating">How satisfied are you?</label>
        <input type="hidden" name="question" value="How satisfied are you?">
        <input type="hidden" name="sentBy" value="JS">        
        <input type="number" id="rating" name="rating" min=1 max=5
            value=0 required style="display: none;">
        <button type="submit">Submit rating</button>
        `;

        this.ratingStarContainer = document.createElement("div");
        this.ratingStarContainer.innerHTML = `
        <input class="ratingStar" id="star-5" type="radio" name="ratingStar">
        <label class="ratingStar" for="star-5"></label>
        <input class="ratingStar" id="star-4" type="radio" name="ratingStar"> 
        <label class="ratingStar" for="star-4"></label>
        <input class="ratingStar" id="star-3" type="radio" name="ratingStar">
        <label class="ratingStar" for="star-3"></label>
        <input class="ratingStar" id="star-2" type="radio" name="ratingStar">
        <label class="ratingStar" for="star-2"></label>
        <input class="ratingStar" id="star-1" type="radio" name="ratingStar">
        <label class="ratingStar" for="star-1"></label>
        `;
        
        this.rating1star = this.ratingStarContainer.querySelector('#star-1');
        this.rating2star = this.ratingStarContainer.querySelector('#star-2');
        this.rating3star = this.ratingStarContainer.querySelector('#star-3');
        this.rating4star = this.ratingStarContainer.querySelector('#star-4');
        this.rating5star = this.ratingStarContainer.querySelector('#star-5');   
        this.shadowRoot.appendChild(this.ratingStarContainer);
        this.shadowRoot.appendChild(this.ratingContainer);
    }

    connectedCallback() {
        //console.log("Custom rating widget connected!");
        this.ratingContainer.action = "https://httpbin.org/post";
        this.ratingContainer.method = "POST";

        let numRating = this.ratingContainer.querySelector('#rating');
        let shadowRoot = this.shadowRoot;        
        
        this.ratingContainer.addEventListener('submit', function(event) {
            event.preventDefault();
    
            // Prepare FormData from the form
            let formData = new FormData(this);         

            // Use fetch API to send the form data
            fetch('https://httpbin.org/post', {
                method: 'POST',
                headers: {
                    "X-Sent-By": "JS",
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    // Display the response
                    document.getElementById('ratingOutput').textContent = JSON.stringify(data, null, 2);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            let ratingMessage = "";
            if (numRating.value >= 4){
                ratingMessage = `Thanks for a ${numRating.value} rating! Much appreciated`;
            } else {
                ratingMessage = `Thank you for your ${numRating.value} star feedback. I'll try to do better`;
            }
            document.getElementById('ratingMsg').textContent = ratingMessage;
        });

        this.rating1star.addEventListener('click', function(event) {
            console.log("set rating to 1 stars");
            numRating.value = 1;
        });
        this.rating2star.addEventListener('click', function(event) {
            console.log("set rating to 2 stars");
            numRating.value = 2;
        });
        this.rating3star.addEventListener('click', function(event) {
            console.log("set rating to 3 stars");
            numRating.value = 3;
        });
        this.rating4star.addEventListener('click', function(event) {
            console.log("set rating to 4 stars");
            numRating.value = 4;
        });
        this.rating5star.addEventListener('click', function(event) {
            console.log("set rating to 5 stars");
            numRating.value = 5;
        });
    }

    // setRating(rateNum) {
    //     console.log("setRating() is called");
    //     let ratingField = this.ratingContainer.querySelector("#rating");
    //     ratingField.value = rateNum;
    // }

}

customElements.define("rating-widget", ratingWidget);