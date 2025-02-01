const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const board = document.getElementById('board');
const winnerMessage = document.getElementById('winner-message');
const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get('mode'); 
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]            
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameOver = true;
            highlightWinner(pattern);
            winnerMessage.textContent = `🎉 Player ${gameBoard[a]} Wins! 🎉`;
            return gameBoard[a]; 
        }
    }
    if (!gameBoard.includes('')) { 
        gameOver = true;
        winnerMessage.textContent = "🤝 It's a Draw! 🤝";
        board.classList.add('draw');
        return 'draw';
    }
    return null; 
}
function highlightWinner(pattern) {
    pattern.forEach(index => {
        document.getElementById(`cell-${index}`).classList.add('winner');
    });
    board.classList.add('game-over');
}
function handleClick(event) {
    if (gameOver) return; 
    const cell = event.target;
    const cellIndex = cell.dataset.index; 
    if (gameBoard[cellIndex] === '') {
        gameBoard[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer); 
        const winner = checkWinner();
        if (winner) return; 
        if (gameMode === 'computer' && currentPlayer === 'X') {
            currentPlayer = 'O'; // Switch to computer's turn
            computerMove();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
        }
    }
}
function computerMove() {
    let availableCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameBoard[randomIndex] = currentPlayer;
        document.getElementById(`cell-${randomIndex}`).textContent = currentPlayer;
        document.getElementById(`cell-${randomIndex}`).classList.add(currentPlayer);
        const winner = checkWinner();
        if (!winner) {
            currentPlayer = 'X'; 
        }
    }
}
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});
resetButton.addEventListener('click', resetGame);

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    currentPlayer = 'X';
    winnerMessage.textContent = '';
    board.classList.remove('draw', 'game-over');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O', 'winner'); 
    });
}