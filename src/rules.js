
window.bush = function (grow3) {

    with (grow3) {
        var shrink = 0.991;
        var mat = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0xffffff});

        maxDepth(100);

        rules({
            start: function() {
                for (var x=0; x<20; x++) {
                    material(mat).r();
                }
            },

            r: [
                function () { forward() },
                function () { turn(); }
                // function () { turn2(); },
                // function () { turn3(); }
                // function () { turn4(); }
            ],

            forward: function() {
                if (depth%90 == 0) {
                    r();
                } else {
                    dbox();
                    rZ(11).move(rnd(2, 4)).tV(2).scale(shrink).forward();
                }
            },

            turn: function() {
                if (depth%90 == 0) {
                  r();
                } else {
                    dbox();
                    rZ(2).move(.2).scale(shrink).turn();
                }
            },

            turn2: function() {
                if (depth%90 == 0) {
                    r();
                } else {
                    dbox();
                    rZ(-2).move(10).scale(shrink).turn2();
                }
            },

            turn3: function() {
                if (depth%90 == 0) {
                    r();
                } else {
                    dbox();
                    rY(-2).move(0.1).scale(shrink).turn3();
                }
            },

            turn4: function() {
                if (depth%90 == 0) {
                    r();
                } else {
                    dbox();
                    rY(-2).move(0.1).scale(shrink).turn4();
                }
            },

            dbox: function() {
                cube(scale(rnd(), rnd(), rnd()));
            }

        });
    }

};