/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = makeBoard(WIDTH,HEIGHT)

let allowClick = true

/** creates array for board data structure
 * accepts width and height value
 * returns an array, with height# of subarrays, 
 * containing width# of values set to null
 */
function makeBoard(width, height) {
  const xArr = [];
  const yArr = [];
  for( let x = 0; x < width; x++){
    xArr.push(null)
  }
  for( let y = 0; y < height; y++){
    yArr.push([...xArr]);
  }
  return yArr
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");

  /** creates table row with id of column-top
  * adds event listener for a click table row 
  * for loop creates cells based on WIDTH and appends to top
  * top is appended to htmlBoard*/ 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  /** creates table rows and cells for html board
   * assigns y and x values as ids to each cell
   */
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** x column is examined and returns the y index for the top empty space
*/
function findSpotForCol(x) {
  const yValArr = board.map(yVal => yVal[x]);
  const yIndex = yValArr.findIndex(val => val !== null);
  if (yIndex === -1){
    return HEIGHT - 1
  } else if (yIndex === 0){
    return null
  } else {
    return yIndex - 1
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div');
  const tableCell = document.getElementById(`${y}-${x}`);
  piece.classList.add('piece', `p${currPlayer}`);
  tableCell.append(piece);
}

/** endGame: announce game end */

const endGame = msg => alert(msg)

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (!allowClick){
    return
  }
  // get x from ID of clicked cell
  const x = evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // update memory board
  placeInTable(y, x);
  board[y].splice(x, 1, currPlayer)

  allowClick = false;

  // check for win
  setTimeout(function() { if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }
    if(currPlayer === 1){
      currPlayer = 2
    } 
    else if( currPlayer === 2) {
      currPlayer = 1
    }
    allowClick = true
  }, 250)
  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  // TODO: switch currPlayer 1 <-> 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }
  
/** creating arrays for every possible winning combination 
 * those arrays are passed into win()
 * if any of those arrays causes win() to return true, the function returns true
 * otherwise nothing.
 */
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
        return true;
      }
    }
  }
}

makeHtmlBoard();
