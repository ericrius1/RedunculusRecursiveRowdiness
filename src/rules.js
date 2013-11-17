var cMesh = new THREE.Mesh(gCube, mat) 
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

var mat= new THREE.ShaderMaterial({

  uniforms: uniforms1,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragment_shader1').textContent

});

var gCube = new THREE.CubeGeometry(1,1,1);

window.RULES = {}

RULES.bush = function(grow3) {
with (grow3) {
        var mat1 = new THREE.MeshPhongMaterial({color: 0xddaa77});
        var mat2 = new THREE.MeshPhongMaterial({color: 0xaadd77});


        rules({
            spiralElement: function () {
                cube(scale(0.5).move(18));
            },

            spiral: function () {
                for (var j = 0; j < 360; j += 0.5) {
                    spiralElement(yaw(j * 0.5).roll(j * 6));
                }
            },

            // arc: function () {
            //     cube(scale(0.9));
            //     arc(pitch(4.0).yaw(7.0).move(-1.3).s(0.97));
            // },

            // twistyObject: function () {
            //     for (var i = -90; i <= 90; i += 60) {
            //         for (var j = 0; j < 360; j += 60) {
            //             arc(pitch(i).yaw(j));
            //         }
            //     }
            // },

            start: function () {
                // twistyObject(material(mat2));
                spiral(material(mat1));
            }
        });
    }

};