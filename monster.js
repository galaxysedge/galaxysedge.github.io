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
    y: Math.round(canvas.y/2),
	targetx: Math.round(canvas.x/2),
	targety: Math.round(canvas.y/2)
};
var monster = {
    x: 0,
    y: 0
};
var monstersCaught = 0;

// Player input

var eventQ = [];
var keysPressed = {};
var mov = {
	37: [-1,0], //Left
	38: [0,-1], //Up
	39: [1,0 ], //Right
	40: [0,1 ] //Down
};

addEventListener("keydown", function (e) {
	if (Object.keys(keysPressed).length == 0 && e.keyCode in mov) {
		eventQ.push(e.keyCode);
		keysPressed[e.keyCode] = true;
		console.log('Key down: ',e.keyCode);
	}
}, false);

addEventListener("keyup", function (e) {
	if (e.keyCode in mov) {
		eventQ.push(-e.keyCode);
		console.log('Key up: ',e.keyCode);
		delete keysPressed[e.keyCode];
	}
}, false);

// New game

var reset = function () {
    monster.x = 1 + Math.round((Math.random() * (canvas.x - 2)));
    monster.y = 1 + Math.round((Math.random() * (canvas.y - 2)))
};

// Update objects



var epsilon = 0.00000001;

var update = function (modifier) {
	var oldx = hero.x;
	var oldy = hero.y;
	var dirx = hero.speedx/hero.speed;
	var diry = hero.speedy/hero.speed;
	if (eventQ.length != 0) {
		// Move the hero
		var e = eventQ[0];
		var keyCode = Math.abs(e);
		console.log('current queue ',eventQ);
		if( keyCode in mov ) {
			if( e>0 ) {
				hero.speedx = hero.speed*mov[keyCode][0];
				hero.speedy = hero.speed*mov[keyCode][1];
				console.log('key down in update')
			} else if (e<0) {
				if (keyCode == 37 || keyCode == 39) { // left/right
					hero.targetx = Math.floor(hero.x)+(dirx+1)/2;
					//hero.speedx = 0 // ONLY IF IN THE MIDDLE OF A TILE!
				}				
				if (keyCode == 38 || keyCode == 40) { // up/down
					hero.targety = Math.floor(hero.y)+(diry+1)/2;
					//hero.speedy = 0;
					console.log('key up in update u/d')
				}
			}
			eventQ.shift();
		
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
	if (hero.x+hero.speedx*modifier > 0 && hero.x+hero.speedx*modifier < canvas.x-1) {
		hero.x += hero.speedx*modifier;
	}
	if (hero.y+hero.speedy*modifier > 0 && hero.y+hero.speedy*modifier < canvas.y-1) {
		hero.y += hero.speedy*modifier;
	}
	if (Object.keys(keysPressed).length == 0) {
		if ((hero.targetx-hero.x)*dirx<0) {
			hero.speedx = 0;
			hero.x = hero.targetx;
		}
		if ((hero.targety-hero.y)*diry<0) {
			hero.speedy = 0;
			hero.y = hero.targety;
		}
	}
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
