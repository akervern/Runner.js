Background = (function() {
  var theta = 0;
  var tilt = 1;
  var width = gz.width / 3;
  var height = gz.height / 3;

  var lastTime = 0;

  var methods = ["atan", "cos", "sin"]

  var circles = [];
  function initCircles() {
    circles = [];
    _.times(5, function() {
      var radius = random(50, 80);
      circles.push({
        radius: radius,
        x: random(radius, gz.width - radius),
        y: random(radius, gz.height - radius),
      })
    })
  }
  initCircles();

  return {
    reset: function() {
      methods = _.shuffle(methods);
      initCircles();
    },
    draw: function(ctx) {
      ctx.save();
      ctx.translate(gz.width / 2, gz.height / 2)
      ctx.scale(1, tilt);
      ctx.rotate(theta);

      ctx.fillStyle = "#f5f5f5"
      ctx.fillRect(-width, -height, width, height);
      ctx.fillRect(0, 1/3 * height, width, height / 2);
      ctx.fillRect(-width, -height, width, height);
      ctx.fillRect(width, -2 * height, width / 2, height);
      ctx.fillRect(-width, 2 * height, width / 2, height);

      ctx.restore();

      ctx.globalCompositeOperation = "lighter"

      _.each(circles, function(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0 , 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
      })

      ctx.globalCompositeOperation = "source-over"

    },
    update: function(time) {
      var diff = time - lastTime;

      //theta += diff * Math.floor(World.getRealSpeed()) / 2000;
      theta += diff * 3 / 1000;

      tilt = Math[methods[0]](theta / 2);

      lastTime = time;
    }
  }
}())
