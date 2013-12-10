(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var sphereGeo;
      this.generateSpeed();
      this.startingPos = new THREE.Vector3(0, 700, 0);
      this.colorStart = new THREE.Color();
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.meteorVisibleDistance = 5000;
      this.meteorTail = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      this.colorEnd = new THREE.Color();
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      sphereGeo = new THREE.SphereGeometry(5, 5, 5);
      this.meteor = new THREE.Object3D();
      this.meteor.position = new THREE.Vector3().copy(this.startingPos);
      this.newMeteor();
      FW.scene.add(this.meteorTail.mesh);
      this.light = new THREE.PointLight(0xefefef, 2, 1000);
      FW.scene.add(this.light);
    }

    Meteor.prototype.generateSpeed = function() {
      this.speedX = 10;
      this.speedY = .5;
      this.speedZ = 10;
      this.dirX = rnd(-1, 1);
      this.dirY = -1;
      return this.dirZ = rnd(1, -1);
    };

    Meteor.prototype.newMeteor = function() {
      this.emitter = new ShaderParticleEmitter({
        position: this.meteor.position,
        size: rnd(0.01, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        acceleration: new THREE.Vector3(-this.dirX, -this.dirY, -this.dirZ),
        accelerationSpread: new THREE.Vector3(.2, .2, .2),
        particlesPerSecond: 1000,
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
      if (distance > this.meteorVisibleDistance) {
        this.generateSpeed();
        this.meteor.position = new THREE.Vector3().copy(this.startingPos);
      }
      return setInterval(function() {
        return _this.calcPosition();
      }, 20000);
    };

    Meteor.prototype.tick = function() {
      this.speedX;
      this.speedY;
      this.speedZ;
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
