// Standard class provides ways to manipulate basic types
class Std {

  static sign() {
    return Math.random() < .5 ? 1 : -1;
  }

  static randFloat(f) {
    return Math.floor(Math.random() * f * 10000) / 10000;
  }

  static randInt(n) {
    return Math.floor(Math.random() * n);
  }

}


class Particle {

  constructor(x, y, context) {
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
  }

  draw(w, h, c, a){
    // TODO : make this a draw function
    //this.color = "rgba(" + 255 + ", " + Std.randInt(100, 255) + ", " + Std.randInt(200, 255) + ", " + this.alpha + ")";
    //this.context.fillStyle = this.color;
    //this.context.fillRect(this.x, this.y, Std.randInt(3), Std.randInt(5)); // Missing width, height, color, alpha

    var size_life_ratio = this.life > 0 ? (10 * this.life / 100) : 0;

    this.color = '#69a34f';

    this.context.beginPath();
    this.context.fillStyle = this.color;

    if(this.circle) {
      this.context.arc(this.x, this.y, size_life_ratio, 0, 2 * Math.PI);  
    }
    else {
      this.context.rect(this.x, this.y, size_life_ratio, size_life_ratio);   
    }
    
    this.context.fill();
  }
  

}


class Zephos {

  constructor() {
    // Contains all particles
    this.particles = [];
  }

  generateParticles(n, x, y, ctx){
    for(var i = 0; i<n; i++) {
      var p = new Particle(x + Std.randFloat(7) * Std.sign(), y + Std.randFloat(7) * Std.sign(), ctx);
      this.particles.push(p);
    }
    return this.particles;
  }

  update(){
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

      p.r += 0.5;


      p.dx *= p.frictX; // friction
      p.dy *= p.frictY;
      

      p.draw();

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

window.Zephos = new Zephos();