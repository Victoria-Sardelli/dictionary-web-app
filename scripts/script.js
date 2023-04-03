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

const initElemWithText = function ({ elemType, elemClass, elemText }) {
    const elem = document.createElement(elemType);
    elem.className = elemClass;
    elem.textContent = elemText;
    return elem;
};

/* Gets definitions from dictionary api and displays results on screen */
const runSearch = function (e) {
    console.log("run search");
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
};

/* Displays 404 message when word could not be found by dictionary api */
const handle404 = function (data) {
    const container404Content = document.createElement("div");

    const emoji = initElemWithText({
        elemType: "p",
        elemClass: "emoji",
        elemText: "😕",
    });

    const title = initElemWithText({
        elemType: "h1",
        elemClass: "search-error-title",
        elemText: data.title ?? "No definitions found",
    });

    const subtitle = initElemWithText({
        elemType: "p",
        elemClass: "search-error-subtitle",
        elemText: `${
            data.message ?? "Sorry, we couldn't find any definitions."
        } ${data.resolution ?? "Please try the search again later."}`,
    });

    container404Content.append(emoji, title, subtitle);
    removeChildren(searchResultsSection);
    searchResultsSection.appendChild(container404Content);
};

/* 
Creates elements to hold synonym lists or antonym lists (both use 
the same html structure and styles), and returns container element
*/
const getSynonymsAntonymsElem = function (title, synonymsAntonymsData) {
    const listTitle = initElemWithText({
        elemType: "h3",
        elemClass: "list-title",
        elemText: title,
    });

    const list = document.createElement("ul");
    list.className = "synonyms-antonyms-list";

    for (const word of synonymsAntonymsData) {
        // create link within list item
        const listItem = document.createElement("li");
        listItem.className = "synonym-antonym-list-item";

        const link = initElemWithText({
            elemType: "a",
            elemClass: "synonym-antonym",
            elemText: word,
        });
        // link will load same page but with new word to search when clicked
        const newSearchUrl = new URL(document.location);
        newSearchUrl.searchParams.delete("search");
        newSearchUrl.searchParams.append("search", word);
        link.href = newSearchUrl;

        listItem.append(link);
        list.append(listItem);
    }

    const listContainer = document.createElement("div");
    listContainer.className = "synonyms-antonyms-container";
    listContainer.append(listTitle);
    listContainer.append(list);
    return listContainer;
};

/* Displays word-related information receieved from dictionary api */
const displayResults = function (data) {
    removeChildren(searchResultsSection);

    // display information in search results section for each word that was returned
    for (const wordItem of data) {
        // add each word item to its own article
        const article = document.createElement("article");
        article.className = "word-info-container";

        // append word and phonetics info to top of article
        const header = getSearchResultHeaderElem(wordItem);
        article.appendChild(header);

        // add definition-related information to article. There may be multiple definitions
        for (const meaning of wordItem.meanings) {
            const meaningContainer = document.createElement("section");
            meaningContainer.className = "meaning-container";

            // append part of speech
            const partOfSpeech = initElemWithText({
                elemType: "h2",
                elemClass: "part-of-speech",
                elemText: meaning.partOfSpeech,
            });
            meaningContainer.appendChild(partOfSpeech);

            // append definitions, synonyms, and antonyms
            const definitionsList = document.createElement("ul");
            definitionsList.className = "definitions-list";

            for (const definitionItem of meaning.definitions) {
                const definitionsListItem = initElemWithText({
                    elemType: "li",
                    elemClass: "definition",
                    elemText: definitionItem.definition,
                });
                definitionsList.append(definitionsListItem);

                if (definitionItem.example) {
                    const exampleListItem = initElemWithText({
                        elemType: "li",
                        elemClass: "example",
                        elemText: `"${definitionItem.example}"`,
                    });
                    definitionsList.append(exampleListItem);
                }
            }

            const definitionsListTitle = initElemWithText({
                elemType: "h3",
                elemClass: "list-title",
                elemText: "Meaning",
            });
            meaningContainer.append(definitionsListTitle);
            meaningContainer.append(definitionsList);

            if (meaning.synonyms.length > 0) {
                const synonymsListContainer = getSynonymsAntonymsElem(
                    "Synonyms",
                    meaning.synonyms
                );
                meaningContainer.append(synonymsListContainer);
            }

            if (meaning.antonyms.length > 0) {
                const antonymsListContainer = getSynonymsAntonymsElem(
                    "Antonyms",
                    meaning.antonyms
                );
                meaningContainer.append(antonymsListContainer);
            }
            article.append(meaningContainer);
        }
        // display article in search results section
        searchResultsSection.appendChild(article);
    }
};

const appInit = function () {
    /* set up event listeners */

    // Will search for word in dictionary when user submits search input
    form.addEventListener("submit", runSearch);

    // Removes warning styles upon user input when search bar has valid content
    searchBar.addEventListener("input", (e) => {
        if (searchBar.validity.valid) {
            searchError.textContent = "";
            searchError.classList.remove("active");
            searchBar.classList.remove("error");
        }
    });

    /* If user visit page with search params already in URL, then search for given word */
    const params = new URL(document.location).searchParams;
    console.log(params);
    if (params.has("search")) {
        searchBar.value = params.get("search");
        form.requestSubmit(); // run form's onsubmit handler
    }
};

appInit();
