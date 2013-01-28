World = (function() {
  var blocks = [];

  var score = 0;
  var bestScore = 0;
  var combo = 0;
  var scoresSprite = [];

  var speed = INITIAL_SPEED = 2;
  var realSpeed = 1;

  function getLastSegment() {
    var last = _.last(blocks);
    return last && last.last() || null;
  }

  function cleanOutsideObjects() {
    blocks = _.reject(blocks, function(block) {
      return block.reject(-50) == 0;
    })
    scoresSprite = _.reject(scoresSprite, function(el) {
      return el.x + el.width < -50;
    });
  }

  function needNewBlock() {
    var lastOne = getLastSegment();
    return(!lastOne || lastOne.x + lastOne.width < gz.width * 1.5);
  }

  function addBlock() {
    var lastOne = getLastSegment();
    var lastX = 0;
    var lastY = gz.height * 0.7;
    if(lastOne) {
      lastX = lastOne.x + lastOne.width;
      lastY = lastOne.y;
    }
    blocks.push(new Block(lastX, lastY));
  }

  function getHoleMax(dH, jump) {
    //Bind value to real varialbe ... maybe?
    // 1 <- fall increment
    // 20 <-- vinit
    //return speed / 1 * (20 + Math.sqrt(Math.pow(20,2) + 2 * 1 * dH));
    //dH: -109: NaN speed: 9.056506908582694
    return realSpeed * (jump + Math.sqrt(Math.abs((jump * jump) + 2 * dH)));
  }

  function calcRealSpeed() {
    realSpeed = 4 * (Math.log(speed) + 1);
  }

  return {
    reset: function() {
      speed = INITIAL_SPEED;
      calcRealSpeed();

      score = Math.ceil(score);

      if(score > 0) {
        if(score > bestScore) {
          bestScore = score;
          if(Main.saveHighScore(score)) {
            scoresSprite.push({
              x: Player.sprite().x,
              y: Player.sprite().y - 10,
              score: "Highscore!"
            })
          }
        }

        scoresSprite.push({
          x: Player.sprite().x,
          y: Player.sprite().y - 20,
          score: score
        })
      }
      combo = 0;
      score = 0;
    },
    getRealSpeed: function() {
      return realSpeed;
    },
    isOnSegment: function(sprite, fall) {
      var collide = false;
      _.each(blocks, function(block) {
        if(collide) {
          return;
        }
        collide = block.isOnSegment(sprite, fall)
      })
      return collide;
    },
    calcCombo: function(el) {
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
    },
    getHoleMax: function(dH, jump) {
      //Bind value to real varialbe ... maybe?
      // 1 <- fall increment
      // 20 <-- vinit
      //return speed / 1 * (20 + Math.sqrt(Math.pow(20,2) + 2 * 1 * dH));
      //dH: -109: NaN speed: 9.056506908582694
      return realSpeed * (jump + Math.sqrt(Math.abs((jump * jump) + 2 * dH)));
    },
    update: function() {
      score += 2 * speed * (combo + 1);

      cleanOutsideObjects();
      while(needNewBlock()) {
        addBlock();
      }

      calcRealSpeed();
      _.each(blocks, function(block) {
        block.update();
      });
      _.each(scoresSprite, function(el) {
        el.x -= 0.5;
      })

      //update speed
      speed += 0.005;
    },
    draw: function(ctx) {
      _.each(blocks, function(block) {
        block.draw(ctx)
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
    }
  }
}());
