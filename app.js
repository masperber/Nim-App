const messageBox = document.getElementById("message-box");
const gameContainer = document.getElementById("game");
const endTurnButton = document.getElementById("button");
const MIN_ROWS = 3;
const MAX_ROWS = 5;
const MIN_PEARLS = 1;
const MAX_PEARLS = 12;

// Define the initial game state
let gameState = {
  rows: [],
  playerTurn: true,
  gameOver: false,
};

function isPlayerTurn() {
    return gameState.playerTurn;
}

function countPearls() {
    let count = 0;
    for (let i = 0; i < gameState.rows[i]; i++) {
      count += gameState.rows[i].length;
    }
    return count;
}
  

// Generate a random number of rows with a random number of pearls in each row
function generateGame() {
  const numRows = Math.floor(Math.random() * (MAX_ROWS - MIN_ROWS + 1)) + MIN_ROWS; // generate between MIN_ROWS and MAX_ROWS rows
  for (let i = 0; i < numRows; i++) {
    const numPearls = Math.floor(Math.random() * (MAX_PEARLS - MIN_PEARLS + 1)) + MIN_PEARLS; // generate between 1 and 12 pearls per row
    gameState.rows.push(numPearls);
  }
  gameState.rows.sort(function(a,b){return a-b});
}

function updateMessage(message) {
  messageBox.textContent = message;
}

function endTurn() {
    // If there is only one pearl remaining, end the game
    if (countPearls() === 1) {
        endGame();
    }

    else {
        // If it is the player's turn, switch to the AI's turn
        if (isPlayerTurn()) {
            gameState.playerTurn = false;
            updateMessage("It is now the computer's turn.");
            setTimeout(handleComputerTurn, 1000); // wait 1 second before making the move
        }
        // If it is the AI's turn, switch to the player's turn
        else {
            gameState.playerTurn = true;
            updateMessage("It is now your turn.");
        }
    }
}  

// Render the game board based on the current game state
function renderGame() {
  gameContainer.innerHTML = "";
  for (let i = 0; i < gameState.rows.length; i++) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("game-row");
    for (let j = 0; j < gameState.rows[i]; j++) {
      const pearl = document.createElement("div");
      pearl.classList.add("pearl");
      pearl.addEventListener("click", () => handlePearlClick(i)); // add a click event listener to each pearl
      rowContainer.appendChild(pearl);
    }
    gameContainer.appendChild(rowContainer);
  }
}

// Handle when the player clicks on a pearl
function handlePearlClick(rowIndex) {
  if (!isPlayerTurn() || gameState.gameOver ) {
    return; // ignore clicks if it's not the player's turn or the game is over
  }
  gameState.rows[rowIndex]--; // remove the clicked pearl
  renderGame(); // re-render the game board to reflect the updated state
  endTurnButton.classList.remove("disabled"); // enable the "end turn" button
}
/*
// Handle when the player clicks the "end turn" button
function handleEndTurn() {
  if (!isPlayerTurn() || gameState.gameOver) {
    return; // ignore clicks if it's not the player's turn or the game is over
  }
  const endTurnButton = document.getElementById("end-turn-button");
  endTurnButton.classList.add("disabled"); // disable the "end turn" button
  gameState.isPlayerTurn = false; // switch to the computer's turn
  renderGame(); // re-render the game board to reflect the updated state
  setTimeout(() => handleComputerTurn(), 500); // add a small delay to simulate the computer "thinking"
}

function handleComputerTurn() {
  // generate a random row
  let row = Math.floor(Math.random() * gameState.rows.length);

  // generate a random number of circles to remove from the row
  let numToRemove = Math.floor(Math.random() * (numCircles[row] - 1)) + 1;

  // remove the circles from the row
  for (let i = 0; i < numToRemove; i++) {
    let circle = document.getElementById(`circle-${row}-${numCircles[row]-i}`);
    circle.style.display = "none";
  }

  // check if the player won
  if (checkWin()) {
    endGame(false);
  } else {
    // switch back to the player's turn
    gameState.isPlayerTurn = true;
    updateMessage("Your turn");
    endTurnButton.disabled = false;
  }
}

function checkWin() {
  let numCirclesLeft = 0;

  // loop through each row and count the number of circles left
  for (let i = 0; i < numRows; i++) {
    let rowCircles = document.querySelectorAll(`.circle-row-${i}`);
    numCirclesLeft += rowCircles.length;
  }

  // return true if only one circle is left
  return numCirclesLeft === 1;
}

function newGame() {
    // Reset game state
    board = generateGame();
    gameState.isPlayerTurn = true;
  
    // Update message and UI
    updateMessage("New game started. Your turn.");
    renderGameBoard();
  
    // Reset endTurn button
    endTurnButton.removeEventListener("click", newGame());
    endTurnButton.addEventListener("click", endTurn());
    endTurnButton.textContent = "End Turn";
  }
  

function endGame(playerWon) {
  if (playerWon) {
    updateMessage("You won!");
  } else {
    updateMessage("Computer won!");
  }
  endTurnButton.innerHTML = "New game";
  endTurnButton.removeEventListener("click", endTurn());
  endTurnButton.addEventListener("click", newGame());
}
*/
window.addEventListener("load", function () {
  // generate a new game board
  generateGame();
  renderGame();

  // initialize the turn variables
  updateMessage(isPlayerTurn() ? "Your turn" : "Computer's turn");
/*
  // add event listeners to the buttons
  endTurnButton.addEventListener("click", endTurn());*/
});
