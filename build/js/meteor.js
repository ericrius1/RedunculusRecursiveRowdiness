(function() {
  var Meteor;

  FW.Meteor = Meteor = (function() {
    var rnd;

    rnd = FW.rnd;

    function Meteor() {
      this.meteorGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 6
      });
      this.emitterSettings = {
        size: rnd(0.01, 1.3),
        sizeSpread: rnd(0.1, 1.0),
        velocity: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)),
        acceleration: new THREE.Vector3(0, -0.01, 0),
        accelerationSpread: new THREE.Vector3(rnd(-2, 0), rnd(-2, 0), rnd(-2, 0)),
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5)),
        colorEnd: this.colorEnd,
        particlesPerSecond: rnd(100, 500),
        alive: 0,
        emitterDuration: rnd(1.0, 5.0),
        opacityEnd: 0.5
      };
      this.meteorGroup.add(1, this.emitterSettings, true);
    }

    Meteor.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return Meteor;

  })();

}).call(this);
