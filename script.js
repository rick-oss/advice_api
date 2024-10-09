let globalAdvice = "";
let usRadio = document.querySelector("#us");
let ptBrRadio = document.querySelector("#pt-br");
let txtAdvice = document.querySelector(".advice");
const sliderTab = document.querySelector(".slider-tab");
const adviceButton = document.querySelector(".btn-advice");

async function getAdvice() {
    try {
        const response = await fetch("https://api.adviceslip.com/advice", {
            cache: "no-store",
        });
        const data = await response.json();

        return data.slip.advice;
    } catch (err) {
        console.error("Error:", err);
    }
}

async function translateAdvice(advice) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${advice}&langpair=en|pt`);
        const data = await response.json();

        return data.responseData.translatedText;
    } catch (err) {
        console.error(`Erro: ${err}`);
    }
}

async function showAdvice() {
    try {
        const advice = await getAdvice();

        txtAdvice.textContent = advice;
        globalAdvice = advice;

        if (ptBrRadio.checked) {
            usRadio.checked = true;
            ptBrRadio.checked = false;
            sliderTab.style.left = "0";
        }
    } catch (err) {
        console.log(err);
    }
}

async function showTranslation(advice) {
    try {
        const translation = await translateAdvice(advice);

        txtAdvice.textContent = translation;
        sliderTab.style.left = "50%";
    } catch (err) {
        console.log(`Erro: ${err}`);
    }
}

function showLanguageReal() {
    txtAdvice.textContent = globalAdvice;
    sliderTab.style.left = "0";
}

adviceButton.addEventListener("click", showAdvice);
usRadio.addEventListener("click", showLanguageReal);
ptBrRadio.addEventListener("click", function () {
    showTranslation(globalAdvice);
});
showAdvice();
