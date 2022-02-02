const { setCharAt } = require("../utils.js");

class SudokuSolver {
  validate(puzzleString) {
    // verify the puzzle string has 81 squares
    if (puzzleString.length !== 81) {
      return false;
    }

    // verify the puzzle string only contains numbers and '.'
    if (puzzleString.match(/[^\d\.]/)) {
      return false;
    }

    // verify the board is not in an illegal state
    const positionsToCheck = [].concat(
      this._rows,
      this._columns,
      this._regions
    );
    for (const positionToCheck of positionsToCheck) {
      let items = [];
      for (const item of positionToCheck) {
        if (puzzleString[item] !== ".") {
          if (items.indexOf(puzzleString[item]) !== -1) {
            return false;
          }
          items.push(puzzleString[item]);
        }
      }
    }

    return true;
  }

  /**
   * checkRowPlacement, checkColPlacement, CheckRegionPlacement
   * @param {*} puzzleString valid puzzleString
   * @param {*} row 0-8
   * @param {*} column 0-8
   * @param {*} value 1-9
   * @returns true or false
   */
  checkRowPlacement(puzzleString, row, column, value) {
    console.log("in checkRowPlacement");
    if (puzzleString[row * 9 + column] !== ".") {
      return false;
    }

    const valueAsString = value.toString();
    for (const index of this._rows[row]) {
      if (puzzleString[index] === valueAsString) {
        console.log("Row");
        console.log(`checking row ${row} column ${column}`);
        console.log(puzzleString);
        console.log(index, puzzleString[index], valueAsString);
        return false;
      }
    }

    console.log("exit check Row Placement on true");
    return true;
  }

  // see checkRowPlacement Def
  checkColPlacement(puzzleString, row, column, value) {
    if (puzzleString[row * 9 + column] !== ".") {
      return false;
    }

    const valueAsString = value.toString();
    for (const index of this._columns[column]) {
      if (puzzleString[index] === valueAsString) {
        console.log("Column");
        console.log(`checking row ${row} column ${column}`);
        console.log(puzzleString);
        console.log(index, puzzleString[index], valueAsString);
        return false;
      }
    }

    return true;
  }

  // see checkRowPlacement Def
  checkRegionPlacement(puzzleString, row, column, value) {
    const region = this.getRegionFromRowAndColumn(row, column);

    if (puzzleString[row * 9 + column] !== ".") {
      return false;
    }

    const valueAsString = value.toString();
    for (const index of this._regions[region]) {
      if (puzzleString[index] === valueAsString) {
        console.log("Region");
        console.log(`checking row ${row} column ${column}`);
        console.log(puzzleString);
        console.log(index, puzzleString[index], valueAsString);
        return false;
      }
    }

    return true;
  }

  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) return false;

    if (puzzleString.match(/[^\d\.]/)) return puzzleString;

    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === ".") {
        const coords = this.getRowAndColumnFromNumericalPosition(i);
        for (let num = 1; num <= 9; num++) {
          if (
            this.checkRowPlacement(puzzleString, coords.row, coords.col, num) &&
            this.checkColPlacement(puzzleString, coords.row, coords.col, num) &&
            this.checkRegionPlacement(puzzleString, coords.row, coords.col, num)
          ) {
            puzzleString = setCharAt(puzzleString, i, num);
            // console.log(" ");
            // console.log("769235418851496372432178956174569283395842761628713549283657194516924837947381625");
            // console.log(puzzleString);
            // this.sleep(100);
            this.solve(puzzleString);
            puzzleString = setCharAt(puzzleString, i, ".");
          }
        }
        return puzzleString;
      }
    }

    console.log("shouldn't get here");
  }

  /**
   * returns the row (0-8) and column(0-8) based on a numerical position (0-80)
   * assumes input is a valid number between 0 and 80
   */
  getRowAndColumnFromNumericalPosition(position) {
    return {
      row: Math.floor(position / 9),
      col: position % 9,
    };
  }

  getRegionFromRowAndColumn(row, column) {
    if (row < 0 || column < 0 || row > 8 || column > 8) return -1;

    if (row <= 2) {
      if (column <= 2) return 0;
      if (column <= 5) return 1;
      return 2;
    } else if (row <= 5) {
      if (column <= 2) return 3;
      if (column <= 5) return 4;
      return 5;
    } else {
      if (column < 2) return 6;
      if (column < 5) return 7;
      return 8;
    }
  }

  /**
   * returns the row (0-9) and column(0-9) based on a written position
   * example of a valid numberical position: A1 is the top left corner,
   * I9 is the bottom right corner
   */
  getRowAndColumnFromStringPosition(position) {
    // check input length
    if (position.length !== 2) {
      return undefined;
    }
    // check row is valid
    if (!position[0].match(/[A-Ia-i]/)) {
      return undefined;
    }
    // check column is valid
    if (!position[1].match(/1-9/)) {
      return undefined;
    }

    return {
      row: parseInt(position[0], 36) - 10,
      col: position[1] - 1,
    };
  }

  _rows = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80],
  ];

  _columns = [
    [0, 9, 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80],
  ];

  _regions = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],
  ];
}

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

module.exports = SudokuSolver;
