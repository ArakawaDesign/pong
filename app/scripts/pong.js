var animate = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
};

var canvas = document.getElementById('game-canvas');
var width = 750;
var	height = 500;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var score = {
	human: 0,
	computer: 0
};

var human = new Human();
var computer = new Computer();
var ball = new Ball();

window.onload = function () {
	step();
};

var render = function () {
	paintCanvas();

	drawScore();
	drawNet();
	human.paddle.render();
	computer.paddle.render();
	ball.render();
};

var step = function () {
	update();
	render();
	animate(step);
};

var update = function () {
	ball.update(human, computer);
	human.paddle.update();
	computer.update(ball);
};

function drawScore() {
	console.log("working");
	context.font = "50px Arial";
	context.fillStyle = "#fff";
	context.fillText(score.human, (width / 2) - 50, 50);
	context.fillText(score.computer, (width / 2) + 25 , 50);
}


function paintCanvas() {
	context.fillStyle = "#000";
	context.fillRect(0.5, 0.5, width, height);	
	context.font = "20px Arial";
	context.fillStyle = "#fff";
	context.fillText("PLAYER", 8, 20);
	context.fillText("COMPUTER", 630, 20);
}

function drawNet() {
	context.beginPath();
	context.setLineDash([10, 20])
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.strokeStyle = "#FFF";
	context.lineWidth = 10;
	context.stroke();
}

function Paddle(x, y) {
	this.x = x;
	this.y = y;
	this.color = "#fff";
	this.width = 15;
	this.height = 80;
	this.y_speed = 100;
	this.boundary = {
		top: this.y,
		bottom: this.y + this.height,
		right: this.x + this.width,
		left: this.x
	};
}

function Human() {
	this.paddle = new Paddle(10, 200);
}

function Computer() {
	this.paddle = new Paddle(725, 200);
}

Computer.prototype.move = function (dy) {
	this.paddle.y += dy;
	this.paddle.boundary.top += dy;
	this.paddle.boundary.bottom += dy;
	this.paddle.y_speed += dy;
};

Computer.prototype.update = function (ball) {

	var computer_y = ball.y;

	var diff = -((this.paddle.y + (this.paddle.height * 0.5)) - computer_y);
	if (diff < 0 && diff < -4) { 
		diff = -5;
	} else if (diff > 0 && diff > 4) { 
		diff = 5;
	}
	this.paddle.move(diff*0.85);
	if (this.paddle.y < 0) {
		this.paddle.y = 0;
	} else if (this.paddle.y + this.paddle.height > height) {
		this.paddle.y = (height - this.paddle.height);
	}
};

Paddle.prototype.render = function () {
	context.beginPath();
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (dy) {
	this.y += dy;
	this.boundary.top += dy;
	this.boundary.bottom += dy;
	this.y_speed += dy;
};

Paddle.prototype.update = function () {
	for (var key in keysDown) {
		var val = Number(key);
		if (val === 38) {
			if (human.paddle.y >= 5) {
				human.paddle.move(-15);
			}
		}
		if (val === 40) {
			if ((human.paddle.y + human.paddle.height) <= 495) {
				human.paddle.move(15);
			}
		}
	}
};



function randomVelocity() {
	var num = Math.floor(Math.random() * 5) + 1;
	num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
	return num;
}

function Ball() {
	this.x = width/2;
	this.y = height/2;
	this.color = '#fff';
	this.radius = 10;
	this.speed = 9;

	this.boundary = {
		right: this.x + 10,
		left: this.x - 10,
		top: this.y - 10,
		bottom: this.y + 10
	};

	this.x_speed = this.speed;
	this.y_speed = randomVelocity();
}

Ball.prototype.render = function () {
	context.fillStyle = this.color;
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	context.fill();
};

Ball.prototype.update = function (human, computer) {
	var paddle;
	this.x += this.x_speed;
	this.y += this.y_speed;
	
	if (this.y < 0 || (this.y + this.radius) > height) {
		var reflect;
		if (this.y_speed < 0) {
			reflect = 0 - this.y;
		} else {
			reflect = height - (this.y + this.radius);
		}
		this.y += 2 * reflect;
		this.y_speed = -this.y_speed;
	}

	if (this.x_speed < 0){
		paddle = human.paddle;
	}
	else {
		paddle = computer.paddle;
	}

	if (paddle.x < this.x && paddle.y < this.y && this.x < paddle.x + paddle.width && this.y < paddle.y + paddle.height){

		if (paddle === human.paddle) {
			this.x = human.paddle.x + human.paddle.width;
		} else {
			this.x = computer.paddle.x - this.radius;
		}

		if (paddle === human.paddle){
			this.x_speed = this.speed;
			this.y_speed += (this.speed / 2);
			this.x += this.x_speed;
		}
		else if (paddle === computer.paddle) {
			this.x_speed = this.speed;
			this.y_speed += (this.speed * 2);
			this.x += this.x_speed;
		}	
		
	} else {
		if (paddle === human.paddle){
			if ((this.x) < 0) {
				score.computer ++;
				this.x = width/2;
				this.y = height/2;
				human.paddle.y = 200;
				this.y_speed = randomVelocity();
				if (score.computer === 10){
					document.getElementById('end-game-text').innerHTML = "Sorry, you lost!";
					document.getElementById('end-game').style.visibility = "visible";
					score.human = 0;
				  score.computer = 0;
				}
			}
		}
		else {
			if ((this.x + this.radius) > width){
				score.human ++;
				this.x = width / 2;
				this.y = height / 2;
				human.paddle.y = 200;
				this.y_speed = randomVelocity();
				if (score.human === 10){
					document.getElementById('end-game-text').innerHTML = "Congratulations, you won!";
					document.getElementById('end-game').style.visibility = "visible";
					score.human = 0;
				  score.computer = 0;
				}
			}
		}
	}

	if ((this.x + this.radius) >= computer.paddle.x) {
		if ((this.y - this.radius) < (computer.paddle.y + computer.paddle.height) && (this.y + this.radius) > computer.paddle.y) {
			this.x_speed = -this.speed;
			this.y_speed = (-this.speed);

		}
	}

};

var keysDown = {};

window.addEventListener('keydown', function (event) {
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
	delete keysDown[event.keyCode];
});