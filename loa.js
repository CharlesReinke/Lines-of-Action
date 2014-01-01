/*
loa.js
Lines of Action engine in Javascript
(http://en.wikipedia.org/wiki/Lines_of_Action for rules of the game)
Charles Reinke 
January 2013 - Now
*/
function loa() {
	this.canvas = null;
	this.context = null;
	this.config = new config();
	this.grid = new Array(this.config.columns);
	this.highlighted = false;
	this.highlightedPiece = null;
	this.groups = new Array();
	//if turn is true, it's white's turn
	this.turn = true;
	var i;
	for (i = 0; i < this.config.columns; i++) {
		this.grid[i] = new Array(this.config.rows);	
	}
	var j;
	var k;
	var theGridSpace;
	for (j = 0; j < this.config.columns; j++) {
		for (k = 0; k < this.config.rows; k++) {
			this.grid[j][k] = new gridSpace(j, k);
			theGridSpace = this.grid[j][k];
			//put pieces in starting positions
			if ((k == 0 && j > 0 && j < 7) || (k == 7 && j > 0 && j < 7)) {
				theGridSpace.contents = new piece(false, this, theGridSpace, j, k);
			}
			if ((j == 0 && k > 0 && k < 7) || (j == 7 && k > 0 && k < 7)) {
				theGridSpace.contents = new piece(true, this, theGridSpace, j, k);
			}
		}
	}
}
loa.prototype.handleClick = function(mouseX, mouseY) {
	var x;
	var y;
	var gridSpace;
	var didMove = false;
	
	//calculate x and y coordinates of the click
	x = Math.ceil((mouseX - this.config.offsetX) / (this.config.gridWidth)) - 1;
	y = Math.ceil((mouseY - this.config.offsetY) / (this.config.gridHeight)) - 1;
	
	if (x >= 0 && x < this.config.columns && y >= 0 && y < this.config.rows) {
		gridSpace = this.grid[x][y];
		contents = gridSpace.contents;
		if (this.highlighted == true) {
			var validMoves = this.highlightedPiece.validMoves;
			var move;
			var i;
			for (i = 0; i < validMoves.length; i++) {
				move = validMoves[i];
				if (move.x == x && move.y == y) {
					var oldX = this.highlightedPiece.x;
					var oldY = this.highlightedPiece.y;
					this.grid[oldX][oldY].contents.highlighted = false;
					this.highlighted = false;
					this.highlightedPiece = null;
					this.grid[move.x][move.y].contents = this.grid[oldX][oldY].contents;
					this.grid[move.x][move.y].contents.x = move.x;
					this.grid[move.x][move.y].contents.y = move.y;
					this.grid[oldX][oldY].contents = null;
					didMove = true;
					if (this.turn == true) {
						this.turn = false;
					} else {
						this.turn = true;	
					}
					this.generateGroups(true);
					this.generateGroups(false);
				}
			}
		}
		if (contents !== null && didMove == false) {
			if (contents.isWhite == this.turn) {
				if (this.highlighted == false) {
					this.highlighted = true;
					this.highlightedPiece = contents;
					contents.highlighted = true;
					contents.calculateMoves();
				} else {
					if (contents.highlighted == true) {
						this.highlighted = false;
						contents.highlighted = false;
						this.highlightedPiece = null;
					} else {
						this.clearHighlight();
						this.highlighted = true;
						contents.highlighted = true;
						this.highlightedPiece = contents;
						contents.calculateMoves();
					}
				}
			}
		}
		this.draw();
	}
}
loa.prototype.clearHighlight = function() {
	var j;
	var k;
	var gridSpace;
	for (j = 0; j < this.config.columns; j++) {
		for (k = 0; k < this.config.rows; k++) {
			var gridSpace = this.grid[j][k];
			if (gridSpace.contents !== null) {
				gridSpace.contents.highlighted = false;
			}
		}
	}
}
loa.prototype.draw = function() {
	var j;
	var k;
	var drawX;
	var drawY;
	var contents;
	var gridSpace;
	
	for (j = 0; j < this.config.columns; j++) {
		for (k = 0; k < this.config.rows; k++) {
			drawX = (j * this.config.gridWidth) + this.config.offsetX;
			drawY = (k * this.config.gridHeight) + this.config.offsetY;
			
			gridSpace = this.grid[j][k];
			contents = gridSpace.contents;
			this.context.fillStyle = this.config.gridBackgroundColor;
			this.context.strokeStyle = this.config.gridBorderColor;

			this.context.fillRect(drawX, drawY, this.config.gridWidth, this.config.gridHeight);
			this.context.strokeRect(drawX, drawY, this.config.gridWidth, this.config.gridHeight);
			
			if (contents !== null) {
				if (contents.isWhite == true) {
					if (contents.highlighted == true) {
						this.context.fillStyle = this.config.lightPieceHighlightFill;
					} else {
						this.context.fillStyle = this.config.lightPieceFill;	
					}
					this.context.strokeStyle = this.config.lightPieceBorder;
				} else {
					if (contents.highlighted == true) {
						this.context.fillStyle = this.config.darkPieceHighlightFill;	
					} else {
						this.context.fillStyle = this.config.darkPieceFill;	
					}
					this.context.strokeStyle = this.config.darkPieceBorder;
				}
				this.context.fillRect(drawX + 8, drawY + 8, this.config.gridWidth - 16, this.config.gridHeight - 16);
				this.context.strokeRect(drawX + 8, drawY + 8, this.config.gridWidth - 16, this.config.gridHeight - 16);
				

			}
			this.context.fillStyle = this.config.candidateMoveColor;

			if (this.highlighted == true) {
				for (i = 0; i < this.highlightedPiece.validMoves.length; i++) {
					var move = this.highlightedPiece.validMoves[i];
					if (move.x == j && move.y == k) {
						var moveDrawX = (move.x * this.config.gridWidth) + this.config.offsetX;
						var moveDrawY = (move.y * this.config.gridHeight) + this.config.offsetY;
						this.context.fillRect(moveDrawX + 18, moveDrawY + 18, 12, 12);	
					}
				}
			}
		}	
	}
}
loa.prototype.generateGroups = function(doWhite) {
	/*
	this function doesn't work yet!  
	*/
	var group = new group();
	var gridSpace = null;
	var j = 0;
	var k = 0;
	for (j = 0; j < this.config.columns; j++) {
		for (k = 0; k < this.config.columns; k++) {
			gridSpace = this.grid[j][k];
			if (gridSpace.contents !== null) {
				gridSpace.contents.group = null;	
			}
		}
	}
	for (j = 0; j < this.config.columns; j++) {
		for (k = 0; k < this.config.columns; k++) {
			gridSpace = this.grid[j][k];
			if (gridSpace.contents !== null) {
				if (doWhite == true) {
					if (gridSpace.contents.isWhite == true) {
							
					}
				} else {
					if (gridSpace.contents.isWhite == false) {
						
					}
				}
			}
		}
	}
}
/*
A space in the grid.
*/
function gridSpace(x, y) {
	this.x = x;
	this.y = y;
	this.contents = null;
}
/*
A piece, either black or white.  Resides on a gridSpace.
*/
function piece(isWhite, loa, gridSpace, x, y) {
	this.reset();
	this.x = x;
	this.y = y;
	this.gridSpace = gridSpace;
	this.loa = loa;
	this.isWhite = null;
	this.isBlack = null;
	this.higlighted = false;
	this.group = null;
	if (isWhite == true) {
		this.isWhite = true;
		this.isBlack = false;
	} else {
		this.isWhite = false;
		this.isBlack = true;
	}
	this.validMoves = new Array;
}
/*
Reset candidate moves for a piece
*/
piece.prototype.reset = function() {
	this.moveW = false;
	this.moveNW = false;
	this.moveN = false;
	this.moveNE = false;
	this.moveE = false;
	this.moveSE = false;
	this.moveS = false;
	this.moveSW = false;
	
	this.verticalPieces = 0;
	this.horizontalPieces = 0;
	this.topLeftPieces = 0;
	this.bottomLeftPieces = 0;
	
	this.validMoves = new Array;
}
/*
Check to see if this piece is the same color as another
*/
piece.prototype.compare = function(otherPiece) {
	if (this.isWhite == otherPiece.isWhite) {
		return true;	
	} else {
		return false;	
	}
}
/*
Generate possible moves for a piece to make
*/
piece.prototype.calculateMoves = function() {
	this.reset();
	var x;
	var y;
	var i;
	var columns = this.loa.config.columns;
	var rows = this.loa.config.rows;
	var grid = this.loa.grid;
	var gridSpace;
	var contents;
	var checkX;
	var checkY;
	//horizontal
	for (x = 0; x < columns; x++) {
		y = this.y;
		if (grid[x][y].contents !== null) {
			this.horizontalPieces++;	
		}
	}
	
	//vertical
	for (y = 0; y < rows; y++) {
		x = this.x;	
		if (grid[x][y].contents !== null) {
			this.verticalPieces++;	
		}
	}
	
	//top-left and bottom-right
	this.topLeftPieces++;
	x = this.x;
	y = this.y;
	while (x > 0 && y > 0) {
		x--;
		y--;
		if (grid[x][y].contents !== null) {
			this.topLeftPieces++;	
		}
	}
	x = this.x;
	y = this.y;
	while (x < columns - 1 && y < rows - 1) {
		x++;
		y++;
		if (grid[x][y].contents !== null) {
			this.topLeftPieces++;	
		}
	}
	
	//bottom-left and top-right
	this.bottomLeftPieces++;
	x = this.x;
	y = this.y;
	while (x < columns - 1 && y > 0) {
		x++;
		y--;
		if (grid[x][y].contents !== null) {
			this.bottomLeftPieces++;	
		}
	}
	
	x = this.x;
	y = this.y;
	while (x > 0 && y < rows - 1) {
		x--;
		y++;
		if (grid[x][y].contents !== null) {
			this.bottomLeftPieces++;	
		}
	}	
	x = this.x;
	y = this.y;
	
	//check east
	checkX = x + this.horizontalPieces;
	if (checkX < columns) {
		if (grid[checkX][y].contents !== null) {
			if (grid[checkX][y].contents.compare(this) == false) {
				this.moveE = true;	
			}
		} else {
			this.moveE = true;	
		}
	}
	if (this.moveE == true) {
		checkX = x;
		for (i = 0; i < this.horizontalPieces; i++) {
			checkX++;
			if (grid[checkX][y].contents !== null) {
				if (grid[checkX][y].contents.compare(this) == false) {
					if (i != this.horizontalPieces - 1) {
						this.moveE = false;
					}
				}
			}
		}
	}
	//check west
	checkX = x - this.horizontalPieces;
	if (checkX >= 0) {
		if (grid[checkX][y].contents !== null) {
			if (grid[checkX][y].contents.compare(this) == false) {
				this.moveW = true;	
			}
		} else {
			this.moveW = true;	
		}
	}
	if (this.moveW == true) {
		checkX = x;
		for (i = 0; i < this.horizontalPieces; i++) {
			checkX--;
			if (grid[checkX][y].contents !== null) {
				if (grid[checkX][y].contents.compare(this) == false) {
					if (i != this.horizontalPieces - 1) {
						this.moveW = false;
					}
				}
			}
		}
	}
	//check south
	checkY = y + this.verticalPieces;
	if (checkY < rows) {
		if (grid[x][checkY].contents !== null) {
			if (grid[x][checkY].contents.compare(this) == false) {
				this.moveS = true;	
			}
		} else {
			this.moveS = true;	
		}
	}
	if (this.moveS == true) {
		checkY = y;
		for (i = 0; i < this.verticalPieces; i++) {
			checkY++;
			if (grid[x][checkY].contents !== null) {
				if (grid[x][checkY].contents.compare(this) == false) {
					if (i != this.verticalPieces - 1) {
						this.moveS = false;
					}
				}
			}
		}
	}
	//check north
	checkY = y - this.verticalPieces;
	if (checkY >= 0) {
		if (grid[x][checkY].contents !== null) {
			if (grid[x][checkY].contents.compare(this) == false) {
				this.moveN = true;	
			}
		} else {
			this.moveN = true;	
		}
	}
	if (this.moveN == true) {
		checkY = y;
		for (i = 0; i < this.verticalPieces; i++) {
			checkY--;
			if (grid[x][checkY].contents !== null) {
				if (grid[x][checkY].contents.compare(this) == false) {
					if (i != this.verticalPieces - 1) {
						this.moveN = false;
					}
				}
			}
		}
	}
	//check northeast
	checkY = y - this.bottomLeftPieces;
	checkX = x + this.bottomLeftPieces;
	if (checkX < columns && checkY >= 0) {
		if (grid[checkX][checkY].contents !== null) {
			if (grid[checkX][checkY].contents.compare(this) == false) {
				this.moveNE = true;	
			}
		} else {
			this.moveNE = true;	
		}
	}
	if (this.moveNE == true) {
		checkX = x;
		checkY = y;
		for (i = 0; i < this.bottomLeftPieces; i++) {
			checkX++;
			checkY--;
			if (grid[checkX][checkY].contents !== null) {
				if (grid[checkX][checkY].contents.compare(this) == false) {
					if (i != this.bottomLeftPieces - 1) {
						this.moveNE = false;
					}
				}
			}
		}
	}
	//check southwest
	checkY = y + this.bottomLeftPieces;
	checkX = x - this.bottomLeftPieces;
	if (checkX >= 0 && checkY < columns) {
		if (grid[checkX][checkY].contents !== null) {
			if (grid[checkX][checkY].contents.compare(this) == false) {
				this.moveSW = true;	
			}
		} else {
			this.moveSW = true;	
		}
	}
	if (this.moveSW == true) {
		checkX = x;
		checkY = y;
		for (i = 0; i < this.bottomLeftPieces; i++) {
			checkX--;
			checkY++;
			if (grid[checkX][checkY].contents !== null) {
				if (grid[checkX][checkY].contents.compare(this) == false) {
					if (i != this.bottomLeftPieces - 1) {
						this.moveSW = false;
					}
				}
			}
		}
	}
	//check northwest
	checkY = y - this.topLeftPieces;
	checkX = x - this.topLeftPieces;
	if (checkX >= 0 && checkY >= 0) {
		if (grid[checkX][checkY].contents !== null) {
			if (grid[checkX][checkY].contents.compare(this) == false) {
				this.moveNW = true;	
			}
		} else {
			this.moveNW = true;	
		}
	}
	if (this.moveNW == true) {
		checkX = x;
		checkY = y;
		for (i = 0; i < this.topLeftPieces; i++) {
			checkX--;
			checkY--;
			if (grid[checkX][checkY].contents !== null) {
				if (grid[checkX][checkY].contents.compare(this) == false) {
					if (i != this.topLeftPieces - 1) {
						this.moveNW = false;
					}
				}
			}
		}
	}	
	//check southeast
	checkY = y + this.topLeftPieces;
	checkX = x + this.topLeftPieces;
	if (checkX < columns && checkY < rows) {
		if (grid[checkX][checkY].contents !== null) {
			if (grid[checkX][checkY].contents.compare(this) == false) {
				this.moveSE = true;	
			}
		} else {
			this.moveSE = true;	
		}
	}
	if (this.moveSE == true) {
		checkX = x;
		checkY = y;
		for (i = 0; i < this.topLeftPieces; i++) {
			checkX++;
			checkY++;
			if (grid[checkX][checkY].contents !== null) {
				if (grid[checkX][checkY].contents.compare(this) == false) {
					if (i != this.topLeftPieces - 1) {
						this.moveSE = false
					}
				}
			}
		}
	}
	
	if (this.moveE == true) {
		this.validMoves.push(new coordinate(x + this.horizontalPieces, y));
	}
	if (this.moveW == true) {
		this.validMoves.push(new coordinate(x - this.horizontalPieces, y));	
	}
	if (this.moveS == true) {
		this.validMoves.push(new coordinate(x, y + this.verticalPieces));
	}
	if (this.moveN == true) {
		this.validMoves.push(new coordinate(x, y - this.verticalPieces));
	}
	if (this.moveNE == true) {
		this.validMoves.push(new coordinate(x + this.bottomLeftPieces, y - this.bottomLeftPieces));
	}
	if (this.moveSW == true) {
		this.validMoves.push(new coordinate(x - this.bottomLeftPieces, y + this.bottomLeftPieces));
	}
	if (this.moveNW == true) {
		this.validMoves.push(new coordinate(x - this.topLeftPieces, y - this.topLeftPieces));
	}
	if (this.moveSE == true) {
		this.validMoves.push(new coordinate(x + this.topLeftPieces, y + this.topLeftPieces));
	}
}
/*
A group of pieces
*/
function group() {
	this.pieces = new Array();	
}
/*
Generic coordinate object
*/
function coordinate(x, y) {
	this.x = x;
	this.y = y;
}
/*
Configuration for the game.  Always a singleton.  Anything that could be considered a 'preference' goes here
*/
function config() {
	this.offsetX = 0;
	this.offsetY = 0;
	this.columns = 8;
	this.rows = 8;
	this.gridHeight = 48;
	this.gridWidth = 48;
	this.gridBorderColor = "#000000";
	this.gridBackgroundColor = "#FFFFDD";
	this.lightPieceFill = "#FFFFFF";
	this.lightPieceHighlightFill = "#FF4444";
	this.lightPieceBorder = "#000000";
	this.darkPieceFill = "#000000";	
	this.darkPieceHighlightFill = "#FF4444";
	this.darkPieceBorder = "#FFFFFF";
	this.candidateMoveColor = "#000088";
}
