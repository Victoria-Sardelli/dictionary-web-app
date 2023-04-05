"use strict";

const storageKeyFont = "font-preference";
const defaultFont = "Sans Serif";
// dropdown elements
const fontDropdown = document.querySelector(".dropdown");
const fontDropdownBtn = document.querySelector(".dropdown-toggle-btn");
const fontDropdownBtnText = document.querySelector(
    ".dropdown-toggle-btn__text"
);
const fontDropdownContent = document.querySelector(".dropdown-content");
const fontDropdownOptions = document.querySelectorAll(".dropdown-option-btn");

/* Get font preference from local storage if exists, otherwise return default */
const getFontPreference = function () {
    if (localStorage.getItem(storageKeyFont)) {
        return localStorage.getItem(storageKeyFont);
    } else {
        return defaultFont;
    }
};

const font = {
    value: getFontPreference(),
};

const updateDropdownText = function (fontName) {
    fontDropdownBtnText.textContent = fontName;
};

/* Updates UI with font preference by modifying html data attribute and selecting from dropdown */
const reflectFontPreference = function () {
    document.firstElementChild.setAttribute("data-font", font.value);

    if (fontDropdown) {
        updateDropdownText(font.value);
    }
};

/* Store font preference in local storage and update UI */
const setFontPreference = function () {
    localStorage.setItem(storageKeyFont, font.value);
    reflectFontPreference();
};

/* Show/hide font dropdown when button is clicked */
fontDropdownBtn.addEventListener("click", () => {
    fontDropdownContent.classList.toggle("show");
});

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

/* Update font when a font option is clicked from dropdown */
for (const dropdownOption of fontDropdownOptions) {
    dropdownOption.addEventListener("click", (e) => {
        font.value = e.target.dataset.fontOption;
        setFontPreference();
    });
}

reflectFontPreference(); // set inital font based on local storage value or default
