const POKEMON_CARDS = document.getElementById("pokemon_box");
const DETAILS_DIALOG = document.getElementById("details_dialog");
const POKEAPI = "https://pokeapi.co/api/v2";
let currentOffset = 0;
const POKEMON_URL = [];
const ALL_INFO = [];
const ALL_NAMES = [];

const ALL_PKM = [];
const PKM_DETAILS = [];

const IMG_CACHE = {};
const EVO_CHAIN = [];

let searchedPokemon = [];
let searchedGlobal = [];
let currentPokemon = 0;

async function init() {
    showLoadingScreen();
    await Promise.all([getData(), getAllPkmNames()]);
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
    return pkmId.toString().padStart(4, "0");
}

//#endregion

// #region dialog

async function openDialog(pkmId) {
    document.body.classList.add("overscroll_stop");
    let activeList;
    if (searchedPokemon.length > 0) {
        activeList = searchedPokemon;
    } else if (searchedGlobal.length > 0) {
        activeList = searchedGlobal;
    } else {
        activeList = ALL_PKM;
    }
    currentPokemon = activeList.findIndex((pkm) => pkm.id === pkmId);
    const singlePokemon = ALL_PKM.find((pkm) => pkm.id === pkmId) || searchedGlobal.find((pkm) => pkm.id === pkmId);
    await getMoreDetails(singlePokemon);

    const details = PKM_DETAILS.find((pkmDetail) => pkmDetail.id === pkmId);
    DETAILS_DIALOG.showModal();
    DETAILS_DIALOG.innerHTML = dialogTemplate(details);
    DETAILS_DIALOG.classList.add("opened");
    loadDialogImg(singlePokemon, details);
    renderDialogTypes(details);
    renderEvoChain(details);

    const prevBtn = document.getElementById("prev_btn");
    const nextBtn = document.getElementById("next_btn");
    prevBtn.disabled = activeList.length <= 1;
    nextBtn.disabled = activeList.length <= 1;
}

async function goToNextPokemon() {
    let activeList;

    if (searchedPokemon.length > 0) {
        activeList = searchedPokemon;
    } else if (searchedGlobal.length > 0) {
        activeList = searchedGlobal;
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
    let activeList;

    if (searchedPokemon.length > 0) {
        activeList = searchedPokemon;
    } else if (searchedGlobal.length > 0) {
        activeList = searchedGlobal;
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
    document.body.classList.remove("overscroll_stop");
    DETAILS_DIALOG.close();
    DETAILS_DIALOG.classList.remove("opened");
}

async function loadDialogImg(singlePokemon, details) {
    const dialogImgRef = document.getElementById(`dialog_img_${details.id}`);
    const pkmImgLoad = await getImg(singlePokemon);
    dialogImgRef.appendChild(pkmImgLoad);
}

function renderDialogTypes(details) {
    const pkmTypesRef = document.getElementById(`data_type_${details.id}`);

    for (let y = 0; y < details.type.length; y++) {
        pkmTypesRef.innerHTML += renderTypesTemplate(details, y);
    }
}

async function renderEvoChain(details) {
    const evoBox = document.getElementById("evo_box");
    evoBox.innerHTML = "";

    for (let i = 0; i < details.evolutions.length; i++) {
        const evoName = details.evolutions[i];
        let evoData = ALL_PKM.find((pkm) => pkm.name === evoName);
        if (!evoData) {
            evoData = await searchGlobalPkm(name);
        }

        let stageClass = "middle";
        if (i === 0) {
            stageClass = "first";
        }
        if (i === details.evolutions.length - 1) {
            stageClass = "last";
        }

        evoBox.innerHTML += evoChainTemplate(evoData, stageClass);
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

function statBarPercent(value) {
    const maxBaseStat = 255;
    return Math.min(100, Math.round((value / maxBaseStat) * 100));
}

function formatAbilityName(abilityName) {
    return abilityName.split("-").map(capitalizeLetter).join(" ");
}

//#endregion
