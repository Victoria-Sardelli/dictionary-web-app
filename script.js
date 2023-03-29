"use strict";

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
