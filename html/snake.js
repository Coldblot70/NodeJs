var socket = io();

let name;
name=prompt("Enter your name");

let user = document.getElementById("user");
let opponent = document.getElementById("opponent");

let enter = document.getElementById("enter");

enter.addEventListener('click', () => {
   
    socket.emit("allPlayer", { name: name, });
    enter.disabled = true;
});
let scoreToCarry=0;
let foundPlayer;
let oppPlayer;

var score = document.getElementById("userScore");
var oppScore = document.getElementById("opponentScore");
var fruit = document.getElementById("fruits");

var message = document.querySelector('.message');
var userMessage = document.querySelector('.user_message');
var sendButton = document.querySelector('#send');
var body = document.querySelector('.body');
var textMessage = document.querySelector('.textMessage');
var chatButton = document.querySelector('#chatButton');
var activeElement = document.activeElement;

socket.on("sendMessage", (msg) => {
 
    var createP = document.createElement('p');
    let p = body.appendChild(createP);
    p.classList.add('message');
    createP.innerText = msg.message;
    console.log(msg.message);
});
textMessage.addEventListener('focus', () => {

    document.addEventListener('keyup', (e) => {
        if (e.key == 'Enter') {
            var createP = document.createElement('p');
            let p = body.appendChild(createP);
            p.classList.add('user_message');
            createP.innerText = textMessage.value;
            
            socket.emit("message", { message: textMessage.value });
            textMessage.value = '';
        }
    });
});
sendButton.addEventListener('click', (e) => {
    var createP = document.createElement('p');
    let p = body.appendChild(createP);
    p.classList.add('user_message');
    createP.innerText = textMessage.value;
    socket.emit("message", { message: textMessage.value });
    textMessage.value = '';
});

socket.on("playersComplete", (allPlayers) => {
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("waiting").style.display = "none";
    foundPlayer = allPlayers.players.find(obj => obj == name);
    oppPlayer = allPlayers.players.find(obj => obj != name);
    chatButton.style.display = 'block';
    user.innerText = foundPlayer;
    opponent.innerText = oppPlayer;
});




socket.on("userScore", (score) => {
    oppScore.innerText = score.userScore;
});



//Initiliaze the values
var blockSize = 25;
var row = 20;
var column = 20;
var board;
var context;
var images = [['Images/1.png', 5], ['Images/2.png', 3], ['Images/3.png', 2]];
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var foodX = blockSize * 10;
var foodY = blockSize * 10;
var fruitX = blockSize * 10;
var fruitY = blockSize * 10;

let randomFruit;
var velocityX = 0;
var velocityY = 0;

let scoreNum = 0;
var snakeBody = []
let difficulty = 25;
var answer = '';

let appearFruit;
while (answer != 'E' || answer != 'M'|| answer!='H') {
    answer = prompt("Write E for easy and M for Medium and H for Hard");
    switch (answer) {
        case 'E':
            difficulty=500;
            break;
        case 'M':
            difficulty=80;
            break;
        case 'H':
            difficulty=60;
            break;
    }
 
    if (answer == 'E' || answer == 'M' || answer == 'H')
        break;
}
let intervalFruits;
//when the page first load or when you refresh it
window.onload = () => {
    board = document.getElementById("board");
    board.width = row * blockSize;
    board.height = column * blockSize;
    context = board.getContext("2d");
    placeFoodRandomly();
    placeFruitRandomly();
    document.addEventListener('keyup', changeDirection);
    setInterval(update, difficulty);
    AppearFruit();
};

function update() {
    //to make the canvas styling
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    //to make the food styling
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX > (blockSize * 25) || snakeX < 0 || snakeY > (blockSize * 25) || snakeY < 0) {
        alert("Game over!");
        location.reload();
    }
    for (var i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] &&
            snakeY == snakeBody[i][1]) {
                alert("Game Over!");
            location.reload();
        }
    }
    if (appearFruit) {
        AppearFruit();
        setTimeout(fruitAppearStop,Math.random()*(5000-3000)+3000);
    }
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFoodRandomly();
        scoreIncrease(1);
    }
    if (snakeX == fruitX && snakeY == fruitY) {
        placeFruitRandomly();
        snakeBody.push([fruitX, fruitY]);
        appearFruit = false;
        scoreIncrease(images[randomFruit][1]);
    }
   
    for (var i = snakeBody.length - 1; i>0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    //to make snake head styling
    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (var i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
}
function scoreIncrease(increaseWith) {
    if (scoreNum != 0 && scoreNum % 10 == 0)
        appearFruit = true;
    scoreNum = scoreNum+increaseWith;
    score.innerHTML = scoreNum;
    scoreToCarry = scoreNum;
    socket.emit("userScore", { score: scoreNum });
}
function changeDirection(e) {

    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}
function fruitAppearStop() {
    appearFruit = false;
}
function AppearFruit() {
    fruit.setAttribute('src', `${images[randomFruit][0]}`);
    context.drawImage(fruit, fruitX, fruitY, 30, 30);
}
function placeFoodRandomly() {
    //To get the random x and ybetween 25 to 500 
    foodX = Math.floor(Math.random() * row) * blockSize;
    foodY = Math.floor(Math.random() * column) * blockSize;
}
function placeFruitRandomly() {
    randomFruit = Math.floor(Math.random() * images.length);
    let randomX = Math.floor(Math.random() * row) * blockSize;
    let randomY = Math.floor(Math.random() * column) * blockSize;
    //To get the random x and ybetween 25 to 500
    if (fruitX == foodX && fruitY == foodY) {
        randomX = Math.floor(Math.random() * row) * blockSize;
        randomY = Math.floor(Math.random() * column) * blockSize;
    }
    fruitX = randomX;
    fruitY = randomY;
}