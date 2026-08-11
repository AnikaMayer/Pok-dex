// #region localSearch

// check condition for input-value
function checkSearchInput() {
    searchedPokemon = [];
    searchedGlobal = [];
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;

    toggleSearchElements(searchInput);

    if (searchInput.length === 0) {
        renderPkmCards(loadedPkm);
    }
}

// toggle buttons and hint-message
function toggleSearchElements(searchInput) {
    const searchBtn = document.getElementById("search_button");
    const searchImg = document.getElementById("search_img");
    const loadBtn = document.getElementById("load_btn");
    const backBtn = document.getElementById("back_btn");
    const hintMsg = document.getElementById("hint_msg");

    searchBtn.disabled = searchInput.length < 3;
    searchImg.classList.toggle("hide_search_img", searchInput.length < 3);
    loadBtn.classList.toggle("hide_load_btn", searchInput.length >= 1);
    backBtn.classList.toggle("hide_back_btn", searchInput.length === 0);
    hintMsg.classList.toggle("hide_hint_msg", searchInput.length === 0 || searchInput.length >= 3);
}

function goBack() {
    const searchInputRef = document.getElementById("search_input");
    searchInputRef.value = "";
    checkSearchInput();
}

// filter array for input-value and render Cards with result or search global
async function searchPkm() {
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
    searchedPokemon = loadedPkm.filter((pokemon) => pokemon.name.includes(searchInput.toLowerCase()));

    if (searchedPokemon.length > 0) {
        renderPkmCards(searchedPokemon);
    } else {
        await renderGlobalResults(searchInput);
    }
}

// global search: filter array with all names for result and render Cards or render error message
async function renderGlobalResults(searchInput) {
    const matches = allNames.filter((pokemon) => pokemon.name.includes(searchInput.toLowerCase()));

    if (matches.length > 0) {
        await getGlobalPkmInfo(matches);
        renderPkmCards(searchedGlobal);
    } else {
        POKEMON_CARDS.innerHTML = noResultsTemplate(searchInput);
    }
}

//#endregion

// #region globalSearch

// fetch global, when local search doesn´t work
async function searchGlobalPkm(name) {
    const resp = await fetch(`${POKEAPI}/pokemon/${name}`);
    if (!resp.ok) {
        return null;
    }
    const respFromJson = await resp.json();
    const pkmImg = respFromJson.sprites.other["official-artwork"].front_default;
    const pkmTypes = getTypes(respFromJson);
    const pokemonObject = createPkmObj(respFromJson, pkmImg, pkmTypes);
    loadedInfo.push(respFromJson);
    return pokemonObject;
}

//#endregion

// #region randomSearch

// disable surprise-Btn, search for a random Pokemon (Nr. 1 - 1025) and render the result and enable surprise-btn
async function searchRandomPkm() {
    const surpriseBtn = document.getElementById("surprise_button");
    surpriseBtn.disabled = true;

    const pokemonObject = getRandomPkm();
    if (!pokemonObject) {
        surpriseBtn.disabled = false;
        return;
    }

    displayRandomResult(pokemonObject);
    surpriseBtn.disabled = false;
}

// get random Name with global search
async function getRandomPkm() {
    const randomName = allNames[Math.floor(Math.random() * allNames.length)];
    return await searchGlobalPkm(randomName.name);
}

// give random name into search-input and into global-search-array, then render Card
function displayRandomResult(pokemonObject) {
    const searchInputRef = document.getElementById("search_input");
    searchInputRef.value = pokemonObject.name;
    checkSearchInput();

    searchedGlobal = [pokemonObject];
    renderPkmCards(searchedGlobal);
}

//#endregion
