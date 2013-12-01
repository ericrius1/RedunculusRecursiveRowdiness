(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      var sphereGeo;
      this.meteorTail = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 15
      });
      sphereGeo = new THREE.SphereGeometry(5, 5, 5);
      this.meteorHead = new THREE.Mesh(sphereGeo, FW.rocketMat);
      this.meteorHead.position.set(-992, 820, 1165);
      FW.scene.add(this.meteorHead);
      this.emitterSettings = {
        size: rnd(0.01, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        acceleration: new THREE.Vector3(1, 0, 0),
        particlesPerSecond: rnd(100, 500),
        alive: 0,
        emitterDuration: 100,
        opacityEnd: 0.5
      };
      this.meteorTail.addPool(5, this.emitterSettings, true);
      FW.scene.add(this.meteorTail.mesh);
    }

    Meteor.prototype.startShower = function() {
      var _this = this;
      return setTimeout(function() {
        console.log("Spakrle!!!!");
        return _this.meteorTail.triggerPoolEmitter(1, _this.meteorHead.position);
      }, 1000);
    };

    Meteor.prototype.tick = function() {
      return this.meteorTail.tick(0.16);
    };

    return Meteor;

  })();

}).call(this);
