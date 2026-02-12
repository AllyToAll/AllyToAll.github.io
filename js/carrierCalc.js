const BASE_SE = 0.5;
const BASE_OCR_RATE = 0.02;

function calculate() {
    const deck = Number(document.getElementById("deckSize").value);
    let SE = BASE_SE;
    document.querySelectorAll(".se:checked").forEach(cb => SE += Number(cb.dataset.value));
    let ocrSum = 0;
    document.querySelectorAll(".ocr:checked").forEach(cb => ocrSum += Number(cb.dataset.value));
    const OCr = BASE_OCR_RATE * (1 + ocrSum);
    let bestPlanes = deck;
    let bestEff = Math.floor(deck * Math.min(1, SE));
    for (let planes = deck + 10; planes <= 350; planes += 10) {
        const over = Math.max(0, planes - deck) / deck;
        const SE_eff = Math.max(0, Math.min(1, SE - OCr * over * 100));
        const eff = Math.floor(planes * SE_eff);
        if (eff > bestEff) {
            bestEff = eff;
            bestPlanes = planes;
        } else {
            break;
        }
    }
    document.getElementById("seOut").textContent = SE.toFixed(2);
    document.getElementById("ocrOut").textContent = (OCr * 100).toFixed(1);
    document.getElementById("mplanesOut").textContent = bestPlanes;
    document.getElementById("meffOut").textContent = bestEff;
}

document.addEventListener("DOMContentLoaded", calculate);
document.addEventListener("input", calculate);
document.addEventListener("change", calculate);

document.addEventListener("DOMContentLoaded", () => {
    const carrier4 = document.getElementById("Carriers 4 (Specialist)");
    const carrier6 = document.getElementById("Carriers 6 (Expert)");
    const carrier8 = document.getElementById("Carriers 8 (Genius)");
    const floatingSD = document.getElementById("Floating Airfields SD");
    const floatingI = document.getElementById("Floating Airfields I");
    const seaIV = document.getElementById("Sea To Shore Air Power IV");
    const seaV = document.getElementById("Sea To Shore Air Power V");
    const flightDeck = document.getElementById("Flight Deck Manager");
    const airController = document.getElementById("Air Controller");
    const massedCarrier = document.getElementById("Massed Carrier Fleet III");
    [massedCarrier, floatingSD].forEach(cb => {
        cb.addEventListener("change", () => {
            if (cb.checked) {
                if (cb === massedCarrier) {
                    floatingSD.checked = false;
                }
                if (cb === floatingSD) {
                    massedCarrier.checked = false;
                }
            }
        });
    });
    floatingSD.addEventListener("change", () => {
        if (!floatingSD.checked) {
            floatingI.checked = false;
        }
    });
    floatingI.addEventListener("change", () => {
        if (floatingI.checked) {
            floatingSD.checked = true;
        }
    });
    seaIV.addEventListener("change", () => {
        if (!seaIV.checked) {
            seaV.checked = false;
        }
    });
    seaV.addEventListener("change", () => {
        if (seaV.checked) {
            seaIV.checked = true;
        }
    });
    carrier8.addEventListener("change", () => {
        if (carrier8.checked) {
            carrier6.checked = true;
            carrier4.checked = true;
        }
    });
    carrier6.addEventListener("change", () => {
        if (carrier6.checked) {
            carrier4.checked = true;
        } else {
            carrier8.checked = false;
        }
    });
    carrier4.addEventListener("change", () => {
        if (!carrier4.checked) {
            carrier6.checked = false;
            carrier8.checked = false;
        }
    });
    flightDeck.addEventListener("change", () => {
        if (flightDeck.checked) {
            airController.checked = true;
        }
    });
    airController.addEventListener("change", () => {
        if (!airController.checked) {
            flightDeck.checked = false;
        }
    });
});
