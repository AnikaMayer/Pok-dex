// check condition for input-value, enable button and hint-message
function checkSearchInput() {
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
    const searchBtn = document.getElementById("search_button");
    const loadBtn = document.getElementById("load_btn");
    const hintMsg = document.getElementById("hint_msg");
    searchBtn.disabled = searchInput.length < 3;
    loadBtn.classList.toggle("hide_btn", searchInput.length >= 1);
    hintMsg.classList.toggle("hidden", searchInput.length === 0 || searchInput.length >= 3);

    if (searchInput.length === 0) {
        renderPkmCards(ALL_PKM);
    }
}

// filter array for input-value and render Cards with result or give an error message
function searchPkm() {
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
    searchedPokemon = ALL_PKM.filter((pokemon) => pokemon.name.includes(searchInput.toLowerCase()));

    if (searchedPokemon.length > 0) {
        renderPkmCards(searchedPokemon);
    } else {
        POKEMON_CARDS.innerHTML = noResultsTemplate(searchInput);
    }
}

// #region globalSearch

// fetch global, when local search doesn´t work
async function searchGlobalPkm(name) {
    const resp = await fetch(`${POKEAPI}/pokemon/${name}`);
    const respFromJson = await resp.json();
    const pkmImg = respFromJson.sprites.other["official-artwork"].front_default;
    const pkmTypes = getTypes(respFromJson);
    const pokemonObject = createPkmObj(respFromJson, pkmImg, pkmTypes);
    ALL_PKM.push(pokemonObject);
    ALL_INFO.push(respFromJson);

    return pokemonObject;
}

//#endregion
