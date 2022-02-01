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
    console.log("hi");
    console.log(positionsToCheck);
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

  checkRowPlacement(puzzleString, row, column, value) {
    const rowToCheck =
      this._rows[this._rows.findIndex((row) => row.indexOf(value) !== -1)];
    rowToCheck.forEach((item) => {
      if (puzzleString[item] === value) {
        return false;
      }
    });
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colToCheck =
      this._columns[
        this._columns.findIndex((col) => col.indexOf(value) !== -1)
      ];
    colToCheck.forEach((item) => {
      if (puzzleString[item] === value) {
        return false;
      }
    });
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regToCheck =
      this._regions[
        this._regions.findIndex((reg) => reg.indexOf(value) !== -1)
      ];
    regToCheck.forEach((item) => {
      if (puzzleString[item] === value) {
        return false;
      }
    });
    return true;
  }

  solve(puzzleString) {
    let string = puzzleString;
    let solved = false;
    // TODO make sure we're not trying to solve an invalid puzzle
    // (make sure all rows, columns, and regions are valid initially
    // if not return some kind of error i guess
    // maybe also do this before checking row/col/reg placement?
    // so it should probably be its own method
    // this maybe also means moving the arrays outside of the functions they're
    // currently in
    while (!solved) {
      if (!string.match(/./)) {
        solved = true;
      } // maybe do this everytime after changing something?

      for (let i = 0; i < 81; i++) {
        if (string[i] === ".") {
          let { row, col } = this.getRowAndColumnFromNumericalPosition(i);
          let validInputs = [];
          for (let num = 1; num <= 9; num++) {
            if (
              this.checkRowPlacement(string, row, col, num) &&
              this.checkColPlacement(string, row, col, num) &&
              this.checkRegionPlacement(string, row, col, num)
            ) {
              validInputs.push(num);
            }
          }
          if (validInputs.length === 1) {
            string[i] = validInputs[0];
          }
        }
      }
    }
    return string;
  }

  /**
   * returns the row (0-9) and column(0-9) based on a numerical position (0-80)
   * assumes input is a valid number between 0 and 80
   */
  getRowAndColumnFromNumericalPosition(position) {
    return {
      row: Math.floor(position / 9),
      col: position % 9,
    };
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

module.exports = SudokuSolver;
