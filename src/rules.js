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
with (grow3) {
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

            start: function () {
                spiral(material(mat2));
            }
        });
    }

};