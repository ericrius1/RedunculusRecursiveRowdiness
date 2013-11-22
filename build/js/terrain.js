(function() {
  var Terrain;

  FW.Terrain = Terrain = (function() {
    function Terrain() {
      var cameraOrtho, geometryTerrain, heightMap, material, normalMap, normalShader, pars, rx, ry, sceneRenderTarget, uniformsNoise, uniformsNormal, vertexShader;
      geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256);
      material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      material.needsUpdate = true;
      sceneRenderTarget = new THREE.Scene();
      cameraOrtho = new THREE.OrthographicCamera(SCREEN_WIDTH / -2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2, -10000, 10000);
      cameraOrtho.position.z = 100;
      sceneRenderTarget.add(cameraOrtho);
      this.ground = new THREE.Mesh(geometryTerrain, material);
      this.ground.rotation.x = -Math.PI / 2;
      this.ground.position.set(0, -125, 0);
      FW.myWorld.scene.add(this.ground);
      normalShader = THREE.NormalMapShader;
      rx = 256;
      ry = 256;
      pars = {
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      };
      heightMap = new THREE.WebGLRenderTarget(rx, ry, pars);
      normalMap = new THREE.WebGLRenderTarget(rx, ry, pars);
      uniformsNoise = {
        time: {
          type: "f",
          value: 1.0
        },
        scale: {
          type: "v2",
          value: new THREE.Vector2(1.5, 1.5)
        },
        offset: {
          type: "v2",
          value: new THREE.Vector2(0, 0)
        }
      };
      uniformsNormal = THREE.UniformsUtils.clone(normalShader.uniforms);
      uniformsNormal.height.value = 0.05;
      uniformsNormal.resolution.value.set(rx, ry);
      uniformsNormal.heightMap.value = heightMap;
      vertexShader = document.getElementById("terrainVertexShader").textContent;
    }

    return Terrain;

  })();

}).call(this);
