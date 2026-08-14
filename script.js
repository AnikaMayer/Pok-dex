// #region globalVar

const POKEMON_CARDS = document.getElementById("pokemon_box");
const DETAILS_DIALOG = document.getElementById("details_dialog");
const POKEAPI = "https://pokeapi.co/api/v2";

let currentOffset = 0;
const pokemonUrl = [];
const loadedInfo = [];
let allNames = [];

const loadedPkm = [];
const pkmDetails = [];
const imgCache = {};
const loadedEvoChain = [];

let searchedPokemon = [];
let searchedGlobal = [];
let currentPokemon = 0;

//#endregion

async function init() {
    showLoadingScreen();
    await Promise.all([getData(currentOffset), getAllPkmNames()]);
    currentOffset = currentOffset + 20;
    await getPkmInfo(pokemonUrl);
    hideLoadingScreen();
    renderPkmCards(loadedPkm);
}

// #region renderCards

async function renderPkmCards(pokemonList) {
    POKEMON_CARDS.innerHTML = "";

    for (let i = 0; i < pokemonList.length; i++) {
        const singlePokemon = pokemonList[i];
        POKEMON_CARDS.innerHTML += renderPkmCardsTemplate(singlePokemon);

        renderTypes(singlePokemon);
        await loadImg(singlePokemon);
    }
}

function renderTypes(singlePokemon) {
    const pkmTypesRef = document.getElementById(`pkm_type_${singlePokemon.id}`);

    for (let y = 0; y < singlePokemon.type.length; y++) {
        pkmTypesRef.innerHTML += renderTypesTemplate(singlePokemon, y);
    }
}

//#endregion

// #region ImgCache

// create img-cache for not needing to use img-url
async function loadImg(singlePokemon) {
    const pkmImgRef = document.getElementById(`pkm_img_${singlePokemon.id}`);
    const pkmImgLoad = await getImg(singlePokemon);
    pkmImgRef.appendChild(pkmImgLoad);
}

function getImg(singlePokemon) {
    return new Promise((resolve, reject) => {
        if (imgCache[singlePokemon.id]) {
            resolve(imgCache[singlePokemon.id].cloneNode());
            return;
        }
        const img = new Image();
        img.src = `${singlePokemon.img}`;
        img.onload = () => {
            imgCache[singlePokemon.id] = img;
            resolve(img.cloneNode());
        };
        img.onerror = reject;
    });
}

//#endregion

// #region format

// format letters
function capitalizeLetter(pkmName) {
    return String(pkmName).charAt(0).toUpperCase() + String(pkmName).slice(1);
}

// format numbers
function padNumber(pkmId) {
    return pkmId.toString().padStart(4, "0");
}

//#endregion
