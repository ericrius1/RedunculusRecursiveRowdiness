(function() {
  var Terrain;

  FW.Terrain = Terrain = (function() {
    function Terrain() {
      var applyShader, cameraOrtho, detailTexture, diffuseTexture1, diffuseTexture2, geometryTerrain, heightMap, i, loadTextures, material, normalMap, normalShader, params, pars, plane, quadTarget, rx, ry, sceneRenderTarget, specularMap, terrainShader, textureCounter, uniformsNoise, uniformsNormal, uniformsTerrain, vertexShader;
      this.mlib = {};
      geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256);
      material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      material.needsUpdate = true;
      sceneRenderTarget = new THREE.Scene();
      textureCounter = 0;
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
      specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars);
      diffuseTexture1 = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big.jpg", null, function() {
        loadTextures();
        return applyShader(THREE.LuminosityShader, diffuseTexture1, specularMap);
      });
      diffuseTexture2 = THREE.ImageUtils.loadTexture("lib/textures/backgrounddetailed6.jpg", null, loadTextures);
      detailTexture = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big-nm.jpg", null, loadTextures);
      diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
      diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
      detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
      specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
      terrainShader = THREE.ShaderTerrain["terrain"];
      uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
      uniformsTerrain["tNormal"].value = normalMap;
      uniformsTerrain["uNormalScale"].value = 3.5;
      uniformsTerrain["tDisplacement"].value = heightMap;
      uniformsTerrain["tDiffuse1"].value = diffuseTexture1;
      uniformsTerrain["tDiffuse2"].value = diffuseTexture2;
      uniformsTerrain["tSpecular"].value = specularMap;
      uniformsTerrain["tDetail"].value = detailTexture;
      uniformsTerrain["enableDiffuse1"].value = true;
      uniformsTerrain["enableDiffuse2"].value = true;
      uniformsTerrain["enableSpecular"].value = true;
      uniformsTerrain["uDiffuseColor"].value.setHex(0xffffff);
      uniformsTerrain["uSpecularColor"].value.setHex(0xffffff);
      uniformsTerrain["uAmbientColor"].value.setHex(0x111111);
      uniformsTerrain["uShininess"].value = 30;
      uniformsTerrain["uDisplacementScale"].value = 375;
      uniformsTerrain["uRepeatOverlay"].value.set(6, 6);
      params = [["heightmap", document.getElementById("fragmentShaderNoise").textContent, vertexShader, uniformsNoise, false], ["normal", normalShader.fragmentShader, normalShader.vertexShader, uniformsNormal, false], ["terrain", terrainShader.fragmentShader, terrainShader.vertexShader, uniformsTerrain, true]];
      i = 0;
      while (i < params.length) {
        material = new THREE.ShaderMaterial({
          uniforms: params[i][3],
          vertexShader: params[i][2],
          fragmentShader: params[i][1],
          lights: params[i][4],
          fog: true
        });
        this.mlib[params[i][0]] = material;
        i++;
      }
      plane = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
      quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
        color: 0x000000
      }));
      quadTarget.position.z = -500;
      sceneRenderTarget.add(quadTarget);
      applyShader = function(shader, texture, target) {
        var meshTmp, sceneTmp, shaderMaterial;
        shaderMaterial = new THREE.ShaderMaterial({
          fragmentShader: shader.fragmentShader,
          vertexShader: shader.vertexShader,
          uniforms: THREE.UniformsUtils.clone(shader.uniforms)
        });
        shaderMaterial.uniforms["tDiffuse"].value = texture;
        sceneTmp = new THREE.Scene();
        meshTmp = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT), shaderMaterial);
        meshTmp.position.z = -500;
        sceneTmp.add(meshTmp);
        return FW.myWorld.renderer.render(sceneTmp, cameraOrtho, target, true);
      };
      loadTextures = function() {
        textureCounter += 1;
        if (textureCounter === 3) {
          return this.visible = true;
        }
      };
    }

    Terrain.prototype.update = function() {
      return console.log('shnur');
    };

    return Terrain;

  })();

}).call(this);
