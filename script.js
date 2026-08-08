const POKEMON_CARDS = document.getElementById("pokemon_box");
const DETAILS_DIALOG = document.getElementById("details_dialog");
const POKEAPI = "https://pokeapi.co/api/v2";
let currentOffset = 0;
const POKEMON_URL = [];
const ALL_INFO = [];

const ALL_PKM = [];
const PKM_DETAILS = [];

const IMG_CACHE = {};
const EVO_CHAIN = [];

let searchedPokemon = [];
let currentPokemon = 0;

async function init() {
    showLoadingScreen();
    await getData();
    currOff = POKEMON_URL;
    await getPkmInfo(currOff);
    hideLoadingScreen();
    renderPkmCards(ALL_PKM);
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

// create img-cache for not needing to use img-url
async function loadImg(singlePokemon) {
    const pkmImgRef = document.getElementById(`pkm_img_${singlePokemon.id}`);
    const pkmImgLoad = await getImg(singlePokemon);
    pkmImgRef.appendChild(pkmImgLoad);
}

function getImg(singlePokemon) {
    return new Promise((resolve, reject) => {
        if (IMG_CACHE[singlePokemon.id]) {
            resolve(IMG_CACHE[singlePokemon.id].cloneNode());
            return;
        }

        const img = new Image();
        img.src = `${singlePokemon.img}`;
        img.onload = () => {
            IMG_CACHE[singlePokemon.id] = img;
            resolve(img.cloneNode());
        };
        img.onerror = reject;
    });
}

// format letters and numbers
function capitalizeLetter(pkmName) {
    return String(pkmName).charAt(0).toUpperCase() + String(pkmName).slice(1);
}

function padNumber(pkmId) {
    return pkmId.toString().padStart(5, "0");
}

//#endregion

// #region dialog

async function openDialog(pkmId) {
    const activeList = searchedPokemon.length > 0 ? searchedPokemon : ALL_PKM;
    currentPokemon = activeList.findIndex((pkm) => pkm.id === pkmId);
    const singlePokemon = ALL_PKM.find((pkm) => pkm.id === pkmId);
    await getMoreDetails(singlePokemon);

    const details = PKM_DETAILS.find((pkmDetail) => pkmDetail.id === pkmId);
    DETAILS_DIALOG.showModal();
    DETAILS_DIALOG.innerHTML = dialogTemplate(details);
    DETAILS_DIALOG.classList.add("opened");
    loadDialogImg(singlePokemon, details);
    renderEvoChain(details);
}

async function goToNextPokemon() {
    let activeList = [];

    if (searchedPokemon.length > 0) {
        activeList = searchedPokemon;
    } else {
        activeList = ALL_PKM;
    }

    if (currentPokemon < activeList.length - 1) {
        currentPokemon++;
    } else {
        currentPokemon = 0;
    }
    await openDialog(activeList[currentPokemon].id);
}

async function goToPrevPokemon() {
    let activeList = [];

    if (searchedPokemon.length > 0) {
        activeList = searchedPokemon;
    } else {
        activeList = ALL_PKM;
    }

    if (currentPokemon > 0) {
        currentPokemon--;
    } else {
        currentPokemon = activeList.length - 1;
    }
    await openDialog(activeList[currentPokemon].id);
}

function bubblingProtection(event) {
    event.stopPropagation();
}

function closeDialog() {
    DETAILS_DIALOG.close();
    DETAILS_DIALOG.classList.remove("opened");
}

async function loadDialogImg(singlePokemon, details) {
    const dialogImgRef = document.getElementById(`dialog_img_${details.id}`);
    const pkmImgLoad = await getImg(singlePokemon);
    dialogImgRef.appendChild(pkmImgLoad);
}

async function renderEvoChain(details) {
    const evoBox = document.getElementById("evo_box");
    evoBox.innerHTML = "";
    for (const name of details.evolutions) {
        let evoData = ALL_PKM.find((pkm) => pkm.name === name);
        if (!evoData) {
            evoData = await searchGlobalPkm(name);
        }

        evoBox.innerHTML += evoChainTemplate(evoData);
        renderEvoTypes(evoData);
        await loadEvoImg(evoData);
    }
}

function renderEvoTypes(singlePokemon) {
    const pkmTypesRef = document.getElementById(`evo_type_${singlePokemon.id}`);

    for (let y = 0; y < singlePokemon.type.length; y++) {
        pkmTypesRef.innerHTML += renderTypesTemplate(singlePokemon, y);
    }
}

// create img-cache for not needing to use img-url
async function loadEvoImg(singlePokemon) {
    const pkmImgRef = document.getElementById(`evo_img_${singlePokemon.id}`);
    const pkmImgLoad = await getImg(singlePokemon);
    pkmImgRef.appendChild(pkmImgLoad);
}

//#endregion
