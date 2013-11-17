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

  with(grow3) {

    var shrink = 0.981;

    maxDepth(10);

    rules({
            seg: [
                function () {
                    cube(scale(0.5));
                    seg(move(2.0).pitch(-45));
                },
                function () {
                    mesh(material(mat), gCube).scale(0.5)
                    seg(yaw(90).pitch(45).move(1.0));
                },
                function () {
                    cube(scale(0.5));
                    seg(yaw(-90).move(1.0));
                }
            ],

            start: function () {
                for (var i = 0; i < 35; i++) {
                    seg();
                }
            }
        });
  }

};