window.bush = function (grow3) {

    with (grow3) {
        var mat1 = new THREE.MeshPhongMaterial({color: 0xddaa77});
        var mat2 = new THREE.MeshPhongMaterial({color: 0xaadd77});

        var materials = [mat1, mat2]
        maxDepth(25);

        rules({

            arc: function () {
                cube(material(materials).scale(0.9));
                arc(pitch(1.0).yaw(0.3).move(1.0).s(0.88));
            },

            twistyObject: function () {
                for (var i = 0; i <= 90; i += 60) {
                    for (var j = 0; j < 360; j += 60) {
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

window.tree = function (grow3) {
    with (grow3) {
        var mat1 = new THREE.MeshPhongMaterial({color: 0xddaa77});
        var mat2 = new THREE.MeshPhongMaterial({color: 0xffdd77});

        var materials = [mat1, mat2]
        maxDepth(100);

        rules({

            arc: function () {
                cube(material(materials).scale(0.9));
                arc(pitch(0.8).yaw(1.0).move(-1.3).s(0.93));
            },

            twistyObject: function () {
                for (var i = -10; i <= 90; i += 60) {
                    for (var j = 0; j < 360; j += 60) {
                        arc(pitch(j).yaw(i));
                    }
                }
            },

            start: function () {
                light( 0xddffdd);
                twistyObject(m(50));
            }
        });
    }

};