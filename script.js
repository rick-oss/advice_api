let globalAdvice = ""; // Armazena o conselho atual gerado (em inglês)
let currentLang = "en"; // Idioma atual da interface
let usRadio = document.querySelector("#us"); // Botão de opçao para inglês
let ptBrRadio = document.querySelector("#pt-br"); // botão de opçao para português
let txtAdvice = document.querySelector(".advice"); // Elemento onde o conselho é exibido
const sliderTab = document.querySelector(".slider-tab"); // Animaçao da aba de idioma
const adviceButton = document.querySelector(".btn-advice"); // botão que gera um novo conselho

// Traduções dos textos da página (título e botão)
const translations = {
    en: { title: "Generator Advice", adviceButton: "New Advice" },
    pt: {
        title: "Gerador de Conselhos",
        adviceButton: "Novo Conselho",
    },
};

// Função que obtém um novo conselho da API
async function getAdvice() {
    try {
        const response = await fetch("https://api.adviceslip.com/advice", {
            cache: "no-store",
        });
        const data = await response.json();

        return data.slip.advice;
    } catch (err) {
        console.error("Error:", err); // Exibe erros no console
    }
}

// Função para mostrar o conselho na tela
async function showAdvice() {
    try {
        const advice = await getAdvice();

        txtAdvice.textContent = advice; // Exibe o conselho
        globalAdvice = advice; // Atualiza o conselho global

        // Se o idioma estiver em pt-br, traduz os textos da página de volta para o inglês
        if (currentLang === "pt") {
            translatePage();
        }

        // Se o idioma estiver em pt-br, volta para inglês e ajusta a animação
        if (ptBrRadio.checked) {
            currentLang = "en";
            usRadio.checked = true;
            ptBrRadio.checked = false;
            sliderTab.style.left = "0";
        }
    } catch (err) {
        console.log(`Erro: ${err}`);
    }
}

// Função que traduz o conselho usando uma API de tradução
async function translateAdvice(advice) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${advice}&langpair=en|pt`);
        const data = await response.json();

        return data.responseData.translatedText; // Retorna o conselho traduzido
    } catch (err) {
        console.error(`Erro: ${err}`);
    }
}

// Função para mostrar a tradução do conselho na tela
async function showTranslation(advice) {
    try {
        const translation = await translateAdvice(advice);

        txtAdvice.textContent = translation; // Exibe o conselho traduzido
        sliderTab.style.left = "50%"; // Movimenta o sliderTab de idioma para português
        translatePage(); // Traduz os textos da página para português
    } catch (err) {
        console.log(`Erro: ${err}`);
    }
}

// Função que exibe o conselho em inglês e traduz os textos da página de volta para inglês
function showLanguageReal() {
    txtAdvice.textContent = globalAdvice; // Exibe o conselho em inglês
    sliderTab.style.left = "0"; // Movimenta o sliderTab de idioma para o inglês
    translatePage(); // Traduz a página de volta para o inglês
}

// Função que alterna os textos da página entre inglês e português
function translatePage() {
    currentLang = currentLang === "en" ? "pt" : "en"; // Alterna o idioma

    document.querySelector(".title").textContent = translations[currentLang].title; // Atualiza o título
    adviceButton.value = translations[currentLang].adviceButton; // Atualiza o texto do botão
}

// Event listener para o botão que gera um novo conselho
adviceButton.addEventListener("click", showAdvice);

// Event listener para exibir o conselho em inglês quando o botão de idioma (inglês) é clicado
usRadio.addEventListener("click", showLanguageReal);

// Event listener para traduzir o conselho e os textos da página ao clicar no botão de idioma (português)
ptBrRadio.addEventListener("click", function () {
    showTranslation(globalAdvice);
});

// Gera o primeiro conselho ao carregar a página
showAdvice();
