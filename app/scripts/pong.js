var animate = window.requestAnimationFrame ||
  	window.webkitRequestAnimationFrame ||
  	window.mozRequestAnimationFrame ||
  	function(callback) {window.setTimeout(callback, 1000/60)};

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var width = 750;
var height = 500;
canvas.width = width;
canvas.height = height;

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 400);

window.onload = function() {
	animate(step);
};

function render() {
	drawTable();
	drawNet();
	player.render();
	computer.render();
	ball.render();
};

function step() {
	update();
	render();
	animate(step);
};

function update() {
	player.update();
}

function drawTable() {
	context.fillStyle = "#000";
	context.fillRect(0.5, 0.5, width, height);
};

function drawNet(width, height) {
	context.beginPath();
	context.setLineDash([10, 20])
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.strokeStyle = "#FFF";
	context.lineWidth = 10;
	context.stroke();
}

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = 15;
	this.height = 100;
	this.y_speed = 10;
	this.boundary = {
		top: this.y,
		bottom: this.y + this.height,
		right: this.x + this.width,
		left: this.x
	};
}

Paddle.prototype.render = function() {
  	context.fillStyle = "#FFF";
	context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
	this.x += x;
	this.y += y;
	this.y_speed = y;
	this.boundary.top += y;
	this.boundary.bottom += y;
	if(this.y < 0) {
    	this.y = 0;
    	this.y_speed = 0;
  	} else if (this.y + this.width > 400) {
    	this.y = 400 - this.width;
    	this.y_speed = 0;
  	}
};

function Player() {
	this.paddle = new Paddle(10, 200);
}

Player.prototype.update = function () {
	for (var key in keyState) {
		var val = Number(key);
		if (val === 38) {
			if (this.paddle.y >= 20) {
				this.paddle.move(0, -5);
			}
		}
		if (val === 40) {
			if ((this.paddle.y + this.paddle.height) <= 550) {
				this.paddle.move(0, 5);
			}
		}
	}
};

Player.prototype.render = function() {
	this.paddle.render();
};

function Computer() {
	this.paddle = new Paddle(725, 200);
}

Computer.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.move = function (yDist) {
	this.paddle.y += yDist;
	this.paddle.boundary.top += yDist;
	this.paddle.boundary.bottom += yDist;
	this.paddle.y_speed += yDist;
};

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.radius = 15;
}

Ball.prototype.render = function() {
  	context.beginPath();
  	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  	context.fillStyle = "#FFF";
  	context.fill();
};

var keyState = {};

window.addEventListener("keydown", function(event) {
	console.log(event);
  	keyState[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  	delete keyState[event.keyCode];
});