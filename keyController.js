keyController = (function() {
  var controllersD = {};
  var controllersU = {};

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
        controllersD[keyCode](keyCode)
      }
    },
    keyUp: function(keyCode) {
      if(controllersU[keyCode]) {
        controllersU[keyCode](keyCode)
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
