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
      for (i = _i = 1; _i <= 15; i = ++_i) {
        this.particleGroup.addPool(1, this.generateEmitter(), true);
      }
      FW.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.generateEmitter = function() {
      var emitterSettings;
      this.colorStart.setRGB(Math.random(255), Math.random(255), Math.random(255));
      this.colorEnd.setRGB(Math.random(255), Math.random(255), Math.random(255));
      return emitterSettings = {
        size: 0.2,
        acceleration: new THREE.Vector3(0, -0.01, 0),
        accelerationSpread: new THREE.Vector3(rnd(.02, 1.5), rnd(.02, 1.5), rnd(.02, 1.5)),
        colorStart: this.colorStart,
        colorEnd: this.colorEnd,
        particlesPerSecond: 300,
        alive: 0,
        emitterDuration: 3.0
      };
    };

    Firework.prototype.createExplosion = function(pos) {
      var _this = this;
      this.particleGroup.triggerPoolEmitter(1, pos);
      return setTimeout(function() {
        console.log("position", pos);
        return _this.createExplosion(pos);
      }, 1000);
    };

    Firework.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return Firework;

  })();

}).call(this);
