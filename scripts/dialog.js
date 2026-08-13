// #region openDialog

async function openDialog(pkmId) {
    document.body.classList.add("overscroll_stop");
    const displayedPkm = getDisplayedPkm();
    currentPokemon = displayedPkm.findIndex((pkm) => pkm.id === pkmId);
    const singlePokemon = loadedPkm.find((pkm) => pkm.id === pkmId) || searchedGlobal.find((pkm) => pkm.id === pkmId);
    await getMoreDetails(singlePokemon);
    const details = pkmDetails.find((pkmDetail) => pkmDetail.id === pkmId);
    renderDialogContent(details);
    loadDialogImg(singlePokemon, details);
    renderDialogTypes(details);
    renderEvoChain(details);
    toggleDialogButtons(displayedPkm);
    preloadShinyImg(details.id);
}

function getDisplayedPkm() {
    if (searchedPokemon.length > 0) {
        return searchedPokemon;
    } else if (searchedGlobal.length > 0) {
        return searchedGlobal;
    } else {
        return loadedPkm;
    }
}

function renderDialogContent(details) {
    DETAILS_DIALOG.showModal();
    DETAILS_DIALOG.innerHTML = dialogTemplate(details);
    DETAILS_DIALOG.classList.add("opened");
}

function toggleDialogButtons(displayedPkm) {
    const prevBtn = document.getElementById("prev_btn");
    const nextBtn = document.getElementById("next_btn");
    prevBtn.classList.toggle("hide_prev_btn", currentPokemon <= 0);
    nextBtn.classList.toggle("hide_next_btn", currentPokemon >= displayedPkm.length - 1);
}

//#endregion

// #region switchPkm

async function goToNextPokemon() {
    const displayedPkm = getDisplayedPkm();

    if (currentPokemon < displayedPkm.length - 1) {
        currentPokemon++;
    } else {
        currentPokemon = 0;
    }
    await openDialog(displayedPkm[currentPokemon].id);
}

async function goToPrevPokemon() {
    const displayedPkm = getDisplayedPkm();

    if (currentPokemon > 0) {
        currentPokemon--;
    } else {
        currentPokemon = displayedPkm.length - 1;
    }
    await openDialog(displayedPkm[currentPokemon].id);
}

//#endregion

// #region close/bubbling

function bubblingProtection(event) {
    event.stopPropagation();
}

function closeDialog() {
    document.body.classList.remove("overscroll_stop");
    DETAILS_DIALOG.close();
    DETAILS_DIALOG.classList.remove("opened");
}

//#endregion

// #region img/type

async function loadDialogImg(singlePokemon, details) {
    const dialogImgRef = document.getElementById(`dialog_img_${details.id}`);
    const pkmImgLoad = await getImg(singlePokemon);
    dialogImgRef.appendChild(pkmImgLoad);
}

function renderDialogTypes(details) {
    const pkmTypesRef = document.getElementById(`data_type_${details.id}`);

    for (let y = 0; y < details.type.length; y++) {
        pkmTypesRef.innerHTML += renderTypesTemplate(details, y);
    }
}

function preloadShinyImg(pkmId) {
    const pkmShiny = loadedInfo.find((pkm) => pkm.id === pkmId);
    const shinyUrl = pkmShiny.sprites.other["official-artwork"].front_shiny;

    if (shinyUrl) {
        new Image().src = shinyUrl;
    }
}

function hasShinySprite(pkmId) {
    const pkmShiny = loadedInfo.find((pkm) => pkm.id === pkmId);
    return pkmShiny.sprites.other["official-artwork"].front_shiny;
}

function toggleImg(variant, pkmId) {
    if (variant === "shiny" && !hasShinySprite(pkmId)) {
        return;
    }
    const pkmShiny = loadedInfo.find((pkm) => pkm.id === pkmId);
    const shinyImg = pkmShiny.sprites.other["official-artwork"];
    const pkmSprite = getSpriteUrl(variant, shinyImg);

    if (!pkmSprite) {
        return;
    }
    renderPkmImg(pkmId, pkmSprite, pkmShiny.name);
    replaceImgBtn(variant, pkmId);
}

function getSpriteUrl(variant, shinyImg) {
    let spriteUrl;

    if (variant === "shiny") {
        spriteUrl = shinyImg.front_shiny;
    } else {
        spriteUrl = shinyImg.front_default;
    }

    return spriteUrl;
}

function renderPkmImg(pkmId, pkmSprite, pkmName) {
    const dialogImgRef = document.getElementById(`dialog_img_${pkmId}`);
    const pkmImg = document.createElement("img");
    pkmImg.src = pkmSprite;
    pkmImg.alt = capitalizeLetter(pkmName);
    dialogImgRef.innerHTML = "";
    dialogImgRef.appendChild(pkmImg);
}

function replaceImgBtn(currentVariant, pkmId) {
    const shinyBtn = document.getElementById(`shiny_btn_${pkmId}`);
    const defaultBtn = document.getElementById(`default_btn_${pkmId}`);

    if (currentVariant === "shiny") {
        shinyBtn.classList.add("hide_img_btn");
        defaultBtn.classList.remove("hide_img_btn");
    } else {
        shinyBtn.classList.remove("hide_img_btn");
        defaultBtn.classList.add("hide_img_btn");
    }
}

//#endregion

// #region details

function statBarPercent(value) {
    const maxBaseStat = 255;
    return Math.min(100, Math.round((value / maxBaseStat) * 100));
}

function formatAbilityName(abilityName) {
    return abilityName.split("-").map(capitalizeLetter).join(" ");
}

function formatHeight(height) {
    return (height / 10).toFixed(1) + " m";
}

function formatWeight(weight) {
    return (weight / 10).toFixed(1) + " kg";
}

function changeGenderImg() {}

//#endregion

// #region evolutions

// .some as alternative for .find or for-loop to toggle "branched"-class for evo-chain
async function renderEvoChain(details) {
    const evoBox = document.getElementById("evo_box");
    evoBox.innerHTML = "";
    evoBox.classList.toggle(
        "branched",
        details.evolutions.some((stage) => stage.length > 1),
    );
    for (let i = 0; i < details.evolutions.length; i++) {
        const evoStage = details.evolutions[i];
        const stageClass = getStageClass(i, details.evolutions.length);
        await renderEvoStage(evoStage, stageClass, evoBox);
    }
}

async function renderEvoStage(evoStage, stageClass, evoBox) {
    if (evoStage.length === 1) {
        await renderSingleEvo(evoStage[0], stageClass, evoBox);
    } else {
        await renderBranchEvo(evoStage, stageClass, evoBox);
    }
}

async function renderSingleEvo(evoName, stageClass, evoBox) {
    const evoData = await getEvoData(evoName);
    evoBox.innerHTML += evoChainTemplate(evoData, stageClass);
    renderEvoTypes(evoData);
    await loadEvoImg(evoData);
}

async function renderBranchEvo(evoStage, stageClass, evoBox) {
    evoBox.innerHTML += evoBranchTemplate(stageClass);
    const branchWrap = evoBox.lastElementChild.querySelector(".evo_branch_wrap");
    for (let y = 0; y < evoStage.length; y++) {
        await renderBranchCard(evoStage[y], branchWrap);
    }
}

async function renderBranchCard(evoName, branchWrap) {
    const evoData = await getEvoData(evoName);
    branchWrap.innerHTML += evoCardTemplate(evoData);
    renderEvoTypes(evoData);
    await loadEvoImg(evoData);
}

async function getEvoData(evoName) {
    let evoData = loadedPkm.find((pkm) => pkm.name === evoName);

    if (evoData) {
        return evoData;
    } else {
        return await searchGlobalPkm(evoName);
    }
}

// first Pkm gets class "last", if it has no evolutions -> better styling for evo-arrow for css
function getStageClass(index, evoLength) {
    if (index === evoLength - 1) {
        return "last";
    } else if (index === 0) {
        return "first";
    } else {
        return "middle";
    }
}

function renderEvoTypes(singlePokemon) {
    const pkmTypesRef = document.getElementById(`evo_type_${singlePokemon.id}`);

    for (let y = 0; y < singlePokemon.type.length; y++) {
        pkmTypesRef.innerHTML += renderTypesTemplate(singlePokemon, y);
    }
}

// create img-cache for not needing to use img-url
async function loadEvoImg(singlePokemon) {
    const pkmImgRef = document.getElementById(`evo_img_${singlePokemon.id}`);
    const pkmImgLoad = await getImg(singlePokemon);
    pkmImgRef.appendChild(pkmImgLoad);
}

//#endregion
