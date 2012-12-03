const X = 60, Y = 30, DEBUG = false;

/** INITIALIZATION **/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); //draw a pink square
var gz = {
  height: canvas.height,
  width: canvas.width,
  update: true,
  draw: true,
}

if(window.devicePixelRatio) {
  var hidefCanvasWidth = canvas.getAttribute('width');
  var hidefCanvasHeight = canvas.getAttribute('height');
  var hidefCanvasCssWidth = hidefCanvasWidth;
  var hidefCanvasCssHeight = hidefCanvasHeight;

  canvas.setAttribute('width', hidefCanvasWidth * window.devicePixelRatio);
  canvas.setAttribute('height', hidefCanvasHeight * window.devicePixelRatio);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  gz.height = canvas.height / window.devicePixelRatio
  gz.width = canvas.width / window.devicePixelRatio
}

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(f) {
    window.setTimeout(f, 1e3 / 60);
  }
}();

var keyController = (function() {
  var controllersD = {};
  var controllersU = {};

  return {
    register: function(keyCode, callbackDown, callbackUp) {
      if(callbackDown) {
        controllersD[keyCode] = callbackDown;
      }

      if(callbackUp) {
        controllersU[keyCode] = callbackUp
      }
    },
    keyDown: function(keyCode) {
      if(controllersD[keyCode]) {
        controllersD[keyCode](keyCode)
      }
    },
    keyUp: function(keyCode) {
      if(controllersU[keyCode]) {
        controllersU[keyCode](keyCode)
      }
    }
  }
}());

window.addEventListener('keydown', function(e) {
  if(keyController.keyDown(e.keyCode)) e.preventDefault();
}, false);

window.addEventListener('keyup', function(e) {
  if(keyController.keyUp(e.keyCode)) e.preventDefault();
}, false);

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

var Player = (function() {
  const fallSpeed = 100;
  const jumpSpeed = 20;
  var fall, isFalling, sprite, isJumping;

  // register keys event
  keyController.register(32, function() {
    gz.update = !gz.update;
  });
  keyController.register(38, function() {
    jump();
  })

  function init() {
    sprite = {
      x: 70,
      y: gz.height * 0.1,
      width: tile.width,
      height: tile.height,
      rotation: 0
    };
    fall = 0;
    isFalling = true;
    isJumping = false;
  }
  init();

  function jump() {
    if(!isJumping) {
      isJumping = true;
      fall = -jumpSpeed;
    }
  }

  function walk() {
    isJumping = false;
    fall = 0;
    sprite.rotation = 0;
  }

  return {
    update: function() {
      fall += 1;
      if(fall > fallSpeed) fall = fallSpeed;

      isFalling = World.fallOnSegment(sprite, fall);
      if(isFalling) {
        sprite.y += fall;
      } else {
        walk();
      }

      if (isJumping) {
        sprite.rotation += (Math.PI / 15) ;
      }

      if(sprite.y > gz.height + tile.height) {
        Player.restart();
      }
    },
    draw: function(ctx) {
      drawPlayer(ctx, sprite)
      if(DEBUG) {
        drawLine(ctx, {
          x: sprite.x,
          y: sprite.y + sprite.height
        }, {
          x: sprite.x,
          y: sprite.y + sprite.height + fall
        }, 'red')
      }

      debugBoolean(isFalling, 1)
      debugBoolean(isJumping, 2)
    },
    restart: function() {
      init();
    }
  }
}());

var World = (function() {
  var segments = [];
  var speed = 1;

  const SPEED_MAX = 3, SPEED_NORM = 1;
  keyController.register(39, function() {
    speed = SPEED_MAX;
  }, function() {
    speed = SPEED_NORM;
  })

  function getLastSegment() {
    var count = segments.length;
    if(count > 0) {
      return segments[count - 1];
    }
    return null;
  }

  function cleanFirstSegment() {
    var first = segments[0]
    if(first && first.x + first.width < -50) {
      segments.shift()
    }
  }

  function needNewSegment() {
    var lastOne = getLastSegment();
    return(!lastOne || lastOne.x + lastOne.width < gz.width * 1.5);
  }

  function addSegment() {
    var lastOne = getLastSegment();
    var lastX = lastOne ? lastOne.x + lastOne.width : 0;
    var lastY = lastOne ? lastOne.y : gz.height * 0.7;
    segments.push(buildSegment(lastX, lastY));
  }

  function getHoleMax(dH) {
    //Bind value to real varialbe ... maybe?
    // 1 <- fall increment
    // 20 <-- vinit
    //return speed / 1 * (20 + Math.sqrt(Math.pow(20,2) - 2 * 1 * dH));
    return SPEED_MAX / 1 * (20 + Math.sqrt(400 - 2 * 1 * dH));
  }

  function buildSegment(startX, lastY) {
    var segmentY = random(lastY - gz.height * 0.3, lastY + gz.height * 0.3)
    // bound segment y between height * 0.4 and height * 0.8
    if(segmentY < gz.height * 0.3) segmentY = gz.height * 0.4;
    if(segmentY > gz.height * 0.9) segmentY = gz.height * 0.8;

    //only for test
    var dH = segmentY - lastY;
    var maxWidth = getHoleMax(dH);

    // joining with previous segment?
    var holeWidth = 0;
    if(random(-5, 1) <= 0) { //joining or not?
      segmentY = lastY;
    } else {
      if(startX != 0) {
        //holeWidth = maxWidth;
        holeWidth = random(50, maxWidth)
        //debug(holeWidth);
      }
    }

    var segment = {
      x: startX + holeWidth,
      y: segmentY,
      width: random(40, 200),
      maxWidth: (maxWidth - holeWidth),
      height: 10,
    }
    return segment
  }

  return {
    fallOnSegment: function(sprite, fall) {
      for(var x = 0; x < segments.length; x++) {
        var el = segments[x];

        var elx = el.x,
          elwidth = el.x + el.width;
        var sx = sprite.x,
          swidth = sprite.x + sprite.width;

        var betweenSegment = elx < swidth && sx < elwidth;
        if(betweenSegment) {
          var spriteBtn = sprite.y + sprite.height;
          if(spriteBtn <= el.y && el.y < spriteBtn + fall) {
            sprite.y = el.y - sprite.height;
            return false;
          }
        }
      }
      return true;
    },
    update: function() {

      cleanFirstSegment();
      while(needNewSegment()) {
        addSegment();
      }

      for(var i = 0; i < segments.length; i++) {
        segments[i].x -= 4 * speed
        if (segments[i].update) segments[i].update();
      }
    },
    draw: function(ctx) {
      strokeText(ctx, segments.length, {
        x: tile.width / 2,
        y: tile.height / 2
      })

      for(var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        fillRect(ctx, segment);
        drawLine(ctx, {x: segment.x, y: segment.y - 20}, {x: segment.x, y: segment.y + 20}, "blue");
        drawLine(ctx, {x: segment.x + segment.maxWidth, y: segment.y - 20}, {x: segment.x + segment.maxWidth, y: segment.y + 20}, "red");
      }

      // draw speed icon
      var mode = gz.update ? (speed == 1 ? ">" : (speed > 1 ? ">>" : ")")) : "||";
      //"> ▶ Ⅱ ≫"
      strokeText(ctx, mode, {
        x: tile.width / 2,
        y: 14.5 * tile.height
      });

      // display generation lines
      if(DEBUG) {
        drawLine(ctx, {
          x: 0,
          y: gz.height * 0.3
        }, {
          x: gz.width,
          y: gz.height * 0.3
        }, 'red')
        drawLine(ctx, {
          x: 0,
          y: gz.height * 0.8
        }, {
          x: gz.width,
          y: gz.height * 0.8
        }, 'red')
      }
    }
  }
}());


/** MAIN LOOP **/

var oldTime = new Date();
(function mainLoop(time) {
  draw(ctx);
  update();

  // show FPS
  strokeText(ctx, Math.round(1000 / (time - oldTime)), {
    x: 29.5 * tile.width,
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw table lines
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

  World.draw(ctx);
  Player.draw(ctx);
}

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
  ctx.strokeStyle = !color ? "lightgrey" : color;
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
    x: - (sprite.width / 2),
    y: - (sprite.height / 2),
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
  ctx.fillStyle = !color ? "black" : color;
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
