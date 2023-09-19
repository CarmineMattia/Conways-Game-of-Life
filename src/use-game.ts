import { useEffect, useState } from "react";

// Define the structure of a cell
export interface CellType {
  x: number; // X-coordinate
  y: number; // Y-coordinate
  state: boolean; // Alive or dead
}

// Define the structure of the game board
export type BoardType = readonly CellType[][];

// Define the dimensions of the board
interface BoardSizeType {
  width: number;
  height: number;
}

// Function to create a new game board
const createBoard = ({ width, height }: BoardSizeType): BoardType =>
  Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => ({
      x: col,
      y: row,
      state: false, // All cells start as dead
    }))
  );

// Function to get neighboring cells for a given cell
const getNeighbors = ({
  board,
  cell,
  width,
  height,
}: BoardSizeType & {
  board: BoardType;
  cell: CellType;
}): CellType[] => {
  const cells = [];

  // Check all surrounding cells
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      // Skip the current cell
      if (dx === 0 && dy === 0) continue;

      let ny = cell.y + dy;
      let nx = cell.x + dx;

      // Handle board edges (wrap around)
      if (ny === -1) ny = height - 1;
      if (nx === -1) nx = width - 1;
      if (ny === height) ny = 0;
      if (nx === width) nx = 0;

      cells.push(board[ny][nx]);
    }
  }
  return cells;
};

// Custom hook to manage the game state
export const useGame = ({ width, height }: BoardSizeType) => {
  const [board, setBoard] = useState<BoardType>([]);

  // Function to toggle the state of a cell (alive <-> dead)
  const toggleCell = (cell: CellType) => {
    setBoard((prev) =>
      prev.map((row) =>
        row.map((col) => {
          if (col.x === cell.x && col.y === cell.y) {
            return { ...cell, state: !cell.state };
          }
          return col;
        })
      )
    );
  };

  // Initialize the board when the component mounts
  useEffect(() => {
    setBoard(createBoard({ width, height }));
  }, [width, height]);

  // Function to reset the game board
  const reset = () => {
    setBoard(createBoard({ width, height }));
  };

  // Function to progress the game by one tick
  const tick = () => {
    setBoard((prev) =>
      prev.map((row) =>
        row.map((cell) => {
          const neighbors = getNeighbors({ board: prev, cell, width, height });

          const liveCellCount = neighbors.reduce(
            (acc, cell) => acc + (cell.state ? 1 : 0),
            0
          );

          // Determine the new state of the cell based on Conway's Game of Life rules
          const newState = cell.state
            ? liveCellCount === 2 || liveCellCount === 3
            : liveCellCount === 3;

          return { ...cell, state: newState };
        })
      )
    );
  };

  return { board, tick, toggleCell, reset };
};
