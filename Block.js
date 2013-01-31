Block = function(lastX, lastY) {
  var maxSegmentY = gz.height * 0.3;
  var minSegmentY = gz.height * 0.7;

  var color = random(0, 1);
  var segmentY = random(lastY - gz.height * 0.3, lastY + gz.height * 0.3) // XXX WEIRD
  if(segmentY < maxSegmentY) segmentY = maxSegmentY;
  if(segmentY > minSegmentY) segmentY = minSegmentY;

  var dH = segmentY - lastY;

  var segments = [];
  // Add 1 segment to min nb every 4 speed points after reaching at least 10.
  var minSegmentNb = 1 + (World.getRealSpeed() > 10 ? (Math.floor((World.getRealSpeed() - 10) / 4)) : 0)

  var nbSegment = _.random(minSegmentNb, minSegmentNb + 3);
  var generator = (_.random(0, 3) == 0) ? BlockGenerator.find(nbSegment, lastY) : null;
  var startY = lastY;

  _.times(nbSegment, function(index) {
    var segment = buildSegment(lastX, lastY)

    if(index == 0 && lastX > 0) {
      // if the first of a new block but not THE first one.
      maxWidth = World.getHoleMax(dH, 17);
      minWidth = World.getHoleMax(dH, 10);

      var gap = random(minWidth, maxWidth); //Ensure to have at least a hole of 100
      segment.x += gap < 100 ? _.random(100, 150) : gap;
    }

    // Modify segment
    if(generator) {
      generator(nbSegment, startY, index, segment)
    }

    segments.push(segment);
    lastX = segment.x + segment.width;
    segmentY = segment.y;
  })

  function buildSegment(startX, lastY) {
    var segment = {
      x: startX,
      y: segmentY,
      width: random(250, 400),
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

      var segmentGap = 5;

      _.each(segments, function(segment, index) {
        // Draw background !
        var x = segment.x;
        var y = segment.y;
        var width = segment.width;
        var height = gz.height - segment.y;

        if(index == 0) {
          x += segmentGap;
        }
        if(index == segments.length - 1) {
          width -= segmentGap;
        }
        if (segments.length == 1) {
          width -= segmentGap;
        }

        fillRect(ctx, {
          x: x,
          y: y,
          width: width,
          height: height,
        }, "#aaaaaa")


        // Draw segments !!
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

BlockGenerator = (function() {
  var validators = [];
  var modifiers = [];

  return {
    add: function(validator, modifier) {
      validators.push(validator);
      modifiers[validator] = modifier;
    },
    find: function(nbSegment, lastY) {
      var validator = _.find(_.shuffle(validators), function(pValidator) {
        return pValidator(nbSegment, lastY)
      })
      return validator && modifiers[validator] || null;
    }
  };
}())

/* SKELETON
BlockGenerator.add(function(nbSegment) {

}, function(nbSegment, startY, index, segment) {

});
*/

// Inverse middle segment if nbSegment is odd and > 3
BlockGenerator.add(function(nbSegment) {
  return nbSegment > 3 && nbSegment & 1
}, function(nbSegment, startY, index, segment) {
  console.log("Middle color switch !")
  var mid = Math.floor(nbSegment / 2);

  if(index == mid) {
    segment.color = Math.abs(segment.color - 1);
  }
});

// Make a stair
BlockGenerator.add(function(nbSegment, lastY) {
  return nbSegment > 2 && lastY < gz.height * 0.4;
}, function(nbSegment, startY, index, segment) {
  var stairHeight = gz.height * 0.7 - startY;
  var stepHeight = stairHeight / nbSegment;

  console.log("Stair !")
  if(index != 0) {
    segment.y = segment.y + stepHeight
  }
})

// Create a hole
BlockGenerator.add(function(nbSegment) {
  return nbSegment & 1;
}, function(nbSegment, startY, index, segment) {
  console.log("Hole !!")
  var mid = Math.floor(nbSegment / 2);

  var holeHeight = 90;
  var holeWidth = 30;
  if(index == mid) {
    segment.y += holeHeight;
    segment.width -= 2 * holeWidth
    segment.x += holeWidth
  }
  if(index == mid + 1) {
    segment.x += holeWidth
    segment.y -= holeHeight;
  }
});

BlockGenerator.add(function(nbSegment) {
  return nbSegment > 3;
}, function(nbSegment, startY, index, segment) {
  console.log("Quick jumps")
  if(index != 0) {
    segment.x += World.getHoleMax(0, 8)
  }
});
