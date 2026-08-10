function renderPkmCardsTemplate(singlePokemon) {
    return /*html*/ `
        <li>
            <button aria-label="show Pokemon details" class="pokemon_card" onclick="openDialog(${singlePokemon.id})">
                <div id="pkm_img_${singlePokemon.id}" class="pkm_img_box"></div>
                <div class="name_and_Type">
                    <div class="pkm_name">
                        <p>Nr. ${padNumber(singlePokemon.id)}</p>
                        <h2>${capitalizeLetter(singlePokemon.name)}</h2>
                    </div>
                    <div id="pkm_type_${singlePokemon.id}" class="pkm_type"></div>
                </div>
            </button>
        </li>
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
        <div class="no_result_box">
            <p class="error_msg">Oops! The Pokéball missed!<br>Your search for „${searchInput}" didn´t catch any Pokémon. Try again!</p>
            <img src="./assets/img/pkm_relaxo_front.svg" alt="Image of Relaxo">
        </div>
    `;
}

function dialogTemplate(details) {
    return /*html*/ `
        <section class="dialog_box" onclick="bubblingProtection(event)">
            <header class="dialog_header">
                <button id="prev_btn" onclick="goToPrevPokemon()"><</button>
                <h2>${capitalizeLetter(details.name)}</h2>
                <p>Nr. ${padNumber(details.id)}</p>
                <button id="next_btn" onclick="goToNextPokemon()">></button>
            </header>
            <div class="dialog_content">
                <div class="main_info">
                    <div class="img_type_box">
                        <div id="dialog_img_${details.id}" class="dialog_img"></div>
                        <div id="data_type_${details.id}" class="data_type"></div>
                    </div>
                    <div class="detail_info_box">
                        <div class="gender_btn">
                            <button class="female">
                                <img src="./assets/img/icon_female_pink.svg" alt="female-gender-icon">
                            </button>
                            <button class="male">
                                <img src="./assets/img/icon_male_blue.svg" alt="male-gender-icon">
                            </button>
                        </div>
                        <p class="description">${details.description}</p>
                    </div>
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
                        <li>
                            <span class="attribute_title">Category:</span>
                            <span class="attribute_value">${details.category}</span>
                        </li>
                        <li>
                            <span class="attribute_title">Abilities:</span>
                            <span class="attribute_value">${details.abilities.map(formatAbilityName).join(" | ")}</span>
                        </li>
                    </ul>
                </div>
                <div class="stats">
                    <h3>Stats</h3>
                    <div>${statRowTemplate("HP", details.stats.hp, "hp")}</div>
                    <div>${statRowTemplate("Attack", details.stats.attack, "attack")}</div>
                    <div>${statRowTemplate("Defense", details.stats.defense, "defense")}</div>
                    <div>${statRowTemplate("Sp.-Attack", details.stats.sp_attack, "sp_attack")}</div>
                    <div>${statRowTemplate("Sp.-Defense", details.stats.sp_defense, "sp_defense")}</div>
                    <div>${statRowTemplate("Speed", details.stats.speed, "speed")}</div>
                </div>
                <div class="evo_container">
                    <h3>Evolutions</h3>
                    <div id="evo_box" class="evo_chain"></div>
                </div>
            </div>
            <footer class="dialog_footer"></footer>
        </section>
    `;
}

function evoChainTemplate(evoData, stageClass) {
    return /*html*/ `
        <div class="evo_stage ${stageClass}">
            <div class="evo_wrapper">
                <div id="evo_img_${evoData.id}" class="evo_img"></div>
                <div class="evo_title">
                    <p class="evo_name">${capitalizeLetter(evoData.name)}</p>
                    <p class="evo_nr">Nr. ${padNumber(evoData.id)}</p>
                </div>
                <div id="evo_type_${evoData.id}" class="evo_type"></div>
            </div>
        </div>
    `;
}

function statRowTemplate(label, value, statKey) {
    return /*html*/ `
        <div class="stat_row">
            <p class="stat_label">${label}</p>
            <div class="stat_bar_track">
                <div class="stat_bar_fill stat_${statKey}" style="width: ${statBarPercent(value)}%"></div>
            </div>
            <p class="stat_value">${value}</p>
        </div>
    `;
}
