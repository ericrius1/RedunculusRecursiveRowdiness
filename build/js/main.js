(function() {
  window.FW = {};

  window.onload = function() {
    FW.myWorld = new FW.World();
    return FW.myWorld.animate();
  };

}).call(this);
