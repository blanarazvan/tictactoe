let switchPlayers, activePlayer;
const getActivePlayer = () => activePlayer;

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
    function positionTaken (row, col){
        return unavailablePositions.some(pos => pos[0] === row && pos[1] === col);
    }
    function addPosition(row, col){
        
        if(!positionTaken(row, col)){
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
        let winner = 1;
        for(let i = 0; i<3; i++){
            if(gameBoard[i][0] && gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][1] === gameBoard[i][2] 
                ||  gameBoard[0][i] && gameBoard[0][i] === gameBoard[1][i] && gameBoard[1][i] === gameBoard[2][i]
                ||  gameBoard[0][0] && gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2]
                ||  gameBoard[0][2] && gameBoard[0][2] === gameBoard[1][1] &&gameBoard[1][1] === gameBoard[2][0]){
                    switchPlayers = false;
                    console.log(`${getActivePlayer().name} won!`);
                    winner = 0;
                    return;
                }
                else if(unavailablePositions.length === 9 && winner === 1 ){
                    console.log("There's a draw!");
                    return;
                }
            }
    }
   
    addPosition(rowSelection, columnSelection);
};
const printBoard = () => {
    console.log(getBoard());
};
return { getBoard, makeSelection, printBoard, switchPlayers};
}
function Cell() {
    let value = "";

    const addSelection = (player) => {
        value = player;
    };

    const getValue = () => value;
    
    return { addSelection, getValue };
}


function gameFlow ( playerOneName = "Player One", playerTwoName = "Player Two"){ 
    
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
        getBoard: board.getBoard
    };
}

function gameDisplay() {
    const playerTurn = document.querySelector(".turn");
    const boardDisplay = document.querySelector(".board");
    const flow = gameFlow();

    const updateScreen = () => {
        boardDisplay.textContent = " ";
        const board = flow.getBoard();
        const activePlayer = getActivePlayer();

        playerTurn.textContent = `${activePlayer.name}'s turn...`;

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

    function clickHandlerButton(e){

        selectedRow = e.target.dataset.rows;
        selectedColumn = e.target.dataset.columns;

        if(selectedRow === undefined || selectedColumn === undefined) return;
        
        flow.playRound(parseInt(selectedRow), parseInt(selectedColumn));
        updateScreen();
        };
        
    boardDisplay.addEventListener("click", clickHandlerButton);

    updateScreen();
}
gameDisplay();

