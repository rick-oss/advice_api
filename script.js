let globalAdvice = "";
let currentLang = "en";
let usRadio = document.querySelector("#us");
let ptBrRadio = document.querySelector("#pt-br");
let txtAdvice = document.querySelector(".advice");
const sliderTab = document.querySelector(".slider-tab");
const adviceButton = document.querySelector(".btn-advice");
const translations = {
    en: { title: "Generator Advice", adviceButton: "New Advice" },
    pt: {
        title: "Gerador de Conselhos",
        adviceButton: "Novo Conselho",
    },
};

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

async function showAdvice() {
    try {
        const advice = await getAdvice();

        txtAdvice.textContent = advice;
        globalAdvice = advice;

        // Se o idioma estiver em pt-br, faz a tradução da interface de volta para o inglês após a nova requisição
        if (currentLang === "pt") {
            translatePage();
        }

        if (ptBrRadio.checked) {
            currentLang = "en";
            usRadio.checked = true;
            ptBrRadio.checked = false;
            sliderTab.style.left = "0";
        }
    } catch (err) {
        console.log(err);
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

async function showTranslation(advice) {
    try {
        const translation = await translateAdvice(advice);

        txtAdvice.textContent = translation;
        sliderTab.style.left = "50%";
        translatePage();
    } catch (err) {
        console.log(`Erro: ${err}`);
    }
}

function showLanguageReal() {
    txtAdvice.textContent = globalAdvice;
    sliderTab.style.left = "0";
    translatePage();
}

function translatePage() {
    currentLang = currentLang === "en" ? "pt" : "en";

    document.querySelector(".title").textContent = translations[currentLang].title;
    adviceButton.value = translations[currentLang].adviceButton;
}

adviceButton.addEventListener("click", showAdvice);
usRadio.addEventListener("click", showLanguageReal);
ptBrRadio.addEventListener("click", function () {
    showTranslation(globalAdvice);
});
showAdvice();
