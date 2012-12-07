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
const X = 20, Y = 15, DEBUG = true;

console.log(JSON.stringify(gz))

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(f) {
    window.setTimeout(f, 1e3 / 60);
  }
}();

["underscore-min", "utils", "ActionController", "Player", "World", "Background", "main"].forEach(function(file) {
  ejecta.include(file + ".js");
})
