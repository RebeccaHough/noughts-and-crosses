let turn = 1;
let boxes;
let gameover = false;
let gameboard = [[null, null, null], [null, null, null], [null, null, null]];

//todo draw lines
//todo fix box changing sizes

//todo ugly focus highlight appears when clicking

window.onload = function(e) {
  boxes = document.getElementsByClassName("box");
  for(let box = 0; box < boxes.length; box++) {
    boxes[box].addEventListener('click', addPlayingPiece.bind(this, boxes[box], convertToCoords(box)));
    boxes[box].addEventListener('keydown', function() {
      //debugging
      //console.log(event.which, box)
      //if enter is pressed
      if(event.which === 13) {
        addPlayingPiece(boxes[box], convertToCoords(box))
    }}.bind(null, event, boxes, box));
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
    box.innerHTML = '<img src="./assets/nought.png" class="playing-piece" aria-label="nought"/>';
    //remove focus
    box.blur()
    //update gameboard arr
    player = 'o';
    gameboard[ coords[0] ][ coords[1] ] = player;
  } else {
    //add cross
    box.innerHTML = '<img src="./assets/cross.png" class="playing-piece" aria-label="cross"/>';
    //remove focus
    box.blur()
    //update gameboard arr
    player = 'x';
    gameboard[ coords[0] ][ coords[1] ] = player;
  }
  turn ++;

  checkForWinner(coords, player);
}

/**
 * Check for line of 3 consecutive playing pieces, if winner found then alert the user, then reset the game 
 * @param {Array} boxClicked array of x and y coords of box clicked
 * @param {string} player 'x' or 'o'
 */
function checkForWinner(boxClicked, player) {
  //directions in clockwise order from top left, but stored in pairs of oppsite directions
  // [0, 0] [0, 1] [0, 2]
  // [1, 0] [1, 1] [1, 2]
  // [2, 0] [2, 1] [2, 2]
  let directions = [
    [ [-1, -1] , [+1, +1] ],
    [ [-1,  0] , [+1,  0] ],
    [ [-1, +1] , [+1, -1] ],
    [ [ 0, +1] , [ 0, -1] ],
  ];

  //do search for winner
  //if there is more than one winning path, all winning paths will be returned & stored in answers
  let answers = [];
  for(let dir of directions) {
    let ansDir = searchInDirection(boxClicked, dir, player);
    if(ansDir)
      answers.push(ansDir);
  }

  //if the current player has won
  if(answers.length > 0) {
    console.log("[checkForWinner] winner found, " + player.toUpperCase());
    console.log("[checkForWinner] winning path(s):", answers);
    alert(player.toUpperCase() + " wins!");  //synchronous
    
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
 * Search along a straight line (in a direction indicated by the direction arg) 
 * for nodes containing strings matching the player arg
 * until 3 consecutive hits, then return the path taken in an array
 * or null if less than 3 consecutive hits were found.
 * @param {Array} start the 'starting point' node, an array of [x, y]
 * @param {Array} direction array of a pair of arrays that take the form: [+/-1 or 0, +/-1 or 0], 
 * that indicate opposite directions, to be added to nodes in order to search along a line
 * @param {string} player 'x' or 'o'
 * @returns an array of nodes denoting the path taken, or null
 */
function searchInDirection(start, direction, player) {
  let history = [start];
  
  //use innerL and innerR to check both directions for any matching nodes
  //not technically left/rights, could be up/down, or diagonal
  //both functions update the same history array
  //and maintain node order (i.e. if the starting node is in-between two matching nodes,
  //this is reflected in the array)
  
  (function innerL(current, direction) {
    //advance to next node 
    current = [ current[0] + direction[0], current[1] + direction[1] ];
    //check one direction
    //will also fail in array out of bounds cases
    //if IE compatibility is needed, use && chains instead of the unsupported ?.
    if(player === gameboard?.[current[0]]?.[current[1]]) {
      //push to hits list
      history.push(current);
      //could do if(history >= 3) return; here but it's pointless given the size of the gameboard
      return innerL(current, direction);
    } else return;
  })(start, direction[0]);

  (function innerR(current, direction) {
    current = [ current[0] + direction[0], current[1] + direction[1] ];
    if(player === gameboard?.[current[0]]?.[current[1]]) {
      //prepend to hits list
      history.unshift(current);
      return innerR(current, direction);
    } else return;
  })(start, direction[1]);


  if(history.length >= 3) return history;
  else return null;
}

/**
 * Convert a number 0-9 to coordinates on a 3x3 grid, with top left being [0,0] and bottom right [2,2]
 * @param {number} num 0-8
 */
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