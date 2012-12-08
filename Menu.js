const NOTHING = 0, MENU_APPEARRING = 1, MENU_HOLD = 2, MENU_HIDING = 3;

ActionController.register(80, function() {
  Menu.push(["GameCenter", "Start"])
})

Menu = (function() {
  var texts = [];
  var mode = 0, x, y, w = gz.width * 0.6,
    h = gz.height * 0.8,
    scale, xOri, xDest;

  function startDisplaying() {
    if (mode != NOTHING) { return; }

    mode = MENU_APPEARRING;
    xOri = x = 1.5 * gz.width;
    xDest = gz.width / 2;
    y = gz.height / 2;
    scale = 0;
  }

  function startHiding() {
    mode = MENU_HIDING;
    xOri = gz.width / 2;
    xDest = -0.5 * gz.width;
  }

  function drawMenu(ctx) {
    var top = -h / 2,
      btn = h / 2,
      left = -w / 2,
      right = w / 2;

    ctx.beginPath();
    ctx.moveTo(left - ctx.lineWidth / 2, top)
    ctx.lineWidth = 6
    ctx.lineTo(right, top - 10)
    ctx.lineTo(right, btn + 5)
    ctx.lineTo(left - 5, btn - 3)
    ctx.lineTo(left, top - ctx.lineWidth / 2)
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = MODE_0
    ctx.fill();
    ctx.strokeStyle = MODE_1
    ctx.stroke();
    ctx.closePath();
  }

  return {
    push: function(menu) {
      texts.push(menu);
      startDisplaying();
      pause();
    },
    hide: function() {
      startHiding();
    },
    update: function() {
      switch(mode) {
      case MENU_APPEARRING:
        x -= 20;
        if(x < xDest) {
          x = xDest;
          mode = MENU_HOLD;
        }

        scale = (xOri - x) / (xOri - xDest)
        break;
      case MENU_HIDING:
        x -= 20;
        if(x < xDest) {
          x = xDest;
          mode = NOTHING;
          resume();
        }

        scale = 1 - (xOri - x) / (xOri - xDest)
        break;
      case MENU_HOLD:
        _.delay(function() {
          Menu.hide();
        }, 1000)
        break;
      }
    },
    draw: function(ctx) {
      if (mode == 0) { return; }

      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, gz.width, gz.height);
      ctx.restore();

      ctx.save();
      ctx.translate(x, y);

      switch(mode) {
      case MENU_APPEARRING:
      case MENU_HIDING:
        ctx.scale(scale, scale)
      case MENU_HOLD:
        drawMenu(ctx)
      }
      ctx.restore();
    }
  }
}())