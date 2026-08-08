// #region ArrayCards

// get url for every pokemon leading to more info
async function getData() {
    const response = await fetch(`${POKEAPI}/pokemon?limit=20&offset=0`);
    const responseFromJson = await response.json();

    for (let j = 0; j < responseFromJson.results.length; j++) {
        POKEMON_URL.push(responseFromJson.results[j].url);
    }

    currentOffset = currentOffset + 20; // offset being adjusted to load more later
}

// use pkm-url to fetch those infos and push all info into an Array to work with later
async function getPkmInfo(currOff) {
    for (const pkmUrl of currOff) {
        const resp = await fetch(`${pkmUrl}`);
        const respFromJson = await resp.json();
        ALL_INFO.push(respFromJson);

        const pkmImg = respFromJson.sprites.other["official-artwork"].front_default;
        const pkmTypes = getTypes(respFromJson);

        const pokemonObject = createPkmObj(respFromJson, pkmImg, pkmTypes);
        ALL_PKM.push(pokemonObject);
    }
}

// create an object only with infos needed to render small cards
function createPkmObj(respFromJson, pkmImg, pkmTypes) {
    return {
        name: respFromJson.name,
        id: respFromJson.id,
        img: pkmImg,
        type: pkmTypes,
    };
}

//#endregion

// #region loadMorePkm

// adjusted offset to fetch new url for next pokemon, then push into first url-Array
async function loadMorePkm() {
    const resp = await fetch(`${POKEAPI}/pokemon?limit=20&offset=${currentOffset}`);
    const respFromJson = await resp.json();
    showLoadingScreen();

    for (let j = 0; j < respFromJson.results.length; j++) {
        POKEMON_URL.push(respFromJson.results[j].url);
    }
    const currOff = POKEMON_URL.slice(currentOffset); // slice with start = adjusted offset -> parameter for getInfo-function
    await getPkmInfo(currOff);
    hideLoadingScreen();
    renderPkmCards(ALL_PKM);
    currentOffset = currentOffset + 20; // adjust offset for next load (again +20)
}

function showLoadingScreen() {
    const loadingSpin = document.getElementById("loading_screen");
    loadingSpin.classList.remove("hide_spin");
}

function hideLoadingScreen() {
    const loadingSpin = document.getElementById("loading_screen");
    loadingSpin.classList.add("hide_spin");
}

//#endregion

// #region ArrayDetails

// use Array from above with all Info to find info needed for detail-view and push into Details-Array for dialog
async function getMoreDetails(singlePokemon) {
    if (PKM_DETAILS.find((pkmDetail) => pkmDetail.id === singlePokemon.id)) {
        return;
    }
    const pkmData = ALL_INFO.find((pkm) => pkm.id === singlePokemon.id);
    const pkmImg = pkmData.sprites.other["official-artwork"].front_default;
    const pkmTypes = getTypes(pkmData);
    const pkmAblts = getAblty(pkmData);
    const resp = await fetch(pkmData.species.url);
    const respFromJson = await resp.json();
    const pkmDescr = getDescr(respFromJson);
    const pkmCtgry = getCtgry(respFromJson);

    const detailsObj = createDetailsObj(pkmData, pkmDescr, pkmImg, pkmTypes, pkmCtgry, pkmAblts);
    PKM_DETAILS.push(detailsObj);
}

// helper-functions for each detail
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

function getStats(statName, pkmData) {
    return pkmData.stats.find((element) => element.stat.name === statName).base_stat;
}

// object to push into Array
function createDetailsObj(pkmData, pkmDescr, pkmImg, pkmTypes, pkmCtgry, pkmAblts) {
    return {
        description: pkmDescr,
        name: pkmData.name,
        id: pkmData.id,
        img: pkmImg,
        type: pkmTypes,
        height: pkmData.height,
        weight: pkmData.weight,
        category: pkmCtgry,
        abilities: pkmAblts,
        stats: {
            hp: getStats("hp", pkmData),
            attack: getStats("attack", pkmData),
            defense: getStats("defense", pkmData),
            sp_attack: getStats("special-attack", pkmData),
            sp_defense: getStats("special-defense", pkmData),
            speed: getStats("speed", pkmData),
        },
    };
}

//#endregion
