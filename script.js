let turn = 1;
let boxes;
let gameover = false;
let gameboard = [[null, null, null], [null, null, null], [null, null, null]];

//todo draw lines
//todo can't win on second game
//todo accessibility 
//todo screen sizes
//todo find a replacement for this: ?.

window.onload = function(e) {
  boxes = document.getElementsByClassName("box");
  for(let box = 0; box < boxes.length; box++) {
    boxes[box].addEventListener('click', addPlayingPiece.bind(this, boxes[box], convertToCoords(box)));
  }
}

/**
 * Determine whose go it is, add an appropriate image to the box that was clicked on and check for winners
 * @param {HTMLElement} box html element to add image to
 * @param {Array} coords x and y of current box in gameboard array
 */
function addPlayingPiece(box, coords) {
  console.log('[addPlayingPiece] called');
  //debugging
  console.log(coords) 
  console.log(gameboard);
  console.log(gameboard[coords[0]][coords[1]]);
    
  if(gameover) return;
  //prevent adding a playing piece to an already filled box
  if(gameboard[coords[0]][coords[1]] !== null) return;

  //even/odd determines player
  let player;
  if(turn % 2 === 0 ) {
    //add nought
    box.innerHTML = '<img src="./assets/nought.png" class="playing-piece"/>';
    //update gameboard arr
    player = 'o';
    gameboard[ coords[0] ][ coords[1] ] = player;
  } else {
    //add cross
    box.innerHTML = '<img src="./assets/cross.png" class="playing-piece"/>';
    //update gameboard arr
    player = 'x';
    gameboard[ coords[0] ][ coords[1] ] = player;
  }
  turn ++;

  checkForWinner(coords, player);
}

/**
 * 
 * @param {Array} boxClicked array of x and y coords of box clicked
 * @param {string} player 'x' or 'o'
 */
function checkForWinner(boxClicked, player) {
  //directions given in clockwise order from top left
  // [0, 0] [0, 1] [0, 2]
  // [1, 0] [1, 1] [1, 2]
  // [2, 0] [2, 1] [2, 2]
  let directions = [
    [-1, -1],
    [-1, 0],
    [-1, +1],
    [0, +1],
    [+1, +1],
    [+1, 0],
    [+1, -1],
    [0, -1],
  ];

  //search algorithms woo

  //todo what about if two lines win
  let answers = [];
  for(let dir of directions) {
    let ansDir = recurse(boxClicked, dir, player);
    console.log(ansDir);
    if(ansDir) 
      answers.push(ansDir);
  }

  if(answers.length > 0) {
    console.log(player.toUpperCase() + " wins!")
    alert(player.toUpperCase() + " wins!")  //synchronous
    
    //todo draw line
    //rotate line asset?

    gameover = true;
    restartGame();
  }
}

/**
 * 
 * @param {Array} start the 'starting point' node, an array of [x, y]
 * @param {Array} direction array of [+/-1 or 0, +/-1 or 0], to be added to nodes in order to search in that direction
 * @param {string} player 'x' or 'o'
 */
function recurse(start, direction, player) {
  //general idea: choose initial direction and keep going in that direction until edge or 3 same
  let history = [start];
  
  return (function inner(current) {
    //move to next node
    current = [ current[0] + direction[0], current[1] + direction[1] ]
    //check next node
    //will also fail in array out of bounds cases
    //todo
    //so safe. much readable. wow.
    if(player === gameboard?.[current[0]]?.[current[1]]) {
      history.push(current);
      if(history.length === 3) {
        return history;
      }
      return inner(current);
    } else {
      return null;
    }
  })(start);
}

function convertToCoords(num) {
  //do this a better way
  switch(num) {
    case 0:
      return [0, 0];
    case 1:
      return [0, 1];
    case 2:
      return [0, 2];
    case 3:
      return [1, 0];
    case 4:
      return [1, 1];
    case 5:
      return [1, 2];
    case 6:
      return [2, 0];
    case 7:
      return [2, 1];
    case 8:
      return [2, 2];
  }
}

/**
 * Clear the gameboard array, reset turn tracker and remove x and o images
 */
function restartGame() {
  //clear all playing pieces
  gameboard = [[null, null, null], [null, null, null], [null, null, null]];
  console.log('[restartGame] resetting gameboard', gameboard);
  //clear up images
  for(let box of boxes) {
    box.innerHTML = '';
  }
  turn = 1;
  gameover = false;
}