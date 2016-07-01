//     Zephos.js 0.1.0

//     (c) 2016 Arthur Kirsz
//     Zephos may be freely distributed under the MIT license.

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  // Set up Zephos appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Zephos.
      root.Zephos = factory(root, exports);
    });

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined') {
    factory(root, exports);

  // Finally, as a browser global.
  } else {
    root.Zephos = factory(root, {});
  }

})(function(root, Zephos) {

  // Current version of the library.
  Zephos.VERSION = '0.1.0';

  // Utils provides ways to manipulate basic types
  var Utils = Zephos.Utils = {};
  
  Utils.sign = function () {
    return Math.random() < .5 ? 1 : -1;
  };

  Utils.randFloat = function (f) {
    return Math.floor(Math.random() * f * 10000) / 10000;
  },

  Utils.randInt = function (n) {
    return Math.floor(Math.random() * n);
  };




  var Particle = Zephos.Particle = function (x, y, context) {
    this.x = x;
    this.y = y;

    this.dx = Utils.randFloat(0.8) * Utils.sign();
    this.dy = - Utils.randFloat(0.8);


    this.gx = Utils.randFloat(0.02) * Utils.sign();
    this.gy = Utils.randFloat(0.02) * Utils.sign();


    this.frictX = 0.95+Utils.randInt(0,40)/1000;
    this.frictY = 0.97;



    this.alpha = 1;
    this.color = "#FFF";
    this.circle = false;

    this.life = Utils.randInt(50, 150);
    this.context = context;
    
    return this;
  };

  Particle.prototype.draw = function (w, h, c, a, options) {

    // TODO : make this a draw function
    //this.color = "rgba(" + 255 + ", " + Utils.randInt(100, 255) + ", " + Utils.randInt(200, 255) + ", " + this.alpha + ")";
    //this.context.fillStyle = this.color;
    //this.context.fillRect(this.x, this.y, Utils.randInt(3), Utils.randInt(5)); // Missing width, height, color, alpha


    if(options.decrease) {
      var size = this.life > 0 ? (10 * this.life / 100) : 0;  
    }
    else {
      size = 2;
    }
    

    if(this.alpha) {
      this.color = '#69a34f';
      this.color = "rgba(105, 163, 79, "+ this.alpha + ")";

      this.context.beginPath();
      this.context.fillStyle = this.color;

      if(this.circle) {
        this.context.arc(this.x, this.y, size, 0, 2 * Math.PI);  
      }
      else {
        this.context.rect(this.x, this.y, size, size);   
      }
      
      this.context.fill();
    } 
  };


  Zephos.particles = [];
  Zephos.generateParticles = function (n, x, y, ctx) {
    for(var i = 0; i<n; i++) {
      var p = new Particle(x + Utils.randFloat(7) * Utils.sign(), y + Utils.randFloat(7) * Utils.sign(), ctx);
      this.particles.push(p);
    }
    return this.particles;
  };

  Zephos.update = function () {

    var i = 0;
    var all = this.particles;
    
    while(i<all.length) {

      // Get the particle from the list
      var p = all[i];

      p.x += p.dx; // movement
      p.y += p.dy;

      // TODO : implement wind correctly wind
      // p.dx += p.gx - 0.06; // with wind

      
      p.dx += p.gx; // gravity 
      p.dy += p.gy;


      p.dx *= p.frictX; // friction
      p.dy *= p.frictY;
      

      p.draw(null, null, null, null, {decrease: false});

      if(p.life-- < 0) {
        p.alpha -= 0.05;
      }
      if(p.alpha <= 0) {
        all.splice(i,1);
      }

      i++;
    }
  };

  return Zephos;
});

// window.Zephos = new Zephos();