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
    var shinyMat = new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader: document.getElementById('rocketVertexShader').textContent,
    fragmentShader: document.getElementById('fragment_shader1').textContent

    })

    var mats = [shinyMat, mat2];

    maxDepth(50);

    rules({
     

      arc: function() {
        cube(material(mats).scale(rnd(0.6, 1.0)));
        arc(pitch(4.0).yaw(FW.rnd(3, 7)).move(-40.3).s(0.97));
      },

      twistyObject: function() {
        for (var i = -90; i <= 90; i += 60) {
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