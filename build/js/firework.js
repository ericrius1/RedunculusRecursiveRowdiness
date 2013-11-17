(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    function Firework() {
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        maxAge: 100,
        blending: THREE.AdditiveBlending
      });
      this.exploding = false;
      this.emitterSettings = {
        type: 'sphere',
        positionSpread: new THREE.Vector3(10, 10, 10),
        radius: 1,
        speed: 100,
        size: 30,
        sizeSpread: 30,
        sizeEnd: 0,
        opacityStart: 1,
        opacityEnd: 0,
        colorStart: new THREE.Color('yellow'),
        colorSpread: new THREE.Vector3(0, 10, 0),
        colorEnd: new THREE.Color('red'),
        particlesPerSecond: 2000,
        alive: 0,
        emitterDuration: 0.05
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
