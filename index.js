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
const X = 20, Y = 15, DEBUG = false;

console.log(JSON.stringify(gz))

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(f) {
    window.setTimeout(f, 1e3 / 60);
  }
}();

var files = ["utils", "keyController", "Player", "World", "main"];

for (var i = 0; i < files.length; i++) {
  ejecta.include(files[i] + ".js");
}
