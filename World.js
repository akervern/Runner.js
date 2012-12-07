World = (function() {
  var segments = [];

  var score = 0;
  var bestScore = 0;

  var speed = INITIAL_SPEED = 2;
  var realSpeed = 1;

  function getLastSegment() {
    return _.last(segments)
  }

  function cleanOutsideObjects() {
    segments = _.reject(segments, function(el) {
      return el.x + el.width < -50;
    });
  }

  function needNewSegment() {
    var lastOne = getLastSegment();
    return(!lastOne || lastOne.x + lastOne.width < gz.width * 1.5);
  }

  function addSegment() {
    var lastOne = getLastSegment();
    var lastX = 0;
    var lastY = gz.height * 0.7;
    if(lastOne) {
      lastX = lastOne.x + lastOne.width;
      lastY = lastOne.y;
    }
    segments.push(buildSegment(lastX, lastY));
  }

  function addBonus(segment) {
    if (segments.length < 3) { return; }

    var last = getLastSegment();
    if ((last.x + last.width == segment.x && last.hasBonus) || random(0, 1) == 0) {

    }
  }

  function getHoleMax(dH) {
    //Bind value to real varialbe ... maybe?
    // 1 <- fall increment
    // 20 <-- vinit
    //return speed / 1 * (20 + Math.sqrt(Math.pow(20,2) + 2 * 1 * dH));
    return realSpeed * (17 + Math.sqrt(289 + 2 * dH));
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
    var joining = random(0, 1) <= 0; //joining or not?
    if(joining) {
      segmentY = lastY;
    } else {
      if(startX != 0) {
        maxWidth = getHoleMax(dH);
        //holeWidth = maxWidth;
        //holeWidth = 100
        holeWidth = random(100, maxWidth)
      }
    }

    var segment = {
      x: startX + holeWidth,
      y: segmentY,
      width: random(200, 300),
      height: 10,
    }
    if (startX == 0) {
      segment.width = 600;
      segment.color = 0;
    } else {
      segment.color = joining ? getLastSegment().color : random(0, 1);
    }

    return segment
  }

  function calcRealSpeed() {
    realSpeed = 4 * (Math.log(speed) + 1);
  }

  return {
    reset: function() {
      speed = INITIAL_SPEED;
      calcRealSpeed();

      if(score > bestScore) {
        bestScore = score;
      }
      score = 0;
      segments = [];
    },
    getRealSpeed: function() {
      return realSpeed;
    },
    isOnSegment: function(sprite, fall) {
      var collide = false;
      _.each(segments, function(el) {
        var elx = el.x,
          elwidth = el.x + el.width;
        var sx = sprite.x,
          swidth = sprite.x + sprite.width;

        var USER_HACKY_MARGE = 5;
        var betweenSegment = elx - USER_HACKY_MARGE <= swidth && sx - USER_HACKY_MARGE <= elwidth; //XXX hacky ...
        if(betweenSegment) {
          var spriteBtn = sprite.y + sprite.height;
          if(spriteBtn <= el.y && el.y < spriteBtn + fall) {
            sprite.y = el.y - sprite.height; //XXX May be somewhere else
            collide = true;
            return;
          }
        }
      });
      return collide;
    },
    update: function() {
      score += 10 * speed;

      cleanOutsideObjects();
      while(needNewSegment()) {
        addSegment();
      }

      calcRealSpeed();
      _.each(segments, function(el) {
        el.x -= realSpeed;
        //el.x -= 0.5
      });

      //update speed
      speed += 0.005;
    },
    draw: function(ctx) {
      strokeText(ctx, segments.length, {
        x: tile.width / 2,
        y: tile.height / 2
      })

      _.each(segments, function(segment) {
        drawSegment(ctx, segment);
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
      });

      // draw speed icon
      var mode = gz.update ? ">" : "||";
      strokeText(ctx, mode, {
        x: tile.width / 2,
        y: (Y / 2 - 0.5) * tile.height
      });
      strokeText(ctx, "V: " + Math.floor(speed), {
        x: 1.5 * tile.width,
        y: (Y / 2 - 0.5) * tile.height
      });
      strokeText(ctx, Math.floor(score), {
        x: Player.sprite().x,
        y: Player.sprite().y - 20
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
