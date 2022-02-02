const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("/api/solve", () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", () => {
      chai
        .request(server)
        .post("/api/solve")
        .type("form")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.solution);
          assert.deepEqual(res.body, {
            solution:
              "769235418851496372432178956174569283395842761628713549283657194516924837947381625",
          });
        });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", () => {
      chai
        .request(server)
        .post("/api/solve")
        .type("form")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.deepEqual(res.body, {
            error: "Required field missing",
          });
        });
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", () => {
      chai
        .request(server)
        .post("/api/solve")
        .type("form")
        .send({
          puzzle:
            "a................................................................................",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid characters in puzzle",
          });
        });
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", () => {
      chai
        .request(server)
        .post("/api/solve")
        .type("form")
        .send({
          puzzle:
            "1...............................................................................",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(
            res.body,
            {
              error: "Expected puzzle to be 81 characters long",
            },
            "Should react correctly to a 80 character length puzzle"
          );
        });
      chai
        .request(server)
        .post("/api/solve")
        .type("form")
        .send({
          puzzle:
            "1.................................................................................",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(
            res.body,
            {
              error: "Expected puzzle to be 81 characters long",
            },
            "Should react correctly to a 82 character length puzzle"
          );
        });
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", () => {
      chai
        .request(server)
        .post("/api/solve")
        .type("form")
        .send({
          puzzle:
            "11...............................................................................",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.error);
          assert.deepEqual(res.body, {
            error: "Puzzle cannot be solved",
          });
        });
    });
  });

  suite("/api/check", () => {
    test("Check a puzzle placement with all fields: POST request to /api/check", () => {
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "B3",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            valid: true,
          });
        });
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", () => {
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            "........1........................................................................",
          coordinate: "A1",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            valid: false,
            conflict: ["row"],
          });
        });
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", () => {
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            "........1...............................................................1........",
          coordinate: "A1",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            valid: false,
            conflict: ["row", "column"],
          });
        });
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", () => {
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            "...1......1................1.....................................................",
          coordinate: "A1",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            valid: false,
            conflict: ["row", "column", "region"],
          });
        });
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", () => {
      const badPayloads = [
        { coordinate: "A1", value: 1 }, // missing puzzle
        {
          puzzle:
            ".................................................................................",
          value: 1,
        }, // missing coordinate
        {
          puzzle:
            ".................................................................................",
          coordinate: "A1",
        }, // missing value
        {
          puzzle:
            ".................................................................................",
        }, // missing value and coordinate
        { value: 1 }, // missing puzzle and coordinate
        { coordinate: "A1" }, // missing puzzle and value
        {}, // missing puzzle, coordinate, and value
      ];

      badPayloads.forEach((payload) => {
        chai
          .request(server)
          .post("/api/check")
          .type("form")
          .send(payload)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              error: "Required field(s) missing",
            });
          });
      });
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", () => {
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".a...............................................................................",
          coordinate: "A1",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid characters in puzzle",
          });
        });
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", () => {
      const incorrectLengthPuzzles = [
        "................................................................................",
        "..................................................................................",
      ];

      incorrectLengthPuzzles.forEach((puzzle) => {
        chai
          .request(server)
          .post("/api/check")
          .type("form")
          .send({
            puzzle: puzzle,
            coordinate: "A1",
            value: 1,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              error: "Expected puzzle to be 81 characters long",
            });
          });
      });
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", () => {
      const badPlacementCoordinates = ["A0", "J1", "A", "A10"];

      badPlacementCoordinates.forEach((coordinate) => {
        chai
          .request(server)
          .post("/api/check")
          .type("form")
          .send({
            puzzle:
              ".................................................................................",
            coordinate: coordinate,
            value: 1,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              error: "Invalid coordinate",
            });
          });
      });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", () => {
      const badPlacementValues = [0, 10, "A"];

      badPlacementValues.forEach((value) => {
        chai
          .request(server)
          .post("/api/check")
          .type("form")
          .send({
            puzzle:
              ".................................................................................",
            coordinate: "A1",
            value: value,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body,
              {
                error: "Invalid value",
              },
              "Value of 0 should be refused"
            );
          });
      });
    });
  });
});
