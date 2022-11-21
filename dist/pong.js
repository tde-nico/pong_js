"use strict";
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FPS = 60;
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 100;
        this.top = 0;
        this.bottom = 0;
        this.right = 0;
        this.left = 0;
        this.score = 0;
        this.color = "white";
    }
}
class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.top = 0;
        this.bottom = 0;
        this.right = 0;
        this.left = 0;
        this.velocityX = 5;
        this.velocityY = 5;
        this.speed = 7;
        this.color = "white";
    }
    reset() {
        ball.x = WIDTH / 2;
        ball.y = HEIGHT / 2;
        ball.velocityX = -ball.velocityX;
        ball.speed = 7;
    }
}
const net = {
    x: WIDTH / 2 - 2 / 2,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
};
const player = new Player(0, (HEIGHT - 100) / 2);
const opponent = new Player(WIDTH - 10, (HEIGHT - 100) / 2);
const ball = new Ball(WIDTH / 2, HEIGHT / 2, 10);
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}
function drawNet() {
    for (let i = 0; i <= HEIGHT; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}
let rectX = 0;
function render() {
    drawRect(0, 0, WIDTH, HEIGHT, "black");
    drawText(player.score.toString(), WIDTH / 4, HEIGHT / 5, player.color);
    drawText(opponent.score.toString(), 3 * WIDTH / 4, HEIGHT / 5, opponent.color);
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
function collision_check(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    return (p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top);
}
function update() {
    if (ball.x - ball.radius < 0) {
        opponent.score++;
        ball.reset();
    }
    else if (ball.x + ball.radius > WIDTH) {
        player.score++;
        ball.reset();
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    // opponent movement
    opponent.y += (ball.y - (opponent.y + opponent.height / 2)) * 0.1;
    if ((ball.y - ball.radius) < 0 || (ball.y + ball.radius) > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }
    let p = (ball.x + ball.radius < WIDTH / 2) ? player : opponent;
    if (collision_check(ball, p)) {
        let point = (ball.y - (p.y + p.height / 2));
        point /= (HEIGHT / 2);
        let angle = Math.PI * point;
        let direction = (ball.x + ball.radius < WIDTH / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += 0.1;
    }
}
function game() {
    update();
    render();
}
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    player.y = event.clientY - rect.top - player.height / 2;
}
canvas.addEventListener("mousemove", getMousePos);
let loop = setInterval(game, 1000 / FPS);
