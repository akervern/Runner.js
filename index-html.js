/** INITIALIZATION **/

var canvas = document.getElementById('canvas');
canvas.height = 500;
canvas.width = 1000;

var ctx = canvas.getContext('2d');
var gz = {
  height: canvas.height,
  width: canvas.width,
  update: true,
  draw: true,
  x: 0,
  y: 0
}


if(true && window.devicePixelRatio) {
  var hidefCanvasWidth = canvas.getAttribute('width');
  var hidefCanvasHeight = canvas.getAttribute('height');
  var hidefCanvasCssWidth = hidefCanvasWidth;
  var hidefCanvasCssHeight = hidefCanvasHeight;

  canvas.setAttribute('width', hidefCanvasWidth * window.devicePixelRatio);
  canvas.setAttribute('height', hidefCanvasHeight * window.devicePixelRatio);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  gz.height = canvas.height / window.devicePixelRatio
  gz.width = canvas.width / window.devicePixelRatio
  console.log("retina activated")
}

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(f) {
    window.setTimeout(f, 1e3 / 60);
  }
}();

var Y = 20,
  X = 2 * Y,
  DEBUG = false,
  showFPS = true;

// dummy GameCenter
var gc = {}
gc.reportScore = function() {}
