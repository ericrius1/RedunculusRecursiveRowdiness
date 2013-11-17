(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    function Firework() {
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 4
      });
      this.exploding = false;
      this.emitterSettings = {
        type: 'sphere',
        radius: 10,
        size: 0.1,
        acceleration: new THREE.Vector3(1, 1, 1),
        colorStart: new THREE.Color('yellow'),
        colorEnd: new THREE.Color('purple'),
        particlesPerSecond: 1000,
        alive: 0,
        opacityEnd: 1,
        emitterDuration: 1.15
      };
    }

    Firework.prototype.init = function() {
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('./assets/star.png')
      });
      this.particleGroup.addPool(10, this.emitterSettings, false);
      return FW.myWorld.scene.add(this.particleGroup.mesh);
    };

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
