// Contains all particles.
const ZEPHOS = [];


class Particle {

  constructor(x, y, context) {
    this.x = x;
    this.y = y;

    this.alpha = 1;
    this.color = "rgba(" + 255 + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + this.alpha + ")";

    this.life = getRandomInt(50, 150);
    this.context = context;
    
    ZEPHOS.push(this);
  }
  
  static generateParticles(n, x, y, ctx){
    for(var i = 0; i<n; i++) {
      new Particle(x, y, ctx);
    }
  }
  
  static update(){
    var i = 0;
    var all = ZEPHOS;
    
    while(i<all.length) {
			var p = ZEPHOS[i];
      p.x += getRandomInt(-1, 2);
      p.y += getRandomInt(-1, 2);
      
      p.color = "rgba(" + 255 + ", " + 255 + ", " + getRandomInt(200, 255) + ", " + p.alpha + ")";
      p.context.fillStyle = p.color;
      p.context.fillRect(p.x,p.y, 2, 2);

      if(p.life-- < 0) {
        p.alpha -= 0.05;
      }
      if(p.alpha <= 0) {
        all.splice(i,1);
      }

      i++;
    }
  }
}


// Easy random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 200;

Particle.generateParticles(200,canvas.width/2, canvas.height/2, ctx );


var Loop = function() {
  
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  
  Particle.update();
  
  window.requestAnimFrame(Loop);
};

Loop();