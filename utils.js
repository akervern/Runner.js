/** TILES SIZE **/
var tile = {
  x: X,
  y: Y,
  width: canvas.width / X,
  height: canvas.height / Y
}
console.log({
  width: gz.width,
  height: gz.height
})
console.log(tile);


/** UTILITIES METHOD **/

function debug(obj) {
  if(DEBUG) {
    console.log("DEBUG:" + JSON.stringify(obj))
  }
}

function log(obj) {
  console.log(obj);
}

function random(min, max) {
  return Math.ceil(Math.random() * (max - min) + min)
}

function drawLine(ctx, pt1, pt2, color) {
  ctx.beginPath();

  var oldColor = ctx.strokeStyle;
  ctx.strokeStyle = !color ? "#CDCDCD" : color;
  ctx.moveTo(pt1.x, pt1.y);
  ctx.lineTo(pt2.x, pt2.y);

  ctx.stroke();
  ctx.closePath();

  ctx.strokeStyle = oldColor;
}

function drawPlayer(ctx, sprite) {
  var x = sprite.x + sprite.width / 2;
  var y = sprite.y + sprite.height / 2;
  ctx.translate(x, y);

  ctx.rotate(sprite.rotation)
  fillRect(ctx, {
    x: -(sprite.width / 2),
    y: -(sprite.height / 2),
    width: sprite.width,
    height: sprite.height
  })
  ctx.rotate(-sprite.rotation)

  ctx.translate(-x, -y);
}

function strokeText(ctx, txt, pos) {
  ctx.textBaseline = "middle"
  ctx.textAlign = "center"
  ctx.strokeText(txt, pos.x, pos.y)
}

function strokeRect(ctx, sprite) {
  ctx.strokeRect(sprite.x, sprite.y, sprite.width, sprite.height);
}

function fillRect(ctx, sprite, color) {
  var oldcolor = ctx.fillStyle;
  ctx.fillStyle = !color ? "#000000" : color;
  ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
  ctx.fillStyle = oldcolor;
}

function debugBoolean(value, index) {
  if(!DEBUG) {
    return;
  }
  var color = value ? "green" : "red";
  fillRect(ctx, {
    x: tile.width * index,
    y: 0,
    width: tile.width,
    height: tile.height
  }, color);
}

function drawCross(ctx, point, color) {
  var length = 15;
  drawLine(ctx, {x: point.x, y: point.y - length}, {x: point.x, y: point.y + length}, color)
  drawLine(ctx, {x: point.x - length, y: point.y}, {x: point.x + length, y: point.y}, color)
}
