"use strict";

/* Helper functions to create elements used in search result header (aka word and phonetics info) */

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

const getSearchResultHeaderElem = function (wordItem) {
    // create heading so we can put word, phonetic spellings, and audios at top of result section
    const header = document.createElement("div");
    header.className = "word-info-header";

    const word = document.createElement("h1");
    word.className = "word";
    word.textContent = wordItem.word;
    header.append(word);

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
                const phoneticTextElem = createPhoneticTextElem(phonetic.text);
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
    return header;
};
