(function() {
  var Main;

  window.FW = {};

  SC.initialize({
    client_id: "7da24ca214bf72b66ed2494117d05480"
  });

  window.soundOn = true;

  window.onload = function() {
    FW.myWorld = new FW.World();
    FW.myWorld.animate();
    return FW.main = FW.Main();
  };

  FW.Main = Main = (function() {
    function Main() {
      var thing;
      this.generateStars();
      this.g = new grow3.System(FW.scene, FW.camera, RULES.bush);
      thing = this.g.build(void 0, new THREE.Vector3(-580, 913, 1009));
      FW.camera.lookAt(thing.position);
      this.firework = new FW.Firework();
      this.groundControl = new FW.Rockets();
      if (soundOn) {
        SC.stream("/tracks/rameses-b-inspire", function(sound) {
          return sound.play();
        });
      }
    }

    Main.prototype.generateStars = function() {
      return console.log('hey');
    };

    return Main;

  })();

}).call(this);
