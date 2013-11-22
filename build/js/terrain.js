(function() {
  var Terrain;

  FW.Terrain = Terrain = (function() {
    function Terrain() {
      var geometryTerrain, material;
      this.mlib = {};
      this.lightDir = 1;
      this.animDeltaDir = -1;
      this.updateNoise = true;
      this.textureCounter = 0;
      geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256);
      material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      material.needsUpdate = true;
      this.sceneRenderTarget = new THREE.Scene();
      this.cameraOrtho = new THREE.OrthographicCamera(SCREEN_WIDTH / -2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2, -10000, 10000);
      this.cameraOrtho.position.z = 100;
      this.sceneRenderTarget.add(this.cameraOrtho);
    }

    Terrain.prototype.init = function() {
      var bluriness, detailTexture, diffuseTexture1, diffuseTexture2, effectBleach, effectBloom, geometryTerrain, hblur, i, material, normalShader, params, pars, plane, renderModel, renderTarget, renderTargetParameters, rx, ry, specularMap, startX, terrain, terrainShader, uniformsNormal, vblur, vertexShader,
        _this = this;
      normalShader = THREE.NormalMapShader;
      rx = 256;
      ry = 256;
      pars = {
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      };
      this.heightMap = new THREE.WebGLRenderTarget(rx, ry, pars);
      this.normalMap = new THREE.WebGLRenderTarget(rx, ry, pars);
      this.uniformsNoise = {
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
      uniformsNormal.heightMap.value = this.heightMap;
      vertexShader = document.getElementById("terrainVertexShader").textContent;
      specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars);
      diffuseTexture1 = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big.jpg", null, function() {
        _this.loadTextures();
        return _this.applyShader(THREE.LuminosityShader, diffuseTexture1, specularMap);
      });
      diffuseTexture2 = THREE.ImageUtils.loadTexture("lib/textures/backgrounddetailed6.jpg", null, function() {
        return _this.loadTextures();
      });
      detailTexture = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big-nm.jpg", null, function() {
        return _this.loadTextures();
      });
      diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
      diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
      detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
      specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
      terrainShader = THREE.ShaderTerrain["terrain"];
      this.uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
      this.uniformsTerrain["tNormal"].value = this.normalMap;
      this.uniformsTerrain["uNormalScale"].value = 3.5;
      this.uniformsTerrain["tDisplacement"].value = this.heightMap;
      this.uniformsTerrain["tDiffuse1"].value = diffuseTexture1;
      this.uniformsTerrain["tDiffuse2"].value = diffuseTexture2;
      this.uniformsTerrain["tSpecular"].value = specularMap;
      this.uniformsTerrain["tDetail"].value = detailTexture;
      this.uniformsTerrain["enableDiffuse1"].value = true;
      this.uniformsTerrain["enableDiffuse2"].value = true;
      this.uniformsTerrain["enableSpecular"].value = true;
      this.uniformsTerrain["uDiffuseColor"].value.setHex(0xffffff);
      this.uniformsTerrain["uSpecularColor"].value.setHex(0xffffff);
      this.uniformsTerrain["uAmbientColor"].value.setHex(0x111111);
      this.uniformsTerrain["uShininess"].value = 30;
      this.uniformsTerrain["uDisplacementScale"].value = 375;
      this.uniformsTerrain["uRepeatOverlay"].value.set(6, 6);
      params = [["heightmap", document.getElementById("fragmentShaderNoise").textContent, vertexShader, this.uniformsNoise, false], ["normal", normalShader.fragmentShader, normalShader.vertexShader, uniformsNormal, false], ["terrain", terrainShader.fragmentShader, terrainShader.vertexShader, this.uniformsTerrain, true]];
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
      this.quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
        color: 0x000000
      }));
      this.quadTarget.position.z = -500;
      this.sceneRenderTarget.add(this.quadTarget);
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
      this.composer = new THREE.EffectComposer(FW.myWorld.renderer, renderTarget);
      renderModel = new THREE.RenderPass(FW.myWorld.scene, FW.myWorld.camera);
      vblur.renderToScreen = true;
      this.composer = new THREE.EffectComposer(FW.myWorld.renderer, renderTarget);
      this.composer.addPass(renderModel);
      this.composer.addPass(effectBloom);
      this.composer.addPass(hblur);
      this.composer.addPass(vblur);
      startX = -3000;
      return FW.myWorld.renderer.initWebGLObjects(FW.myWorld.scene);
    };

    Terrain.prototype.applyShader = function(shader, texture, target) {
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
      console.log(this.cameraOrtho);
      return FW.myWorld.renderer.render(sceneTmp, this.cameraOrtho, target, true);
    };

    Terrain.prototype.loadTextures = function() {
      this.textureCounter += 1;
      if (this.textureCounter === 3) {
        return FW.myWorld.terrainVisible = true;
      }
    };

    Terrain.prototype.update = function() {
      var animDelta, delta, fHigh, fLow, lightVal, time, valNorm;
      delta = FW.myWorld.delta;
      time = Date.now() * 0.001;
      fLow = 0.1;
      fHigh = 0.8;
      lightVal = THREE.Math.clamp(lightVal + 0.5 * delta * this.lightDir, fLow, fHigh);
      valNorm = (lightVal - fLow) / (fHigh - fLow);
      FW.myWorld.scene.fog.color.setHSL(0.1, 0.5, lightVal);
      FW.myWorld.renderer.setClearColor(FW.myWorld.scene.fog.color, 1);
      FW.myWorld.directionalLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.1, 1.15);
      FW.myWorld.pointLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.9, 1.5);
      this.uniformsTerrain["uNormalScale"].value = THREE.Math.mapLinear(valNorm, 0, 1, 0.6, 3.5);
      if (this.updateNoise) {
        animDelta = THREE.Math.clamp(animDelta + 0.00075 * this.animDeltaDir, 0, 0.05);
        this.uniformsNoise["time"].value += delta * animDelta;
        this.uniformsNoise["offset"].value.x += delta * 0.05;
        this.uniformsTerrain["uOffset"].value.x = 4 * this.uniformsNoise["offset"].value.x;
        this.quadTarget.material = this.mlib["heightmap"];
        FW.myWorld.renderer.render(this.sceneRenderTarget, this.cameraOrtho, this.heightMap, true);
        this.quadTarget.material = this.mlib["normal"];
        FW.myWorld.renderer.render(this.sceneRenderTarget, this.cameraOrtho, this.normalMap, true);
      }
      return FW.myWorld.renderer.render(FW.myWorld.scene, FW.myWorld.camera);
    };

    return Terrain;

  })();

}).call(this);
