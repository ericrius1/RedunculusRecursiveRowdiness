(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    function Firework() {
      this.fireworkGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        maxAge: 100,
        blending: THREE.AdditiveBlending
      });
      this.fireworkEmitter = new ShaderParticleEmitter({
        type: 'sphere',
        radius: 0.3,
        speed: 2,
        colorStart: new THREE.Color('red'),
        colorSpread: new THREE.Vector3(0, 0.5, 0),
        colorEnd: new THREE.Color('red'),
        size: 1,
        sizeEnd: 0,
        particlesPerSecond: 1000
      });
      this.fireworkGroup.addEmitter(this.fireworkEmitter);
    }

    Firework.prototype.explode = function(pos) {
      FW.myWorld.scene.add(this.fireworkGroup.mesh);
      this.fireworkEmitter.position.set(pos.x, pos.y, pos.z);
      return this.exploding = true;
    };

    Firework.prototype.tick = function() {
      return this.fireworkGroup.tick(0.16);
    };

    return Firework;

  })();

}).call(this);
