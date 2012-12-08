/** MAIN LOOP **/
var oldTime = new Date();
(function mainLoop() {
  var time = new Date() - oldTime;

  draw(ctx);
  update(time);

  if(showFPS) {
    strokeText(ctx, Math.round(1000 / time), {
      x: ((X - 1) * tile.width),
      y: tile.height / 2
    })
    oldTime = new Date();
  }

  window.requestAnimationFrame(mainLoop);
}(oldTime));

function update(time) {
  Menu.update(time);

  if(!gz.update) {
    return;
  }

  Background.update(time);
  World.update();
  Player.update();
}

function draw(ctx) {
  if(!gz.draw) {
    return;
  }

  //ctx.clearRect(0, 0, gz.width, gz.height);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, gz.width, gz.height);
  ctx.globalAlpha = 1.0;

  Background.draw(ctx);
  World.draw(ctx);
  Player.draw(ctx);

  Menu.draw(ctx);
}

function pause() {
  gz.update = false;
}

function resume() {
  gz.update = true;
}

function restartGame() {
  Player.restart();
  World.reset();
  Background.reset();
}

function saveHighScore(score) {
  log("try to save")
  gc.reportScore(gcName, score);
  var prevHighScore = localStorage.getItem("maxScore");
  if(!prevHighScore || prevHighScore < score) {
    localStorage.setItem("maxScore", score);
  }
}

function getHighScore() {
  var highScore = localStorage.getItem("maxScore");
  return highScore ? highScore : 0;
}
