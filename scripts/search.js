// #region localSearch

// check condition for input-value
function checkSearchInput() {
    searchedPokemon = [];
    searchedGlobal = [];
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
    const loadBtn = document.getElementById("load_btn");
    const backBtn = document.getElementById("back_btn");
    toggleSearchElements(searchInput);
    if (searchInput.length === 0) {
        renderPkmCards(loadedPkm);
        loadBtn.classList.toggle("hide_load_btn", false);
        backBtn.classList.toggle("hide_back_btn", true);
    }
}

// toggle buttons and hint-message
function toggleSearchElements(searchInput) {
    const searchBtn = document.getElementById("search_button");
    const searchImg = document.getElementById("search_img");
    const hintMsg = document.getElementById("hint_msg");

    searchBtn.disabled = searchInput.length < 3;
    searchImg.classList.toggle("hide_search_img", searchInput.length < 3);
    hintMsg.classList.toggle("hide_hint_msg", searchInput.length === 0 || searchInput.length >= 3);
}

function goBack() {
    const backBtn = document.getElementById("back_btn");
    const searchInputRef = document.getElementById("search_input");
    searchInputRef.value = "";
    backBtn.classList.toggle("hide_back_btn", true);
    checkSearchInput();
}

// filter array for input-value and render Cards with result or search global
async function searchPkm() {
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
    const backBtn = document.getElementById("back_btn");
    const loadBtn = document.getElementById("load_btn");
    backBtn.classList.toggle("hide_back_btn", false);
    loadBtn.classList.toggle("hide_load_btn", true);
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

    const pokemonObject = await getRandomPkm();
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
    const backBtn = document.getElementById("back_btn");
    const loadBtn = document.getElementById("load_btn");
    backBtn.classList.toggle("hide_back_btn", false);
    loadBtn.classList.toggle("hide_load_btn", true);

    const searchInputRef = document.getElementById("search_input");
    searchInputRef.value = pokemonObject.name;
    checkSearchInput();

    searchedGlobal = [pokemonObject];
    renderPkmCards(searchedGlobal);
}

//#endregion
