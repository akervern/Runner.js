/** INITIALIZATION **/
var w = window.innerWidth;
var h = window.innerHeight;

var canvas = document.getElementById('canvas');
canvas.scalingMode = 'fit-height';

var ctx = canvas.getContext('2d');

var gz = {
  height: canvas.height,
  width: canvas.width,
  update: true,
  draw: true,
}
var Y = 20,
  X = 1.5 * Y,
  DEBUG = false,
  showFPS = true;

console.log(JSON.stringify(gz))

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(f) {
    window.setTimeout(f, 1e3 / 60);
  }
}();

["underscore-min", "utils", "ActionController", "Menu", "Player", "World", "Background", "main"].forEach(function(file) {
  ejecta.include(file + ".js");
})

// At game start
var gc = new Ejecta.GameCenter();
gc.softAuthenticate(function(error) {
  if(error) {
    console.log('Auth failed');
  } else {
    console.log('Auth successful');
  }
});

//Setting up iAd
var adBanner = new Ejecta.AdBanner();
adBanner.isAtBottom = true;
adBanner.show();
