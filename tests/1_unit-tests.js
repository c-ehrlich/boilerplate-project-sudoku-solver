const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    assert.isTrue(
      solver.validate(
        "123456789456789123789123456214365897365897214897214365531642978642978531978531642",
        "Valid Board: 123456789456789123789123456214365897365897214897214365531642978642978531978531642"
      )
    );
  });
  test("Logic handles a puzzle string with invalid characters (not 1-9 or `.`)", () => {
    assert.isFalse(
      solver.validate(
        "a................................................................................",
        "String containing 'a' should fail validation"
      )
    );
  });
  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    assert.isFalse(
      solver.validate(
        "................................................................................",
        "String of 80x '.' should fail validation"
      )
    );
    assert.isFalse(
      solver.validate(
        "..................................................................................",
        "String of 82x '.' should fail validation"
      )
    );
  });
  test("Logic handles a valid row placement", () => {
    assert.isTrue(
      solver.checkRowPlacement(
        "1................................................................................",
        0,
        1,
        2
      )
    );
  });
  test("Logic handles an invalid row placement (duplicate number)", () => {
    assert.isFalse(
      solver.checkRowPlacement(
        "1................................................................................",
        0,
        1,
        1
      )
    );
  });
  test("Logic handles an invalid row placement (non empty square)", () => {
    assert.isFalse(
      solver.checkRowPlacement(
        "1................................................................................",
        0,
        0,
        1
      )
    );
  });
  test("Logic handles a valid column placement", () => {
    assert.isTrue(
      solver.checkColPlacement(
        "1................................................................................",
        1,
        0,
        2
      )
    );
  });
  test("Logic handles an invalid column placement (duplicate number)", () => {
    assert.isFalse(
      solver.checkColPlacement(
        "1................................................................................",
        1,
        0,
        1
      )
    );
  });
  test("Logic handles an invalid column placement (non empty square)", () => {
    assert.isFalse(
      solver.checkColPlacement(
        "1................................................................................",
        0,
        0,
        1
      )
    );
  });
  test("Logic handles a valid region (3x3 grid) placement", () => {
    assert.isTrue(
      solver.checkRegionPlacement(
        "1................................................................................",
        1,
        1,
        2
      )
    );
  });
  test("Region calculation isn't x-y flipped", () => {
    assert.isTrue(
      solver.checkRegionPlacement(
        "76923541885149637243217895617456928339584276162871354928....1945....4.37.4.3..6..",
        7,
        4,
        2
      )
    );
  });
  test("Region calculation works for more complex input", () => {
    assert.isTrue(
      solver.checkRegionPlacement(
        "76923541885149637243217895617456928339584276162871354928....1945....4.37.4.3..6..",
        6,
        2,
        3
      ),
      "Region"
    );
  });
  test("Logic handles an invalid region (3x3 grid) placement (duplicate number)", () => {
    assert.isFalse(
      solver.checkRegionPlacement(
        "1................................................................................",
        1,
        1,
        1
      )
    );
  });
  test("Logic handles an invalid region (3x3 grid) placement (non empty square)", () => {
    assert.isFalse(
      solver.checkRegionPlacement(
        "1................................................................................",
        0,
        0,
        1
      )
    );
  });
  test("Valid puzzle strings pass the solver", () => {
    assert.equal(
      solver.solve(
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ),
      "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
    ), "Solver should solve correctly";
  });
  test("Invalid puzzle strings fail the solver", () => {
    assert.fail();
  });
  test("Solver returns the expected solution for an incomplete puzzle", () => {
    assert.fail();
  });
});
