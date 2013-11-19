(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework(color) {
      this.color = color;
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 7
      });
      console.log(color, this.color);
      this.emitterSettings = {
        size: 0.2,
        acceleration: new THREE.Vector3(0, -0.1, 0),
        accelerationSpread: new THREE.Vector3(.2, .2, .2),
        colorStart: this.color,
        particlesPerSecond: 500,
        alive: 0,
        emitterDuration: 1.0
      };
      this.particleGroup.addPool(10, this.emitterSettings, false);
      FW.myWorld.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.createExplosion = function(pos) {
      return this.particleGroup.triggerPoolEmitter(1, pos);
    };

    Firework.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return Firework;

  })();

}).call(this);
