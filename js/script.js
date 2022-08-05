var state = {
  board: [],
  currentGame: [],
  savedGames: [],
};

function start() {
  readLocalStorage();
  createBoard();
  newGame();
}
/** Lendo os jogos salvos no local storage */
function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGamesFromLocalStorage = window.localStorage.getItem('saved-games');

  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage);
  }
}

function writeToLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createBoard() {
  // cria os numeros de 1 a 60
  state.board = [];

  for (let i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function newGame() {
  resetGame();
  render();

  console.log(state.currentGame);
}

function render() {
  //criacao dos elementos visuais
  renderBoard();
  renderButtons();
  renderSavedGames();
}

function renderBoard() {
  let divBoard = document.querySelector('#megasena-board');
  divBoard.innerHTML = '';

  let ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  for (let i = 0; i < state.board.length; i++) {
    let currentNumber = state.board[i];

    let liNumber = document.createElement('li');
    liNumber.textContent = currentNumber;
    liNumber.classList.add('number');

    liNumber.addEventListener('click', handleNumberClick);
    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add('selected-number');
    }
    ulNumbers.appendChild(liNumber);
  }

  divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event) {
  let value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }
  console.log(state.currentGame);

  render();
}

function renderButtons() {
  let divButtons = document.querySelector('#megasena-buttons');
  divButtons.innerHTML = '';
  let buttonNewGame = createNewGameButton();
  let buttonRandomGame = createRandomGameButton();
  let buttonSaveGame = createSaveGameButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSaveGame);
}

function createSaveGameButton() {
  let button = document.createElement('button');
  button.textContent = 'Salvar Jogo';
  button.disabled = !isGameComplete();

  button.addEventListener('click', saveGame);

  return button;
}
function createRandomGameButton() {
  let button = document.createElement('button');
  button.textContent = 'Jogo aleatório';

  button.addEventListener('click', randomGame);

  return button;
}

function createNewGameButton() {
  let button = document.createElement('button');
  button.textContent = 'Novo jogo';

  button.addEventListener('click', newGame);
  return button;
}
function renderSavedGames() {
  let divSavedGames = document.querySelector('#megasena-saved-games');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>';
  } else {
    let ulSavedGames = document.createElement('ul');

    for (let i = 0; i < state.savedGames.length; i++) {
      let currentGame = state.savedGames[i];

      let liGame = document.createElement('li');
      liGame.textContent = currentGame.join(', ');

      ulSavedGames.appendChild(liGame);
    }

    divSavedGames.appendChild(ulSavedGames);
  }
}

function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error('Numero Invalido', numberToAdd);
    return;
  }

  if (state.currentGame.length >= 6) {
    console.error('O jogo já está completo');
    return;
  }

  if (isNumberInGame(numberToAdd)) {
    console.error('Este número já está no jogo', numberToAdd);
    return;
  }

  state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error('Numero Invalido', numberToRemove);
    return;
  }

  var newGame = [];

  for (let i = 0; i < state.currentGame.length; i++) {
    var currentNumber = state.currentGame[i];

    if (currentNumber === numberToRemove) {
      continue;
    }

    newGame.push(currentNumber);
  }

  state.currentGame = newGame;
}

function isNumberInGame(numberToCheck) {
  return state.currentGame.includes(numberToCheck);
}

function saveGame() {
  if (!isGameComplete()) {
    console.error('O jogo não está completo');
    return;
  }

  state.savedGames.push(state.currentGame);
  writeToLocalStorage();
  newGame();
}

function isGameComplete() {
  return state.currentGame.length === 6;
}

function resetGame() {
  state.currentGame = [];
}

function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }

  console.log(state.currentGame);
  render();
}
start();
