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
    var mat2 = new THREE.MeshPhongMaterial({
      color: 0x70AAFF
    });

    var mat1 = new THREE.MeshLambertMaterial({
      color: 0xff00ff
    });
    // var shinyMat = new THREE.ShaderMaterial({
    // uniforms: uniforms1,
    // vertexShader: document.getElementById('rocketVertexShader').textContent,
    // fragmentShader: document.getElementById('fragment_shader1').textContent

    // })

    var mats = [ mat2, mat1];

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