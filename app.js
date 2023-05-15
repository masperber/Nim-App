const messageBox = document.getElementById("message-box");
const gameContainer = document.getElementById("game");
const button = document.getElementById("button");
const taunt = document.getElementById("taunt");
const MIN_ROWS = 3;
const MAX_ROWS = 5;
const MIN_SMALL_ROW = 1;
const MAX_SMALL_ROW = 5;
const MIN_MED_ROW = 4;
const MAX_MED_ROW = 10;
const MIN_LARGE_ROW = 8;
const MAX_LARGE_ROW = 15;

// Define the initial game state
let gameState = {
  rows: [],
  playerTurn: true,
  gameOver: false,
  rowSelected: -1, // the player may remove pearls from any row
  hasTaunted: false
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

function nimSum(rows) {
    let nimSum = 0;
    for (let i = 0; i < rows.length; i++) {
        nimSum ^= rows[i];
    }
    return nimSum;
}

function generateRow(size) {
    switch (size % 3) {
        case 1:
            return Math.floor(Math.random() * (MAX_SMALL_ROW - MIN_SMALL_ROW + 1)) + MIN_SMALL_ROW;
        case 2:
            return Math.floor(Math.random() * (MAX_MED_ROW - MIN_MED_ROW + 1)) + MIN_MED_ROW;
        case 0:
            return Math.floor(Math.random() * (MAX_LARGE_ROW - MIN_LARGE_ROW + 1)) + MIN_LARGE_ROW;
        default:
            return Math.floor(Math.random() * 15) + 1;
    }
}

// Generate a random number of rows with a random number of pearls in each row
function generateGame() {
    gameState.rows = [];
    gameState.playerTurn = true;
    gameState.gameOver = false;
    gameState.rowSelected = -1;
    gameState.hasTaunted = false;
    const numRows = Math.floor(Math.random() * (MAX_ROWS - MIN_ROWS + 1)) + MIN_ROWS; // generate between MIN_ROWS and MAX_ROWS rows
    for (let i = 0; i < numRows; i++) {
        var numPearls;
        if (gameState.rows.length == 0) {
            numPearls = generateRow(i);
        }
        else {
            numPearls = gameState.rows[0];
            while (gameState.rows.includes(numPearls)) {
                numPearls = generateRow(i);
            }
        }
        gameState.rows.push(numPearls);
    }
    gameState.rows.sort(function(a,b){return a-b});
}

// Render the game board based on the current game state
function renderGame() {
    gameContainer.innerHTML = "";
    // create a <div> with class game-row for each number in the gameState.rows array
    for (let i = 0; i < gameState.rows.length; i++) {
            const rowContainer = document.createElement("div");
            rowContainer.classList.add("game-row");
            // create a <div> with class pearl corresponding to the number in each cell of the array
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
    button.textContent = "End turn";
    button.disabled = false; // enable the "end turn" button

    // end the game if only 1 pearl remains
    if (countPearls() == 1) {
        endGame(isPlayerTurn());
    }
}

function randomTurn() {
    // generate a random row
    let row = Math.floor(Math.random() * gameState.rows.length);
  
    // generate a random number of pearls to remove from the row
    let numToRemove = Math.floor(Math.random() * (gameState.rows[row] - 1)) + 1;

    // if the computer would remove all pearls, remove one fewer
    if (numToRemove == countPearls()) {
        numToRemove--;
    }

    return [row,numToRemove];
}

function findSolution() {
    // count the number of singleton rows
    let numSingletons = 0;
    for (let i = 0; i < gameState.rows.length; i++) {
        if (gameState.rows[i] == 1) {
            numSingletons++;
        }
    }
    // if all rows are singleton rows, then remove the first pearl
    if (numSingletons == gameState.rows.length) {
        return [0, 1];
    }
    // if all rows but one are singleton rows, calculate the winning move
    else if (numSingletons == gameState.rows.length - 1) {
        let maxRow = gameState.rows.indexOf(Math.max(...gameState.rows));
        if (gameState.rows.length % 2 == 0) {
            return [maxRow, gameState.rows[maxRow]];
        }
        else {
            return [maxRow, gameState.rows[maxRow] - 1];
        }
    }
    // if there are more than 1 non-singleton rows, calculate a NimSum = 0 solution
    else {
        let gameNimSum = nimSum(gameState.rows);
        for (let i = 0; i < gameState.rows.length; i++) {
            let rowNimSum = nimSum([gameNimSum, gameState.rows[i]]);
            if (rowNimSum < gameState.rows[i]) {
                return [i, gameState.rows[i] - rowNimSum];
            }
        }
    }
    // failsafe return
    return randomTurn();
}

function handleComputerTurn() {
    let turn = [0,0];
    if (nimSum(gameState.rows) == 0) {
        turn = randomTurn();
    }
    else {
        turn = findSolution();
    }

    // remove the pearls from the row
    for (let i = 0; i < turn[1]; i++) {
        removePearl(turn[0]);
    }

    if (countPearls() == 1) {
        endGame(isPlayerTurn());
    }
    else {
        endTurn();
    }
}

function endTurn() {
    button.disabled = true; // disable the "end turn button"

    // If it is the player's turn, switch to the AI's turn
    if (isPlayerTurn()) {
        if (!gameState.hasTaunted && nimSum(gameState.rows) != 0 && countPearls() > 5) {
            gameState.hasTaunted = true;
            taunt.textContent = "NimBot: \"THAT... was your first mistake.\"";
        }
        else {
            taunt.textContent = "";
        }
        gameState.playerTurn = false;
        gameState.rowSelected = -1;
        updateMessage("NimBot's turn");
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

    button.removeEventListener("click", endTurn);
    button.addEventListener("click", newGame);
    console.log("1");
    button.textContent = "New Game";
    console.log("2");
    button.disabled = false;
}

function newGame() {
    // Reset game state
    generateGame();
    renderGame();

    // Update message and UI
    updateMessage("New game started! Your turn");
    
    // add event listener to the end turn button
    button.removeEventListener("click", newGame);
    button.addEventListener("click", endTurn);
    button.textContent = "Pass";
}

window.addEventListener("load", function () {
    newGame();
});
