(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var sphereGeo;
      this.speed = .1;
      this.dir = rnd(-1, 1);
      this.meteorTail = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      sphereGeo = new THREE.SphereGeometry(5, 5, 5);
      this.meteorHead = new THREE.Mesh(sphereGeo, FW.rocketMat);
      this.meteorHead.position.set(-992, 820, 1165);
      this.emitter = new ShaderParticleEmitter({
        position: new THREE.Vector3(-992, 820, 1165),
        size: rnd(0.01, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        acceleration: new THREE.Vector3(1, 0, 0),
        accelerationSpread: new THREE.Vector3(.1, .1, .1),
        particlesPerSecond: rnd(100, 500),
        opacityEnd: 0.5
      });
      this.meteorTail.addEmitter(this.emitter);
      FW.scene.add(this.meteorTail.mesh);
    }

    Meteor.prototype.startShower = function() {
      var _this = this;
      return setTimeout(function() {}, 500);
    };

    Meteor.prototype.tick = function() {
      this.meteorHead.translateX(this.speed * this.dir);
      this.meteorHead.translateY(this.speed * this.dir);
      this.emitter.position.x = this.meteorHead.position.x;
      return this.meteorTail.tick(0.16);
    };

    return Meteor;

  })();

}).call(this);
