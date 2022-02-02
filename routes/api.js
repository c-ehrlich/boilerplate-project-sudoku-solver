"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    /**
     * SAMPLE REQUEST PAYLOAD
     * coordinate: "A1"
     * puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
     * value: "1"
     */
  });

  app.route("/api/solve").post((req, res) => {
    /**
     * SAMPLE REQUEST PAYLOAD
     * puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
     */
  });
};
