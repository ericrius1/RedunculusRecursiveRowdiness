(function() {
  var Main;

  window.FW = {};

  if (typeof SC !== "undefined" && SC !== null) {
    SC.initialize({
      client_id: "7da24ca214bf72b66ed2494117d05480"
    });
  }

  window.soundOn = true;

  window.onload = function() {
    FW.startingPos = new THREE.Vector3(-580, 913, 1009);
    FW.myWorld = new FW.World();
    FW.myWorld.animate();
    FW.main = new FW.Main();
    return FW.main.makeStars();
  };

  FW.Main = Main = (function() {
    function Main() {
      if (soundOn) {
        SC.stream("/tracks/rameses-b-inspire", function(sound) {
          return sound.play();
        });
      }
    }

    Main.prototype.makeStars = function() {
      var thing;
      this.g = new grow3.System(FW.scene, FW.camera, RULES.bush);
      thing = this.g.build(void 0, FW.startingPos);
      return FW.camera.lookAt(thing.position);
    };

    return Main;

  })();

}).call(this);
