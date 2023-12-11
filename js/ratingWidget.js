class ratingWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.ratingContainer = document.createElement("form");
        this.ratingContainer.innerHTML = `
        <label for="rating">How satisfied are you?</label>
        <input type="hidden" name="question" value="How satisfied are you?">
        <input type="hidden" name="sentBy" value="JS">        
        <input type="hidden" id="rating" name="rating" required>
        <button type="submit">Submit rating</button>
        `
        
        this.ratingStarContainer = document.createElement("div");
        this.ratingStarContainer.innerHTML = `
        <label for="star-1">★</label>
        <input id="star-1" type="radio" style="display: none;">
        <label for="star-2">★</label>
        <input id="star-2" type="radio" style="display: none;">
        <label for="star-3">★</label>
        <input id="star-3" type="radio" style="display: none;">
        <label for="star-4">★</label>
        <input id="star-4" type="radio" style="display: none;">
        <label for="star-5">★</label>
        <input id="star-5" type="radio" style="display: none;">
        `
        
        this.shadowRoot.appendChild(this.ratingStarContainer);
        this.shadowRoot.appendChild(this.ratingContainer);
    }

    connectedCallback() {
        //console.log("Custom rating widget connected!");
        this.ratingContainer.action = "https://httpbin.org/post";
        this.ratingContainer.method = "POST";
        
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
        });
    }

    setRating(rateNum) {
        console.log("setRating() is called");
        let ratingField = this.ratingContainer.getElementById("rating");
        ratingField.value = rateNum;
    }

}

customElements.define("rating-widget", ratingWidget);

