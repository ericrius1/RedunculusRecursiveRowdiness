(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework() {
      var i, _i;
      this.groups = [];
      this.colorStart = new THREE.Color();
      this.colorEnd = new THREE.Color();
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 13
      });
      for (i = _i = 1; _i <= 10; i = ++_i) {
        this.particleGroup.addPool(1, this.generateEmitter(), true);
      }
      FW.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.generateEmitter = function() {
      var emitterSettings;
      this.colorStart.setRGB(rnd(255), rnd(255), rnd(255));
      console.log('color start', this.colorSTart);
      return emitterSettings = {
        size: 0.2,
        acceleration: new THREE.Vector3(0, -0.01, 0),
        accelerationSpread: new THREE.Vector3(rnd(.01, 1), rnd(.01, 1), rnd(.01, 1)),
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(20, 20, 20),
        particlesPerSecond: 100,
        alive: 0,
        emitterDuration: 2.0
      };
    };

    Firework.prototype.createExplosion = function(pos) {
      return this.particleGroup.triggerPoolEmitter(1, pos);
    };

    Firework.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return Firework;

  })();

}).call(this);
