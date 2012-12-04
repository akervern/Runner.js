World = (function() {
  var segments = [];
  var speed = 1;
  var realSpeed = 1;
  var arrowDown = false;
  var score = 0;
  var bestScore = 0;

  const SPEED_MAX = 3, SPEED_NORM = 1;
  keyController.register(39, function() {
    if(!arrowDown) {
      speed = speed * 2;
      arrowDown = true;
    }
  }, function() {
    speed = speed / 2;
    arrowDown = false;
  })

  function getLastSegment() {
    var count = segments.length;
    if(count > 0) {
      return segments[count - 1];
    }
    return null;
  }

  function cleanFirstSegment() {
    var first = segments[0];

    while(first && first.x + first.width < -50) {
      segments.shift()
      first = segments[0];
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
    var tmp = realSpeed * (20 + Math.sqrt(400 + 2 * dH));
    debug(tmp);
    return tmp;
  }

  function buildSegment(startX, lastY) {
    var segmentY = random(lastY - gz.height * 0.3, lastY + gz.height * 0.3)
    // bound segment y between height * 0.4 and height * 0.8
    if(segmentY < gz.height * 0.3) segmentY = gz.height * 0.4;
    if(segmentY > gz.height * 0.9) segmentY = gz.height * 0.8;

    //only for test
    var dH = segmentY - lastY;
    var maxWidth = 0;

    // joining with previous segment?
    var holeWidth = 0;
    if(random(-2, 1) <= 0) { //joining or not?
      segmentY = lastY;
    } else {
      if(startX != 0) {
        maxWidth = getHoleMax(dH);
        //holeWidth = maxWidth;
        holeWidth = random(100, maxWidth)
        //debug(holeWidth);
      }
    }

    var segment = {
      x: startX + holeWidth,
      y: segmentY,
      width: random(100, 400),
      maxWidth: (maxWidth - holeWidth),
      height: 10,
    }
    return segment
  }

  return {
    reset: function() {
      speed = 1;

      if(score > bestScore) {
        bestScore = score;
      }
      score = 0;
      arrowDown = false;
      segments = [];
    },
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
      score += 10 * speed;

      cleanFirstSegment();
      while(needNewSegment()) {
        addSegment();
      }

      realSpeed = 4 * (Math.log(speed) + 1);
      for(var i = 0; i < segments.length; i++) {
        segments[i].x -= realSpeed;
        if(segments[i].update) segments[i].update();
      }

      //update speed
      speed += 0.003;
    },
    draw: function(ctx) {
      strokeText(ctx, segments.length, {
        x: tile.width / 2,
        y: tile.height / 2
      })

      for(var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        fillRect(ctx, segment);
        if(DEBUG) {
          drawLine(ctx, {
            x: segment.x,
            y: segment.y - 20
          }, {
            x: segment.x,
            y: segment.y + 20
          }, "blue");
          drawLine(ctx, {
            x: segment.x + segment.maxWidth,
            y: segment.y - 20
          }, {
            x: segment.x + segment.maxWidth,
            y: segment.y + 20
          }, "red");
        }
      }

      // draw speed icon
      var mode = gz.update ? (arrowDown ? ">>" : ">") : "||";
      strokeText(ctx, mode, {
        x: tile.width / 2,
        y: (Y / 2 - 0.5) * tile.height
      });
      strokeText(ctx, "V: " + Math.floor(speed), {
        x: 1.5 * tile.width,
        y: (Y / 2 - 0.5) * tile.height
      });
      strokeText(ctx, Math.floor(score), {
        x: 4.5 * tile.width,
        y: (Y / 2 - 0.5) * tile.height
      });
      strokeText(ctx, Math.floor(bestScore), {
        x: 6.5 * tile.width,
        y: (Y / 2 - 0.5) * tile.height
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
