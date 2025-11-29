import React, { useEffect, useState } from "react";

const MazeGame = () => {
  const size = 10; // 10x10 grid

  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const goal = { x: 9, y: 9 };

  // Maze walls (1 = wall, 0 = free)
  const maze = [
    [0,0,0,1,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,1,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,0,1],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,0],
  ];

  const movePlayer = (dx, dy) => {
    const newX = player.x + dx;
    const newY = player.y + dy;

    // Bounds + check wall
    if (
      newX >= 0 &&
      newY >= 0 &&
      newX < size &&
      newY < size &&
      maze[newY][newX] === 0
    ) {
      setPlayer({ x: newX, y: newY });
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") movePlayer(0, -1);
      if (e.key === "ArrowDown") movePlayer(0, 1);
      if (e.key === "ArrowLeft") movePlayer(-1, 0);
      if (e.key === "ArrowRight") movePlayer(1, 0);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [player]);

  const reachedGoal = player.x === goal.x && player.y === goal.y;

  return (
    <div className="maze-container">

      {reachedGoal && (
        <div className="maze-win">
          🎉 You completed the maze! Great job! 🎉
        </div>
      )}

      <div className="maze-grid">
        {maze.map((row, y) =>
          row.map((cell, x) => {
            let className = cell === 1 ? "maze-wall" : "maze-path";
            if (player.x === x && player.y === y) className = "maze-player";
            if (goal.x === x && goal.y === y) className = "maze-goal";
            return <div key={`${x}-${y}`} className={className}></div>;
          })
        )}
      </div>
    </div>
  );
};

export default MazeGame;
