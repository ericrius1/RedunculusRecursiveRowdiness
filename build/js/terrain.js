(function() {
  var Terrain;

  FW.Terrain = Terrain = (function() {
    function Terrain() {
      var geometryTerrain, material;
      geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256);
      material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      material.needsUpdate = true;
      this.terrain = new THREE.Mesh(geometryTerrain, material);
      this.terrain.rotation.x = -Math.PI / 2;
      this.terrain.position.y = -200;
      FW.myWorld.scene.add(this.terrain);
    }

    return Terrain;

  })();

}).call(this);
