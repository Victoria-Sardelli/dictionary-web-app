"use strict";

const storageKeyTheme = "theme-preference";
const defaultTheme = "light";

// dark theme toggle elements
let slider, toggleIcon;

/* 
Get theme preference from local storage if exists, otherwise use prefers-color-scheme value.
If locally stored value is null or undefined, use default theme instead
*/
const getColorPreference = function () {
    if (localStorage.getItem(storageKeyTheme)) {
        return localStorage.getItem(storageKeyTheme) ?? defaultTheme;
    } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
};

/* Store theme preference in local storage and update UI */
const setThemePreference = function () {
    localStorage.setItem(storageKeyTheme, theme.value);
    reflectThemePreference();
};

/* Updates UI with theme preference by modifying html data attribute and toggle classes */
const reflectThemePreference = function () {
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
reflectThemePreference();

window.onload = () => {
    // get toggle elements on page and add event listener
    slider = document.querySelector(".theme-toggle-slider");
    toggleIcon = document.querySelector(".theme-toggle-icon");
    document
        .querySelector(".theme-toggle-btn")
        .addEventListener("click", () => {
            theme.value = theme.value === "light" ? "dark" : "light";
            setThemePreference();
        });

    // call again on load so that aria-label updates and screen readers get latest value
    reflectThemePreference();
};

// stay synchronized with system preference
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
        theme.value = isDark ? "dark" : "light";
        setThemePreference();
    });
