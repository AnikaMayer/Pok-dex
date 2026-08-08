function renderPkmCardsTemplate(singlePokemon) {
    return /*html*/ `
        <button aria-label="show Pokemon details" class="pokemon_card" onclick="openDialog(${singlePokemon.id})">
            <div id="pkm_img_${singlePokemon.id}" class="pkm_img_box"></div>
            <div class="pkm_name">
                <p>Nr. ${padNumber(singlePokemon.id)}</p>
                <h2>${capitalizeLetter(singlePokemon.name)}</h2>
            </div>
            <div id="pkm_type_${singlePokemon.id}" class="pkm_type"></div>
        </button>
    `;
}

function renderTypesTemplate(singlePokemon, y) {
    return /*html*/ `
        <div class="single_type bg_${singlePokemon.type[y]}">
            <p>${capitalizeLetter(singlePokemon.type[y])}</p>
        </div>
    `;
}

function noResultsTemplate(searchInput) {
    return /*html*/ `
        <p>"Oops! The Pokéball missed! Your search for „${searchInput}" didn´t catch any Pokémon. Try again!"</p>
    `;
}

function dialogTemplate(details) {
    return /*html*/ `
        <section class="dialog_box" onclick="bubblingProtection(event)">
            <header class="dialog_header">
                <button id="prev_btn" onclick="goToPrevPokemon()">PREV</button>
                <h2>${capitalizeLetter(details.name)}</h2>
                <p>Nr. ${padNumber(details.id)}</p>
                <button id="next_btn" onclick="goToNextPokemon()">NEXT</button>
            </header>
            <div class="dialog_content">
                <div id="dialog_img_${details.id}"></div>
                <div class="main_info">
                    <p class="description">${details.description}</p>
                    <div>
                        <button class="male"></button>
                        <button class="female"></button>
                    </div>
                    <div class="attributes">
                        <ul>
                            <li>
                                <span class="attribute_title">Height:</span>
                                <span class="attribute_value">${details.height}</span>
                            </li>
                            <li>
                                <span class="attribute_title">Weight:</span>
                                <span class="attribute_value">${details.weight}</span>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <span class="attribute_title">Category:</span>
                                <span class="attribute_value">${details.category}</span>
                            </li>
                            <li>
                                <span class="attribute_title">Abilities:</span>
                                <span class="attribute_value">${details.abilities}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="data">
                    <div class="data_type">
                        <h3>Type</h3>
                    </div>
                </div>
                <div class="stats">
                    <h3>Stats</h3>
                    <p>HP <span>${details.stats.hp}</span></p>
                    <p>Attack <span>${details.stats.attack}</span></p>
                    <p>Defense <span>${details.stats.defense}</span></p>
                    <p>Sp.-Attack <span>${details.stats.sp_attack}</span></p>
                    <p>Sp.-Defense <span>${details.stats.sp_defense}</span></p>
                    <p>Speed <span></span>${details.stats.speed}</p>
                </div>
                <div class="evo_container">
                    <h3>Evolutions</h3>
                    <div id="evo_box" class="evo_chain"></div>
                </div>
            <footer class="dialog_footer"></footer>
        </section>
    `;
}

function evoChainTemplate(evoData) {
    return /*html*/ `
        <div class="evo_stage">
            <div id="evo_img_${evoData.id}"></div>
            <p>${capitalizeLetter(evoData.name)} ${padNumber(evoData.id)}</p>
            <div id="evo_type_${evoData.id}"></div>
        </div>
    `;
}
