function renderPkmCardsTemplate(singlePokemon) {
    return /*html*/ `
        <button>
            <div>
                <img src="" alt="">
            </div>
            <div>
                <p id="pkm_${singlePokemon}">${singlePokemon.id}</p>
                <h2 id="pkm_${singlePokemon}">${singlePokemon.name}</h2>
            </div>
            <div></div>
        </button>
    `;
}
