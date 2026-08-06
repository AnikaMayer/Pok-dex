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

async function getData() {
    const response = await fetch(`${POKEAPI}/pokemon?limit=20&offset=0`);
    const responseFromJson = await response.json();

    for (let j = 0; j < responseFromJson.results.length; j++) {
        POKEMON_URL.push(responseFromJson.results[j].url);
    }
}

async function getPkmInfo() {
    for (const pkmUrl of POKEMON_URL) {
        const resp = await fetch(`${pkmUrl}`);
        const respFromJson = await resp.json();
        ALL_INFO.push(respFromJson);

        const pkmImg = respFromJson.sprites.other["official-artwork"].front_default;
        const pkmTypes = getTypes(respFromJson);

        const pokemonObject = createPkmObj(respFromJson, pkmImg, pkmTypes);
        ALL_POKEMON.push(pokemonObject);
    }
    renderPkmCards(ALL_POKEMON);
}

function createPkmObj(respFromJson, pkmImg, pkmTypes) {
    return {
        name: respFromJson.name,
        id: respFromJson.id,
        img: pkmImg,
        type: pkmTypes,
    };
}

async function getMoreDetails() {
    for (let index = 0; index < ALL_INFO.length; index++) {
        const pkmImg = ALL_INFO[index].sprites.other["official-artwork"].front_default;
        const pkmTypes = getTypes(ALL_INFO[index]);
        const pkmAblts = getAblty(ALL_INFO[index]);
        const resp = await fetch(ALL_INFO[index].species.url);
        const respFromJson = await resp.json();
        const pkmDescr = getDescr(respFromJson);
        const pkmCtgry = getCtgry(respFromJson);

        const detailsObj = createDetailsObj(index, pkmDescr, pkmImg, pkmTypes, pkmCtgry, pkmAblts);
        POKEMON_DETAILS.push(detailsObj);
    }
}

function getTypes(pkmIndex) {
    const pkmTypes = [];
    pkmIndex.types.forEach((pkmType) => pkmTypes.push(pkmType.type.name));
    return pkmTypes;
}

function getAblty(pkmIndex) {
    const pkmAblts = [];
    pkmIndex.abilities.forEach((pkmAbility) => pkmAblts.push(pkmAbility.ability.name));
    return pkmAblts;
}

function getDescr(respFromJson) {
    return respFromJson.flavor_text_entries.find((element) => element.language.name === "en").flavor_text;
}

function getCtgry(respFromJson) {
    return respFromJson.genera.find((element) => element.language.name === "en").genus;
}

function getStats(statName, index) {
    return ALL_INFO[index].stats.find((element) => element.stat.name === statName).base_stat;
}

function createDetailsObj(index, pkmDescr, pkmImg, pkmTypes, pkmCtgry, pkmAblts) {
    return {
        description: pkmDescr,
        name: ALL_INFO[index].name,
        id: ALL_INFO[index].id,
        img: pkmImg,
        type: pkmTypes,
        height: ALL_INFO[index].height,
        weight: ALL_INFO[index].weight,
        category: pkmCtgry,
        abilities: pkmAblts,
        stats: {
            hp: getStats("hp", index),
            attack: getStats("attack", index),
            defense: getStats("defense", index),
            sp_attack: getStats("special-attack", index),
            sp_defense: getStats("special-defense", index),
            speed: getStats("speed", index),
        },
    };
}

async function renderPkmCards(pokemonList) {
    POKEMON_CARDS.innerHTML = "";

    for (let i = 0; i < pokemonList.length; i++) {
        const singlePokemon = pokemonList[i];
        POKEMON_CARDS.innerHTML += renderPkmCardsTemplate(singlePokemon, i);

        await loadImg(singlePokemon, i);
        renderTypes(singlePokemon, i);
    }
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

async function loadImg(singlePokemon, i) {
    const pkmImgRef = document.getElementById(`pkm_img_${i}`);
    const pkmImgLoad = await getImg(singlePokemon, i);
    pkmImgRef.appendChild(pkmImgLoad);
}

function renderTypes(singlePokemon, i) {
    const pkmTypesRef = document.getElementById(`pkm_type_${i}`);

    for (let y = 0; y < singlePokemon.type.length; y++) {
        pkmTypesRef.innerHTML += renderTypesTemplate(singlePokemon, y);
    }
}

function capitalizeLetter(index) {
    return String(index).charAt(0).toUpperCase() + String(index).slice(1);
}

function padNumber(index) {
    return index.toString().padStart(5, "0");
}

function openDialog(i) {
    // console.log(singlePokemon);
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
