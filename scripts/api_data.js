// #region createCardsArray

// get url for every pokemon leading to more info
async function getData() {
    const response = await fetch(`${POKEAPI}/pokemon?limit=20&offset=0`);
    const responseFromJson = await response.json();

    for (let j = 0; j < responseFromJson.results.length; j++) {
        POKEMON_URL.push(responseFromJson.results[j].url);
    }
}

// use pkm-url to fetch those infos and push all info into an Array to work with later
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

// #region createDetailsArray

// use Array from above with all Info to find info needed for detail-view and push into Details-Array for dialog
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

function getStats(statName, index) {
    return ALL_INFO[index].stats.find((element) => element.stat.name === statName).base_stat;
}

// object to push into Array
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

//#endregion
