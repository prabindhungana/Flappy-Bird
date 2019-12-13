const BACKGROUNDWIDTH = 288;
const BACKGROUNDHEIGHT = 512;
const BASEHEIGHT = 112;
const BODYHEIGHT = 400;
const PIPE_GAP = 80;
const PIPE_WIDTH = 50;
const MAX_PIPE_HEIGHT = 150;
const MIN_PIPE_HEIGHT = 150;
const BIRD_INITIAL_POSITION = 120;
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 30;
const PIPE_DELAY_SPEED = 120;
const BIRD_RIGHT_POSITION = BACKGROUNDWIDTH - 2 * BIRD_HEIGHT;
const GAME_ANIMATION_FRAME = 24;
const YGRAVITY=0.1
var gravity = 2;
var PIPES = [];
var pipes = 1;
var counter = 0;
var interval = null;
var bird = null;
var score = 0;
var highScore = 0;
function createBackground() {
  that1 = this;
  this.backgroundElem = null;
  this.bodyElem = null;
  this.baseElem = null;
  this.backgroundX = 0;
  this.baseX = 0;
  this.startMessage = null;

  this.init = function() {
    this.backgroundElem = document.createElement("div");
    this.backgroundElem.style.height = BACKGROUNDHEIGHT + "px";
    this.backgroundElem.style.width = BACKGROUNDWIDTH + "px";
    this.backgroundElem.style.margin = "0 auto";
    this.backgroundElem.style.position = "relative";
    this.bodyElem = document.createElement("div");
    this.bodyElem.setAttribute("id", "body-container");
    this.bodyElem.style.height = BODYHEIGHT + "px";
    this.bodyElem.style.width = BACKGROUNDWIDTH + "px";
    this.bodyElem.style.position = "relative";
    this.bodyElem.style.overflow = "hidden";
    this.baseElem = document.createElement("div");
    this.baseElem.setAttribute("id", "base-container");
    this.baseElem.style.height = BASEHEIGHT + "px";
    this.baseElem.style.width = BACKGROUNDWIDTH + "px";
    this.baseElem.style.position = "absolute";
    this.baseElem.style.backgroundPositionX = this.baseX + "px";
    this.startMessage = document.createElement("img");
    this.startMessage.setAttribute("src", "./Images/message.png");
    this.startMessage.style.position = "absolute";
    this.startMessage.style.height = BACKGROUNDHEIGHT + "px";
    this.startMessage.style.width = BACKGROUNDWIDTH + "px";
    this.startMessage.style.top = 0;
    this.startMessage.onclick = function() {
      animate();
      that1.startMessage.style.display = "none";
    };
    this.endMessage = document.createElement("img");
    this.endMessage.setAttribute("src", "./Images/gameover.png");
    this.endMessage.style.position = "absolute";
    this.endMessage.style.width = BACKGROUNDWIDTH + "px";
    this.endMessage.style.top = 50 + "%";
    this.endMessage.style.display = "none";
    this.endMessage.onclick = function() {
      that1.endMessage.style.display = "none";
      document.getElementById("score-board").innerHTML = "Your Score: 0";
      score = 0;
      reset();
    };
    document.body.appendChild(this.backgroundElem);
    this.backgroundElem.appendChild(this.bodyElem);
    this.backgroundElem.appendChild(this.baseElem);
    this.backgroundElem.appendChild(this.startMessage);
    this.backgroundElem.appendChild(this.endMessage);
  };
  this.createScoreboard = function() {
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.setAttribute("id", "score-board");
    this.scoreBoard.style.position = "absolute";
    this.scoreBoard.style.top = 0;
    this.scoreBoard.style.left = 0;
    this.scoreBoard.style.color = "white";
    this.scoreBoard.style.fontSize = 18 + "px";
    this.scoreBoard.innerHTML = "Your Score: " + score;
    this.backgroundElem.appendChild(this.scoreBoard);
    this.highScore = document.createElement("div");
    this.highScore.setAttribute("id", "high-score");
    this.highScore.style.position = "absolute";
    this.highScore.style.right = 0;
    this.highScore.style.top = 0;
    this.highScore.style.color = "white";
    this.highScore.style.fontSize = 18 + "px";
    this.highScore.innerHTML = "High Score: " + highScore;
    this.backgroundElem.appendChild(this.highScore);
  };

  this.moveBase = function() {
    this.baseX -= 2;
  };

  this.updateBase = function() {
    this.baseElem.style.backgroundPositionX = this.baseX + "px";
  };
  return this;
}

function createPipe(body) {
  that2 = this;
  this.body = body;
  this.pipeTop = null;
  this.pipeBottom = null;
  this.scoreBoard = null;
  this.xVelocity = -PIPE_WIDTH;
  this.pipetopHeight = getRandom(MIN_PIPE_HEIGHT, MAX_PIPE_HEIGHT);
  this.pipebottomHeight = BODYHEIGHT - PIPE_GAP - this.pipetopHeight;
  this.init = function() {
    this.pipeTop = document.createElement("img");
    this.pipeTop.setAttribute("src", "./Images/pipe-green.png");
    this.pipeTop.style.position = "absolute";
    this.pipeTop.style.height = this.pipetopHeight + "px";
    this.pipeTop.style.width = PIPE_WIDTH + "px";
    this.pipeTop.style.top = 0;
    this.pipeBottom = document.createElement("img");
    this.pipeBottom.setAttribute("src", "./Images/pipe-green.png");
    this.pipeBottom.style.height = this.pipebottomHeight + "px";
    this.pipeBottom.style.width = PIPE_WIDTH + "px";
    this.pipeBottom.style.position = "absolute";
    this.pipeBottom.style.top = BODYHEIGHT - this.pipebottomHeight + "px";
    this.pipeBottom.style.transform = "rotate(180deg)";
    this.body.appendChild(this.pipeBottom);
    this.body.appendChild(this.pipeTop);
  };

  this.movePipe = function() {
    this.xVelocity += 2;
    if (this.xVelocity === BACKGROUNDWIDTH) {
      this.body.removeChild(this.pipeTop);
      this.body.removeChild(this.pipeBottom);
      PIPES = PIPES.filter(function(value) {
        return value.xVelocity != BACKGROUNDWIDTH;
      });
    }
  };

  this.updatePipe = function() {
    this.pipeTop.style.right = this.xVelocity + "px";
    this.pipeBottom.style.right = this.xVelocity + "px";
  };

  this.detectCollision = function() {
    if (
      (parseInt(that.bird.style.top) <
        parseInt(this.pipeTop.style.top) + this.pipetopHeight &&
        parseInt(that.bird.style.top) + BIRD_HEIGHT >
          parseInt(this.pipeTop.style.top) &&
        parseInt(that.bird.style.right) <
          parseInt(this.pipeTop.style.right) + PIPE_WIDTH &&
        parseInt(that.bird.style.right) + BIRD_WIDTH >
          parseInt(this.pipeTop.style.right)) ||
      (parseInt(that.bird.style.top) <
        parseInt(this.pipeBottom.style.top) + this.pipebottomHeight &&
        parseInt(that.bird.style.top) + BIRD_HEIGHT >
          parseInt(this.pipeBottom.style.top) &&
        parseInt(that.bird.style.right) <
          parseInt(this.pipeBottom.style.right) + PIPE_WIDTH &&
        parseInt(that.bird.style.right) + BIRD_WIDTH >
          parseInt(this.pipeBottom.style.right)) ||
      parseInt(that.bird.style.top) >= BODYHEIGHT - BIRD_HEIGHT ||
      parseInt(that.bird.style.top) <= 0
    ) {
      clearInterval(interval);
      that1.endMessage.style.display = "block";
      if (score > highScore) {
        highScore = score;
        document.getElementById("high-score").innerHTML =
          "Highscore: " + highScore;
        document.getElementById("score-board").innerHTML =
          "Your Total Score: " + score;
      }
    }
  };
  this.countScore = function() {
    if (
      parseInt(that.bird.style.right) + BIRD_WIDTH ===
      parseInt(this.pipeTop.style.right)
    ) {
      score++;
      document.getElementById("score-board").innerHTML = "Your Score: " + score;
    }
  };
}

function addBird(parent) {
  this.parent = parent;
  this.birdPosition = BIRD_INITIAL_POSITION;
  that = this;
  this.init = function() {
    this.bird = document.createElement("img");
    this.bird.setAttribute("src", "./Images/bird.png");
    this.bird.style.position = "absolute";
    this.bird.style.width = BIRD_WIDTH + "px";
    this.bird.style.height = BIRD_HEIGHT + "px";
    this.bird.style.right = BIRD_RIGHT_POSITION + "px";
    this.bird.style.top = this.birdPosition + "px";
    this.parent.appendChild(this.bird);
    document.addEventListener("keypress", changeDirection);
    document.addEventListener("keyup", changeImage);
  };
  function changeDirection(e) {
    var x = e.keyCode;

    if (x === 32) {
      gravity = 2;
      that.birdPosition -= 30;
      that.bird.style.top = that.birdPosition + "px";
      that.bird.setAttribute("src", "./Images/upflap.png");
    }
  }
  function changeImage(e) {
    var x = e.keyCode;

    if (x === 32) {
      that.bird.setAttribute("src", "./Images/bird.png");
    }
  }

  this.moveBird = function() {
    this.birdPosition+=gravity;
    gravity += YGRAVITY;
  };

  this.updateBird = function() {
    this.bird.style.top = this.birdPosition + "px";
  };
}

function reset() {
  counter = 0;
  for (var i = 0; i < PIPES.length; i++) {
    that1.bodyElem.removeChild(PIPES[i].pipeTop);
    that1.bodyElem.removeChild(PIPES[i].pipeBottom);
  }
  PIPES = [];
  that.birdPosition = BIRD_INITIAL_POSITION;
  animate();
}

function getRandom(min, max) {
  return Math.floor(Math.random() * max + min);
}

var background = new createBackground();
background.init();
background.createScoreboard();
bird = new addBird(background.bodyElem);
bird.init();

function animate() {
  interval = setInterval(function() {
    counter++;
    background.updateBase();
    background.moveBase();
    bird.moveBird();
    bird.updateBird();
    if (counter === PIPE_DELAY_SPEED) {
      pipe = new createPipe(background.bodyElem);
      pipe.init();
      PIPES.push(pipe);
      counter = 0;
    }

    for (var i = 0; i < PIPES.length; i++) {
      PIPES[i].movePipe();
      PIPES[i].updatePipe();
      PIPES[i].detectCollision();
      PIPES[i].countScore();
    }
  }, GAME_ANIMATION_FRAME);
}
