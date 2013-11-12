window.bush = function (grow3) {

    with (grow3) {
        var mat1 = new THREE.MeshPhongMaterial({color: 0xddaa77});
        var mat2 = new THREE.MeshPhongMaterial({color: 0xaadd77});

        maxDepth(40);

        rules({

            arc: function () {
                cube();
            },

            twistyObject: function () {
               for(var i = 0; i < 100; i+=1.1){
                arc(tH(i).pitch(i));
                }
               
            },

            start: function () {
                twistyObject(material(mat2));
            }
        });
    }

};