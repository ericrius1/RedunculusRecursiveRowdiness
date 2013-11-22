(function() {
  var Terrain;

  FW.Terrain = Terrain = (function() {
    function Terrain() {
      var applyShader, bluriness, cameraOrtho, composer, detailTexture, diffuseTexture1, diffuseTexture2, effectBleach, effectBloom, geometryTerrain, hblur, heightMap, i, loadTextures, material, normalMap, normalShader, params, pars, plane, quadTarget, renderModel, renderTarget, renderTargetParameters, rx, ry, sceneRenderTarget, specularMap, startX, terrain, terrainShader, textureCounter, uniformsNoise, uniformsNormal, uniformsTerrain, vblur, vertexShader;
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
      geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256);
      geometryTerrain.computeFaceNormals();
      geometryTerrain.computeVertexNormals();
      geometryTerrain.computeTangents();
      terrain = new THREE.Mesh(geometryTerrain, this.mlib["terrain"]);
      terrain.position.set(0, -125, 0);
      terrain.rotation.x = -Math.PI / 2;
      terrain.visible = false;
      FW.myWorld.scene.add(terrain);
      FW.myWorld.renderer.autoClear = false;
      renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };
      renderTarget = new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters);
      effectBloom = new THREE.BloomPass(0.6);
      effectBleach = new THREE.ShaderPass(THREE.BleachBypassShader);
      hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
      vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
      bluriness = 6;
      hblur.uniforms["h"].value = bluriness / SCREEN_WIDTH;
      vblur.uniforms["v"].value = bluriness / SCREEN_HEIGHT;
      hblur.uniforms["r"].value = vblur.uniforms["r"].value = 0.5;
      effectBleach.uniforms["opacity"].value = 0.65;
      composer = new THREE.EffectComposer(FW.myWorld.renderer, renderTarget);
      renderModel = new THREE.RenderPass(FW.myWorld.scene, FW.myWorld.camera);
      vblur.renderToScreen = true;
      composer = new THREE.EffectComposer(FW.myWorld.renderer, renderTarget);
      composer.addPass(renderModel);
      composer.addPass(effectBloom);
      composer.addPass(hblur);
      composer.addPass(vblur);
      startX = -3000;
      FW.myWorld.renderer.initWebGLObjects(FW.myWorld.scene);
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
