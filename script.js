const POKEMON_CARDS = document.getElementById("pokemon_box");
const DETAILS_DIALOG = document.getElementById("details_dialog");
const POKEAPI = "https://pokeapi.co/api/v2";
const POKEMON_URL = [];
let currentOffset = 0;
const ALL_INFO = [];

const CURRENT_PKM = [];
const PKM_DETAILS = [];

const IMG_CACHE = {};
const EVO_CHAIN = [];

const START = 1;
const STOP = START + 20;
let searchedPokemon = [];

async function init() {
    await getData();
    const currOff = POKEMON_URL;
    await getPkmInfo(currOff);
    console.log(ALL_INFO);
    console.log(CURRENT_PKM);
    console.log(PKM_DETAILS);
    console.log(IMG_CACHE);

    await getMoreDetails();
}

// #region renderCards

async function renderPkmCards(pokemonList) {
    POKEMON_CARDS.innerHTML = "";

    for (let i = 0; i < pokemonList.length; i++) {
        const singlePokemon = pokemonList[i];
        POKEMON_CARDS.innerHTML += renderPkmCardsTemplate(singlePokemon, i);

        renderTypes(singlePokemon, i);
        await loadImg(singlePokemon, i);
    }
}

function renderTypes(singlePokemon, i) {
    const pkmTypesRef = document.getElementById(`pkm_type_${i}`);

    for (let y = 0; y < singlePokemon.type.length; y++) {
        pkmTypesRef.innerHTML += renderTypesTemplate(singlePokemon, y);
    }
}

// create img-cache for not needing to use img-url
async function loadImg(singlePokemon, i) {
    const pkmImgRef = document.getElementById(`pkm_img_${i}`);
    const pkmImgLoad = await getImg(singlePokemon, i);
    pkmImgRef.appendChild(pkmImgLoad);
}

function getImg(singlePokemon, i) {
    return new Promise((resolve, reject) => {
        if (IMG_CACHE[singlePokemon.id]) {
            resolve(IMG_CACHE[singlePokemon.id]);
            return;
        }

        const img = new Image();
        img.src = `${singlePokemon.img}`;
        img.onload = () => {
            IMG_CACHE[singlePokemon.id] = img;
            resolve(img);
        };
        img.onerror = reject;
    });
}

// format letters and numbers
function capitalizeLetter(index) {
    return String(index).charAt(0).toUpperCase() + String(index).slice(1);
}

function padNumber(index) {
    return index.toString().padStart(5, "0");
}

//#endregion

// #region loadMorePkm

async function loadMorePkm() {
    const resp = await fetch(`${POKEAPI}/pokemon?limit=20&offset=${currentOffset}`);
    const respFromJson = await resp.json();

    for (let j = 0; j < respFromJson.results.length; j++) {
        POKEMON_URL.push(respFromJson.results[j].url);
    }
    const currOff = POKEMON_URL.slice(currentOffset);
    getPkmInfo(currOff);
    currentOffset = currentOffset + 20;
}

//#endregion

// #region dialog

function openDialog(i) {
    const singlePokemon = CURRENT_PKM[i];

    DETAILS_DIALOG.showModal();
    DETAILS_DIALOG.innerHTML = dialogTemplate(i);
    DETAILS_DIALOG.classList.add("opened");
    loadDialogImg(singlePokemon, i);
    getMoreDetails();
}

async function loadDialogImg(singlePokemon, i) {
    const dialogImgRef = document.getElementById(`dialog_img_${i}`);
    const pkmImgLoad = await getImg(singlePokemon, i);
    dialogImgRef.appendChild(pkmImgLoad);
}

function bubblingProtection(event) {
    event.stopPropagation();
}

function closeDialog() {
    DETAILS_DIALOG.close();
    DETAILS_DIALOG.classList.remove("opened");
}

//#endregion
