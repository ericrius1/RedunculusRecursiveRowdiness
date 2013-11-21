(function() {
  window.FW = {};

  window.onload = function() {
    FW.myWorld = new FW.World();
    FW.myWorld.init();
    return FW.myWorld.animate();
  };

}).call(this);
