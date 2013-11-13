(function() {
  window.onload = function() {
    window.myWorld = new World();
    myWorld.animate();
    return myWorld.addEntity(window.bush);
  };

}).call(this);
