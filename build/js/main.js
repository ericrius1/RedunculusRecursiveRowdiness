(function() {
  window.onload = function() {
    window.myWorld = new World();
    myWorld.addEntity(bush);
    return myWorld.animate();
  };

}).call(this);
