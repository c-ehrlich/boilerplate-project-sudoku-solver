# Sudoku Solver

Sample deployment: https://fcc-sudoku-solver1.herokuapp.com/

## What is this?
A REST API, including a test suite, for solving sudoku puzzles using a backtracking algorithm. Part of the [freeCodeCamp Testing Curriculum](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver).

## Installation
* Clone down the repo
* `npm i`
* `npm start`

## Deployment
Heroku is shown as a sample deployment.

With the [Heroku CLI](https://devcenter.heroku.com/categories/command-line) installed,
```
heroku login -i
heroku create <app name>
heroku git:remote -a <app name>
git push heroku main
```

## Sample Requests
### Check a valid number placement
#### Request
```
POST https://fcc-sudoku-solver1.herokuapp.com/api/check
```
```json
{
    "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
    "coordinate": "A1",
    "value": "7"
}
```
#### Response
```json
{
    "valid": true
}
```
### Check an invalid number placement
#### Request
```
POST https://fcc-sudoku-solver1.herokuapp.com/api/check
```
```json
{
    "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
    "coordinate": "A1",
    "value":"1"
}
```
#### Response
```json
{
    "valid": false,
    "conflict":
        [
            "row","column"
        ]
}
```

### Solve a valid puzzle
#### Request
```
POST https://fcc-sudoku-solver1.herokuapp.com/api/solve
```
```json
{
    "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
}
```
#### Response
```json
{
    "solution": "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
}
```

### Solve an invalid puzzle
#### Request
```
POST https://fcc-sudoku-solver1.herokuapp.com/api/solve
```
```json
{
    "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6"
}
```
#### Response
```json
{
    "error": "Expected puzzle to be 81 characters long"
}
```
