/** MAIN LOOP **/

var oldTime = new Date();
(function mainLoop(time) {
  draw(ctx);
  update();

  // show FPS
  strokeText(ctx, Math.round(1000 / (time - oldTime)), {
    x: (X - 0.5) * tile.width,
    y: tile.height / 2
  })
  oldTime = time;

  window.requestAnimationFrame(mainLoop);
}(oldTime));

function update() {
  if(!gz.update) {
    return;
  }

  World.update();
  Player.update();
}

function draw(ctx) {
  if(!gz.draw) {
    return;
  }

  //ctx.clearRect(0, 0, gz.width, gz.height);
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, gz.width, gz.height);

  // draw table lines
  if(DEBUG) {
    for(var i = 1; i < tile.x; i++) {
      drawLine(ctx, {
        x: i * tile.width,
        y: 0
      }, {
        x: i * tile.width,
        y: canvas.height
      })
    }
    for(var i = 1; i < tile.y; i++) {
      drawLine(ctx, {
        x: 0,
        y: i * tile.height
      }, {
        x: canvas.width,
        y: i * tile.height
      })
    }
  }

  World.draw(ctx);
  Player.draw(ctx);
}
