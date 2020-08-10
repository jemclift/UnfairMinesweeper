var board_size = [28,28]; // [y,x]
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
      try { if (board[y-1][x+1] == "x") { mine_count++ } } catch (e) {}

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

function drawTiles() {
  for (y=0; y<board_size[1]; y++) {
    for (x=0; x<board_size[0]; x++) {
      var tile = document.createElement("div");
      tile.id = "tile"
      tile.className = "unopened"
      document.getElementById("board").appendChild(tile)
      document.getElementById("board").style.width = (24*board_size[1]+6)+"px"
    }
  }
}

drawTiles()