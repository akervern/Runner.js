Block = function(lastX, lastY) {
  var maxSegmentY = gz.height * 0.3;
  var minSegmentY = gz.height * 0.7;

  var color = random(0, 1);
  var segmentY = random(lastY - gz.height * 0.3, lastY + gz.height * 0.3)
  if(segmentY < maxSegmentY) segmentY = maxSegmentY;
  if(segmentY > minSegmentY) segmentY = minSegmentY;

  var dH = segmentY - lastY;

  var segments = [];
  // Add 1 segment to min nb every 4 speed points after reaching at least 10.
  var minSegmentNb = 1 + (World.getRealSpeed() > 10 ? (Math.floor((World.getRealSpeed() - 10) / 4)) : 0)

  _.times(_.random(minSegmentNb, minSegmentNb + 4), function(index) {
    var segment = buildSegment(lastX, lastY)

    if(index == 0 && lastX > 0) {
      // if the first of a new block but not THE first one.
      maxWidth = World.getHoleMax(dH, 17);
      minWidth = World.getHoleMax(dH, 10);

      var gap = random(minWidth, maxWidth); //Ensure to have at least a hole of 100
      segment.x += gap < 100 ? _.random(100, 150) : gap;
    }

    segments.push(segment);
    lastX = segment.x + segment.width;
    lastY = segment.y;
  })

  if(_.random(0, 2) == 0) {
    BlockModifier.modify(segments)
  }

  function buildSegment(startX, lastY) {
    var segment = {
      x: startX,
      y: segmentY,
      width: random(300, 450),
      height: tile.height / 2,
    }
    if(startX == 0) {
      segment.width = 600;
      color = 0;
    }

    segment.color = color;

    return segment
  }

  return {
    update: function(delta) {
      _.each(segments, function(segment) {
        segment.x -= World.getRealSpeed();
      });
    },
    draw: function(ctx) {
      var last = _.last(segments);
      var segmentGap = 5;

      fillRect(ctx, {
        x: segments[0].x + segmentGap,
        y: segments[0].y,
        width: (last.x + last.width) - segments[0].x - (2 * segmentGap),
        height: -segments[0].y + gz.height,
      }, "#dddddd")

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
      })
    },
    last: function() {
      return _.last(segments);
    },
    reject: function(minX) {
      segments = _.reject(segments, function(el) {
        return el.x + el.width < minX;
      })
      return segments.length
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

            World.calcCombo(el);
            return;
          }
        }
      });

      return collide;
    }
  }
}

BlockModifier = (function() {
  var modifiers = {};

  return {
    add: function(nbCell, modifier) {
      var mods = modifiers[nbCell] || [];
      mods.push(modifier)
      modifiers[nbCell] = mods;
    },
    modify: function(segments) {
      console.log("Modifying segments: " + segments.length)
      var mods = modifiers[segments.length] || [];
      if(mods.length > 0) {
        mods[_.random(0, mods.length - 1)](segments);
      }
    }
  };
}())

// Inverse middle segment color
BlockModifier.add(5, function(segments) {
  if(segments.length & 1) {
    var mid = Math.floor(segments.length / 2);

    segments[mid].color = Math.abs(segments[mid].color - 1);
  }
})
