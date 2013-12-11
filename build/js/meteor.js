(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var i, _i;
      this.startingPos = new THREE.Vector3(0, 1000, 0);
      this.startYRange = 3000;
      this.meteors = [];
      this.activeMeteors = [];
      this.currentMeteorIndex = 0;
      this.meteorGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      this.meteorVisibleDistance = 3000;
      for (i = _i = 1; _i <= 10; i = ++_i) {
        this.newMeteor();
      }
      FW.scene.add(this.meteorGroup.mesh);
      this.activeMeteors.push(this.meteors[0]);
      this.calcPositions();
    }

    Meteor.prototype.generateSpeed = function(meteor) {
      meteor.speedX = rnd(0.1, 1);
      meteor.speedY = .05;
      meteor.speedZ = rnd(0.1, 1);
      meteor.accelX = rnd(.01, .1);
      meteor.accelY = 0.005;
      meteor.accelZ = rnd(.01, .1);
      meteor.dirX = rnd(-1, 1);
      meteor.dirY = -1;
      return meteor.dirZ = rnd(1, -1);
    };

    Meteor.prototype.newMeteor = function() {
      var colorEnd, colorStart, meteor;
      colorStart = new THREE.Color();
      colorStart.setRGB(Math.random(), Math.random(), Math.random());
      meteor = new THREE.Object3D();
      this.generateSpeed(meteor);
      meteor.position = new THREE.Vector3(this.startingPos.x, rnd(this.startingPos.y, this.startingPos.y + this.startYRange), this.startingPos.z);
      colorEnd = new THREE.Color();
      colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      meteor.light = new THREE.PointLight(colorStart, 0, 1000);
      FW.scene.add(meteor.light);
      meteor.tailEmitter = new ShaderParticleEmitter({
        position: meteor.position,
        positionSpread: new THREE.Vector3(20, 20, 20),
        size: rnd(100, 200),
        sizeSpread: 100,
        sizeEnd: rnd(20, 50),
        acceleration: new THREE.Vector3(meteor.dirX, meteor.dirY, meteor.dirZ),
        accelerationSpread: new THREE.Vector3(.7, .7, .7),
        particlesPerSecond: 100,
        colorStart: colorStart,
        colorSpread: new THREE.Vector3(rnd(0, .5), rnd(0.5), rnd(0.5))
      });
      this.meteorGroup.addEmitter(meteor.tailEmitter);
      return this.meteors.push(meteor);
    };

    Meteor.prototype.activateMeteor = function() {
      if (this.currentMeteorIndex === this.meteors.length) {
        this.currentMeteorIndex = 0;
      }
      this.activeMeteors.push(this.meteors[this.currentMeteorIndex++]);
      if (this.activeMeteors.length > this.maxActiveMeteors) {
        return this.activeMeteors.shift();
      }
    };

    Meteor.prototype.calcPositions = function() {
      var distance, meteor, _i, _len, _ref,
        _this = this;
      _ref = this.activeMeteors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        meteor = _ref[_i];
        distance = FW.camera.position.distanceTo(meteor.position);
        if (distance > this.meteorVisibleDistance) {
          this.generateSpeed(meteor);
          meteor.position = new THREE.Vector3(this.startingPos.x, rnd(this.startingPos.y, this.startingPos.y + this.startYRange), this.startingPos.z);
          this.activateMeteor();
        }
      }
      return setInterval(function() {
        return _this.calcPositions();
      }, 10000);
    };

    Meteor.prototype.tick = function() {
      var meteor, _i, _len, _ref;
      _ref = this.activeMeteors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        meteor = _ref[_i];
        meteor.speedX += meteor.accelX;
        meteor.speedY += meteor.accelY;
        meteor.speedZ += meteor.accelZ;
        meteor.translateX(meteor.speedX * meteor.dirX);
        meteor.translateY(meteor.speedY * meteor.dirY);
        meteor.translateZ(meteor.speedZ * meteor.dirZ);
        meteor.light.position = new THREE.Vector3().copy(meteor.position);
        meteor.tailEmitter.position = new THREE.Vector3().copy(meteor.position);
      }
      return this.meteorGroup.tick(FW.tickRate);
    };

    return Meteor;

  })();

}).call(this);
