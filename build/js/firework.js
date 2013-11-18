(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework() {
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      this.exploding = false;
      this.emitterSettings = {
        size: 0.1,
        sizeEnd: 0.09,
        acceleration: new THREE.Vector3(0, -0.1, 0),
        accelerationSpread: new THREE.Vector3(.2, .2, .2),
        color: new THREE.Vector3(rnd(255), rnd(255), rnd(255)),
        colorSpread: new THREE.Vector3(rnd(20), rnd(20), rnd(10)),
        particlesPerSecond: 200,
        alive: 0,
        emitterDuration: 1.0,
        opacityEnd: 0.1
      };
      this.particleGroup.addPool(100, this.emitterSettings, false);
      FW.myWorld.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.createExplosion = function(pos) {
      this.exploding = true;
      return this.particleGroup.triggerPoolEmitter(1, pos);
    };

    Firework.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return Firework;

  })();

}).call(this);
