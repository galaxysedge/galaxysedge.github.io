var canvas = document.createElement("canvas");

var ctx = canvas.getContext("2d");
canvas.x = 16; // number of tiles across
canvas.y = 15; // number of tiles down
canvas.tilesize = 32;
canvas.width = canvas.x*canvas.tilesize;
canvas.height = canvas.y*canvas.tilesize;

document.body.appendChild(canvas);

// background

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {bgReady = true;};
bgImage.src = "images/desert.png";

// hero image

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {heroReady = true;};
heroImage.src = "images/cat.png";

// monster image

var monReady = false;
var monImage = new Image();
monImage.onload = function () {monReady = true;};
monImage.src = "images/mouse.png"

// Game objects

var hero = {
    speed: 8,
	speedx: 0,
	speedy: 0,
    x: Math.round(canvas.x/2),
    y: Math.round(canvas.y/2)
};
var monster = {
    x: 0,
    y: 0
};
var monstersCaught = 0;

// Player input

var eventQ = [];
var keysPressed = {};

addEventListener("keydown", function (e) {
	if (!(e.keyCode in keysPressed)) {
		eventQ.push(e.keyCode);
		keysPressed[e.keyCode] = true;
	}
}, false);

addEventListener("keyup", function (e) {
	eventQ.push(-e.keyCode);
	delete keysPressed[e.keyCode];
}, false);

// New game

var reset = function () {
    monster.x = 1 + Math.round((Math.random() * (canvas.x - 2)));
    monster.y = 1 + Math.round((Math.random() * (canvas.y - 2)))
};

// Update objects

var mov = {
	37: [-1,0], //Left
	38: [0,-1], //Up
	39: [1,0 ], //Right
	40: [0,1 ] //Down
};

var epsilon = 0.00000001;

var update = function (modifier) {
	var oldx = hero.x;
	var oldy = hero.y;
	if (eventQ.length != 0) {
		// Move the hero
		var e = eventQ[0];
		var keyCode = Math.abs(e);
		if( keyCode in mov ) {
			if( e>0 ) {
				hero.speedx = hero.speed*mov[keyCode][0];
			} else {
				
			}
		
		
			// Check if integer boundary has passed

			
			/* 			if (Math.floor(oldx + epsilon*dir[0]).toFixed(0) != Math.floor(hero.x).toFixed(0)) {
			
				if (eventQ.length <= 1 || eventQ[0] != eventQ[1]) {
					hero.x = Math.floor(oldx+(dir[0]+1)/2);
				}
				eventQ.shift();
			}
			else if (Math.floor(oldy + epsilon*dir[1]).toFixed(0) != Math.floor(hero.y).toFixed(0) ) {
				if (eventQ.length <= 1 || eventQ[0] != eventQ[1]) {
					hero.y = Math.floor(oldy + (dir[1]+1)/2);
				}
				eventQ.shift();
			}; */
		}
	};		 
	hero.x += hero.speedx*modifier;
	hero.y += hero.speedy*modifier;
	
		// Are they touching?
    if (
		hero.x == monster.x && hero.y == monster.y
    ) {
        ++monstersCaught;
        reset();
    }
};

// Render objects

var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x*canvas.tilesize, hero.y*canvas.tilesize);
    }
    
    if (monReady) {
        ctx.drawImage(monImage, monster.x*canvas.tilesize, monster.y*canvas.tilesize);
    }
    
    // Score
    ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Mice caught: " + monstersCaught, 32, 32);
}

// Main game loop

var main = function () {
    var now = Date.now();
    var delta = now - then;
    
    update(delta/1000);
    render();
    
    then = now;
    
    requestAnimationFrame(main);
}

// AnimationFrame cross browser
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();

main();
