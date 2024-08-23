const rounds = [
    {
        words: [
            "Gato", "Cão", "Leão", "Tigre",
            "Azul", "Verde", "Vermelho", "Amarelo",
            "Brasil", "Argentina", "França", "Itália",
            "Ford", "Toyota", "BMW", "Honda"
        ],
        correctGroups: [
            { words: ["Gato", "Cão", "Leão", "Tigre"], color: "correct-1", theme: "Animais" },
            { words: ["Azul", "Verde", "Vermelho", "Amarelo"], color: "correct-2", theme: "Cores" },
            { words: ["Brasil", "Argentina", "França", "Itália"], color: "correct-3", theme: "Países" },
            { words: ["Ford", "Toyota", "BMW", "Honda"], color: "correct-4", theme: "Marcas de Carros" }
        ]
    },
    {
        words: [
            "Capivara", "Rato", "Esquilo", "Porquinho-da-Índia",
            "Lousa", "Giz", "Apagador", "Caderno",
            "Pastel", "Feijoada", "Coxinha", "Brigadeiro",
            "Microfone", "Violão", "Piano", "Bateria"
        ],
        correctGroups: [
            { words: ["Capivara", "Rato", "Esquilo", "Porquinho-da-Índia"], color: "correct-1", theme: "Roedores" },
            { words: ["Lousa", "Giz", "Apagador", "Caderno"], color: "correct-2", theme: "Objetos de Sala de Aula" },
            { words: ["Pastel", "Feijoada", "Coxinha", "Brigadeiro"], color: "correct-3", theme: "Alimentos Típicos" },
            { words: ["Microfone", "Violão", "Piano", "Bateria"], color: "correct-4", theme: "Instrumentos Musicais" }
        ]
    },
    {
        words: [
            "Documentos", "Planilhas", "Apresentações", "Formulários",
            "Abstração", "Padrões", "Algoritmo", "Decomposição",
            "Breno", "Maria Paula", "Andressa", "Rafael",
            "Júpiter", "Marte", "Terra", "Saturno"
        ],
        correctGroups: [
            { words: ["Documentos", "Planilhas", "Apresentações", "Formulários"], color: "correct-1", theme: "Ferramentas Google" },
            { words: ["Abstração", "Padrões", "Algoritmo", "Decomposição"], color: "correct-2", theme: "Pilares do Pensamento Computacional" },
            { words: ["Breno", "Maria Paula", "Andressa", "Rafael"], color: "correct-3", theme: "Nomes Populares" },
            { words: ["Júpiter", "Marte", "Terra", "Saturno"], color: "correct-4", theme: "Planetas" }
        ]
    }
];

let currentRound = 0;
let selectedWords = [];
let attempts = 0;
let groupsCompleted = 0;

function initGame() {
    if (currentRound >= rounds.length) {
        showFinalPassword();
        return;
    }

    updateRoundTitle();

    const { words, correctGroups } = rounds[currentRound];
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    selectedWords = [];
    attempts = 0;
    groupsCompleted = 0;
    updateAttempts();
    updateMessage('');

    const shuffledWords = words.sort(() => 0.5 - Math.random());

    shuffledWords.forEach(word => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.textContent = word;
        div.addEventListener('click', () => toggleSelection(div));
        grid.appendChild(div);
    });
}

function updateRoundTitle() {
    const roundTitle = document.getElementById('round-title');
    roundTitle.textContent = `Round ${currentRound + 1}/3`;
}

function toggleSelection(div) {
    const word = div.textContent;
    if (selectedWords.includes(word)) {
        selectedWords = selectedWords.filter(w => w !== word);
        div.classList.remove('selected');
    } else if (selectedWords.length < 4) {
        selectedWords.push(word);
        div.classList.add('selected');
    }

    if (selectedWords.length === 4) {
        checkGroups();
    }
}

function checkGroups() {
    attempts++;
    updateAttempts();

    const { correctGroups } = rounds[currentRound];
    let foundGroup = correctGroups.find(group =>
        selectedWords.every(word => group.words.includes(word))
    );

    if (foundGroup) {
        document.getElementById('message').textContent = `Grupo correto! Tema: ${foundGroup.theme}`;
        highlightCorrectGroup(foundGroup.color);
        groupsCompleted++;

        if (groupsCompleted === 4) {
            currentRound++;
            if (currentRound < rounds.length) {
                setTimeout(initGame, 1000); // Espera 1 segundo antes de iniciar a próxima rodada
            } else {
                showFinalPassword();
            }
        }
    } else {
        document.getElementById('message').textContent = "Grupo incorreto. Tente novamente!";
        resetSelection();
    }
}

function highlightCorrectGroup(colorClass) {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        if (selectedWords.includes(item.textContent)) {
            item.classList.add(colorClass);
            item.classList.remove('selected');
            item.removeEventListener('click', toggleSelection); // Desabilita clique em grupos corretos
        }
    });
    selectedWords = [];
}

function resetSelection() {
    const gridItems = document.querySelectorAll('.grid-item.selected');
    gridItems.forEach(item => {
        item.classList.remove('selected');
    });
    selectedWords = [];
}

function updateAttempts() {
    document.getElementById('attempts').textContent = `Tentativas: ${attempts}`;
}

function updateMessage(message) {
    document.getElementById('message').textContent = message;
}

function showFinalPassword() {
    let modal = document.getElementById('congrats-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'congrats-modal';
        modal.innerHTML = `
            <h2>Parabéns!</h2>
            <p>Você completou todas as rodadas!</p>
            <p>A senha é: <strong>FOQUE APENAS NO IMPORTANTE</strong></p>
            <button onclick="closeCongratsModal()">Jogar Novamente</button>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'block';
}

function closeCongratsModal() {
    const modal = document.getElementById('congrats-modal');
    modal.style.display = 'none';
    currentRound = 0;
    initGame();
}

window.onload = initGame;
