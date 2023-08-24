"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import "./wordsearchComponente.css";

import { useState, useEffect } from "react";
import createGrid, { Ipoint } from "./createGrid";
import { checkSelectedWord, getSelectedHoverData } from "./accions";
import LetterComponent from "./components/Letter";

const words = [
  "película",
  "actor",
  "actriz",
  "director",
  "guión",
  "escena",
  "premios",
  "cámara",
  "taquilla",
  "festival",
  "estreno",
  "reparto",
  "cineasta",
  "género",
  "animación",
  "secuela",
  "trama",
  "palomitas",
  "escenografía",
  "maquillaje",
];
const creatgridWords = createGrid(words);

const Home = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [positionsSelected, setPositionsSelected] = useState<Ipoint[]>([]);
  const [correctPositions, setCorrectPositions] = useState<Ipoint[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ row: -1, col: -1 });
  const [currentPos, setCurrentPos] = useState({ row: -1, col: -1 });

  const clearSelection = () => {
    setPositionsSelected([]);
    setCurrentPos({ row: -1, col: -1 });
    setStartPos({ row: -1, col: -1 });
  };

  const addPosition = (row: number, col: number) => {
    setPositionsSelected((prev) => [...prev, { row, col }]);
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setStartPos({ row, col });
    setCurrentPos({ row, col });
    addPosition(row, col);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!selecting) return;
    const { selectedPositions } = getSelectedHoverData(grid, startPos, {
      row,
      col,
    });
    setPositionsSelected(selectedPositions);
    setCurrentPos({ row, col });
  };

  const handleCellMouseUp = () => {
    if (!selecting) return;
    setSelecting(false);
    const { selectedLetters, selectedPositions } = getSelectedHoverData(
      grid,
      startPos,
      currentPos
    );
    const isCorrect = checkSelectedWord(selectedLetters.join(""), words);
    setCorrectPositions((prev) =>
      isCorrect ? [...prev, ...selectedPositions] : prev
    );
    // reset states
    clearSelection();
  };

  useEffect(() => {
    setGrid(creatgridWords);
  }, []);
  return (
    <div>
      <h1>Word Search Game</h1>
      <div className="grid-container">
        <>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((letter, columnIndex) => (
                <div
                  key={`${rowIndex}, ${columnIndex}`}
                  onMouseDown={() => handleCellMouseDown(rowIndex, columnIndex)}
                  onMouseEnter={() =>
                    handleCellMouseEnter(rowIndex, columnIndex)
                  }
                  onMouseUp={handleCellMouseUp}
                  className={`grid-cell ${
                    positionsSelected.some(
                      (pos) => pos.row === rowIndex && pos.col === columnIndex
                    )
                      ? "selected"
                      : ""
                  }
                  ${
                    correctPositions.some(
                      (pos) => pos.row === rowIndex && pos.col === columnIndex
                    )
                      ? "correct"
                      : ""
                  }`}
                >
                  <LetterComponent letter={letter} />
                </div>
              ))}
            </div>
          ))}
        </>
      </div>
      <div className="word-list">
        <h2>Word List</h2>
        <ul>
          {words.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
