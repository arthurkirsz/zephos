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

  Utils.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  };



  /*
   * Particle Class
   *
   * context: 2DRendringContext
   * options: Object containing specific 
   *   x : The position on X axis of the particle when it spawns
   *   y : The position on Y axis of the particle when it spawns
   *   size : The size of the particle (or the radius if circle)
   *   life : The life length of the Particle
   *   frictY : Friction on Y axis
   *   gx : Gravity on X axis
   *   gy : Gravity on Y axis
   *
   *
   */
  var Particle = Zephos.Particle = function (x, y, size,  context) {
    this.x = x;
    this.y = y;

    this.size = size;


    this.dx = Utils.randFloat(0.8) * Utils.sign();
    this.dy = - Utils.randFloat(0.8);


    this.gx = Utils.randFloat(0.02) * Utils.sign();
    this.gy = Utils.randFloat(0.02) * Utils.sign();


    this.frictX = 0.95+Utils.randInt(0,40)/1000;
    this.frictY = 0.97;



    this.alpha = 1;
    this.color = "#FFF";
    this.circle = false;

    this.life = Utils.randInt(40);
    this.context = context;
    
    return this;

    // TODO : make documentation for mendatory properties for a Particle instance
    // for(var property in options) {
    //     if(options.hasOwnProperty(property)) {
    //         this[property] = options[property];
    //     }
    // }
    
    return this;
  };

  Particle.prototype.setEffect = function (effect) {
    switch(effect) {
      case 'dust': 
        this.dx = Utils.randFloat(0.8) * Utils.sign();
        this.dy = - Utils.randFloat(0.8);

        this.gx = Utils.randFloat(0.02) * Utils.sign();
        this.gy = Utils.randFloat(0.02) * Utils.sign();

        this.frictX = 0.95+Utils.randInt(0,40)/1000;
        this.frictY = 0.97;

        this.alpha = 1;
      break;
      case 'snow': 
        this.size = 1.5 + Utils.randInt(2);
        this.gx = - 0.08;
        this.gy = 0.001;
        this.frictY = 1.0000001;
        this.life = 1000;
        this.dy = Math.abs(this.dy);
        this.circle = true;
      break;
    }
  };


  Particle.prototype.draw = function (options) {

    this.size = (options.decrease) ? (this.life > 0 ? (this.size * this.life / 100) : 0) : this.size;

    // Do not draw hidden particles (flashing problems)
    if(this.alpha) {
      // TODO : make color hex to rgba dynamic
      // this.color = '#69a34f';
      // this.color = "rgba(105, 163, 79, "+ this.alpha + ")";
      this.color = '#FFF';
      //var color = Utils.hexToRgb(this.color);



      //this.color = (color != null) ? "rgba(" + color.r + ", " + color.g + ", " + color.b + ", "+ this.alpha + ")" : this.color;
      this.context.beginPath();

      // TODO : handle arrays of colors with dynamic choosing :)
      this.context.fillStyle = this.color;

      if(this.circle) {
        this.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  
      }
      else {
        this.context.rect(this.x, this.y, this.size, this.size);   
      }
      
      this.context.fill();
    } 
  };


  Zephos.particles = [];
  Zephos.spawn = function (number, x, y, size, life) {
    for(var i = 0; i < number; i++) {
      var p = new Particle(x + Utils.randFloat(7) * Utils.sign(), y + Utils.randFloat(7) * Utils.sign(), size, Zephos.context);

      //var p = new Particle(Zephos.context, options);
      this.particles.push(p);

    }
    return this.particles;
  };

  Zephos.initialize = function (ctx) {
    Zephos.context = Zephos.c = ctx;
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
      

      p.draw({decrease: false});

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