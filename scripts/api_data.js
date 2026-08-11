// #region fetchData

// get url for every pokemon leading to more info
async function getData(offset) {
    const response = await fetch(`${POKEAPI}/pokemon?limit=20&offset=${offset}`);
    const responseFromJson = await response.json();

    for (let j = 0; j < responseFromJson.results.length; j++) {
        pokemonUrl.push(responseFromJson.results[j].url);
    }
}

// use pkm-url to fetch those infos and push all info into an Array to work with later
async function getPkmInfo(listUrl) {
    for (const pkmUrl of listUrl) {
        const resp = await fetch(`${pkmUrl}`);
        const respFromJson = await resp.json();
        loadedInfo.push(respFromJson);

        const pkmImg = respFromJson.sprites.other["official-artwork"].front_default;
        const pkmTypes = getTypes(respFromJson);

        const pokemonObject = createPkmObj(respFromJson, pkmImg, pkmTypes);
        loadedPkm.push(pokemonObject);
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
    const loadBtn = document.getElementById("load_btn");
    loadBtn.classList.add("hide_load_btn");

    showLoadingScreen();
    await getData(currentOffset);

    const listUrl = pokemonUrl.slice(currentOffset); // slice with start = adjusted offset
    await getPkmInfo(listUrl);
    hideLoadingScreen();
    renderPkmCards(loadedPkm);
    loadBtn.classList.remove("hide_load_btn");
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

// #region getDetailsDialog

// use Array from above with all Info to find info needed for detail-view and push into Details-Array for dialog
async function getMoreDetails(singlePokemon) {
    if (pkmDetails.find((pkmDetail) => pkmDetail.id === singlePokemon.id)) {
        return;
    }
    const pkmData = loadedInfo.find((pkm) => pkm.id === singlePokemon.id);
    const pkmImg = pkmData.sprites.other["official-artwork"].front_default;
    const pkmTypes = getTypes(pkmData);
    const pkmAblts = getAblty(pkmData);
    const resp = await fetch(pkmData.species.url);
    const respFromJson = await resp.json();
    const pkmDescr = getDescr(respFromJson);
    const pkmCtgry = getCtgry(respFromJson);
    const evoChain = await getEvoChain(respFromJson);
    const detailsObj = createDetailsObj(pkmData, pkmDescr, pkmImg, pkmTypes, pkmCtgry, pkmAblts, evoChain);
    pkmDetails.push(detailsObj);
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
    const descr = respFromJson.flavor_text_entries.find((element) => element.language.name === "en").flavor_text;

    return descr.replace(/\f/g, " ").replace(/\n/g, " ");
}

function getCtgry(respFromJson) {
    return respFromJson.genera.find((element) => element.language.name === "en").genus;
}

async function getEvoChain(respFromJson) {
    const evoChain = [];
    const evoResp = await fetch(respFromJson.evolution_chain.url);
    const evoRespFromJson = await evoResp.json();
    const chainInfo = evoRespFromJson.chain;
    evoChain.push(chainInfo.species.name);
    chainInfo.evolves_to.forEach((firstEvo) => {
        evoChain.push(firstEvo.species.name);
        firstEvo.evolves_to.forEach((secondEvo) => {
            evoChain.push(secondEvo.species.name);
        });
    });
    return evoChain;
}

function getStats(statName, pkmData) {
    return pkmData.stats.find((element) => element.stat.name === statName).base_stat;
}

// object to push into Array
function createDetailsObj(pkmData, pkmDescr, pkmImg, pkmTypes, pkmCtgry, pkmAblts, evoChain) {
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
        evolutions: evoChain,
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

// #region getGlobalData

//fetch from API (same as getData()-function), push into new Array for global search later on
async function getAllPkmNames() {
    const response = await fetch(`${POKEAPI}/pokemon?limit=1025&offset=0`);
    const responseFromJson = await response.json();

    allNames = responseFromJson.results;
}

async function getGlobalPkmInfo(matches) {
    searchedGlobal.length = 0;
    for (const pkm of matches) {
        const resp = await fetch(`${pkm.url}`);
        const respFromJson = await resp.json();
        loadedInfo.push(respFromJson);

        const pkmImg = respFromJson.sprites.other["official-artwork"].front_default;
        const pkmTypes = getTypes(respFromJson);

        const pokemonObject = createPkmObj(respFromJson, pkmImg, pkmTypes);
        searchedGlobal.push(pokemonObject);
    }
}

//#endregion
