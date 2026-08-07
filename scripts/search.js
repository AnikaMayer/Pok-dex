// async function getData() {
//     const response = await fetch(`${POKEAPI}/pokemon?limit=20&offset=0`);
//     const responseFromJson = await response.json();

//     for (let j = 0; j < responseFromJson.results.length; j++) {
//         POKEMON_URL.push(responseFromJson.results[j].url);
//     }

//     currentOffset = currentOffset + 20; // offset being adjusted to load more later
// }

// function checkSearchInput() {
//     const searchInputRef = document.getElementById("search_input");
//     const searchInput = searchInputRef.value;
//     const searchBtn = document.getElementById("search_button");
//     searchBtn.disabled = searchInput.length < 3;

//     searchPkm(searchInput);
// }

function checkSearchInput() {
    const searchInputRef = document.getElementById("search_input");
    const searchInput = searchInputRef.value;
    const searchBtn = document.getElementById("search_button");
    const hintMsg = document.getElementById("hint_msg");
    searchBtn.disabled = searchInput.length < 3;
    hintMsg.classList.toggle("hidden", searchInput.length === 0 || searchInput.length >= 3);

    if (searchInput.length === 0) {
        renderPkmCards(ALL_PKM);
    }
}

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
