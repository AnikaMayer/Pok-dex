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

async function renderEvoChain(details) {
    const evoBox = document.getElementById("evo_box");
    evoBox.innerHTML = "";

    for (let i = 0; i < details.evolutions.length; i++) {
        const evoName = details.evolutions[i];
        const evoData = await getEvoData(evoName);
        const stageClass = getStageClass(i, details.evolutions.length);

        evoBox.innerHTML += evoChainTemplate(evoData, stageClass);
        renderEvoTypes(evoData);
        await loadEvoImg(evoData);
    }
}

async function getEvoData(evoName) {
    let evoData = loadedPkm.find((pkm) => pkm.name === evoName);

    if (evoData) {
        return evoData;
    } else {
        return await searchGlobalPkm(evoName);
    }
}

function getStageClass(index, evoLength) {
    if (index === 0) {
        return "first";
    } else if (index === evoLength - 1) {
        return "last";
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
