const POKEMON_CARDS = document.getElementById("pokemon_box");
const DETAILS_DIALOG = document.getElementById("details_dialog");
const POKEAPI = "https://pokeapi.co/api/v2";
const POKEMON_URL = [];

const ALL_INFO = [];
const IMG_CACHE = {};
const ALL_POKEMON = [];
const POKEMON_DETAILS = [];
const EVO_CHAIN = [];

let searchedPokemon = [];

async function init() {
    await getData();
    await getPkmInfo();
    console.log(ALL_INFO);
    console.log(ALL_POKEMON);
    console.log(POKEMON_DETAILS);
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

// #region dialog

function openDialog(i) {
    const singlePokemon = ALL_POKEMON[i];

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
