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
var cMesh = new THREE.Mesh(gCube, mat) 

window.RULES = {}

RULES.bush = function(grow3) {

  with(grow3) {

    var shrink = 0.981;

    maxDepth(10);

    rules({
      start: function() {
        move(myWorld.camera.position.z)
        tH(myWorld.camera.position.x)
        tV(myWorld.camera.position.y)
        for (var x = 0; x < 10; x++) {
          r();
        }
      },

      r: [

        function() {
          forward()
        },
      ],

      forward: function() {
        if (depth % 90 == 0) {
          r();
        } else {
          dbox();
          rZ(rnd(4, 100)).move(rnd(2, 5)).tV(10.1).scale(shrink).forward();
        }
      },

      dbox: function() {
        mesh(scale(0.5).material(mat), gCube)
      }

    });
  }

};