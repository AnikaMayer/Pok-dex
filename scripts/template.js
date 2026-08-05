function renderPkmCardsTemplate(singlePokemon, i, pkmImg) {
    return /*html*/ `
        <button>
            <div id="pkm_img_${i}">
                <img src="${pkmImg}" alt="">
            </div>
            <div>
                <p>${singlePokemon.id}</p>
                <h2>${singlePokemon.name}</h2>
            </div>
            <div id="pkm_type_${i}"></div>
        </button>
    `;
}

function renderTypesTemplate(singlePokemon, y) {
    return /*html*/ `
        <div>
            <p>${singlePokemon.types[y].type.name}</p>
        </div>
    `;
}
