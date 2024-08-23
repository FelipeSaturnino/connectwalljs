// script.js
const words = [
    "Gato", "Cão", "Leão", "Tigre", // Grupo 1: Animais
    "Azul", "Verde", "Vermelho", "Amarelo", // Grupo 2: Cores
    "Brasil", "Argentina", "França", "Itália", // Grupo 3: Países
    "Ford", "Toyota", "BMW", "Honda" // Grupo 4: Marcas de Carros
];

const correctGroups = [
    { words: ["Gato", "Cão", "Leão", "Tigre"], color: "correct-1", theme: "Animais" },
    { words: ["Azul", "Verde", "Vermelho", "Amarelo"], color: "correct-2", theme: "Cores" },
    { words: ["Brasil", "Argentina", "França", "Itália"], color: "correct-3", theme: "Países" },
    { words: ["Ford", "Toyota", "BMW", "Honda"], color: "correct-4", theme: "Marcas de Carros" }
];

let selectedWords = [];
let attempts = 0;
let groupsCompleted = 0;

function initGame() {
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

    let foundGroup = correctGroups.find(group => 
        selectedWords.every(word => group.words.includes(word))
    );

    if (foundGroup) {
        document.getElementById('message').textContent = `Grupo correto! Tema: ${foundGroup.theme}`;
        highlightCorrectGroup(foundGroup.color);
        groupsCompleted++;

        if (groupsCompleted === 4) {
            showCongratsModal();
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

function showCongratsModal() {
    let modal = document.getElementById('congrats-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'congrats-modal';
        modal.innerHTML = `
            <h2>Parabéns!</h2>
            <p>Você completou o jogo!</p>
            <button onclick="closeCongratsModal()">Jogar Novamente</button>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'block';
}

function closeCongratsModal() {
    const modal = document.getElementById('congrats-modal');
    modal.style.display = 'none';
    initGame();
}

window.onload = initGame;
