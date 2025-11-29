import React, { useState } from "react";
import "./index.css";

function TicTacToe() {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const winningCombinations = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];

  const checkWinner = (newBoard) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);

    const check = checkWinner(newBoard);
    if (check) {
      setWinner(check);
    } else if (!newBoard.includes(null)) {
      setWinner("draw");
    } else {
      setIsXTurn(!isXTurn);
    }
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setIsXTurn(true);
    setWinner(null);
  };

  return (
    <div className="ttt-container">
      <h2>⭕ Tic Tac Toe ❌</h2>

      <div className="ttt-board">
        {board.map((cell, i) => (
          <div key={i} className="ttt-cell" onClick={() => handleClick(i)}>
            {cell}
          </div>
        ))}
      </div>

      {winner && (
        <div className="ttt-result">
          {winner === "draw" ? (
            <h3>It's a Draw 😄</h3>
          ) : (
            <h3>Winner: {winner} 🎉</h3>
          )}
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
