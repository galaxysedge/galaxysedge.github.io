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
	}
}, false);

addEventListener("keyup", function (e) {
	if (e.keyCode in mov) {
		eventQ.push(-e.keyCode);
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
		if( keyCode in mov ) {
			if( e>0 ) {
				hero.speedx = hero.speed*mov[keyCode][0];
				hero.speedy = hero.speed*mov[keyCode][1];
			} else if (e<0) {
				if ((keyCode == 37 || keyCode == 39) && hero.speedx != 0) { // left/right
					hero.targetx = Math.floor(hero.x)+(dirx+1)/2;
					if (hero.targetx < 0) {hero.targetx = 0;}
					else if (hero.targetx >= canvas.x) {hero.targetx = canvas.x-1;}
				}				
				if ((keyCode == 38 || keyCode == 40) && hero.speedy != 0) { // up/down
					hero.targety = Math.floor(hero.y)+(diry+1)/2;
					if (hero.targety < 0) {hero.targety = 0;}
					else if (hero.targety >= canvas.y) {hero.targety = canvas.y-1;}
				}
			}
			eventQ.shift();
		}
	};		 
	hero.x += hero.speedx*modifier;
	if (hero.x < 0) {hero.x = 0; hero.speedx = 0;}
	else if (hero.x > canvas.x-1) {hero.x = canvas.x-1; hero.speedx = 0;}

	hero.y += hero.speedy*modifier;
	if (hero.y < 0) {hero.y = 0; hero.speedy = 0;}
	else if (hero.y > canvas.y-1) {hero.y = canvas.y-1; hero.speedy = 0;}
	
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
		// Have we caught it?
    if (
		hero.x == monster.x && (monster.y-oldy)*(hero.y-monster.y) >= 0 ||
		hero.y == monster.y && (monster.x-oldx)*(hero.x-monster.x) >= 0 )	
    {
        ++monstersCaught;
        reset();
    }
	console.log(hero.x,hero.y,oldx,oldy);
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
