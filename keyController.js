keyController = (function() {
  var controllersD = {};
  var controllersU = {};
  var timeElapsed = {};

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
        var now = Date.now();
        if (!timeElapsed[keyCode]) { //called only if first press or after key release
          timeElapsed[keyCode] = now;
        }
        var diff = Math.abs(now - timeElapsed[keyCode]);
        controllersD[keyCode](diff)
      }
    },
    keyUp: function(keyCode) {
      if(controllersU[keyCode]) {
        controllersU[keyCode](Date.now() - timeElapsed[keyCode])
        timeElapsed[keyCode] = null;
      }
    }
  }
}());

window.addEventListener('keydown', function(e) {
  if(keyController.keyDown(e.keyCode)) e.preventDefault();
}, false);

window.addEventListener('keyup', function(e) {
  if(keyController.keyUp(e.keyCode)) e.preventDefault();
}, false);
