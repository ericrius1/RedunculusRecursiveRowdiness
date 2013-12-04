(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var sphereGeo;
      this.speed = 1;
      this.acceleration = 0.01;
      this.dirX = rnd(-1, 1);
      this.dirY = rnd(-1, 1);
      this.dirZ = rnd(-1, 1);
      this.startingPos = new THREE.Vector3(-992, 820, 1165);
      this.meteorTail = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      sphereGeo = new THREE.SphereGeometry(5, 5, 5);
      this.meteorHead = new THREE.Mesh(sphereGeo, FW.rocketMat);
      this.meteorHead.position.copy(this.startingPos);
      this.newMeteor();
      FW.scene.add(this.meteorHead);
      FW.scene.add(this.meteorTail.mesh);
    }

    Meteor.prototype.newMeteor = function() {
      this.emitter = new ShaderParticleEmitter({
        position: this.meteorHead.position,
        size: rnd(0.01, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        acceleration: new THREE.Vector3(-this.dirX, -this.dirY, -this.dirZ),
        accelerationSpread: new THREE.Vector3(.2, .2, .2),
        particlesPerSecond: rnd(100, 500),
        opacityEnd: 0.5
      });
      this.meteorTail.addEmitter(this.emitter);
      return this.calcDistance();
    };

    Meteor.prototype.calcDistance = function() {
      var _this = this;
      return setInterval(function() {
        var distance;
        distance = FW.camera.position.distanceTo(_this.meteorHead.position);
        if (distance > FW.camera.far / 10) {
          console.log(_this.startingPos);
          return _this.meteorHead.position.copy(_this.startingPos);
        }
      }, 1000);
    };

    Meteor.prototype.tick = function() {
      this.meteorHead.translateX(this.speed * this.dirZ);
      this.meteorHead.translateY(this.speed * this.dirY);
      this.emitter.position.x = this.meteorHead.position.x;
      this.emitter.position.y = this.meteorHead.position.y;
      return this.meteorTail.tick(0.16);
    };

    return Meteor;

  })();

}).call(this);
