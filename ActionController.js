const JUMP_KEYCODE = 38;
const SWITCH_KEYCODE = 37;
const PAUSE_KEYCODE = 32;

const JUMP_ZONE = {
  x: 2 / 3 * gz.width,
  y: 0,
  width: gz.width / 3,
  height: gz.height
}
const SWITCH_ZONE = {
  x: 0,
  y: 0,
  width: gz.width / 3,
  height: gz.height
}

ActionController = (function() {
  var controllersD = {};
  var controllersU = {};
  var timeElapsed = {};
  var activeTouches = {};

  function convertCoordToKeyCode(pos) {
    // XXX a bit dirty :]
    if(intersect(pos, JUMP_ZONE)) {
      return JUMP_KEYCODE;
    } else if(intersect(pos, SWITCH_ZONE)) {
      return SWITCH_KEYCODE;
    }
    return false;
  }

  return {
    register: function(keyCode, callbackDown, callbackUp) {
      if(callbackDown) {
        controllersD[keyCode] = callbackDown;
      }

      if(callbackUp) {
        controllersU[keyCode] = callbackUp
      }
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
    console.log(index + "(" + touch.identifier + ") -- " + touch.pageX + ":" + touch.pageY)
  });
}, false);

window.addEventListener('touchend', function(e) {
  _.each(e.changedTouches, function(touch, index) {
    ActionController.touchEnd(touch.identifier);
    console.log(index + "(" + touch.identifier + ")");
  })
}, false);
