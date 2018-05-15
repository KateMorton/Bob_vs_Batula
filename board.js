var dict = {
    0: "grass",
    1: "stone",
    2: "weapon1",
    3: "weapon2",
    4: "weapon3",
    5: "weapon4",
    6: "weapon5",
    10: "player1",
    11: "player2",
    12: "tree" 
};

var Board = function(size){
    this.size = size;
    this.map = [];
    this.WEAPON1 = 2;
    this.WEAPON2 = 3;
    this.WEAPON3 = 4;
    this.WEAPON4 = 5;
    this.WEAPON5 = 6;
    this.weapon1 = new Weapon(this.WEAPON1, "Slime", 30);
    this.weapon2 = new Weapon(this.WEAPON2, "Fire", 25);
    this.weapon3 = new Weapon(this.WEAPON3, "Ice", 20);
    this.weapon4 = new Weapon(this.WEAPON4, "Arrow", 10);
    this.weapon5 = new Weapon(this.WEAPON5, "Sword", 10);
    this.weapons = [this.WEAPON1, this.WEAPON2, this.WEAPON3];
    this.weapons_dict = {
        2 : this.weapon1,
        3 : this.weapon2,
        4 : this.weapon3,
        5 : this.weapon4,
        6 : this.weapon5
    };
    this.PLAYER1 = 10;
    this.PLAYER2 = 11;
    this.player1  = new Player(this.PLAYER1, "Bob", 100);
    this.player2 = new Player(this.PLAYER2, "Batula", 100);
    this.player1.weapon = this.weapon4;
    this.player2.weapon = this.weapon5;
    this.GRASS = 0;
    this.STONE = 1;
    this.TREE = 12;
    this.OBSTICLE = .10;
    this.start = function() {
        this.generateGrass();
        this.generateObsticles();
        this.generateWeapons();
        this.generatePlayers();
    };
    this.generateGrass = function(){
        for (var i = 0; i < this.size; i++) {
            this.map.push([]);
            for (var p = 0; p < this.size; p++) {
             this.map[i].push(this.GRASS);
             }          
      }
    };
    this.generateObsticles = function(){
          var obsticles = Math.ceil(this.size * this.size * this.OBSTICLE);
          var l = 0;
          var s = this.STONE;
          while (l < obsticles) {
            var coordinates = this.generateXY(0, this.size);
            var spaceFree = (this.map[coordinates["X"]][coordinates["Y"]] === this.GRASS);
            if (spaceFree) {
                if(s == this.STONE){
                    this.map[coordinates["X"]][coordinates["Y"]] = this.STONE; 
                    s = this.TREE;
                    l++;                
                } else {
                    this.map[coordinates["X"]][coordinates["Y"]] = this.TREE;
                    s = this.STONE;
                    l++
                }  
            }
        }
    };
    this.generateWeapons = function(){
        var w = 0;
        while (w < this.weapons.length) {
            var coordinates = this.generateXY(0, this.size);
            var spaceFree = (this.map[coordinates["X"]][coordinates["Y"]] === this.GRASS);
            if (spaceFree) {
                this.map[coordinates["X"]][coordinates["Y"]] = this.weapons[w]; 
                w++;
            }            
        }
    };
    this.generatePlayers = function(){
        var p = 0;
        while(p < 1) {
            var player1XY = this.generateXY(0, Math.floor(this.size/2));
            var spaceFree = (this.map[player1XY["X"]][player1XY["Y"]] === this.GRASS);
            if (spaceFree) {
            this.map[player1XY["X"]][player1XY["Y"]] = this.PLAYER1;
            this.player1.setPosition(player1XY["X"], player1XY["Y"]);
            p++;
            }
        }
        
        p = 0;
        while(p < 1){
            var player2XY = this.generateXY(Math.ceil(this.size/2), this.size-1);
            var spaceFree = (this.map[player2XY["X"]][player2XY["Y"]] === this.GRASS);
            if (spaceFree) {
                this.map[player2XY["X"]][player2XY["Y"]] = this.PLAYER2; 
                this.player2.setPosition(player2XY["X"], player2XY["Y"]);
                p++;
            }
        }
    };
    this.generateXY = function(lower_limit, upper_limit){
        var x = Math.floor((Math.random() * (upper_limit - lower_limit)) + lower_limit);
        var y = Math.floor((Math.random() * (upper_limit - lower_limit)) + lower_limit);
        return {"X" : x, "Y" : y};
    };
    this.hasPlayer= function(x,y){
        if(x >= 0 && x < this.size && y >= 0 && y < this.size) {
            if(this.map[x][y] == this.PLAYER1 || this.map[x][y] == this.PLAYER2){
                return true;
            }            
        }
        return false;
    };
    this.checkAttackCondition = function(x,y){
        if(this.hasPlayer(x-1,y) || this.hasPlayer(x+1,y) || this.hasPlayer(x , y - 1) || this.hasPlayer(x, y + 1)) {
           return true;
        }
        return false;
    }
};

var Display = function() {
    this.field = $("#field");
    this.init = function(boardSize){
        this.setSize(boardSize);
    };
    this.setSize = function(boardSize){
        var width, height;
            if (boardSize === 10) {
                width = "70px";
                height = "70px";
            } else if (boardSize === 7) {
                width = "80px";
                height = "80px";
            } else {
                boardSize = 5;
                width = "100px";
                height = "100px";
            }
        document.documentElement.style.setProperty("--grid-size", boardSize);
        document.documentElement.style.setProperty("--grid-width", width);
        document.documentElement.style.setProperty("--grid-height", height);
    };
    this.draw = function (board) {
        this.field.empty();
        for(var i = 0; i < board.map.length; i++){
            for(var j = 0; j < board.map.length; j++){
               var div = $("<div>", {"class": dict[board.map[i][j]]});
               this.field.append(div);
            }
        }
    };
};

var Dashboard = function(board){
    this.generate = function(){
        var dash_dict = {
            0 : "Name: " + board.player1.name,
            1 : "Weapon: " + board.player1.weapon.name, 
            2 : "Damage: " + board.player1.weapon.damage,
            3 : "Health: " + board.player1.health,
            4 : "Name: " + board.player2.name,
            5 : "Weapon: " + board.player2.weapon.name,
            6 : "Damage: " + board.player2.weapon.damage,
            7 : "Health: " + board.player2.health
        };
        
       this.generateDash(dash_dict);
    };
    this.generateDash = function(dictionary){
        var el = $("li");
        el.empty();
        for(var i = 0; i < el.length; i++){
            el[i].append(dictionary[i]);
        }        
    }
    this.updateMessage = function(message){
        var text = message;
        var el = $("#message");
        el.empty().append("<p>" + text + "</p>");
    };
};

var Weapon = function(id, name, damage){
    this.id = id;
    this.name = name;
    this.damage = damage;
};

var Player = function(id, name, health){
    this.id = id;
    this.name = name;
    this.health = health;
    this.weapon;
    this.x;
    this.y;
    this.setPosition = function(x,y){
        this.x = x;
        this.y = y;
    };    
};

var Game = function(size){
    this.boardSize = size;
    this.goes = 0;
    this.max_goes = 3;
    this.min_goes = 0;
    this.board = new Board(this.boardSize);
    this.display = new Display();
    this.dashboard = new Dashboard(this.board);
    this.currentPlayer = this.board.player1;
    this.opponent = this.board.player2;
    this.currFightMode;
    this.oppFightMode;
    this.start = function(){
        document.addEventListener("keydown", this.keyHandler);
        $("#game-start").css("display", "none");
        this.board.start();
        this.display.init(this.boardSize);
        this.display.draw(this.board); 
        this.dashboard.generate();
        this.welcomeMessage();
    };
    this.keyHandler = function(event){
        event.preventDefault();
        switch(event.key){
            case "ArrowLeft" :
                game.move("left");
                break;
            case "ArrowRight" :
                game.move("right");
                break;
            case "ArrowUp" :
                game.move("up");
                break;
            case "ArrowDown" :
                game.move("down");
                break; 
            case "Enter" :
                game.move("enter");
                break;
            default:
                //do nothing            
        }        
    };
    this.move = function(direction){
        var newX;
        var newY;
        var oldX = this.currentPlayer.x;
        var oldY = this.currentPlayer.y;
              
        switch(direction){
            case 'left' :
                newY = oldY - 1;
                newX = oldX;
                break;
            case 'right' :
                newY = oldY + 1;
                newX = oldX;
                break;
            case 'up' :
                newX = oldX - 1;
                newY = oldY;
                break;
            case 'down' :
                newX = oldX + 1;
                newY = oldY;
                break;
            case 'enter':
                this.endMove();
                newX = oldX;
                newY = oldY;
                break;
            default:
                //do nothing
        }
               
        this.movePlayer(oldX, oldY, newX, newY);
    };
    this.movePlayer = function(oldX, oldY, newX, newY){
        var attack = false;
        var moved = false;
        if(newX >= 0 && newX < this.boardSize && newY >= 0 && newY < this.boardSize) {
           var newPosVal = this.board.map[newX][newY];  
           if (newPosVal === this.board.GRASS){
                this.board.map[oldX][oldY] = this.board.GRASS;
                this.board.map[newX][newY] = this.currentPlayer.id;
                this.currentPlayer.setPosition(newX, newY);
                attack = this.board.checkAttackCondition(newX, newY);
                moved = true;
                
            } else if (newPosVal >= this.board.WEAPON1 && newPosVal <= this.board.WEAPON5) {
                this.board.map[oldX][oldY] = this.currentPlayer.weapon.id;
                this.currentPlayer.weapon = this.board.weapons_dict[newPosVal];
                this.board.map[newX][newY] = this.currentPlayer.id;
                this.currentPlayer.setPosition(newX, newY);
                attack = this.board.checkAttackCondition(newX, newY);
                moved = true;
            } 
             if(attack){
                document.removeEventListener("keydown", this.keyHandler);
                this.goes--;
                this.initiateAttack();
             }
            
            if(moved){
                this.countMoves();
            }
        }
        
       
        this.display.draw(this.board);
        this.dashboard.generate();
    };
    this.countMoves = function(){
        this.goes++;
        if(this.goes >= this.max_goes){
           this.endMove();
        }
    };
    this.endMove = function() {
            this.goes = this.min_goes;
            if(this.currentPlayer.id === this.board.player1.id) {
                this.currentPlayer = this.board.player2;
                this.opponent = this.board.player1;
            } else {
                this.currentPlayer = this.board.player1;
                this.opponent = this.board.player2;
            }         
        
        var text = this.currentPlayer.name + "'s move!";
        this.dashboard.updateMessage(text); 
     };
    this.welcomeMessage = function(){
        var text = "Welcome to the game! " + " Use arrow keys to move, " + this.board.player1.name + " moves first!";
        this.dashboard.updateMessage(text);
    }; 
    this.initiateAttack = function(){
        this.currentModal();         
    };
    this.fight = function(){
        var currFight = this.currFightMode;
        var oppFight = this.oppFightMode;
        var current = this.currentPlayer;
        var opponent = this.opponent;
        if (currFight === "attack" && oppFight === "attack"){
            opponent.health = opponent.health - current.weapon.damage;
            current.health = current.health - opponent.weapon.damage;
            var text = current.name + " and " + opponent.name + " have both attacked! " +
            current.name + " now has " + current.health + " health points. " + opponent.name + " now has "
            + opponent.health + " health points.";
            this.dead();
            this.dashboard.updateMessage(text);
            this.dashboard.generate();
        } else if (currFight === "attack" && oppFight === "defend"){
            opponent.health = opponent.health - current.weapon.damage / 2;
            text = current.name + " has attacked " + opponent.name + " and " + opponent.name +
            " has defended. " + opponent.name + " now has " + opponent.health + " health points.";
            this.dead();
            this.dashboard.updateMessage(text);
            this.dashboard.generate();
        } else if (currFight === "defend" && oppFight === "attack") {
            current.health = current.health - opponent.weapon.damage / 2;
             text = opponent.name + " has attacked " + current.name + " and " + current.name +
            " has defended. " + current.name + " now has " + current.health + " health points.";
            this.dead();
            this.dashboard.updateMessage(text);
            this.dashboard.generate();
        } else {
            text = current.name + " and " + opponent.name + " have do not want to fight! " +
            current.name + " still has " + current.health + " health. " + opponent.name + " still has "
            + opponent.health + " health points.";
            this.dead();
            this.dashboard.updateMessage(text);
            this.dashboard.generate();
        }
        
        if(current.health === "dead" || opponent.health === "dead"){
            $(".game-over-modal").css("display", "block");
            if (current.health === "dead" && opponent.health === "dead") {
               $(".winner, .is-winner").css("display", "none");
               $(".modal-content .no-winner").css("display", "block");               
            } else if (current.health === "dead") {
                var winner = opponent.name;
                var looser = current.name;
                this.gameOverModal(winner, looser);
            } else if (opponent.health === "dead") {
                looser = opponent.name;
                winner = current.name;
                this.gameOverModal(winner, looser);
           }
        }
        
        document.addEventListener("keydown", this.keyHandler);
    };
    this.attackCurr = function(){
        this.currFightMode = "attack";
        this.oppModal();
    };
    this.defendCurr = function(){
        this.currFightMode = "defend";
        this.oppModal();
    };
    this.attackOpp = function(){
        this.oppFightMode = "attack";
        $(".modal-opp").css("display", "none");
        this.fight();
    };
    this.defendOpp = function(){
        this.oppFightMode = "defend";
        $(".modal-opp").css("display", "none");
        this.fight();
    };
    this.currentModal = function(){
        $(".player").empty().append(this.currentPlayer.name);
        $(".modal-current").css("display", "block");
    };
    this.oppModal = function(){
        $(".modal-current").css("display", "none");
        $(".player").empty().append(this.opponent.name);
        $(".modal-opp").css("display", "block");
    };
    this.dead = function(){
        if(this.currentPlayer.health <= 0) {
            this.currentPlayer.health = "dead";
        }
         if(this.opponent.health <= 0) {
            this.opponent.health = "dead";
        }
    }
    this.gameOverModal = function(winner, looser){
        $(".winner").empty().append(winner);
        $(".looser").empty().append(looser);
        if(winner == "Bob"){
            $(".winner-img").append('<img src="images/bob.png">');
            $(".looser-img").append('<img src="images/player2_Die.png">');
        } else if (winner == "Batula"){
            $(".winner-img").append('<img src="images/batula.png">');
            $(".looser-img").append('<img src="images/player1_Die.png">');
        }      
    };
};

function playAgain(){
       location.reload();
}

var game = new Game(10);