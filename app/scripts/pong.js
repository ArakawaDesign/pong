var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var width = 800;
var height = 500;
canvas.width = width;
canvas.height = height;
var ball = new Ball(200, 300);

window.onload = function() {
	document.getElementById("container").appendChild(canvas);
	render();
};

function render() {
	context.strokeStyle = "#FFF";
	context.lineWidth = 15;
	context.strokeRect(0.5, 0.5, width, height);
	net();
	player.render();
	computer.render();
	ball.render();
	console.log(player);
	console.log(computer);
}

//create net line
function net(width, height) {
	context.beginPath();
	context.setLineDash([10, 20])
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.strokeStyle = "#FFF";
	context.lineWidth = 10;
	context.stroke();
}

//create paddles
function Paddle(x, y, width, height) {
	console.log("also working");
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

function Player() {
	console.log("working");
	this.paddle = new Paddle(20, 180, 20, 100);
}

function Computer() {
	this.paddle = new Paddle(760, 180, 20, 100);
}

Paddle.prototype.render = function() {
  context.fillStyle = "#FFF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

Player.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.render = function() {
	this.paddle.render();
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
