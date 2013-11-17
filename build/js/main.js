(function() {
  window.FW = {};

  window.onload = function() {
    FW.myWorld = new FW.World();
    FW.myWorld.firework = new FW.Firework();
    return FW.myWorld.animate();
  };

}).call(this);
