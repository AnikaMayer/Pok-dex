function renderPkmCardsTemplate(singlePokemon, i) {
    return /*html*/ `
        <button>
            <div>
                <img src="" alt="">
            </div>
            <div>
                <p>${singlePokemon.id}</p>
                <h2>${singlePokemon.name}</h2>
            </div>
            <div id="pkm_${i}"></div>
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
