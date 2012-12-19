var JUMP_KEYCODE = 38;
var SWITCH_KEYCODE = 37;
var PAUSE_KEYCODE = 80;

var JUMP_ZONE = {
  x: 2 / 3 * gz.width,
  y: 0,
  width: gz.width / 3,
  height: gz.height,
  order: 0
}
var SWITCH_ZONE = {
  x: 0,
  y: 0,
  width: gz.width / 3,
  height: gz.height,
  order: 0
}
var PAUSE_ZONE = {
  x: 5 / 6 * gz.width,
  y: 0,
  width: gz.width / 6,
  height: gz.height / 6,
  order: -1
}

ActionController = (function() {
  var controllersD = {};
  var controllersU = {};
  var timeElapsed = {};
  var activeTouches = {};
  var zones = [];

  function convertCoordToKeyCode(pos) {
    var zone = _.find(zones, function(zone) {
      return intersect(pos, zone);
    });
    return zone ? zone.keyCode : false;
  }

  return {
    register: function(keyCode, zone, callbackDown, callbackUp) {
      if(callbackDown) {
        controllersD[keyCode] = callbackDown;
      }

      if(callbackUp) {
        controllersU[keyCode] = callbackUp
      }

      zone.keyCode = keyCode;
      zones.push(zone);
      zones = _.sortBy(zones, function() {
        return zone.order ? zone.order : 0;
      })
    },
    keyDown: function(keyCode) {
      if(controllersD[keyCode]) {
        if(!timeElapsed[keyCode]) { //called only if first press or after key release
          timeElapsed[keyCode] = Date.now();
          controllersD[keyCode]()
        }
      }
    },
    keyUp: function(keyCode) {
      if(controllersU[keyCode]) {
        controllersU[keyCode](Date.now() - timeElapsed[keyCode])
      }
      timeElapsed[keyCode] = null;
    },
    touchStart: function(pos, id) {
      var keyCode = convertCoordToKeyCode(pos);
      if(keyCode) {
        activeTouches[id] = keyCode;
        ActionController.keyDown(keyCode)
      }
    },
    touchEnd: function(id) {
      var keyCode = activeTouches[id]
      if(keyCode != null) {
        ActionController.keyUp(keyCode)
        activeTouches[id] = null;
      }
    }
  }
}());

// Game play with keyboard !
window.addEventListener('keydown', function(e) {
  if(ActionController.keyDown(e.keyCode)) e.preventDefault();
}, false);

window.addEventListener('keyup', function(e) {
  if(ActionController.keyUp(e.keyCode)) e.preventDefault();
}, false);

// Game play on touch !
window.addEventListener('touchstart', function(e) {
  _.each(e.touches, function(touch, index) {
    var pos = {
      x: touch.pageX,
      y: touch.pageY
    };

    ActionController.touchStart(pos, touch.identifier);
  });
}, false);

window.addEventListener('touchend', function(e) {
  _.each(e.changedTouches, function(touch, index) {
    ActionController.touchEnd(touch.identifier);
  })
}, false);
