// Create the canvas
var howmanymice = 2

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/desert.png";

// cat image
var catReady = false;
var catImage = new Image();
catImage.onload = function () {
	catReady = true;
};
catImage.src = "images/cat.png";

// mouse array
var mice = []
for (var i=0; i < howmanymice; i++) {
	var m = {
	  speed: 256
	};
	mice.push(m)
};

// mouse image
var mouseReady = false;
var mouseImage = new Image();
mouseImage.onload = function () {
	mouseReady = true;
};
mouseImage.src = "images/mouse.png";

// picks a direction
var choose_dir = function (m) {
	m.speedx = Math.random() * 2 - 1;
	m.speedy = Math.random() * 2 - 1;
	}
var time_elapsed = 0;

// Game objects
var cat = {
	speed: 256 // movement in pixels per second
};
//var mouse = {
//  speed: 256
//};
var miceCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a mouse
var reset = function (m) {
	// Throw the mouse somewhere on the screen randomly
	m.x = 32 + (Math.random() * (canvas.width - 64));
	m.y = 32 + (Math.random() * (canvas.height - 64));
};

var full_reset = function () {
	for (i=0; i<howmanymice; i++) {
		reset(mice[i]);
	};
	cat.x = canvas.width / 2;
	cat.y = canvas.height / 2;
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown && cat.y - (cat.speed * modifier) > 0) { // Player holding up
		cat.y -= cat.speed * modifier;
	}
	if (40 in keysDown && cat.y + 32 + (cat.speed * modifier) < canvas.height) { // Player holding down
		cat.y += cat.speed * modifier;
	}
	if (37 in keysDown && cat.x - (cat.speed * modifier) > 0) { // Player holding left
		cat.x -= cat.speed * modifier;
	}
	if (39 in keysDown && cat.x + 32 + (cat.speed * modifier) < canvas.width) { // Player holding right
		cat.x += cat.speed * modifier;
	}

  // moves the mouse
  time_elapsed += modifier;
  if (time_elapsed > 0.5) {
    for (i=0; i<howmanymice; i++) {
			choose_dir(mice[i]);
		}
    time_elapsed = 0;
  }
  //keep within bounds
	for (i=0; i<howmanymice; i++) {
		var mouse = mice[i];
		if (
	   mouse.x + mouse.speedx * modifier * mouse.speed < canvas.width - 32 &&
	   mouse.x + mouse.speedx * modifier * mouse.speed> 0
	   ) {
	     mouse.x += mouse.speedx * modifier * mouse.speed;
	   }
	  if (
	   mouse.y + mouse.speedy * modifier * mouse.speed < canvas.height - 32 &&
	   mouse.y + mouse.speedy * modifier * mouse.speed > 0
	   ) {
	     mouse.y += mouse.speedy * modifier * mouse.speed;
	   }
	};


	// Are they touching?
	for (i=0; i<howmanymice; i++) {
		var mouse = mice[i];
		if (
			cat.x <= (mouse.x + 32)
			&& mouse.x <= (cat.x + 32)
			&& cat.y <= (mouse.y + 32)
			&& mouse.y <= (cat.y + 32)
		) {
			++miceCaught;
			reset(mice[i]);
		}
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (catReady) {
		ctx.drawImage(catImage, cat.x, cat.y);
	}

	if (mouseReady) {
		for (i=0; i<howmanymice; i++) {
			ctx.drawImage(mouseImage, mice[i].x, mice[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Mice caught: " + miceCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
full_reset();
for (i=0; i<howmanymice; i++) {
	choose_dir(mice[i]);
}

main();
