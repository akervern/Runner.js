Player = (function() {
  var FALL_SPEED = 100, JUMP_SPEED = 10;

  var fall, isFalling, sprite, isJumping, rotate;

  // Jump action
  ActionController.register(MODE_PLAYING, JUMP_KEYCODE, JUMP_ZONE, function() {
    jump();
    _.delay(stopJump, 200);
  }, function(ts) {
    stopJump(ts);
  })

  // Switching action
  ActionController.register(MODE_PLAYING, SWITCH_KEYCODE, SWITCH_ZONE, function() {
    sprite.mode = Math.abs(sprite.mode - 1);
  }, function() {
    //sprite.mode = 0;
  });

  function init() {
    sprite = {
      x: gz.width * 1/8,
      y: gz.height * 0.1,
      width: tile.width,
      height: tile.height,
      rotation: 0,
      mode: 0
    };
    fall = 0;
    isFalling = true;
    rotate = isJumping = false;
  }
  init();

  function jump() {
    if(!isFalling) {
      rotate = isJumping = true;
      fall = -JUMP_SPEED;
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
    sprite: function() {
      return sprite;
    },
    update: function() {
      if(!isJumping) {
        fall += 1;
      }
      if(fall > FALL_SPEED) fall = FALL_SPEED;

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
        Main.restart();
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
