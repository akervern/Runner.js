Player = (function() {
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

      if(isJumping) {
        sprite.rotation += (Math.PI / 15);
      }

      if(sprite.y > gz.height + tile.height) {
        Player.restart();
        World.reset();
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
