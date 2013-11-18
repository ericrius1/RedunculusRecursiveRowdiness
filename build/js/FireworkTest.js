(function() {
  var FireworkTest;

  FW.FireworkTest = FireworkTest = (function() {
    var rnd;

    rnd = FW.rnd;

    function FireworkTest(pos) {
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 1
      });
      this.emitter = new ShaderParticleEmitter({
        size: 0.1,
        position: new THREE.Vector3(0, 0, 0),
        accelerationSpread: new THREE.Vector3(.2, .2, .2),
        color: new THREE.Vector3(rnd(255), rnd(255), rnd(255)),
        colorSpread: new THREE.Vector3(rnd(100), rnd(100), rnd(100)),
        particlesPerSecond: 100,
        emitterDuration: 2.0
      });
      this.particleGroup.addEmitter(this.emitter);
    }

    FireworkTest.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return FireworkTest;

  })();

}).call(this);
