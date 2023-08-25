"use client";

import "./gridStyle.css";
import { useState, useEffect } from "react";
import createGrid, { Ipoint } from "@utils/createGrid";
import { checkSelectedWord, getSelectedHoverData } from "@utils/accions";
import LetterComponent from "./Letter";
import { IWordData } from "../Types";

type IProps = {
  words: IWordData[];
  onWordFound?: (word: IWordData) => void;
};

const Grid = (props: IProps) => {
  const { words, onWordFound } = props;
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
    const isCorrect = checkSelectedWord(
      selectedLetters.join(""),
      words.map((word) => word.value)
    );
    if (isCorrect) {
      setCorrectPositions((prev) => [...prev, ...selectedPositions]);
      onWordFound?.(
        words.find(
          (word) => word.value === selectedLetters.join("").toUpperCase()
        )!
      );
    }
    // reset states
    clearSelection();
  };

  useEffect(() => {
    const creatgridWords = createGrid(words.map((word) => word.value));
    setGrid(creatgridWords);
  }, [words]);
  return (
    <div>
      <h1>Word Search Game</h1>
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((letter, columnIndex) => (
              <div
                key={`${rowIndex}, ${columnIndex}`}
                onMouseDown={() => handleCellMouseDown(rowIndex, columnIndex)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, columnIndex)}
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
      </div>
    </div>
  );
};

export default Grid;
