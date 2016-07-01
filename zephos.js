// Standard Object provides ways to manipulate basic types
Std = {
  sign: function () {
    return Math.random() < .5 ? 1 : -1;
  },

  randFloat: function (f) {
    return Math.floor(Math.random() * f * 10000) / 10000;
  },

  randInt: function (n) {
    return Math.floor(Math.random() * n);
  }
};



Particle = function (x, y, context) {
  this.x = x;
  this.y = y;

  this.dx = Std.randFloat(0.8) * Std.sign();
  this.dy = - Std.randFloat(0.8);


  this.gx = Std.randFloat(0.02) * Std.sign();
  this.gy = Std.randFloat(0.02) * Std.sign();


  this.frictX = 0.95+Std.randInt(0,40)/1000;
  this.frictY = 0.97;



  this.alpha = 1;
  this.color = "#FFF";
  this.circle = false;

  this.life = Std.randInt(50, 150);
  this.context = context;
  
  return this;
};

Particle.prototype.draw = function (w, h, c, a, options) {

  // TODO : make this a draw function
  //this.color = "rgba(" + 255 + ", " + Std.randInt(100, 255) + ", " + Std.randInt(200, 255) + ", " + this.alpha + ")";
  //this.context.fillStyle = this.color;
  //this.context.fillRect(this.x, this.y, Std.randInt(3), Std.randInt(5)); // Missing width, height, color, alpha


  if(options.decrease) {
    var size = this.life > 0 ? (10 * this.life / 100) : 0;  
  }
  else {
    size = 2;
  }
  

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
};






//     Backbone.js 1.3.3

//     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Zephos = factory(root, exports);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    factory(root, exports);

  // Finally, as a browser global.
  } else {
    root.Zephos = factory(root, {});
  }

})(function(root) {

  var Zephos = {
    particles: [],

    generateParticles: function (n, x, y, ctx){
      for(var i = 0; i<n; i++) {
        var p = new Particle(x + Std.randFloat(7) * Std.sign(), y + Std.randFloat(7) * Std.sign(), ctx);
        this.particles.push(p);
      }
      return this.particles;
    },

    update: function (){
      var i = 0;
      var all = this.particles;
      
      while(i<all.length) {

        // Get the particle from the list
        var p = all[i];

        p.x += p.dx; // movement
        p.y += p.dy;

        // p.dx += p.gx - 0.06; // with wind
        p.dx += p.gx; // gravity TODO : implement wind correctly wind
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
    }
  };

  return Zephos;
});

// window.Zephos = new Zephos();