//to move left, new x = old x -1, where old x is the x of the current player. New y is = old y.

//to move right, new x = old x + 1, where old x is the x of the current player. New y is = old y.
//generate new x and y.
//check if new x and y are with in boundries.
////if it is with boundry, if has grass, then move player to new x and new y. Set old x and old y to grass. re-draw map.
///if new x,y has weapon drop old weapon, pick up new.
//html add new buttons up, down, left right.
//turn switching.

 this.move = function(direction){
        if (direction === "left") {
            this.newY = this.board.player1.y - 1;
            this.newX = this.board.player1.x;
        } else if (direction === "right") {
            this.newY = this.board.player1.y + 1;
            this.newX = this.board.player1.x;
        } else if (direction === "up") {
            this.newX = this.board.player1.x -1;
            this.newY = this.board.player1.y;
        } else {
            this.newX = this.board.player1.x + 1;
            this.newY = this.board.player1.y;
        }
    
        this.movePlayer();
    }
    this.movePlayer = function(){
        var oldY = this.board.player1.y;
        var oldX = this.board.player1.x;
        var oldPosVal = this.board.map[oldX][oldY];
        var newPosVal = this.board.map[this.newX][this.newY];
        var newWeapon;
        if (newPosVal === 0){
            oldPosVal = 0;                    
        } else if (newPosVal === 2) {
              oldPosVal = this.board.player1.weapon;
              this.board.player1.weapon = this.board.weapon1;  
        } else if (newPosVal === 3) {
              oldPosVal = this.board.player1.weapon;
              this.board.player1.weapon = this.board.weapon2;
        } else if (newPosVal === 4) {
              oldPosVal = this.board.player1.weapon;
              this.board.player1.weapon = this.board.weapon3;
        } else if (newPosVal === 5) {
              oldPosVal = this.board.player1.weapon;
              this.board.player1.weapon = this.board.weapon4;
        } else {
              oldPosVal = this.board.player1.weapon;
              this.board.player1.weapon = this.board.weapon5;
        }        
        newPosVal = this.board.player1.id;
        this.board.player1.setPosition(this.newX, this.newY);
        var oldBoard = document.getElementById("field");
        oldBoard.innerHTML = " ";
        this.display.draw(this.board);
    }
    
    
    
    this.currentPlayer = this.board.player1;

    