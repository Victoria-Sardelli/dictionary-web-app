"use strict";

const storageKey = "theme-preference";

// dark theme toggle elements
let slider, toggleIcon;

/* Get theme preference from local storage if exists, otherwise check */
const getColorPreference = function () {
    if (localStorage.getItem(storageKey)) {
        return localStorage.getItem(storageKey);
    } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
};

/* Store theme preference in local storage and update UI */
const setPreference = function () {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
};

/* Updates UI with theme preference by modifying html data attribute and toggle classes */
const reflectPreference = function () {
    document.firstElementChild.setAttribute("data-theme", theme.value);

    // for screen reader accessibility
    document
        .querySelector(".theme-toggle-btn")
        ?.setAttribute("aria-label", theme.value);

    if (slider && toggleIcon) {
        updateToggleClasses();
    }
};

/* Updates the class styles on toggle elements based on theme */
const updateToggleClasses = function () {
    if (theme.value === "dark") {
        slider.classList.add("theme-toggle-slider--dark");
        toggleIcon.classList.add("theme-toggle-icon--dark");
    } else {
        slider.classList.remove("theme-toggle-slider--dark");
        toggleIcon.classList.remove("theme-toggle-icon--dark");
    }
};

const theme = {
    value: getColorPreference(),
};

// set theme right away, before loading css and rest of html
reflectPreference();

window.onload = () => {
    // get toggle elements on page and add event listener
    slider = document.querySelector(".theme-toggle-slider");
    toggleIcon = document.querySelector(".theme-toggle-icon");
    document
        .querySelector(".theme-toggle-btn")
        .addEventListener("click", () => {
            theme.value = theme.value === "light" ? "dark" : "light";
            setPreference();
        });

    // call again on load so that aria-label updates and screen readers get latest value
    reflectPreference();
};

// stay synchronized with system preference
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
        theme.value = isDark ? "dark" : "light";
        setPreference();
    });
