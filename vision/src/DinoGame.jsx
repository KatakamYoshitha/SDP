import React, { useState, useEffect, useRef } from "react";
import "./index.css";

function DinoGame() {
  const [dinoTop, setDinoTop] = useState(150);
  const [cactusLeft, setCactusLeft] = useState(500);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameInterval = useRef(null);
  const scoreInterval = useRef(null);

  // Handle Jump
  const jump = () => {
    if (dinoTop > 140) {
      setDinoTop(80);
      setTimeout(() => setDinoTop(150), 500);
    }
  };

  useEffect(() => {
    if (!gameOver) {
      gameInterval.current = setInterval(() => {
        setCactusLeft((prev) => {
          if (prev <= -20) return 500;
          return prev - 10;
        });
      }, 50);

      scoreInterval.current = setInterval(() => {
        setScore((s) => s + 1);
      }, 200);
    }

    return () => {
      clearInterval(gameInterval.current);
      clearInterval(scoreInterval.current);
    };
  }, [gameOver]);

  // Collision detection
  useEffect(() => {
    if (cactusLeft < 60 && cactusLeft > 0 && dinoTop > 120) {
      setGameOver(true);
    }
  }, [cactusLeft, dinoTop]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setCactusLeft(500);
  };

  return (
    <div className="dino-game">
      <h2 className="dino-title">🦖 Dino Runner</h2>
      <p className="dino-tip">Press SPACE to jump</p>

      <div className="game-box" onClick={jump}>
        <div className="dino" style={{ top: dinoTop }}></div>
        <div className="cactus" style={{ left: cactusLeft }}></div>
      </div>

      <h3 className="score">Score: {score}</h3>

      {gameOver && (
        <div className="game-over-box">
          <h2>Game Over 💀</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default DinoGame;
