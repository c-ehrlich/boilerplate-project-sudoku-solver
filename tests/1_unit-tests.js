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
    assert.fail();
  });
  test("Logic handles an invalid region (3x3 grid) placement", () => {
    assert.fail();
  });
  test("Valid puzzle strings pass the solver", () => {
    assert.fail();
  });
  test("Invalid puzzle strings fail the solver", () => {
    assert.fail();
  });
  test("Solver returns the expected solution for an incomplete puzzle", () => {
    assert.fail();
  });
});
