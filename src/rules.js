window.bush= function (grow3) {

    with (grow3) {
        var mats = [new THREE.MeshPhongMaterial({color: 0xeebbaa}), new THREE.MeshPhongMaterial({color: 0xbbeeaa}) ];
        maxDepth(50);
        rules({
            line: function () {
                for (var x = -5; x < 5; x++) {
                    cube(scale(0.9).move(x).yaw(rnd(15)));
                }
            },

            quad: function () {
                for (var y = -5; y < 5; y++) {
                    line(tH(y));
                }
            },

            start: function () {

                for (var z = -5; z < 5; z++) {
                    quad(tH(10).tV(z).material(select(mats, z)));
                }
            }
        });
    }

};