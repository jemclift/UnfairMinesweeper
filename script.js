var board_size = [9,9]; // [y,x]
var mines = 10;

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
    var x = Math.floor(Math.random() * board_size[0]);
    var y = Math.floor(Math.random() * board_size[1]);
    if (new_board[x][y] != 'x') {
      new_board[x][y] = 'x';
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
      try { if (board[y-1][x] == "x") { mine_count++ } } catch (e) {}
      try { if (board[y-1][x+1] == "x") { mine_count++ } } catch (e) {}

      try { if (board[y][x-1] == "x") { mine_count++ } } catch (e) {}
      try { if (board[y][x+1] == "x") { mine_count++ } } catch (e) {}

      try { if (board[y+1][x-1] == "x") { mine_count++ } } catch (e) {}
      try { if (board[y+1][x] == "x") { mine_count++ } } catch (e) {}
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
  for (y=0; y<board_size[1]; y++) {
    for (x=0; x<board_size[0]; x++) {
      var tile = document.createElement("div");
      tile.id = "tile"
      tile.className = "unopened"
      tile.onclick = function() {digTile(this,board)};
      tile.addEventListener('contextmenu', function(el) {
          el.preventDefault();
          flagTile(this);
          return false;
      }, false);
      tile.row = y;
      tile.column = x;
      boardElement.appendChild(tile)
      boardElement.style.width = (24*board_size[1]+6)+"px"
    }
  }
}

function digTile(tile,board) {
  if (tile.className != "flagged") {
    tile.className = "opened";
    var text = "";
    if (board[tile.row][tile.column] == "x") {
      tile.className = "first-mine"
      alert('game over');
    } else if (board[tile.row][tile.column] > 0) {
      text = board[tile.row][tile.column]
      uncoverTiles(tile.row, tile.column);
    }
    tile.innerHTML = text;
  }
}

function uncoverTiles(row, column, board) {
  if (board[row][column] == "0") {
    document.g
  } else {
    // look in all direcrions
  }
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

newGame();