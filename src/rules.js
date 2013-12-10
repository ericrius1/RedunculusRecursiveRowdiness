

window.RULES = {}

RULES.bush = function(grow3) {
  with(grow3) {
    var mat1 = new THREE.MeshPhongMaterial({
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    });

    var mat2 = new THREE.MeshLambertMaterial({
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    });
    
    var mat3 = new THREE.MeshLambertMaterial({
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    });


    var mats = [ mat1, mat2, mat3];

    maxDepth(50);

    rules({
     

      arc: function() {
        cube(material(mats).scale(rnd(0.6, 4.0)));
        arc(pitch(rnd(1, 8)).yaw(FW.rnd(3, 11)).move(rnd(-40, -20)).s(0.97));
      },

      twistyObject: function() {
        for (var i = -90; i <= 10; i += 60) {
          for (var j = 0; j < 360; j += 60) {
            arc(pitch(i).yaw(j));
          }
        }
      },

      start: function() {
        twistyObject();

      }
    });
  }
};