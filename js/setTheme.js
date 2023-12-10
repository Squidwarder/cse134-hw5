// console.log("This script is loaded");
// console.log(localStorage.getItem("theme"));

// Set the initial theme based on the saved theme or default to Light mode
document.addEventListener("DOMContentLoaded", function() {
    let themeSwitch = document.getElementById('theme-switch');    
    let savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'Dark') {
        themeSwitch.checked = true;
    }

    // Listen for changes to the theme switch
    themeSwitch.addEventListener('change', function () {
        if (themeSwitch.checked) {

            // Save the theme preference to localStorage
            localStorage.setItem('theme', 'Dark');
        } else {

            // Remove the theme preference from localStorage
            // Probably better then setting it to Light mode
            localStorage.removeItem('theme');
        }
    });
})