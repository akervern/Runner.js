/** MAIN LOOP **/
var oldTime = new Date();
(function mainLoop(time) {
  draw(ctx);
  update(time);

  // show FPS
  strokeText(ctx, Math.round(1000 / (time - oldTime)), {
    x: (X * .4) * tile.width,
    y: tile.height / 2
  })
  oldTime = time;

  window.requestAnimationFrame(mainLoop);
}(oldTime));

function update(time) {
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
}

function restartGame() {
  Player.restart();
  World.reset();
  Background.reset();
}
