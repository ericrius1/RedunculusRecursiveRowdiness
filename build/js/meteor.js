(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var sphereGeo;
      this.generateSpeed();
      this.colorStart = new THREE.Color();
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.meteorTail = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      this.colorEnd = new THREE.Color();
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      sphereGeo = new THREE.SphereGeometry(5, 5, 5);
      this.meteor = new THREE.Object3D();
      this.calculateStartPos();
      this.newMeteor();
      FW.scene.add(this.meteorTail.mesh);
      this.light = new THREE.PointLight(0xefefef, 2, 1000);
      FW.scene.add(this.light);
    }

    Meteor.prototype.generateSpeed = function() {
      this.speedX = .1;
      this.speedY = .1;
      this.speedZ = .1;
      this.accelX = rnd(.01, .05);
      this.accelY = .02;
      this.accelZ = .01;
      this.dirX = rnd(0, 1);
      this.dirY = rnd(-1, 1);
      return this.dirZ = rnd(-1, 1);
    };

    Meteor.prototype.newMeteor = function() {
      this.emitter = new ShaderParticleEmitter({
        position: this.meteor.position,
        size: rnd(0.01, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        acceleration: new THREE.Vector3(-this.dirX, -this.dirY, -this.dirZ),
        accelerationSpread: new THREE.Vector3(.2, .2, .2),
        particlesPerSecond: 1000,
        opacityEnd: 0.5,
        colorStart: this.colorStart,
        colorEnd: this.colorEnd
      });
      this.meteorTail.addEmitter(this.emitter);
      return this.calcPosition();
    };

    Meteor.prototype.calcPosition = function() {
      var distance,
        _this = this;
      distance = FW.camera.position.distanceTo(this.meteor.position);
      if (distance > FW.camera.far) {
        this.generateSpeed();
        this.calculateStartPos();
      }
      return setInterval(function() {
        return _this.calcPosition();
      }, 20000);
    };

    Meteor.prototype.calculateStartPos = function() {
      return this.meteor.position = new THREE.Vector3(-290, 1335, 883);
    };

    Meteor.prototype.tick = function() {
      this.speedX += this.accelX;
      this.speedY += this.accelY;
      this.speedZ += this.accelZ;
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
