(function() {
  var Main;

  window.FW = {};

  window.onload = function() {
    FW.myWorld = new FW.World();
    FW.myWorld.animate();
    return FW.main = FW.Main();
  };

  FW.Main = Main = (function() {
    function Main() {
      var thing;
      this.g = new grow3.System(FW.scene, FW.camera, RULES.bush);
      thing = this.g.build(void 0, new THREE.Vector3(-1220, 760, 1250));
      FW.camera.lookAt(thing.position);
      this.firework = new FW.Firework();
      this.groundControl = new FW.Rockets();
    }

    return Main;

  })();

}).call(this);
