import { useState } from "react";
import { useGame } from "./use-game";
import "./App.css";

export const App = () => {
  // State for the game board and related methods from the useGame hook
  const { board, tick, toggleCell, reset } = useGame({ width: 12, height: 12 });

  // State to manage the game's interval (for play/pause functionality)
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // State to manage the visibility of the "About" modal
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Start the game simulation
  const play = () => {
    // If already playing, do nothing
    if (intervalId) return;

    // Start the interval to progress the game every 500ms
    setIntervalId(setInterval(() => tick(), 500));
  };

  // Pause the game simulation
  const pause = () => {
    // If not playing, do nothing
    if (!intervalId) return;

    // Clear the interval and set intervalId to null
    clearInterval(intervalId);
    setIntervalId(null);
  };

  // Check if the game is currently playing
  const isPlaying = intervalId !== null;

  return (
    <div>
      {/* Header with link to creator's website and About button */}
      <div className="header">
        <button onClick={() => setShowAboutModal(true)}>
          About Game of Life
        </button>
        <a
          href="https://carminemattia.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="creator-link"
        >
          Created by Carmine Mattia
        </a>
      </div>

      {/* Game grid */}
      <div className="container">
        <table>
          <tbody>
            {/* Render each row of the game board */}
            {board.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {/* Render each cell within the row */}
                {row.map((cell, cellIndex) => (
                  <td
                    key={`cell-${cell.x}-${cell.y}-${cellIndex}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleCell(cell)}
                  >
                    {/* Display cell state (alive or dead) */}
                    <div
                      className={`cell ${cell.state ? "cell--alive" : ""}`}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Control buttons */}
      <div className="buttons">
        {/* Single step button */}
        <button onClick={() => tick()}>
          <i className="fa fa-redo-alt" />
          Tick
        </button>

        {/* Play/pause button based on game state */}
        {isPlaying ? (
          <button onClick={pause}>
            <i className="fa fa-pause" />
            pause
          </button>
        ) : (
          <button onClick={play}>
            <i className="fa fa-play" />
            play
          </button>
        )}

        {/* Reset button */}
        <button
          onClick={() => {
            pause(); // Ensure the game is paused
            reset(); // Reset the game grid
          }}
        >
          <i className="fa fa-times" />
          Reset
        </button>
      </div>

      {/* About modal */}
      {showAboutModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>About Conway's Game of Life</h2>
            <p>
              The Game of Life, also known simply as Life, is a cellular
              automaton devised by the British mathematician John Horton Conway
              in 1970. It is a zero-player game, meaning that its evolution is
              determined by its initial state, requiring no further input. One
              interacts with the Game of Life by creating an initial
              configuration and observing how it evolves.
            </p>
            <button onClick={() => setShowAboutModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
