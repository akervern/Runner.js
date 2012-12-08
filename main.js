/** MAIN OBJECT **/
Main = (function() {
  var lsHighScoreKey = "highScore";
  var currentColors, lsColorsKey = "colors"

  return {
    // Color management
    colors: function(index) {
      if(!currentColors) {
        var stored = localStorage.getItem(lsColorsKey)
        if(stored) {
          currentColors = JSON.parse(stored)
        } else {
          currentColors = ["#333333", "#ee1010"]
        }
      }
      return currentColors[index];
    },
    setColors: function(color_1, color_2) {
      localStorage.setItem(lsColorsKey, JSON.stringify([color_1, color_2]))
      currentColors = [color_1, color_2]
    },
    resetColors: function() {
      localStorage.removeItem(lsColorsKey)
      currentColors = false
    },

    // Game play management
    pause: function() {
      gz.update = false;
    },
    resume: function() {
      gz.update = true;
    },
    restart: function() {
      Player.restart();
      World.reset();
      Background.reset();
    },

    // High score management
    saveHighScore: function(score) {
      gc.reportScore(gcName, score);

      if(Main.getHighScore() < score) {
        localStorage.setItem(lsHighScoreKey, score);
      }
    },
    getHighScore: function() {
      var highScore = localStorage.getItem(lsHighScoreKey);
      return highScore ? highScore : 0;
    }
  }
}());

/** MAIN LOOP **/
var oldTime = new Date();
(function mainLoop() {
  var time = new Date() - oldTime;

  draw(ctx);
  update(time);

  if(showFPS) {
    strokeText(ctx, Math.round(1000 / time), {
      x: ((X - 1) * tile.width),
      y: tile.height / 2
    })
    oldTime = new Date();
  }

  window.requestAnimationFrame(mainLoop);
}(oldTime));

function update(time) {
  Menu.update(time);

  if(!gz.update) {
    return;
  }

  Background.update(time);
  World.update();
  Player.update();
}

function draw(ctx) {
  if(!gz.draw) {
    return;
  }

  //ctx.clearRect(0, 0, gz.width, gz.height);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, gz.width, gz.height);
  ctx.globalAlpha = 1.0;

  Background.draw(ctx);
  World.draw(ctx);
  Player.draw(ctx);

  Menu.draw(ctx);
}
