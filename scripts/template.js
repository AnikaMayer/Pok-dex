function renderPkmCardsTemplate(singlePokemon, i) {
    return /*html*/ `
        <button aria-label="show Pokemon details" class="pokemon_card" onclick="openDialog(${i})">
            <div id="pkm_img_${i}" class="pkm_img_box"></div>
            <div class="pkm_name">
                <p>Nr. ${padNumber(singlePokemon.id)}</p>
                <h2>${capitalizeLetter(singlePokemon.name)}</h2>
            </div>
            <div id="pkm_type_${i}" class="pkm_type"></div>
        </button>
    `;
}

function renderTypesTemplate(singlePokemon, y) {
    return /*html*/ `
        <div class="single_type">
            <p>${capitalizeLetter(singlePokemon.type[y])}</p>
        </div>
    `;
}

function dialogTemplate(i) {
    return /*html*/ `
        <section class="dialog_box">
            <header class="dialog_header">
                <h2>${capitalizeLetter(POKEMON_DETAILS[i].name)}</h2>
                <p>Nr. ${padNumber(POKEMON_DETAILS[i].id)}</p>
            </header>
            <div class="dialog_content">
                <div id="dialog_img_${i}"></div>
                <div class="main_info">
                    <p class="description">${POKEMON_DETAILS[i].description}</p>
                    <div>
                        <button class="male"></button>
                        <button class="female"></button>
                    </div>
                    <div class="attributes">
                        <ul>
                            <li>
                                <span class="attribute_title">Height:</span>
                                <span class="attribute_value">${POKEMON_DETAILS[i].height}</span>
                            </li>
                            <li>
                                <span class="attribute_title">Weight:</span>
                                <span class="attribute_value">${POKEMON_DETAILS[i].weight}</span>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <span class="attribute_title">Category:</span>
                                <span class="attribute_value">${POKEMON_DETAILS[i].category}</span>
                            </li>
                            <li>
                                <span class="attribute_title">Abilities:</span>
                                <span class="attribute_value">${POKEMON_DETAILS[i].abilities}</span>
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
                    <p>HP <span>${POKEMON_DETAILS[i].stats.hp}</span></p>
                    <p>Attack <span>${POKEMON_DETAILS[i].stats.attack}</span></p>
                    <p>Defense <span>${POKEMON_DETAILS[i].stats.defense}</span></p>
                    <p>Sp.-Attack <span>${POKEMON_DETAILS[i].stats.sp_attack}</span></p>
                    <p>Sp.-Defense <span>${POKEMON_DETAILS[i].stats.sp_defense}</span></p>
                    <p>Speed <span></span>${POKEMON_DETAILS[i].stats.speed}</p>
                </div>
            </div>
            <footer class="dialog_footer"></footer>
        </section>
    `;
}
