// #region localSearch

// check condition for input-value, enable button and hint-message
function checkSearchInput() {
    searchedPokemon = [];
    searchedGlobal = [];
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
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

    if (searchInput.length === 0) {
        renderPkmCards(ALL_PKM);
    }
}

function goBack() {
    const searchInputRef = document.getElementById("search_input");
    searchInputRef.value = "";
    checkSearchInput();
}

// filter array for input-value and render Cards with result or give an error message
async function searchPkm() {
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
    searchedPokemon = ALL_PKM.filter((pokemon) => pokemon.name.includes(searchInput.toLowerCase()));

    if (searchedPokemon.length > 0) {
        renderPkmCards(searchedPokemon);
    } else {
        matches = ALL_NAMES.filter((pokemon) => pokemon.name.includes(searchInput.toLowerCase()));
        if (matches.length > 0) {
            await getGlobalPkmInfo(matches);
            renderPkmCards(searchedGlobal);
        } else {
            POKEMON_CARDS.innerHTML = noResultsTemplate(searchInput);
        }
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
    // ALL_PKM.push(pokemonObject);
    ALL_INFO.push(respFromJson);

    return pokemonObject;
}

//#endregion

// #region randomSearch

// search for a random Pokemon (Nr. 1 - 1025) and render the result
async function searchRandomPkm() {
    const surpriseBtn = document.getElementById("surprise_button");
    surpriseBtn.disabled = true;

    const randomName = ALL_NAMES[Math.floor(Math.random() * ALL_NAMES.length)];
    console.log(randomName);

    const pokemonObject = await searchGlobalPkm(randomName.name);
    if (!pokemonObject) {
        surpriseBtn.disabled = false;
        return;
    }

    const searchInputRef = document.getElementById("search_input");
    searchInputRef.value = pokemonObject.name;
    checkSearchInput();

    searchedGlobal = [pokemonObject];
    renderPkmCards(searchedGlobal);

    surpriseBtn.disabled = false;
}

//#endregion
