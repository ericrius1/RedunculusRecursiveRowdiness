(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework() {
      this.groups = [];
      this.color = new THREE.Color();
      this.color.setRGB(200, 0, 0);
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 13
      });
      this.emitterSettings = {
        size: 0.2,
        acceleration: new THREE.Vector3(0, -0.01, 0),
        accelerationSpread: new THREE.Vector3(.2, .2, .02),
        colorStart: this.color,
        particlesPerSecond: 100,
        alive: 0,
        emitterDuration: 2.0
      };
      this.particleGroup.addPool(20, this.emitterSettings, true);
      this.color.setRGB(0, 0, 200);
      this.emitterSettings.colorStart = this.color;
      this.particleGroup.addPool(1, this.emitterSettings, true);
      FW.scene.add(this.particleGroup.mesh);
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
