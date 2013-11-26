(function() {
  var Rockets;

  FW.Rockets = Rockets = (function() {
    var rnd;

    rnd = FW.rnd;

    function Rockets() {
      rnd = FW.rnd;
      this.rockets = [];
      this.launchSound = new Audio('./assets/launch.mp3');
      this.explodeSound = new Audio('./assets/explosion.mp3');
      this.crackleSound = new Audio('./assets/crackle.mp3');
      this.soundOn = false;
      this.color = new THREE.Color();
      this.color.setRGB(200, 10, 0);
      this.firework = new FW.Firework(this.color);
      this.projector = new THREE.Projector();
      this.launchSpeed = 0.8;
      this.launchSpeedY = 1.0;
      this.explosionDelay = 500;
      this.shootDirection = new THREE.Vector3();
      this.dimmingSpeed = 0.008;
      this.explosionLightIntensity = 2.0;
      this.rocketMat = new THREE.ShaderMaterial({
        uniforms: uniforms1,
        vertexShader: document.getElementById('rocketVertexShader').textContent,
        fragmentShader: document.getElementById('fragment_shader1').textContent
      });
      this.rocketGeo = new THREE.CylinderGeometry(.1, 1, 1);
      this.light = new THREE.PointLight(0xffeeee, 0.0, 4000);
      this.light.position.set(1, 1, 1);
      FW.scene.add(this.light);
    }

    Rockets.prototype.explode = function(position) {
      var _this = this;
      this.light.intensity = this.explosionLightIntensity;
      this.light.position.set(position.x, position.y, position.z);
      this.firework.createExplosion(position);
      if (this.soundOn) {
        return setTimeout(function() {
          _this.explodeSound.play();
          return setTimeout(function() {}, 400);
        }, 500);
      }
    };

    Rockets.prototype.launchRocket = function() {
      var ray, rocket, vector,
        _this = this;
      this.launchSound.load();
      this.explodeSound.load();
      this.crackleSound.load();
      rocket = new THREE.Mesh(this.rocketGeo, this.rocketMat);
      rocket.position.set(FW.camera.position.x, FW.camera.position.y, FW.camera.position.z);
      this.rockets.push(rocket);
      vector = new THREE.Vector3();
      vector.set(0, 0, 1);
      this.projector.unprojectVector(vector, FW.camera);
      ray = new THREE.Ray(FW.camera.position, vector.sub(FW.camera.position).normalize());
      FW.scene.add(rocket);
      rocket.shootDirection = new THREE.Vector3();
      rocket.shootDirection.x = ray.direction.x;
      rocket.shootDirection.y = ray.direction.y;
      rocket.shootDirection.z = ray.direction.z;
      rocket.launchSpeedY = 0.0;
      rocket.translateX(rocket.shootDirection.x);
      rocket.translateY(rocket.shootDirection.y);
      rocket.translateZ(rocket.shootDirection.z);
      if (this.soundOn) {
        this.launchSound.play();
      }
      this.rockets.push(rocket);
      return setTimeout(function() {
        FW.scene.remove(rocket);
        return _this.explode(rocket.position);
      }, this.explosionDelay);
    };

    Rockets.prototype.update = function() {
      var rocket, _i, _len, _ref;
      if (this.light.intensity > 0) {
        this.light.intensity -= this.dimmingSpeed * this.explosionLightIntensity;
      }
      _ref = this.rockets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rocket = _ref[_i];
        this.updateRocket(rocket);
      }
      return this.firework.tick();
    };

    Rockets.prototype.updateRocket = function(rocket) {
      rocket.translateX(this.launchSpeed * rocket.shootDirection.x);
      rocket.translateY(this.launchSpeed * rocket.shootDirection.y);
      rocket.translateZ(this.launchSpeed * rocket.shootDirection.z);
      rocket.translateY(rocket.launchSpeedY);
      return rocket.launchSpeedY -= .005;
    };

    return Rockets;

  })();

}).call(this);
