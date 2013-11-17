(function() {
  window.FW = {};

  window.onload = function() {
    FW.myWorld = new FW.World();
    FW.myWorld.firework = new FW.Firework();
    FW.myWorld.firework.init();
    return FW.myWorld.animate();
  };

}).call(this);
