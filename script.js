var board_size = [16,30]; // [y,x]
var mines = 99;

function generateGrid() {
  let board = new Array(board_size[0]); 
  for (var i = 0; i < board_size[0]; i++) {
    board[i] = new Array(board_size[1]);
  }
  return board;
}

function buryMines(board) {
  var new_board = board;
  var mines_to_bury = mines;

  while (mines_to_bury > 0) {
    var y = Math.floor(Math.random() * board_size[0]);
    var x = Math.floor(Math.random() * board_size[1]);
    if (new_board[y][x] != 'x') {
      new_board[y][x] = 'x';
      mines_to_bury --;
    }
  }

  return new_board;
}

function calculateHints(board) {
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
  return board;
}

function generateCompleteBoard() {
  var board = generateGrid();
  board = buryMines(board);
  board = calculateHints(board);
  return board;
}

function drawTiles(board) {
  var boardElement = document.getElementById("board")
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.lastChild);
  }
  for (y=0; y<board_size[0]; y++) {
    for (x=0; x<board_size[1]; x++) {
      var tile = document.createElement("tile");
      // tile.id = "tile"
      tile.className = "unopened"
      tile.onclick = function() {digTile(this,board)};
      tile.addEventListener('contextmenu', function(el) { el.preventDefault(); flagTile(this); return false; }, false);
      tile.row = y;
      tile.column = x;
      tile.id = y+"-"+x
      boardElement.appendChild(tile)
      boardElement.style.width = (24*board_size[1]+6)+"px"
    }
  }
}

function digTile(tile,board) {
  if (tile.className != "flagged") {
    if (board[tile.row][tile.column] == "0") {
      uncoverTiles(tile.row, tile.column, board);
    } else {
      tile.className = "opened";
    }
    var text = "";
    if (board[tile.row][tile.column] == "x") {
      tile.className = "first-mine"
      gameOver(tile.row,tile.column,board)
    } else if (board[tile.row][tile.column] > 0) {
      text = board[tile.row][tile.column]
    }
    tile.innerHTML = text;
    coloriseHint(tile.row,tile.column)
  }
}

function coloriseHint(row,column) {
  console.log("row:"+row+"column"+column)
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
 
function uncoverTiles(row, column, board) {
  if (board[row][column] == "0" && document.getElementById(row+"-"+column).className != "opened") {
    document.getElementById(row+"-"+column).className = "opened"

    try { if (board[row-1][column-1] == "0") { uncoverTiles(row-1,column-1,board) } } catch(e) {}
    try { if (board[row-1][column]   == "0") { uncoverTiles(row-1,column,board)   } } catch (e) {}
    try { if (board[row-1][column+1] == "0") { uncoverTiles(row-1,column+1,board) } } catch (e) {}

    try { if (board[row][column-1] == "0") { uncoverTiles(row,column-1,board) } } catch (e) {}
    try { if (board[row][column+1] == "0") { uncoverTiles(row,column+1,board) } } catch (e) {}

    try { if (board[row+1][column-1] == "0") { uncoverTiles(row+1,column-1,board) } } catch (e) {}
    try { if (board[row+1][column]   == "0") { uncoverTiles(row+1,column,board)   } } catch (e) {}
    try { if (board[row+1][column+1] == "0") { uncoverTiles(row+1,column+1,board) } } catch (e) {}

    openAdjacentNumbers(row, column, board)
  }
}

function openAdjacentNumbers(row, column, board) {
  function openIfUnopened(row, column, board) {
    var tile = document.getElementById(row+"-"+column)
    if (tile.className == "unopened") {
      tile.className = "opened"
      tile.innerHTML = board[row][column]
      coloriseHint(row,column)
    }
  }
  try { if (board[row-1][column-1] < 10) { openIfUnopened(row-1,column-1,board) } } catch(e) {}
  try { if (board[row-1][column]   < 10) { openIfUnopened(row-1,column,board)   } } catch (e) {}
  try { if (board[row-1][column+1] < 10) { openIfUnopened(row-1,column+1,board) } } catch (e) {}

  try { if (board[row][column-1] < 10) { openIfUnopened(row,column-1,board) } } catch (e) {}
  try { if (board[row][column+1] < 10) { openIfUnopened(row,column+1,board) } } catch (e) {}

  try { if (board[row+1][column-1] < 10) { openIfUnopened(row+1,column-1,board) } } catch (e) {}
  try { if (board[row+1][column] < 10) { openIfUnopened(row+1,column,board)   } } catch (e) {}
  try { if (board[row+1][column+1] < 10) { openIfUnopened(row+1,column+1,board) } } catch (e) {}
}

function flagTile(tile) {
  if (tile.className == "unopened") {
    tile.className = "flagged";
  } else if (tile.className == "flagged") {
    tile.className = "unopened"
  }
}

function newGame() {
  var board = generateCompleteBoard();
  drawTiles(board);
}

function gameOver(firstY,firstX,board) {
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
    tile.disabled = true
  }
  document.getElementById(firstY+"-"+firstX).classList.add("first-mine")
}

newGame();