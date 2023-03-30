"use strict";

/* Form Validation and Submission*/
const form = document.querySelector(".form");
const searchBar = document.querySelector(".search-bar");
const searchError = document.querySelector(".error-msg");

const searchResultsSection = document.querySelector(".search-results");

/* Removes all child elements from DOM node */
const removeChildren = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

/* Displays 404 message when word could not be found by dictionary api */
const handle404 = function (data) {
    const emoji = document.createElement("p");
    emoji.className = "emoji";
    emoji.textContent = "😕";

    const title = document.createElement("h1");
    title.className = "search-error-title";
    title.textContent = data.title ?? "No definitions found";

    const subtitle = document.createElement("p");
    subtitle.className = "search-error-subtitle";
    subtitle.textContent = `${
        data.message ?? "Sorry, we couldn't find any definitions."
    } ${data.resolution ?? "Please try the search again later."}`;

    removeChildren(searchResultsSection);
    searchResultsSection.append(emoji, title, subtitle);
};

/* Displays word-related information receieved from dictionary api */
const displayResults = function (data) {
    const word = document.createElement("h1");
    word.textContent = "word";

    removeChildren(searchResultsSection);
    searchResultsSection.appendChild(word);
};

/* Gets definitions from dictionary api and displays results on screen */
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

/* Removes warning styles upon user input when search bar has valid content */
searchBar.addEventListener("input", (e) => {
    if (searchBar.validity.valid) {
        searchError.textContent = "";
        searchError.classList.remove("active");
        searchBar.classList.remove("error");
    }
});
