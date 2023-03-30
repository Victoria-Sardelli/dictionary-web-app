"use strict";

/* Form Validation and Submission*/
const form = document.querySelector(".form");
const searchBar = document.querySelector(".search-bar");
const searchError = document.querySelector(".error-msg");

searchBar.addEventListener("input", (e) => {
    if (searchBar.validity.valid) {
        searchError.textContent = "";
        searchError.classList.remove("active");
        searchBar.classList.remove("error");
    }
});

/* Displays 404 message when word could not be found by dictionary api */
const handle404 = function (data) {
    console.log("Aw, there was a 404 error...");
    console.log(data);
};

/* Displays word-related information receieved from dictionary api */
const displayResults = function (data) {
    console.log("Yay! You got data.");
    console.log(data);
};

form.addEventListener("submit", (e) => {
    if (!searchBar.validity.valid) {
        // show error message if user submitted empty search
        searchError.textContent = "Whoops, can't be empty...";
        searchError.classList.add("active");
        searchBar.classList.add("error");
    } else {
        // get data using user input
        fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${searchBar.value}`
        )
            .then(async (response) => {
                const data = await response.json();

                if (response.ok) displayResults(data);
                else handle404(data);
            })
            .catch((error) => console.error(error));
    }
    e.preventDefault();
});
