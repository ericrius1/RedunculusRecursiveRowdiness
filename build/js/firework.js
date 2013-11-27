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
        texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 8
      });
      for (i = _i = 1; _i <= 25; i = ++_i) {
        this.particleGroup.addPool(1, this.generateEmitter(), true);
      }
      FW.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.generateEmitter = function() {
      var emitterSettings;
      this.colorStart.setRGB(Math.random(255), Math.random(255), Math.random(255));
      this.colorEnd.setRGB(Math.random(255), Math.random(255), Math.random(255));
      return emitterSettings = {
        size: rnd(0.01, 0.3),
        acceleration: new THREE.Vector3(0, -0.01, 0),
        accelerationSpread: new THREE.Vector3(rnd(.0001, 1.5), rnd(.0001, 1.5), rnd(.0001, 1.5)),
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(10, 10, 10),
        colorEnd: this.colorEnd,
        particlesPerSecond: 300,
        alive: 0,
        emitterDuration: 3.0
      };
    };

    Firework.prototype.createExplosion = function(origPos, newPos, count) {
      var _this = this;
      if (newPos == null) {
        newPos = origPos;
      }
      if (count == null) {
        count = 0;
      }
      this.particleGroup.triggerPoolEmitter(2, newPos);
      if (count < 5) {
        return setTimeout(function() {
          count++;
          newPos = new THREE.Vector3(rnd(origPos.x - 20, origPos.x + 20), rnd(origPos.y - 20, origPos.y + 20), rnd(origPos.z - 20, origPos.z + 20));
          return _this.createExplosion(origPos, newPos, count++);
        }, rnd(100, 500));
      }
    };

    Firework.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return Firework;

  })();

}).call(this);
