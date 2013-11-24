window.uniforms1 = {
  time: {
    type: "f",
    value: 1.0
  },
  resolution: {
    type: "v2",
    value: new THREE.Vector2()
  }
};


window.RULES = {}

RULES.bush = function(grow3) {
  with(grow3) {
    var mat1 = new THREE.MeshPhongMaterial({
      color: 0xddaa77
    });
    var mat2 = new THREE.MeshPhongMaterial({
      color: 0xaadd77
    });

    maxDepth(120);

    rules({
     

      arc: function() {
        cube(scale(0.9));
        arc(pitch(4.0).yaw(7.0).move(-1.3).s(0.97));
      },

      twistyObject: function() {
        for (var i = -90; i <= 90; i += 60) {
          for (var j = 0; j < 360; j += 60) {
            arc(pitch(i).yaw(j));
          }
        }
      },

      start: function() {
        twistyObject(material(mat2));

      }
    });
  }
};