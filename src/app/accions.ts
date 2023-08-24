import { Ipoint } from "./createGrid";

export const getSelectedHoverData = (
  grid: string[][],
  start: Ipoint,
  end: Ipoint
) => {
  const selectedLetters = [];
  const selectedPositions = [];
  let direction = "none";
  const startRowIndex = start.row;
  const endRowIndex = end.row;
  const startColIndex = start.col;
  const endColIndex = end.col;
  const rowDiff = Math.abs(endRowIndex - startRowIndex);
  const colDiff = Math.abs(endColIndex - startColIndex);

  if (
    rowDiff === colDiff &&
    startColIndex > endColIndex &&
    startRowIndex > endRowIndex
  ) {
    direction = "diagonal-inverted";
    for (let i = 0; i <= rowDiff; i++) {
      const row = startRowIndex - i;
      const col = startColIndex - i;
      selectedPositions.push({ row, col });
      selectedLetters.push(grid[row][col]);
    }
  } else if (startColIndex === endColIndex && startRowIndex > endRowIndex) {
    direction = "vertical-inverted";
    for (let row = startRowIndex; row >= endRowIndex; row--) {
      selectedPositions.push({ row, col: startColIndex });
      selectedLetters.push(grid[row][startColIndex]);
    }
  } else if (startRowIndex === endRowIndex && startColIndex > endColIndex) {
    direction = "horizontal-inverted";
    for (let col = startColIndex; col >= endColIndex; col--) {
      selectedPositions.push({ row: startRowIndex, col });
      selectedLetters.push(grid[startRowIndex][col]);
    }
  } else if (rowDiff === colDiff) {
    direction = "diagonal";
    for (let i = 0; i <= rowDiff; i++) {
      const row = startRowIndex + i * (endRowIndex > startRowIndex ? 1 : -1);
      const col = startColIndex + i * (endColIndex > startColIndex ? 1 : -1);
      selectedPositions.push({ row, col });
      selectedLetters.push(grid[row][col]);
    }
  } else if (rowDiff === 0) {
    direction = "horizontal";
    for (let col = startColIndex; col <= endColIndex; col++) {
      selectedPositions.push({ row: startRowIndex, col });
      selectedLetters.push(grid[startRowIndex][col]);
    }
  } else if (colDiff === 0) {
    direction = "vertical";
    for (let row = startRowIndex; row <= endRowIndex; row++) {
      selectedPositions.push({ row, col: startColIndex });
      selectedLetters.push(grid[row][startColIndex]);
    }
  }
  return {
    selectedLetters,
    selectedPositions,
    direction,
  };
};

export const checkSelectedWord = (word: string, words: string[]) => {
  if (words.map((word) => word.toUpperCase()).includes(word)) {
    return true;
  }
  return false;
};
