let turn = 1;
let boxes;
let gameover = false;
let gameboard = [[null, null, null], [null, null, null], [null, null, null]];

window.onload = function(e) {
  boxes = document.getElementsByClassName("box");
  for(let box = 0; box < boxes.length; box++) {
    boxes[box].addEventListener('click', addPlayingPiece.bind(this, boxes[box], convertToCoords(box)));
  }
}

/**
 * 
 * @param {HTMLElement} box 
 * @param {Array} coords
 */
function addPlayingPiece(box, coords) {
  console.log('[addPlayingPiece] called');
  console.log(box) 
    console.log(coords) 
    console.log(gameboard);
    console.log(gameboard[coords[0]][coords[1]]);
    
  if(gameover) return;
  //prevent adding a playing piece to an already filled box
  if(gameboard[coords[0]][coords[1]] !== null) return;

  //even/odd determines player
  if(turn % 2 === 0 ) {
    //add nought
    box.innerHTML = '<img src="./assets/nought.png" class="playing-piece"/>';
    //todo update gameboard
    gameboard[coords[0]][coords[1]] = 'o';
  } else {
    //add cross
    box.innerHTML = '<img src="./assets/cross.png" class="playing-piece"/>';
    //todo update gameboard
    gameboard[coords[0]][coords[1]] = 'x';
  }
  turn ++;

  checkForWinner(); //todo args
}

/**
 * 
 * @param {} boxClicked 
 */
function checkForWinner(boxClicked) {
  let winner;
  
  //search algorithms woo
  //recurse
  //let numAdjacent = 0;
  //check vertical/horiz adajecent boxes for same type
  //store any of the same type
  //search them
  //if numAdj === 3 return true;

  if(winner) {
    alert(winner + " wins!") 
    //todo draw line
    //rotate line asset?

    gameover = true;
  }
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

//todo test
function restartGame() {
  //clear all playing pieces
  for(let arr of gameboard) {
    for(let el of arr) {
      el = null;
    }
  }
  console.log('[restartGame]', gameboard);
}