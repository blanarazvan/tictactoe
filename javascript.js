let switchPlayers, activePlayer, player1Name, player2Name, playerOneScore = 0, playerTwoScore = 0, gameIndex = 0;
const getActivePlayer = () => activePlayer;
const getPlayer1Name = () => player1Name;
const getPlayer2Name = () => player2Name;
const getPlayer1Score = () => playerOneScore;
const getPlayer2Score = () => playerTwoScore;

let gameOver = false;
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const gameBoard = [];
    for(let i = 0; i < rows; i++){
        gameBoard[i] = [];
        for (let j = 0; j < columns; j++){
             gameBoard[i].push(Cell());
        }
    }
const getBoard = () => gameBoard;
const unavailablePositions = [];

const makeSelection = (rowSelection, columnSelection, token) => {
    let winner = 1;
    if (gameOver) return;
    function positionTaken (row, col){
        return unavailablePositions.some(pos => pos[0] === row && pos[1] === col);
    }
    function addPosition(row, col){
        if(!positionTaken(row, col)){
            if (gameOver) return;
            gameBoard[row][col].addSelection(token);
            unavailablePositions.push([row, col]);
            switchPlayers = true;
            checkWinner();
        }else{
           console.log("Position unavailable");
           switchPlayers = false;
        }
    }
    function checkWinner(){
        const cell = (r, c) => gameBoard[r][c].getValue();
        for(let i = 0; i<3; i++){
            if(cell(i,0) && cell(i,0) === cell(i,1) && cell(i,1) === cell(i, 2) 
                ||  cell(0,i) && cell(0,i) === cell(1,i) && cell(1,i) === cell(2,i)
                ||  cell(0,0) && cell(0,0) === cell(1,1) && cell(1,1) === cell(2,2)
                ||  cell(0,2) && cell(0,2) === cell(1,1) &&cell(1,1) === cell(2,0)){
                    switchPlayers = false;
                    winner = 0;
                    displayWinner(getActivePlayer().name);
                    return true;
                }
                else if(unavailablePositions.length === 9 && winner === 1 ){
                    displayWinner(getActivePlayer().name);
                    return true;
                }
            }
            return false;
    }

    function displayWinner (winnerName){
        const playerOneScoreDisplay = document.getElementById("player-one-score");
        const playerTwoScoreDisplay = document.getElementById("player-two-score");
        const player1Name = document.getElementById("playerOne").value.trim();
        const player2Name = document.getElementById("playerTwo").value.trim();

        gameOver = true;
        const winnerMessage = document.querySelector(".turn");
        if (winner === 1) { winnerMessage.textContent = "There's a draw!"};
        if (winner === 0) { 
            winnerMessage.textContent = `${winnerName} won!`;
            if (winnerName === player1Name) {
                playerOneScore += 1;
                playerOneScoreDisplay.textContent = `Score: ${playerOneScore}`;    
              } else if (winnerName === player2Name) {
                playerTwoScore += 1;
                playerTwoScoreDisplay.textContent = `Score: ${playerTwoScore}`;
              }
        };
        document.querySelectorAll(".cell").forEach(btn => {
            btn.disabled = true;
        });
    }
    
    addPosition(rowSelection, columnSelection);
};
const printBoard = () => {
    console.log(getBoard());
};
return { getBoard, makeSelection, printBoard};
}
function Cell() {
    let value = "";

    const addSelection = (player) => {
        value = player;
    };

    const getValue = () => value;
    
    return { addSelection, getValue };
}


function gameFlow (playerOneName, playerTwoName){ 
    
    const board = Gameboard();

    const players = [ 
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];
activePlayer = players[0];

const switchPlayerTurn = () => {
       activePlayer = activePlayer === players[0] ? players[1]: players [0];
    };

const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
};
const playRound = (rowChoice, columnChoice) => {
    board.makeSelection(rowChoice, columnChoice, getActivePlayer().token);
    if(switchPlayers){
        switchPlayerTurn();
        printNewRound();}
    else {
        board.printBoard();
        return "Waiting for a new input...";
    }
};
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        switchPlayerTurn,
        getBoard: board.getBoard
    };
}

function gameDisplay() {
    const form = document.getElementById("form");
    const playerOneNameDisplay = document.getElementById("player-one-name");
    const playerTwoNameDisplay = document.getElementById("player-two-name");
    const playerOneScoreDisplay = document.getElementById("player-one-score");
    const playerTwoScoreDisplay = document.getElementById("player-two-score");
    const gameContainer = document.getElementById("game-container");
    const playerTurn = document.querySelector(".turn");
    const boardDisplay = document.querySelector(".board");
    let flow;
  
    
    const updateScreen = () => {
        boardDisplay.innerHTML = "";
        const board = flow.getBoard();
        const activePlayer = getActivePlayer();

        if (!gameOver){
        playerTurn.textContent = `${activePlayer.name}'s turn...`;
        }
        board.forEach((row, rindex) => {
            row.forEach((cell, cindex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.rows = rindex;
                cellButton.dataset.columns = cindex;
                cellButton.textContent = cell.getValue();
                boardDisplay.appendChild(cellButton);
            })
        })
    }
    

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const player1Name = document.getElementById("playerOne").value.trim();
        const player2Name = document.getElementById("playerTwo").value.trim();
        
        playerOneNameDisplay.textContent = player1Name || "Player 1";
        playerTwoNameDisplay.textContent = player2Name || "Player 2";
      
        playerOneScore = 0;
        playerTwoScore = 0;
        playerOneScoreDisplay.textContent = `Score: ${playerOneScore}`;
        playerTwoScoreDisplay.textContent = `Score: ${playerTwoScore}`;
      
        form.style.display = "none";
        gameContainer.classList.remove("hidden");
        flow = gameFlow(player1Name, player2Name);
        updateScreen();
      });
      
    document.getElementById("reset-score-btn").addEventListener("click", () => {
        playerOneScore = 0;
        playerTwoScore = 0;
        playerOneScoreDisplay.textContent = `Score: ${playerOneScore}`;
        playerTwoScoreDisplay.textContent = `Score: ${playerTwoScore}`;
    });
    document.getElementById("new-game").addEventListener("click", () => {
        gameOver = 0;
        winner = 1;
        const player1Name = document.getElementById("playerOne").value.trim();
        const player2Name = document.getElementById("playerTwo").value.trim();
        if (gameIndex%2 === 1){
            flow = gameFlow(player1Name,player2Name);
            updateScreen();
        }
        if (gameIndex%2 === 0){
                flow = gameFlow(player2Name, player1Name);
                updateScreen();
        }
        gameIndex++;
    });

    function clickHandlerButton(e){
        
        selectedRow = e.target.dataset.rows;
        selectedColumn = e.target.dataset.columns;

        if(selectedRow === undefined || selectedColumn === undefined) return;
        flow.playRound(parseInt(selectedRow), parseInt(selectedColumn));
        updateScreen();
        };
        
    boardDisplay.addEventListener("click", clickHandlerButton);


}
gameDisplay();

