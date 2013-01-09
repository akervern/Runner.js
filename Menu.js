ActionController.register(MODE_PLAYING, PAUSE_KEYCODE, PAUSE_ZONE, function() {
  Menu.push(["GameCenter", "Start"])
})

ActionController.register(MODE_MENU, PAUSE_KEYCODE, PAUSE_ZONE, function() {
  Menu.hide();
})

ResourcesLoader.loadImage("menu", "images/menu.png")
ResourcesLoader.loadFont("font_score", "images/font_score.png", "0123456789")

var sc_selectedIndex = 0;
var sc_colors = [{
  fg: "#333333",
  bg: "#aaaaaa"
}, {
  fg: "#b2c840",
  bg: "#7fbf81"
}, {
  fg: "#437fbf",
  bg: "#d756cb"
}, {
  fg: "#56d7b0",
  bg: "#437fbf"
}, {
  fg: "#bf4327",
  bg: "#efda63"
}];


Menu = (function() {
  const NOTHING = 0, MENU_APPEARRING = 1, MENU_HOLD = 2, MENU_HIDING = 3;

  var texts = [];
  var mode = 0,
    x, y, w = gz.width * 0.6,
    h = gz.height * 0.8,
    scale, xOri, xDest;

  /** REGISTERING ACTIONS **/
  var SC_ZONE = {
    x: -w / 2 + 15,
    y: h / 2 - 120,
    width: 35,
    height: 80,
    order: 10
  },
    SC_KEYCODE = 83;

  ActionController.register(MODE_MENU, SC_KEYCODE, SC_ZONE, function() {
    // Dirty <3
    if(sc_selectedIndex >= sc_colors.length) {
      Main.resetColors();
      sc_selectedIndex = 0;
    } else {
      var color = sc_colors[sc_selectedIndex];
      Main.setColors(color.fg, color.bg);
      sc_selectedIndex += 1;
    }
  })

  function startDisplaying() {
    if(mode != NOTHING) {
      return;
    }

    mode = MENU_APPEARRING;
    xOri = x = 1.5 * gz.width;
    xDest = gz.width / 2;
    y = gz.height / 2;
    scale = 0;
  }

  function displayed() {
    Main.gameMode = MODE_MENU;
  }

  function startHiding() {
    Main.pause();
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
    ctx.fillStyle = Main.colors(0)
    ctx.fill();
    ctx.strokeStyle = Main.colors(1)
    ctx.stroke();
    ctx.closePath();
  }

  return {
    push: function(menu) {
      texts.push(menu);
      startDisplaying();
      Main.pause();
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
          displayed();
        }

        scale = (xOri - x) / (xOri - xDest)
        break;
      case MENU_HIDING:
        x -= 20;
        if(x < xDest) {
          x = xDest;
          mode = NOTHING;
          Main.resume();
        }

        scale = 1 - (xOri - x) / (xOri - xDest)
        break;
      case MENU_HOLD:

        break;
      }
    },
    draw: function(ctx) {
      if(mode == 0) {
        return;
      }

      ctx.save();
      ctx.globalAlpha = 0.8;
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

      ctx.globalAlpha = 1;

      // Menu BG
      var tempHack = 30;
      drawImage(ctx, "menu", {
        x: -w / 2 - tempHack,
        y: -h / 2
      }, {
        width: w + tempHack,
        height: h
      })

      // Game Colors
      var spriteColor = {
        x: -w / 2 + 15,
        y: h / 2 - 120,
        width: 35,
        height: 40
      }
      fillRect(ctx, spriteColor, Main.colors(0));
      spriteColor.y = h / 2 - 80
      fillRect(ctx, spriteColor, Main.colors(1));
      spriteColor.y = h / 2 - 120
      spriteColor.height = 80

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#9e9e9e"
      strokeRect(ctx, spriteColor);

      // Score
      var charWidth = w / 16; // Arbitrary size
      drawFont(ctx, "font_score", {x: 0, y: -60}, charWidth, "" + Main.getHighScore(), function(dSprite) {
        ctx.textAlign = "left"
        ctx.fillStyle = "#9e9e9e"
        ctx.fillText("Highscore", dSprite.x, dSprite.y + dSprite.height + 10)
      })

      // End
      ctx.restore();
    }
  }
}())
