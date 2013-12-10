(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      this.generateSpeed();
      this.startingPos = new THREE.Vector3(0, 700, 0);
      this.colorStart = new THREE.Color();
      this.colorEnd = new THREE.Color();
      this.meteorVisibleDistance = 3000;
      this.newMeteor();
      this.light = new THREE.PointLight(0xefefef, 2, 699);
      FW.scene.add(this.light);
    }

    Meteor.prototype.generateSpeed = function() {
      this.speedX = rnd(5, 10);
      this.speedY = rnd(0.1, 0.5);
      this.speedZ = rnd(5, 10);
      this.accelX = .01;
      this.accelY = .01;
      this.accelZ = .01;
      this.dirX = rnd(-1, 1);
      this.dirY = -1;
      return this.dirZ = rnd(1, -1);
    };

    Meteor.prototype.newMeteor = function() {
      var _ref;
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      FW.scene.remove((_ref = this.meteorTail) != null ? _ref.mesh : void 0);
      this.meteorTail = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      this.meteor = new THREE.Object3D();
      this.meteor.position = new THREE.Vector3().copy(this.startingPos);
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      this.emitter = new ShaderParticleEmitter({
        position: this.meteor.position,
        size: rnd(0.1, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        acceleration: new THREE.Vector3(-this.dirX, -this.dirY, -this.dirZ),
        accelerationSpread: new THREE.Vector3(.2, .2, .2),
        particlesPerSecond: 1000,
        colorStart: this.colorStart,
        colorEnd: this.colorEnd
      });
      FW.scene.add(this.meteorTail.mesh);
      this.meteorTail.addEmitter(this.emitter);
      return this.calcPosition();
    };

    Meteor.prototype.calcPosition = function() {
      var distance,
        _this = this;
      distance = FW.camera.position.distanceTo(this.meteor.position);
      if (distance > this.meteorVisibleDistance) {
        this.generateSpeed();
        this.newMeteor();
      }
      return setInterval(function() {
        return _this.calcPosition();
      }, 10000);
    };

    Meteor.prototype.tick = function() {
      this.speedX += this.accelX;
      this.speedY += this.accelY;
      this.speedZ += this.accelY;
      this.meteor.translateX(this.speedX * this.dirX);
      this.meteor.translateY(this.speedY * this.dirY);
      this.meteor.translateZ(this.speedZ * this.dirZ);
      this.emitter.position = new THREE.Vector3().copy(this.meteor.position);
      this.light.position = new THREE.Vector3().copy(this.meteor.position);
      return this.meteorTail.tick(0.16);
    };

    return Meteor;

  })();

}).call(this);
