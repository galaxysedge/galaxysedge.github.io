// Create the canvas
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

// mouse image
var mouseReady = false;
var mouseImage = new Image();
mouseImage.onload = function () {
	mouseReady = true;
};
mouseImage.src = "images/mouse.png";

// Game objects
var cat = {
	speed: 256 // movement in pixels per second
};
var mouse = {};
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
var reset = function () {
	//cat.x = canvas.width / 2;
	//cat.y = canvas.height / 2;

	// Throw the mouse somewhere on the screen randomly
	mouse.x = 32 + (Math.random() * (canvas.width - 64));
	mouse.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		cat.y -= cat.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		cat.y += cat.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		cat.x -= cat.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		cat.x += cat.speed * modifier;
	}

	// Are they touching?
	if (
		cat.x <= (mouse.x + 32)
		&& mouse.x <= (cat.x + 32)
		&& cat.y <= (mouse.y + 32)
		&& mouse.y <= (cat.y + 32)
	) {
		++miceCaught;
		reset();
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
		ctx.drawImage(mouseImage, mouse.x, mouse.y);
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
reset();
cat.x = canvas.width / 2;
cat.y = canvas.height / 2;
main();
