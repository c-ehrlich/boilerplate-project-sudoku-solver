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
      // missing puzzle
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          coordinate: "A1",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Required field(s) missing",
          });
        });
      // missing coordinate
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Required field(s) missing",
          });
        });
      // missing value
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "A1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Required field(s) missing",
          });
        });
      // missing puzzle, coordinate, and value
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Required field(s) missing",
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

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", () => {
      // Check A0
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "A0",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid coordinate",
          });
        });
      // Check J1
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "J1",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid coordinate",
          });
        });
      // Check A
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "A",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid coordinate",
          });
        });
      // Check A10
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "A10",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid coordinate",
          });
        });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", () => {
      // Check 0
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "A1",
          value: 0,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid value",
          });
        });
      // Check 10
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "A1",
          value: 10,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid value",
          });
        });
      // Check A
      chai
        .request(server)
        .post("/api/check")
        .type("form")
        .send({
          puzzle:
            ".................................................................................",
          coordinate: "A1",
          value: "A",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid value",
          });
        });
    });
  });
});
