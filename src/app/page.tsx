"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import "./wordsearchComponente.css";

import { useState, useEffect } from "react";

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
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    console.log(`MouseEnter en la celda ${row}, ${col}`);
    if (selecting) {
      setCurrentPos({ row, col });
    }
  };

  const handleCellMouseUp = () => {
    console.log("MouseUp");
    if (selecting) {
      setSelecting(false);
      // Aquí puedes procesar la selección y verificar si es una palabra válida
      // basada en las posiciones seleccionadas (startPos y currentPos).
      // Puedes usar una función similar a `checkSelectedWord`.
      // Luego, restablece las posiciones seleccionadas y la palabra actual.
      setCurrentPos({ row: -1, col: -1 });
      setStartPos({ row: -1, col: -1 });
      setSelectedWord("");
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

  const checkSelectedWord = (word: string) => {
    if (words.map((word) => word.toUpperCase()).includes(word)) {
      setCorrectPositions(positionsSelected);
      setPositionsSelected([]);
      console.log(`¡Palabra encontrada: ${word}!`);
      // Aquí puedes realizar cualquier acción que desees cuando una palabra se ha encontrado
    }
  };
  const handleCellClick = (row: number, col: number) => {
    console.log(`Click en la celda ${row}, ${col}`);
    if (grid[row][col] !== "x") {
      const selectedLetter = grid[row][col];
      setPositionsSelected((prev) => [...prev, { row, col }]);
      checkSelectedWord(selectedWord + selectedLetter);
      setSelectedWord(selectedWord + selectedLetter);
    }
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
                  // onMouseDown={() => handleCellMouseDown(rowIndex, columnIndex)}
                  // onMouseEnter={() =>
                  //   handleCellMouseEnter(rowIndex, columnIndex)
                  // }
                  // onMouseUp={handleCellMouseUp}
                  onClick={() => handleCellClick(rowIndex, columnIndex)}
                >
                  {letter === "x" ? "" : letter}
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
