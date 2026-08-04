const POKEMON_CARDS = document.getElementById("pokemon_cards");
const POKEAPI = "https://pokeapi.co/api/v2";
const ALL_POKEMON = [];
const POKEMON_DETAILS = [];
let searchedPokemon = [];

async function init() {
    await getData();
    await getPkmInfo();
    console.log(POKEMON_DETAILS);
}

function renderPkmCards(pokemonList) {
    POKEMON_CARDS.innerHTML = "";

    for (let i = 0; i < pokemonList.length; i++) {
        const singlePokemon = pokemonList[i];
        POKEMON_CARDS.innerHTML += renderPkmCardsTemplate(singlePokemon);
    }
}

async function getData() {
    const response = await fetch(`${POKEAPI}/pokemon?limit=20&offset=0`);
    const responseFromJson = await response.json();

    for (let j = 0; j < responseFromJson.results.length; j++) {
        ALL_POKEMON.push(responseFromJson.results[j]);
    }
}

async function getPkmInfo() {
    for (const pokemon of ALL_POKEMON) {
        const response = await fetch(`${pokemon.url}`);
        const responseFromJson = await response.json();
        POKEMON_DETAILS.push(responseFromJson);

        renderPkmCards(POKEMON_DETAILS);
    }
}
