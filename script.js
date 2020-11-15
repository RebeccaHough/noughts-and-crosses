let turn = 1;
let boxes;
let gameover = false;
let gameboard = [[null, null, null], [null, null, null], [null, null, null]];

//todo draw lines
//todo fix box changing sizes
//todo THE ALGORITHM DOESNT WORK, need to search both ways

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
  // console.log(coords) 
  // console.log(gameboard);
  // console.log(gameboard[coords[0]][coords[1]]);
    
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

  
  //todo what about if two lines win
  let answers = [];
  for(let dir of directions) {
    //do search for winner
    let ansDir = recurse(boxClicked, dir, player);
    if(ansDir) 
      answers.push(ansDir);
  }

  //if the current player has won
  if(answers.length > 0) {
    console.log("[checkForWinner] winner found, " + player.toUpperCase())
    alert(player.toUpperCase() + " wins!")  //synchronous
    
    //todo draw line
    //rotate line asset?
    
    gameover = true;
    restartGame();
  } 
  //if the current player hasn't won
  else { 
    //check if gameboard is full
    let gameboardIsFull = true;
    for(let arr of gameboard) {
      for(let el of arr) {
        if(el === null) {
          gameboardIsFull = false; 
          break; //no goto :(
        }
      }    
      if(!gameboardIsFull) break; //goto
    }
  
    //if the gameboard is full (and there was no winner)
    if(gameboardIsFull) {
      console.log("[checkForWinner] no winner found")
      alert("No winner this time!")  //synchronous

      gameover = true;
      restartGame();
    } //else carry on playing
  }
}

/**
 * Search in a straight line (in a direction indicated by the direction arg) 
 * for nodes containing strings matching the player arg
 * until 3 consecutive hits, then return the path taken in an array
 * or null if less than 3 consecutive hits were found.
 * @param {Array} start the 'starting point' node, an array of [x, y]
 * @param {Array} direction array of [+/-1 or 0, +/-1 or 0], to be added to nodes in order to search in that direction
 * @param {string} player 'x' or 'o'
 * @returns an array of nodes denoting the path taken, or null
 */
function recurse(start, direction, player) {
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
  console.log('[restartGame] resetting gameboard');
  //clear up images
  for(let box of boxes) {
    box.innerHTML = '';
  }
  turn = 1;
  gameover = false;
}