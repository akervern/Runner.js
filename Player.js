Player = (function() {
  const fallSpeed = 100;
  const jumpSpeed = 10;
  var fall, isFalling, sprite, isJumping, rotate;

  // register keys event
  keyController.register(32, function() {
    gz.update = !gz.update;
  });
  keyController.register(38, function(ts) {
    if(ts > 150) {
      stopJump();
    } else {
      jump();
    }
  }, function() {
    stopJump();
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
    rotate = isJumping = false;
  }
  init();

  function jump() {
    if(!isFalling) {
      rotate = isJumping = true;
      fall = -jumpSpeed;
    }
  }

  function stopJump(ts) {
    isJumping = false;
  }

  function walk() {
    fall = 0;
    rotate = false;
    sprite.rotation = 0;
  }

  return {
    update: function() {
      if(!isJumping) {
        fall += 1;
      }
      if(fall > fallSpeed) fall = fallSpeed;

      isFalling = !World.isOnSegment(sprite, fall);
      if(isFalling) {
        sprite.y += fall;
      } else {
        walk();
      }

      if(rotate) {
        sprite.rotation += (Math.PI / 15);
      }

      if(sprite.y > gz.height + tile.height) {
        restartGame();
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
