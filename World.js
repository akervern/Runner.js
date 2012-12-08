World = (function() {
  var maxSegmentY = gz.height * 0.3;
  var minSegmentY = gz.height * 0.7;

  var segments = [];

  var score = 0;
  var bestScore = 0;
  var combo = 0;
  var scoresSprite = [];

  var speed = INITIAL_SPEED = 2;
  var realSpeed = 1;

  function getLastSegment() {
    return _.last(segments)
  }

  function cleanOutsideObjects() {
    segments = _.reject(segments, function(el) {
      return el.x + el.width < -50;
    });
    scoresSprite = _.reject(scoresSprite, function(el) {
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

  function getHoleMax(dH, jump) {
    //Bind value to real varialbe ... maybe?
    // 1 <- fall increment
    // 20 <-- vinit
    //return speed / 1 * (20 + Math.sqrt(Math.pow(20,2) + 2 * 1 * dH));
    //dH: -109: NaN speed: 9.056506908582694
    return realSpeed * (jump + Math.sqrt(Math.abs((jump * jump) + 2 * dH)));
  }

  function buildSegment(startX, lastY) {
    var segmentY = random(lastY - gz.height * 0.3, lastY + gz.height * 0.3)
    // bound segment y between height * 0.4 and height * 0.8
    if(segmentY < maxSegmentY) segmentY = maxSegmentY;
    if(segmentY > minSegmentY) segmentY = minSegmentY;

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

        maxWidth = getHoleMax(dH, 17);
        minWidth = getHoleMax(dH, 10);
        //holeWidth = maxWidth;
        //holeWidth = minWidth;
        holeWidth = random(minWidth, maxWidth)
      }
    }

    var segment = {
      x: startX + holeWidth,
      y: segmentY,
      width: random(200, 300),
      height: tile.height / 2,
    }
    if(startX == 0) {
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

  function calcCombo(el) {
    if(!el.alreadyOn) {
      if(el.color == Player.sprite().mode) {
        combo += 1;
      } else {
        if(combo > 0) {
          scoresSprite.push({
            x: Player.sprite().x + 20,
            y: Player.sprite().y - 10,
            score: combo
          });
        }
        combo = 0;
      }
    }
    el.alreadyOn = true;
  }

  return {
    reset: function() {
      speed = INITIAL_SPEED;
      calcRealSpeed();

      score = Math.ceil(score);
      if(score > bestScore) {
        bestScore = score;
        Main.saveHighScore(score)
      }

      if(score > 0) {
        scoresSprite.push({
          x: Player.sprite().x,
          y: Player.sprite().y - 20,
          score: score
        })
      }
      combo = 0;
      score = 0;
      segments = [];
    },
    getRealSpeed: function() {
      return realSpeed;
    },
    isOnSegment: function(sprite, fall) {
      var collide = false;
      _.each(segments, function(el, index) {
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

            calcCombo(el);

            return;
          }
        }
      });
      return collide;
    },
    update: function() {
      score += 2 * speed * (combo + 1);

      cleanOutsideObjects();
      while(needNewSegment()) {
        addSegment();
      }

      calcRealSpeed();
      _.each(segments, function(el) {
        el.x -= realSpeed;
      });
      _.each(scoresSprite, function(el) {
        el.x -= 1;
      })

      //update speed
      speed += 0.005;
    },
    draw: function(ctx) {
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
      _.each(scoresSprite, function(el) {
        strokeText(ctx, el.score, el)
      })

      strokeText(ctx, Math.floor(score), {
        x: Player.sprite().x - 0.5 * tile.width,
        y: Player.sprite().y - 1.5 * tile.height
      });
      if(combo > 0) {
        strokeText(ctx, Math.floor(combo), {
          x: Player.sprite().x + tile.width,
          y: Player.sprite().y - 0.5 * tile.height
        });
      }
      strokeText(ctx, Math.floor(bestScore), {
        x: (tile.x - 2) * tile.width,
        y: (tile.y - 1) * tile.height
      });

      // display generation lines
      if(DEBUG) {
        strokeText(ctx, segments.length, {
          x: tile.width / 2,
          y: tile.height / 2
        })
        strokeText(ctx, "V: " + Math.floor(speed), {
          x: 1.5 * tile.width,
          y: (Y / 2 - 0.5) * tile.height
        });
        drawLine(ctx, {
          x: 0,
          y: maxSegmentY
        }, {
          x: gz.width,
          y: maxSegmentY
        }, 'red')
        drawLine(ctx, {
          x: 0,
          y: minSegmentY
        }, {
          x: gz.width,
          y: minSegmentY
        }, 'red')
      }
    }
  }
}());
