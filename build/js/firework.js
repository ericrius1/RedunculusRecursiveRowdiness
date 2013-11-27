(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework() {
      var i, _i;
      this.colorStart = new THREE.Color();
      this.colorEnd = new THREE.Color();
      this.numFireworksPerExplosion = 3;
      this.lightIndex = 0;
      this.lightDimmingFactor = 0.06;
      this.explodeSound = new Audio('./assets/explosion.mp3');
      this.crackleSound = new Audio('./assets/crackle.mp3');
      this.lights = [];
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
        blending: THREE.AdditiveBlending,
        maxAge: rnd(5, 15)
      });
      for (i = _i = 1; _i <= 10; i = ++_i) {
        this.particleGroup.addPool(1, this.generateEmitter(), true);
      }
      FW.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.generateEmitter = function() {
      var emitterSettings, light;
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      light = new THREE.PointLight(this.colorStart, 0.0, 6000);
      FW.scene.add(light);
      this.lights.push(light);
      return emitterSettings = {
        size: rnd(0.01, 1.3),
        velocity: new THREE.Vector3(rnd(-2, 2), rnd(-2, 2), rnd(-2, 2)),
        acceleration: new THREE.Vector3(0, -0.01, 0),
        accelerationSpread: new THREE.Vector3(rnd(-5, 5), rnd(-5, 5), rnd(-5, 5)),
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5)),
        colorEnd: this.colorEnd,
        particlesPerSecond: rnd(100, 500),
        alive: 0,
        emitterDuration: rnd(1.0, 5.0)
      };
    };

    Firework.prototype.createExplosion = function(origPos, newPos, count) {
      var emitter, light,
        _this = this;
      if (newPos == null) {
        newPos = origPos;
      }
      if (count == null) {
        count = 0;
      }
      emitter = this.particleGroup.triggerPoolEmitter(1, newPos);
      light = this.lights[this.lightIndex++];
      if (this.lightIndex === this.lights.length) {
        this.lightIndex = 0;
      }
      light.position.set(newPos.x, newPos.y, newPos.z);
      light.intensity = 2.0;
      if (count < this.numFireworksPerExplosion) {
        return setTimeout(function() {
          _this.explodeSound.load();
          if (soundOn) {
            setTimeout(function() {
              _this.explodeSound.play();
              return setTimeout(function() {
                return _this.crackleSound.play();
              }, 100);
            }, 100);
          }
          count++;
          newPos = new THREE.Vector3(rnd(origPos.x - 20, origPos.x + 20), rnd(origPos.y - 20, origPos.y + 20), rnd(origPos.z - 20, origPos.z + 20));
          return _this.createExplosion(origPos, newPos, count++);
        }, rnd(100, 700));
      }
    };

    Firework.prototype.tick = function() {
      var light, _i, _len, _ref, _results;
      this.particleGroup.tick(0.16);
      _ref = this.lights;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        light = _ref[_i];
        if (light.intensity > 0) {
          _results.push(light.intensity -= this.lightDimmingFactor);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Firework;

  })();

}).call(this);
