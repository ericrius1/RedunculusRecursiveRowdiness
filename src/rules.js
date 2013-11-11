window.bush = function (grow3) {

    with (grow3) {
        var mat1 = new THREE.MeshPhongMaterial({color: 0xddaa77});
        var mat2 = new THREE.MeshPhongMaterial({color: 0xaadd77});

        var materials = [mat1, mat2]
        maxDepth(20);

        rules({

            arc: function () {
                cube(material(materials).scale(0.5));
                arc(m(1.0).tV(1.0).s(0.81));
            },

            twistyObject: function () {
                for (var i = 0; i <= 90; i += 30) {
                    for (var j = 0; j < 360; j += 30) {
                        arc(pitch(i).yaw(j));
                    }
                }
            },

            start: function () {
                twistyObject();
            }
        });
    }

};
