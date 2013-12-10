(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var i, _i;
      this.startingPos = new THREE.Vector3(0, 700, 0);
      this.colorStart = new THREE.Color();
      this.colorEnd = new THREE.Color();
      this.meteors = [];
      this.meteorGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      this.meteorVisibleDistance = 3000;
      for (i = _i = 1; _i <= 3; i = ++_i) {
        this.newMeteor();
      }
      FW.scene.add(this.meteorGroup.mesh);
      this.calcPositions();
    }

    Meteor.prototype.generateSpeed = function(meteor) {
      meteor.speedX = rnd(0.1, 1);
      meteor.speedY = .05;
      meteor.speedZ = rnd(0.1, 1);
      meteor.accelX = .1;
      meteor.accelY = 0.001;
      meteor.accelZ = .1;
      meteor.dirX = rnd(-1, 1);
      meteor.dirY = -1;
      return meteor.dirZ = rnd(1, -1);
    };

    Meteor.prototype.newMeteor = function() {
      var meteor, tailEmitter;
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      meteor = new THREE.Object3D();
      this.generateSpeed(meteor);
      meteor.position = new THREE.Vector3().copy(this.startingPos);
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      meteor.light = new THREE.PointLight(0xefefef, 2, 799);
      FW.scene.add(meteor.light);
      tailEmitter = new ShaderParticleEmitter({
        position: meteor.position,
        size: 10,
        sizeSpread: 10,
        accelerationSpread: new THREE.Vector3(.4, .4, .4),
        particlesPerSecond: 5000,
        colorStart: this.colorStart,
        colorEnd: this.colorEnd
      });
      this.meteorGroup.addEmitter(tailEmitter);
      return this.meteors.push(meteor);
    };

    Meteor.prototype.calcPositions = function() {
      var distance, meteor, _i, _len, _ref,
        _this = this;
      _ref = this.meteors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        meteor = _ref[_i];
        distance = FW.camera.position.distanceTo(meteor.position);
        if (distance > this.meteorVisibleDistance) {
          this.generateSpeed(meteor);
          meteor.position = new THREE.Vector3().copy(this.startingPos);
        }
      }
      return setInterval(function() {
        return _this.calcPositions();
      }, 10000);
    };

    Meteor.prototype.tick = function() {
      var meteor, _i, _len, _ref;
      _ref = this.meteors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        meteor = _ref[_i];
        meteor.speedX += meteor.accelX;
        meteor.speedY += meteor.accelY;
        meteor.speedZ += meteor.accelZ;
        meteor.translateX(meteor.speedX * meteor.dirX);
        meteor.translateY(meteor.speedY * meteor.dirY);
        meteor.translateZ(meteor.speedZ * meteor.dirZ);
        meteor.light.position = new THREE.Vector3().copy(meteor.position);
      }
      return this.meteorGroup.tick(0.16);
    };

    return Meteor;

  })();

}).call(this);
