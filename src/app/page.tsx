"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import "./wordsearchComponente.css";

import { useState, useEffect, useCallback } from "react";

const longestWordLength = (wordsArray: string[]) => {
  let longestLength = 0;
  for (let i = 0; i < wordsArray.length; i++) {
    if (wordsArray[i].length > longestLength) {
      longestLength = wordsArray[i].length;
    }
  }
  return longestLength;
};

const sortByLengthDescending = (wordsArray: string[]) => {
  return wordsArray.sort((a, b) => b.length - a.length);
};

const createGrid = (rows: number, cols: number, value: string) => {
  const matrix = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => value)
  );
  return matrix;
};

const generateRandomCharacter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
};

const addCellToGrid = (numberWords: number) => {
  let cells = 2;
  if (numberWords >= 15) {
    cells = 4;
  }
  if (numberWords >= 10) {
    cells = 3;
  }
  return cells;
};

const checkSelectedWord = (word: string, words: string[]) => {
  if (words.map((word) => word.toUpperCase()).includes(word)) {
    return true;
  }
  return false;
};

const Home = () => {
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

  const gridSize = longestWordLength(words) + addCellToGrid(words.length);

  const addPosition = (row: number, col: number) => {
    setPositionsSelected((prev) => [...prev, { row, col }]);
  };

  const [grid, setGrid] = useState(createGrid(gridSize, gridSize, "x"));
  const [selectedWord, setSelectedWord] = useState("");
  const [positionsSelected, setPositionsSelected] = useState<
    {
      row: number;
      col: number;
    }[]
  >([]);
  const [correctPositions, setCorrectPositions] = useState<
    {
      row: number;
      col: number;
    }[]
  >([]);
  const [selecting, setSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ row: -1, col: -1 });
  const [currentPos, setCurrentPos] = useState({ row: -1, col: -1 });

  const handleCellMouseDown = (row: number, col: number) => {
    console.log(`MouseDown en la celda ${row}, ${col}`);
    setSelecting(true);
    setStartPos({ row, col });
    setCurrentPos({ row, col });
    addPosition(row, col);
  };

  const getDiagonalPositions = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => {
    const positions = [];
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    const rowStep = rowDiff > 0 ? 1 : -1;
    const colStep = colDiff > 0 ? 1 : -1;

    let row = startRow;
    let col = startCol;

    while (row !== endRow || col !== endCol) {
      positions.push({ row, col });
      row += rowStep;
      col += colStep;
    }

    positions.push({ row: endRow, col: endCol });
    return positions;
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    console.log(`MouseEnter en la celda ${row}, ${col}`);
    if (selecting) {
      const direction = getMouseDirection(startPos.row, startPos.col, row, col);

      setCurrentPos({ row, col });

      if (direction === "diagonal") {
        const diagonalPositions = getDiagonalPositions(
          startPos.row,
          startPos.col,
          row,
          col
        );

        diagonalPositions.forEach((position) => {
          console.log(position);
          addPosition(position.row, position.col);
        });
      } else if (direction === "horizontal" || direction === "vertical") {
        addPosition(row, col);
      }
    }
  };

  const getMouseDirection = (
    startRow: number,
    startCol: number,
    currentRow: number,
    currentCol: number
  ) => {
    const rowDiff = Math.abs(currentRow - startRow);
    const colDiff = Math.abs(currentCol - startCol);

    if (rowDiff === colDiff) {
      // Diagonal movement
      return "diagonal";
    } else if (rowDiff > colDiff) {
      // Vertical movement
      return "vertical";
    } else {
      // Horizontal movement
      return "horizontal";
    }
  };

  const handleCellMouseUp = () => {
    if (selecting) {
      setSelecting(false);
      clearSelection();
      const selectedLetters = [];
      const startRowIndex = startPos.row;
      const endRowIndex = currentPos.row;
      const startColIndex = startPos.col;
      const endColIndex = currentPos.col;
      const rowDiff = Math.abs(endRowIndex - startRowIndex);
      const colDiff = Math.abs(endColIndex - startColIndex);

      if (rowDiff === colDiff) {
        // Diagonal selection
        for (let i = 0; i <= rowDiff; i++) {
          const row =
            startRowIndex + i * (endRowIndex > startRowIndex ? 1 : -1);
          const col =
            startColIndex + i * (endColIndex > startColIndex ? 1 : -1);
          selectedLetters.push(grid[row][col]);
        }
      } else if (rowDiff === 0) {
        // Horizontal selection
        for (let col = startColIndex; col <= endColIndex; col++) {
          selectedLetters.push(grid[startRowIndex][col]);
        }
      } else if (colDiff === 0) {
        // Vertical selection
        for (let row = startRowIndex; row <= endRowIndex; row++) {
          selectedLetters.push(grid[row][startColIndex]);
        }
      }

      console.log(selectedLetters.join(""));
      setSelectedWord(selectedLetters.join(""));
      setCurrentPos({ row: -1, col: -1 });
      setStartPos({ row: -1, col: -1 });
    }
  };
  // Función para verificar si una palabra colisiona con otra en la cuadrícula
  const wordCollides = (
    word: string,
    row: number,
    col: number,
    direction: {
      row: number;
      col: number;
    }
  ) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction.row * i;
      const newCol = col + direction.col * i;

      // Verificar si la posición está fuera de los límites o si hay colisión
      if (
        newRow < 0 ||
        newRow >= gridSize ||
        newCol < 0 ||
        newCol >= gridSize ||
        (grid[newRow][newCol] !== "x" && grid[newRow][newCol] !== word[i])
      ) {
        return true;
      }
    }
    return false;
  };

  const insertWord = (word: string) => {
    const directions = [
      { row: 1, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ];

    let direction, startRow, startCol;

    // Intentar encontrar una posición libre para la palabra
    let attempts = 0;
    do {
      direction = directions[Math.floor(Math.random() * directions.length)];
      startRow = Math.floor(Math.random() * gridSize);
      startCol = Math.floor(Math.random() * gridSize);
      attempts++;
    } while (
      attempts < 50 &&
      wordCollides(word, startRow, startCol, direction)
    );

    if (attempts >= 50) {
      // No se encontró una posición adecuada, podrías manejarlo como desees
      console.log(`No se pudo insertar la palabra "${word}"`);
      return;
    }

    const newGrid = [...grid];

    for (let i = 0; i < word.length; i++) {
      const row = startRow + direction.row * i;
      const col = startCol + direction.col * i;
      newGrid[row][col] = word[i];
    }
    setGrid(newGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    // console.log(`Click en la celda ${row}, ${col}`);
    if (grid[row][col] !== "x") {
      const selectedLetter = grid[row][col];
      if (checkSelectedWord(selectedWord + selectedLetter, words)) {
        setCorrectPositions((prev) => [
          ...prev,
          ...positionsSelected,
          { row, col },
        ]);
        clearSelection();
      } else {
        setPositionsSelected((prev) => [...prev, { row, col }]);
      }
      setSelectedWord(selectedWord + selectedLetter);
    } else {
      clearSelection();
    }
  };

  const clearSelection = () => {
    console.log("clearSelection");
    setPositionsSelected([]);
    setSelectedWord("");
  };

  useEffect(() => {
    console.log("useEffect");
    const wordSort = sortByLengthDescending(words);
    console.log(createGrid(gridSize, gridSize, "x"));
    wordSort.forEach((word) => {
      insertWord(word.toUpperCase());
    });
    console.log(grid);
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
                  key={columnIndex}
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
                  <p
                    onMouseDown={() =>
                      handleCellMouseDown(rowIndex, columnIndex)
                    }
                    onMouseEnter={() =>
                      handleCellMouseEnter(rowIndex, columnIndex)
                    }
                    onMouseUp={handleCellMouseUp}
                    // onClick={() => handleCellClick(rowIndex, columnIndex)}
                  >
                    {letter === "x" ? "" : letter}
                  </p>
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
