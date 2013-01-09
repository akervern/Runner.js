var gcName = "highscore"

var MODE_PLAYING = "playing"
var MODE_PAUSE   = "pause"
var MODE_MENU    = "in_menu"

/** TILES SIZE **/
var tile = {
  x: X,
  y: Y,
  width: gz.width / X,
  height: gz.height / Y
}
console.log(tile);

/** UTILITIES METHOD **/

function intersect(point, sprite) {
  return !(
       point.x > sprite.x + sprite.width
    || point.x < sprite.x
    || point.y > sprite.y + sprite.height
    || point.y < sprite.y);
}

function debug(obj) {
  if(DEBUG) {
    console.log("DEBUG:" + JSON.stringify(obj))
  }
}

function log(obj) {
  console.log(obj);
}

function random(min, max) {
  return _.random(min, max)
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

function drawSegment(ctx, segment) {
  ctx.save();

  var color = segment.color == 1 ? Main.colors(1) : Main.colors(0);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.fillRect(segment.x, segment.y, segment.width, segment.height);

  ctx.textBaseline = "middle"
  ctx.textAlign = "center"
  ctx.strokeText(segment.width, segment.x+ segment.width / 2, segment.y + segment.height + 10)

  ctx.restore();
}

function drawPlayer(ctx, sprite) {
  var x = sprite.x + sprite.width / 2;
  var y = sprite.y + sprite.height / 2;
  var player = {
    x: -(sprite.width / 2),
    y: -(sprite.height / 2),
    w: sprite.width,
    h: sprite.height
  };

  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(sprite.rotation)
  ctx.lineWidth = 3;
  ctx.fillStyle = sprite.mode == 1 ? Main.colors(0) : Main.colors(1)
  ctx.strokeStyle = sprite.mode != 1 ? Main.colors(0) : Main.colors(1)

  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.strokeRect(player.x, player.y, player.w, player.h);

  ctx.restore();
}

function strokeText(ctx, txt, pos) {
  ctx.fillStyle = "#000000"
  ctx.textBaseline = "middle"
  ctx.textAlign = "center"
  ctx.fillText(txt, pos.x, pos.y)
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
  drawLine(ctx, {
    x: point.x,
    y: point.y - length
  }, {
    x: point.x,
    y: point.y + length
  }, color)
  drawLine(ctx, {
    x: point.x - length,
    y: point.y
  }, {
    x: point.x + length,
    y: point.y
  }, color)
}

function drawImage(ctx, name, point, size) {
  ctx.drawImage(ResourcesLoader.getImage(name), point.x, point.y, size.width, size.height)
}

function drawFont(ctx, name, point, dCharWidth, text, callback) {
  var img = ResourcesLoader.getImage(name);
  var charWidth = parseFloat(img.dataset['charWidth']),
    letters =  img.dataset['letters'],
    startX = point.x - dCharWidth * (text.length / 2),
    dHeight = (dCharWidth * img.height) / charWidth

  _.each(text, function(letter, lIndex) {
    var index = _.indexOf(letters, letter);
    if (index < 0) return;

    var sX = index * charWidth;
    var dX = startX + lIndex * dCharWidth;
    ctx.drawImage(img, sX, 0, charWidth, img.height, dX, point.y, dCharWidth, dHeight)
  })
  if (callback !== undefined) {
    callback({x: startX, y: point.y, width: dCharWidth * text.length,height: dHeight});
  }
}
