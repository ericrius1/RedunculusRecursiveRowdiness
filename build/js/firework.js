(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework() {
      var i, _i;
      this.colorStart = new THREE.Color();
      this.colorEnd = new THREE.Color();
      this.numFireworksPerExplosion = rnd(2, 5);
      this.lightIndex = 0;
      this.fwSpread = 100;
      this.fwAge = 15;
      this.startLightIntensity = 4;
      this.lightDimmingFactor = .5 / this.fwAge;
      this.explodeSound = new Audio('./assets/explosion.mp3');
      this.crackleSound = new Audio('./assets/crackle.mp3');
      this.lights = [];
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 6
      });
      for (i = _i = 1; _i <= 10; i = ++_i) {
        this.particleGroup.addPool(1, this.generateEmitter(), false);
      }
      FW.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.generateEmitter = function() {
      var emitterSettings, light;
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      light = new THREE.PointLight(this.colorStart, 0.0, 5000);
      FW.scene.add(light);
      this.lights.push(light);
      return emitterSettings = {
        size: rnd(0.01, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        velocity: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)),
        acceleration: new THREE.Vector3(0, -0.01, 0),
        accelerationSpread: new THREE.Vector3(rnd(-2, 0), rnd(-2, 0), rnd(-2, 0)),
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5)),
        colorEnd: this.colorEnd,
        particlesPerSecond: rnd(100, 500),
        alive: 0,
        emitterDuration: rnd(1.0, 5.0),
        opacityEnd: 0.1
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
      light.intensity = this.startLightIntensity;
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
          newPos = new THREE.Vector3(rnd(origPos.x - _this.fwSpread, origPos.x + _this.fwSpread), rnd(origPos.y - _this.fwSpread, origPos.y + _this.fwSpread), rnd(origPos.z - _this.fwSpread, origPos.z + _this.fwSpread));
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
