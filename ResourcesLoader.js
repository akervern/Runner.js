ResourcesLoader = (function() {
  var that = {};
  var _callback;
  var images = {};

  var totalResources = 0;
  var loadedResources = 0;

  function resourcesLoaded() {
    loadedResources += 1;
    if(loadedResources == totalResources) {
      if(_callback) {
        _callback();
      }
    }
  }

  that.loadImage = function(name, src) {
    totalResources += 1;
    var img = new Image();
    img.onload = function() {
      resourcesLoaded();
    }
    img.src = src;
    images[name] = img;
  }

  that.loadFont = function(name, src, letters) {
    totalResources += 1;
    var img = new Image();
    img.dataset["letters"] = letters;
    img.onload = function() {
      img.dataset["charWidth"] = img.width / letters.length
      resourcesLoaded();
    }
    img.src = src;
    images[name] = img;
  }

  that.getImage = function(name) {
    return images[name];
  }

  that.onload = function(callback) {
    _callback = callback;
    if(totalResources == 0) {
      _callback();
    }
  }

  return that
})();
