"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const { setCharAt } = require("../utils.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    /**
     * SAMPLE REQUEST PAYLOAD
     * coordinate: "A1"
     * puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
     * value: "1"
     */
    // console.log(
    //   `value: ${req.body.value}, coordinate: ${req.body.coordinate}, puzzle: ${req.body.puzzle}`
    // );

    if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
      return res.json({ error: "Required field(s) missing" });
    }

    let puzzle = req.body.puzzle;

    const coords = solver.getRowAndColumnFromStringPosition(
      req.body.coordinate
    );
    if (!coords) return res.json({ error: "Invalid coordinate" });

    if (!solver.validateLength(puzzle)) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    if (!solver.validateCharacters(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (!solver.validateBoardLegality(puzzle)) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    if (
      !Number.isInteger(Number(req.body.value)) ||
      req.body.value > 9 ||
      req.body.value < 1
    ) {
      return res.json({ error: "Invalid value" });
    }

    // if the input value is already on the board in that place, return true
    // we've already checked that the puzzle is legal, so we know it's true
    // get the numerical version of the coordinate
    const coordinateNum = 9 * coords.row + coords.col;
    // check if there is already something on spot
    // if so, create a new puzzle that is empty in that spot, and check for that puzzle
    puzzle = setCharAt(puzzle, coordinateNum, ".");

    const conflict = solver.checkConflict(
      puzzle,
      coords.row,
      coords.col,
      req.body.value
    );

    if (conflict) {
      return res.json({ valid: false, conflict: conflict });
    }

    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    /**
     * SAMPLE REQUEST PAYLOAD
     * puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
     */
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    if (!solver.validateLength(puzzle)) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    if (!solver.validateCharacters(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (!solver.validateBoardLegality(puzzle)) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    const solution = solver.solve(puzzle);

    if (!solution) {
      return res.json({ error: "Bug in the solver. This should not happen." });
    }

    return res.json({ solution: solution });
  });
};
