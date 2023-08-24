export type Ipoint = {
  row: number;
  col: number;
};

export const longestWordLength = (wordsArray: string[]) => {
  let longestLength = 0;
  for (let i = 0; i < wordsArray.length; i++) {
    if (wordsArray[i].length > longestLength) {
      longestLength = wordsArray[i].length;
    }
  }
  return longestLength;
};

export const addCellToGrid = (numberWords: number) => {
  let cells = 2;
  if (numberWords >= 15) {
    cells = 4;
  }
  if (numberWords >= 10) {
    cells = 3;
  }
  return cells;
};

export const sortByLengthDescending = (wordsArray: string[]) => {
  return wordsArray.sort((a, b) => b.length - a.length);
};

export const createVoidGrid = (rows = 10, cols = 10, value = "x") => {
  const matrix = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => value)
  );
  return matrix;
};

export const wordCollides = (
  word: string,
  point: Ipoint,
  direction: Ipoint,
  gridSize: number,
  grid: string[][]
) => {
  for (let i = 0; i < word.length; i++) {
    const newRow = point.row + direction.row * i;
    const newCol = point.col + direction.col * i;

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

export const insertWord = (
  word: string,
  grid: string[][],
  gridSize: number
) => {
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
    wordCollides(
      word,
      { row: startRow, col: startCol },
      direction,
      gridSize,
      grid
    )
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
  return newGrid;
};

const createGrid = (words: string[]) => {
  console.log("se ejecuto");
  const wordSort = sortByLengthDescending(words);
  const gridSize = longestWordLength(wordSort) + addCellToGrid(wordSort.length);
  const grid = createVoidGrid(gridSize, gridSize, "x");
  console.log("gridVoid", grid);
  wordSort.forEach((word) => {
    insertWord(word.toUpperCase(), grid, gridSize);
  });
  return grid;
};

export default createGrid;
