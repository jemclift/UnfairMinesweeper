var board_size = [29,58]; // [y,x]
board_size = [9,9]
var mines = 347;
mines = 10
// var large_start = true;
var first_go = true;
var board;
var counter = 0;
var stop_counter = false;
var mines_left = mines;
var timout_counter;

document.onkeyup = function(e) {
  if (e.which == 32) { newGame() }
};

var loadedimages = new Array();
for (i=0; i<10; i++) {
  loadedimages[i] = new Image();
  loadedimages[i].src = "digits/d"+i+".svg";
}
new_image = new Image()
new_image.src = "digits/d-.svg"
loadedimages.push(new_image)

function generateGrid() {
  board = new Array(board_size[0]); 
  for (var i = 0; i < board_size[0]; i++) {
    board[i] = new Array(board_size[1]);
  }
}

function buryMines() {
  var mines_to_bury = mines;

  while (mines_to_bury > 0) {
    var y = Math.floor(Math.random() * board_size[0]);
    var x = Math.floor(Math.random() * board_size[1]);
    if (board[y][x] != 'x') {
      board[y][x] = 'x';
      mines_to_bury --;
    }
  }
}

function calculateHints() {
  for (y=0; y<board.length; y++) {
    for (x=0; x<board[y].length; x++) {
      var mine_count = 0;
      adjacent_sqaures = [];

      try { if (board[y-1][x-1] == "x") { mine_count++ } } catch (e) {}
      try { if (board[y-1][x]   == "x") { mine_count++ } } catch (e) {}
      try { if (board[y-1][x+1] == "x") { mine_count++ } } catch (e) {}

      try { if (board[y][x-1] == "x") { mine_count++ } } catch (e) {}
      try { if (board[y][x+1] == "x") { mine_count++ } } catch (e) {}

      try { if (board[y+1][x-1] == "x") { mine_count++ } } catch (e) {}
      try { if (board[y+1][x]   == "x") { mine_count++ } } catch (e) {}
      try { if (board[y+1][x+1] == "x") { mine_count++ } } catch (e) {}

      if (board[y][x] != 'x') {
        board[y][x] = mine_count;
      }
    }
  }
}

function generateCompleteBoard() {
  generateGrid();
  buryMines();
  calculateHints();
}

function drawTiles() {
  var boardElement = document.getElementById("board")
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.lastChild);
  }
  for (y=0; y<board_size[0]; y++) {
    for (x=0; x<board_size[1]; x++) {
      var tile = document.createElement("tile");
      tile.className = "unopened"
      tile.onclick = function() {digTile(this)};
      tile.addEventListener('contextmenu', function(el) { 
        el.preventDefault(); 
        flagTile(this); 
        mines_left --;
        updateMineCounter();
        return false; 
      }, false);
      tile.row = y;
      tile.column = x;
      tile.id = y+"-"+x
      boardElement.appendChild(tile)
      boardElement.style.width = (24*board_size[1]+6)+"px"
    }
  }
}

function digTile(tile) {
  if (first_go) { startTimer() }
  if (tile.className != "flagged") {
    if (board[tile.row][tile.column] == "0") {
      uncoverTiles(tile.row, tile.column);
    } else {
      tile.className = "opened";
    }
    var text = "";
    if (board[tile.row][tile.column] == "x") {
      if (first_go == false) {
        tile.className = "first-mine"
        gameOver(tile.row,tile.column)
      } else {
        var y = tile.row; var x = tile.column
        newGame()
        digTile(document.getElementById(y+"-"+x))
      }
    } else if (board[tile.row][tile.column] > 0) {
      text = board[tile.row][tile.column]
    }
    tile.innerHTML = text;
    coloriseHint(tile.row,tile.column)
  }
  first_go = false
  if (checkWin()) {
    stop_counter = true
    for (tile of document.getElementsByTagName("tile")) {
      if (tile.className != "flagged" && board[tile.row][tile.column] == "x") {
        tile.className = "flagged";
      }
      tile.onclick = null;
      tile.classList.add("disabled");
    }
  }
}

function coloriseHint(row,column) {
  var hint = document.getElementById(row+"-"+column)

  switch (hint.innerHTML) {
    case "1": hint.style.color = "blue"; break;
    case "2": hint.style.color = "green"; break;
    case "3": hint.style.color = "red"; break;
    case "4": hint.style.color = "navy"; break;
    case "5": hint.style.color = "maroon"; break;
    case "6": hint.style.color = "teal"; break;
    case "7": hint.style.color = "black"; break;
    case "8": hint.style.color = "gray";
  }
}
 
function uncoverTiles(row, column) {
  if (board[row][column] == "0" && document.getElementById(row+"-"+column).className != "opened") {
    document.getElementById(row+"-"+column).className = "opened"

    try { if (board[row-1][column-1] == "0") { uncoverTiles(row-1,column-1) } } catch(e) {}
    try { if (board[row-1][column]   == "0") { uncoverTiles(row-1,column)   } } catch (e) {}
    try { if (board[row-1][column+1] == "0") { uncoverTiles(row-1,column+1) } } catch (e) {}

    try { if (board[row][column-1] == "0") { uncoverTiles(row,column-1) } } catch (e) {}
    try { if (board[row][column+1] == "0") { uncoverTiles(row,column+1) } } catch (e) {}

    try { if (board[row+1][column-1] == "0") { uncoverTiles(row+1,column-1) } } catch (e) {}
    try { if (board[row+1][column]   == "0") { uncoverTiles(row+1,column)   } } catch (e) {}
    try { if (board[row+1][column+1] == "0") { uncoverTiles(row+1,column+1) } } catch (e) {}

    openAdjacentNumbers(row, column)
  }
}

function openAdjacentNumbers(row, column) {
  function openIfUnopened(row, column) {
    var tile = document.getElementById(row+"-"+column)
    if (tile.className == "unopened") {
      tile.className = "opened"
      tile.innerHTML = board[row][column]
      coloriseHint(row,column)
    }
  }
  try { if (board[row-1][column-1] < 10) { openIfUnopened(row-1,column-1) } } catch(e) {}
  try { if (board[row-1][column]   < 10) { openIfUnopened(row-1,column)   } } catch (e) {}
  try { if (board[row-1][column+1] < 10) { openIfUnopened(row-1,column+1) } } catch (e) {}

  try { if (board[row][column-1] < 10) { openIfUnopened(row,column-1) } } catch (e) {}
  try { if (board[row][column+1] < 10) { openIfUnopened(row,column+1) } } catch (e) {}

  try { if (board[row+1][column-1] < 10) { openIfUnopened(row+1,column-1) } } catch (e) {}
  try { if (board[row+1][column] < 10) { openIfUnopened(row+1,column)   } } catch (e) {}
  try { if (board[row+1][column+1] < 10) { openIfUnopened(row+1,column+1) } } catch (e) {}
}

function flagTile(tile) {
  if (tile.className == "unopened") {
    tile.className = "flagged";
  } else if (tile.className == "flagged") {
    tile.className = "unopened"
  }
}

function newGame() {
  clearTimeout(timout_counter);
  document.getElementById("timer").childNodes[1].style.backgroundImage =
  document.getElementById("timer").childNodes[3].style.backgroundImage =
  document.getElementById("timer").childNodes[5].style.backgroundImage = "url('digits/d0.svg')"
  first_go = true;
  mines_left = mines;
  counter = 0;
  generateCompleteBoard();
  drawTiles();
  updateMineCounter();
  stop_counter = false;
}

function updateMineCounter() {
  if (mines_left < 1000 && mines_left > -100) {
    if (mines_left.toString().length == 3) {
      document.getElementById("mines").childNodes[1].style.backgroundImage = "url('digits/d"+mines_left.toString()[0]+".svg')";
      document.getElementById("mines").childNodes[3].style.backgroundImage = "url('digits/d"+mines_left.toString()[1]+".svg')";
      document.getElementById("mines").childNodes[5].style.backgroundImage = "url('digits/d"+mines_left.toString()[2]+".svg')";
    } else if (mines_left.toString().length == 2) {
      document.getElementById("mines").childNodes[1].style.backgroundImage = "url('digits/d0.svg')";
      document.getElementById("mines").childNodes[3].style.backgroundImage = "url('digits/d"+mines_left.toString()[0]+".svg')";
      document.getElementById("mines").childNodes[5].style.backgroundImage = "url('digits/d"+mines_left.toString()[1]+".svg')";
    } else {
      document.getElementById("mines").childNodes[1].style.backgroundImage = "url('digits/d0.svg')";
      document.getElementById("mines").childNodes[3].style.backgroundImage = "url('digits/d0.svg')";
      document.getElementById("mines").childNodes[5].style.backgroundImage = "url('digits/d"+mines_left.toString()[0]+".svg')";
    }
  }
}

function gameOver(firstY,firstX) {
  stop_counter = true
  var tiles = document.getElementsByTagName("tile")
  for (tile of tiles) {
    if (board[tile.row][tile.column] == "x") {
      if (tile.className != "flagged") {
        tile.className = "mine"
      }
    } else if (tile.className == "flagged") {
      tile.className = "mine-wrong"
    }
    tile.onclick = null
    tile.classList.add("disabled")
  }
  document.getElementById(firstY+"-"+firstX).classList.add("first-mine")
}

function startTimer() {
  if (counter < 1000 && stop_counter == false) {
    timout_counter = setTimeout( function() {
      if (counter % 100 == 0) {
        document.getElementById("timer").childNodes[1].style.backgroundImage = "url('digits/d"+(counter % 1000).toString()[0]+".svg')"; 
      }
      if (counter % 10 == 0) {
        document.getElementById("timer").childNodes[3].style.backgroundImage = "url('digits/d"+(counter % 100).toString()[0]+".svg')";
      }
      if (stop_counter == false) {
        document.getElementById("timer").childNodes[5].style.backgroundImage = "url('digits/d"+(counter % 10)+".svg')";
      }
      counter ++;
      startTimer();
    }, 1000);
  }
}

function checkWin() {
  var win = true
  for (tile of document.getElementById("board").childNodes) {
    if (tile.className != "opened" && board[tile.row][tile.column] != "x") {
      win = false; break
    }
  }
  return win
}

newGame();