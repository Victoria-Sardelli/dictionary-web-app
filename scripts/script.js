"use strict";

// dropdown elements
const fontDropdown = document.querySelector(".dropdown");
const fontDropdownBtn = document.querySelector(".dropdown-toggle-btn");
const fontDropdownBtnText = document.querySelector(
    ".dropdown-toggle-btn__text"
);
const fontDropdownContent = document.querySelector(".dropdown-content");
const fontDropdownOptions = document.querySelectorAll(".dropdown-option-btn");

/* Show/hide font dropdown when button is clicked */
fontDropdownBtn.addEventListener("click", () => {
    fontDropdownContent.classList.toggle("show");
});

/* Update font when a font option is clicked from dropdown */
const updateFont = function (e) {
    fontDropdownBtnText.textContent = e.target.dataset.font;
};

for (const dropdownOption of fontDropdownOptions) {
    dropdownOption.addEventListener("click", updateFont);
}

/* Hide font dropdown content if user clicks outside of dropdown */
const hideDropdownIfClickedOutside = function (e) {
    let currentTarget = e.target;
    while (currentTarget && currentTarget !== fontDropdown) {
        currentTarget = currentTarget.parentNode;
    }
    if (currentTarget !== fontDropdown)
        fontDropdownContent.classList.remove("show");
};
document.addEventListener("click", hideDropdownIfClickedOutside);

/* Form Submission*/
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

form.addEventListener("submit", (e) => {
    if (!searchBar.validity.valid) {
        // show error message if user submitted empty search
        searchError.textContent = "Whoops, can't be empty...";
        searchError.classList.add("active");
        searchBar.classList.add("error");
    } else {
        // get data using user input
        console.log(`get data: ${searchBar.value}`);
    }
    e.preventDefault();
});
