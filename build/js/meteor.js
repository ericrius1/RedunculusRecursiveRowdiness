(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var sphereGeo;
      this.generateSpeed();
      this.startingPos = new THREE.Vector3(-992, 820, 1165);
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
      this.meteorHead = new THREE.Mesh(sphereGeo, FW.rocketMat);
      this.meteorHead.position.copy(this.startingPos);
      this.newMeteor();
      FW.scene.add(this.meteorHead);
      FW.scene.add(this.meteorTail.mesh);
      this.light = new THREE.PointLight(0xefefef, 2, 2000);
      FW.scene.add(this.light);
    }

    Meteor.prototype.generateSpeed = function() {
      this.speedX = .1;
      this.speedY = .1;
      this.speedZ = .1;
      this.accelX = rnd(.01, .05);
      this.accelY = .02;
      this.accelZ = .01;
      this.dirX = rnd(-1, 1);
      this.dirY = rnd(-1, 1);
      return this.dirZ = rnd(-1, 1);
    };

    Meteor.prototype.newMeteor = function() {
      this.emitter = new ShaderParticleEmitter({
        position: this.meteorHead.position,
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
      return this.calcDistance();
    };

    Meteor.prototype.calcDistance = function() {
      var _this = this;
      return setInterval(function() {
        var distance;
        distance = FW.camera.position.distanceTo(_this.meteorHead.position);
        if (distance > FW.camera.far / 4) {
          _this.generateSpeed();
          _this.meteorHead.position.copy(_this.startingPos);
          return _this.emit;
        }
      }, 1000);
    };

    Meteor.prototype.tick = function() {
      this.speedX += this.accelX;
      this.speedY += this.accelY;
      this.speedZ += this.accelZ;
      this.meteorHead.translateX(this.speedX * this.dirX);
      this.meteorHead.translateY(this.speedY * this.dirY);
      this.meteorHead.translateZ(this.speedZ * this.dirZ);
      this.emitter.position = new THREE.Vector3().copy(this.meteorHead.position);
      this.light.position = new THREE.Vector3().copy(this.meteorHead.position);
      return this.meteorTail.tick(0.16);
    };

    return Meteor;

  })();

}).call(this);
