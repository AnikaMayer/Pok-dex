function renderPkmCardsTemplate(singlePokemon, i, pkmImg) {
    return /*html*/ `
        <button class="pokemon_card">
            <div id="pkm_img_${i}" class="pkm_img_box">
                <img src="${pkmImg}" alt="${singlePokemon.name}">
            </div>
            <div>
                <p>Nr. ${padNumber(singlePokemon.id)}</p>
                <h2>${capitalizeLetter(singlePokemon.name)}</h2>
            </div>
            <div id="pkm_type_${i}"></div>
        </button>
    `;
}

function renderTypesTemplate(singlePokemon, y) {
    return /*html*/ `
        <div>
            <p>${capitalizeLetter(singlePokemon.types[y].type.name)}</p>
        </div>
    `;
}
