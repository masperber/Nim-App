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
  rowSelected: -1 // the player may remove pearls from any row
};

function isPlayerTurn() {
    return gameState.playerTurn;
}

function countPearls() {
    let count = 0;
    for (let i = 0; i < gameState.rows.length; i++) {
        count += gameState.rows[i];
    }
    return count;
}

function updateMessage(message) {
    messageBox.textContent = message;
}

// Generate a random number of rows with a random number of pearls in each row
function generateGame() {
    gameState.rows = [];
    gameState.playerTurn = true;
    gameState.gameOver = false;
    gameState.rowSelected = -1;
    const numRows = Math.floor(Math.random() * (MAX_ROWS - MIN_ROWS + 1)) + MIN_ROWS; // generate between MIN_ROWS and MAX_ROWS rows
    for (let i = 0; i < numRows; i++) {
        const numPearls = Math.floor(Math.random() * (MAX_PEARLS - MIN_PEARLS + 1)) + MIN_PEARLS; // generate between 1 and 12 pearls per row
        gameState.rows.push(numPearls);
    }
    gameState.rows.sort(function(a,b){return a-b});
    console.log(gameState.rows);
    console.log(countPearls());
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

function removePearl(row) {
    gameState.rows[row]--; // remove the clicked pearl
    console.log(gameState.rows);
    console.log(countPearls());
    // if the row is empty, remove it from the game state
    if (gameState.rows[row] == 0) {
        gameState.rows.splice(row,1);
        gameState.rowSelected = -2; // the player may not remove any more pearls
    }
    renderGame(); // re-render the game board to reflect the updated state
}

// Handle when the player clicks on a pearl
function handlePearlClick(row) {
    if (!isPlayerTurn() || gameState.gameOver || (gameState.rowSelected != -1 && gameState.rowSelected != row)) {
        return; // ignore clicks if it's not the player's turn or the game is over
    }
    gameState.rowSelected = row;
    removePearl(row);
    if (countPearls() == 1) {
        endGame(isPlayerTurn());
    }
    endTurnButton.textContent = "End turn";
    endTurnButton.disabled = false; // enable the "end turn" button
}

function handleComputerTurn() {
    // generate a random row
    let row = Math.floor(Math.random() * gameState.rows.length);
  
    // generate a random number of pearls to remove from the row
    let numToRemove = Math.floor(Math.random() * (gameState.rows[row] - 1)) + 1;

    if (numToRemove == countPearls()) {
        numToRemove--;
    }
    
    // remove the pearls from the row
    for (let i = 0; i < numToRemove; i++) {
        removePearl(row);
    }

    if (countPearls() == 1) {
        endGame(isPlayerTurn());
    }
    else {
        endTurn();
    }
}

function endTurn() {
    endTurnButton.disabled = true; // disable the "end turn button"
    // If it is the player's turn, switch to the AI's turn
    if (isPlayerTurn()) {
        gameState.playerTurn = false;
        gameState.rowSelected = -1;
        updateMessage("Computer's turn");
        setTimeout(handleComputerTurn, 1000); // wait 1 second before making the move
    }
    // If it is the AI's turn, switch to the player's turn
    else {
        gameState.playerTurn = true;
        gameState.rowSelected = -1;
        updateMessage("Your turn");
    }
}
function endGame(playerWon) {
    gameState.gameOver = true;
    if (playerWon) {
        updateMessage("You won!");
    } else {
        updateMessage("Computer won!");
    }
    endTurnButton.textContent = "New game";
    endTurnButton.disabled = false;
    endTurnButton.removeEventListener("click", endTurn);
    endTurnButton.addEventListener("click", newGame);
}

function newGame() {
    // Reset game state
    generateGame();
    renderGame();

    // Update message and UI
    updateMessage("New game started! Your turn");
    
    // add event listener to the end turn button
    endTurnButton.removeEventListener("click", newGame);
    endTurnButton.addEventListener("click", endTurn);
    endTurnButton.textContent = "Pass";
}

window.addEventListener("load", function () {
    newGame();
});
