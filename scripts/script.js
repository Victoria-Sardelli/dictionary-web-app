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
    const container404Content = document.createElement("div");

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

    container404Content.append(emoji, title, subtitle);
    removeChildren(searchResultsSection);
    searchResultsSection.appendChild(container404Content);
};

/* Returns svg element representing play button */
const createSVGPlayBtn = function () {
    const xmlns = "http://www.w3.org/2000/svg";
    const svgElem = document.createElementNS(xmlns, "svg");
    svgElem.classList.add("play-btn__svg");
    svgElem.setAttribute("width", "75");
    svgElem.setAttribute("height", "75");
    svgElem.setAttribute("viewBox", "0 0 75 75");

    const g = document.createElementNS(xmlns, "g");
    g.classList.add("play-btn__svg__g");
    g.setAttribute("fill-rule", "evenodd");
    svgElem.appendChild(g);

    const circle = document.createElementNS(xmlns, "circle");
    circle.classList.add("play-btn__svg__circle");
    circle.setAttribute("cx", "37.5");
    circle.setAttribute("cy", "37.5");
    circle.setAttribute("r", "35.5");
    circle.setAttribute("opacity", ".25");
    g.appendChild(circle);

    const path = document.createElementNS(xmlns, "path");
    path.classList.add("play-btn__svg__path");
    path.setAttribute("d", "M29 27v21l21-10.5z");
    g.appendChild(path);

    return svgElem;
};

/* Returns button that will play phonetic audio */
const createPlayButton = function (audio, phoneticNum) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "play-btn";
    // set data attr to be used for both duplicate checking and audio playing
    btn.dataset.audio = audio;

    // create svg and append as child to play button
    const svgElem = createSVGPlayBtn();

    btn.appendChild(svgElem);

    const audioObj = new Audio(audio);
    // play audio when button is clicked
    btn.addEventListener("click", () => {
        audioObj.play();
    });

    // apply class to button when audio is playing
    audioObj.addEventListener("play", () => {
        btn.classList.add("play-btn--playing");
    });
    // remove class when audio stops
    audioObj.addEventListener("ended", () => {
        btn.classList.remove("play-btn--playing");
    });

    return btn;
};

/* Returns paragraph element representing phonetic text */
const createPhoneticTextElem = function (text) {
    const phoneticText = document.createElement("p");
    phoneticText.className = "phonetic";
    phoneticText.textContent = text || "";
    return phoneticText;
};

/* 
Updates the phonetic information held in allPhoneticsContainer while handling possible duplicates.
The new element will be appended to allPhoneticsContainer if:
- it does not have phonetic text
- there is no pre-existing element with the same text
- all pre-existing element's audio is different
Otherwise, it will replace the first pre-existing audio that contains the same, or no, audio
*/
const addPhoneticInfo = function ({
    phoneticText,
    newElem,
    allPhoneticsContainer,
}) {
    // use data attr to check for duplicates based on phonetic text
    const prevElems = allPhoneticsContainer.querySelectorAll(
        `[data-phonetic="${phoneticText}"]`
    );
    if (phoneticText && prevElems.length > 0) {
        for (const prevElem of prevElems) {
            // replace previous instance if it has no audio or the same audio
            const prevElemAudio = prevElem.querySelector(".play-btn");
            const thisElemAudio = newElem.querySelector(".play-btn");
            if (
                !prevElemAudio ||
                prevElemAudio.dataset.audio === thisElemAudio.dataset.audio
            ) {
                prevElem.replaceWith(newElem);
                break;
            }
        }
    } else {
        // add new instance if it has no phonetic text or there are no existing duplicates
        allPhoneticsContainer.appendChild(newElem);
    }
};

/* Displays word-related information receieved from dictionary api */
const displayResults = function (data) {
    removeChildren(searchResultsSection);

    // display information in search results section for each word that was returned
    for (const wordItem of data) {
        // add each word item to its own article
        const article = document.createElement("article");
        article.className = "word-info-container";

        // put word, phonetic spelling, and audio at top
        const header = document.createElement("div");
        header.className = "word-info-header";

        const word = document.createElement("h1");
        word.className = "word";
        word.textContent = wordItem.word;
        article.append(word);

        if (wordItem.phonetics) {
            // layout depends on presence of one or more phonetics
            if (wordItem.phonetics.length === 1) {
                /* 
                    envisioned layout:
                    word            play button (esentially spans 2 columns)
                    phonetic        
                */
                const phonetic = wordItem.phonetics[0];
                const wordPhoneticWrapper = document.createElement("div");
                wordPhoneticWrapper.className = "word-wrapper";

                wordPhoneticWrapper.appendChild(word);

                // add phonetic text if it exists
                if (phonetic.text) {
                    const phoneticTextElem = createPhoneticTextElem(
                        phonetic.text
                    );
                    wordPhoneticWrapper.appendChild(phoneticTextElem);
                }

                header.classList.add("word-info-header--one-phonetic");
                header.appendChild(wordPhoneticWrapper);

                // add play button if audio exists
                if (phonetic.audio) {
                    const playButton = createPlayButton(phonetic.audio, 1);
                    header.appendChild(playButton);
                }
            } else {
                /* 
                    envisioned layout:
                    word            
                    phonetic        play button
                    phonetic        play button
                    ...
                */
                const allPhoneticsContainer = document.createElement("div");
                allPhoneticsContainer.className = "many-phonetics";

                for (const [index, phonetic] of wordItem.phonetics.entries()) {
                    const phoneticContainer = document.createElement("div");
                    phoneticContainer.className =
                        "many-phonetics__phonetic-container";

                    // add phonetic text if it exists
                    if (phonetic.text) {
                        const phoneticTextElem = createPhoneticTextElem(
                            phonetic.text
                        );
                        phoneticContainer.appendChild(phoneticTextElem);
                        // add data attribute that can be used to check for duplicates later
                        phoneticContainer.dataset.phonetic = phonetic.text;
                    }

                    // add play button if audio exists
                    if (phonetic.audio) {
                        // create play button with alt text that differentiaties phonetics based on number
                        const playButton = createPlayButton(
                            phonetic.audio,
                            index + 1
                        );
                        playButton.classList.add("play-btn--many-phonetics");
                        phoneticContainer.appendChild(playButton);
                    }

                    // add contents of phoneticContainer element to larger container while handling duplicates
                    addPhoneticInfo({
                        phoneticText: phonetic.text,
                        newElem: phoneticContainer,
                        allPhoneticsContainer: allPhoneticsContainer,
                    });
                }
                header.classList.add("word-info-header--many-phonetics");
                header.appendChild(allPhoneticsContainer);
            }
        }
        article.appendChild(header);

        // add definition-related information to article. There may be multiple definitions
        /*for (const meaning of wordItem.meanings) {
            const partOfSpeech = document.createElement("h2");
            partOfSpeech.className = "part-of-speech";

            partOfSpeech.textContent = meaning.partOfSpeech;

            article.appendChild(partOfSpeech);
        }*/

        // display article in search results section
        searchResultsSection.appendChild(article);
    }
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
