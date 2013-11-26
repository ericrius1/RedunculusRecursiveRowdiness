(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FW.World = World = (function() {
    function World() {
      this.animate = __bind(this.animate, this);
      this.onKeyDown = __bind(this.onKeyDown, this);
      var bluriness, detailTexture, diffuseTexture1, diffuseTexture2, effectBleach, effectBloom, hblur, i, material, normalShader, params, pars, plane, renderModel, renderTargetParameters, rx, ry, specularMap, vblur,
        _this = this;
      this.textureCounter = 0;
      this.animDelta = 0;
      this.animDeltaDir = 1;
      this.lightVal = 0;
      this.lightDir = -1;
      this.clock = new THREE.Clock();
      this.updateNoise = true;
      this.animateTerrain = false;
      this.mlib = {};
      this.MARGIN = 10;
      this.SCREEN_WIDTH = window.innerWidth;
      this.SCREEN_HEIGHT = window.innerHeight - 2 * this.MARGIN;
      FW.camera = new THREE.PerspectiveCamera(40, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 2, 4000);
      FW.camera.position.set(-1200, 800, 1200);
      this.controls = new THREE.FlyControls(FW.camera);
      this.controls.movementSpeed = 100;
      this.controls.rollSpeed = Math.PI / 16;
      this.controls.dragToLook = true;
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      this.sceneRenderTarget = new THREE.Scene();
      this.cameraOrtho = new THREE.OrthographicCamera(this.SCREEN_WIDTH / -2, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, this.SCREEN_HEIGHT / -2, -10000, 10000);
      this.cameraOrtho.position.z = 100;
      this.sceneRenderTarget.add(this.cameraOrtho);
      FW.scene = new THREE.Scene();
      FW.scene.fog = new THREE.Fog(0x000000, 100, 4000);
      this.firework = new FW.Firework();
      this.groundControl = new FW.Rockets();
      FW.scene.add(new THREE.AmbientLight(0x111111));
      this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
      this.directionalLight.position.set(500, 2000, 0);
      FW.scene.add(this.directionalLight);
      this.pointLight = new THREE.PointLight(0xff4400, 1.5);
      this.pointLight.position.set(0, 0, 0);
      FW.scene.add(this.pointLight);
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
      this.uniformsNormal = THREE.UniformsUtils.clone(normalShader.uniforms);
      this.uniformsNormal.height.value = 0.05;
      this.uniformsNormal.resolution.value.set(rx, ry);
      this.uniformsNormal.heightMap.value = this.heightMap;
      this.vertexShader = document.getElementById("vertexShader").textContent;
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
      this.terrainShader = THREE.ShaderTerrain["terrain"];
      this.uniformsTerrain = THREE.UniformsUtils.clone(this.terrainShader.uniforms);
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
      params = [["heightmap", document.getElementById("fragmentShaderNoise").textContent, this.vertexShader, this.uniformsNoise, false], ["normal", normalShader.fragmentShader, normalShader.vertexShader, this.uniformsNormal, false], ["@terrain", this.terrainShader.fragmentShader, this.terrainShader.vertexShader, this.uniformsTerrain, true]];
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
      plane = new THREE.PlaneGeometry(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
        color: 0x000000
      }));
      this.quadTarget.position.z = -500;
      this.sceneRenderTarget.add(this.quadTarget);
      this.geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256);
      this.geometryTerrain.computeFaceNormals();
      this.geometryTerrain.computeVertexNormals();
      this.geometryTerrain.computeTangents();
      this.terrain = new THREE.Mesh(this.geometryTerrain, this.mlib["@terrain"]);
      this.terrain.rotation.x = -Math.PI / 2;
      this.terrain.visible = false;
      FW.scene.add(this.terrain);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.renderer.setClearColor(FW.scene.fog.color, 1);
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.top = this.MARGIN + "px";
      this.renderer.domElement.style.left = "0px";
      document.body.appendChild(this.renderer.domElement);
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      this.onWindowResize();
      this.renderer.autoClear = false;
      renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };
      this.renderTarget = new THREE.WebGLRenderTarget(this.SCREEN_WIDTH, this.SCREEN_HEIGHT, renderTargetParameters);
      effectBloom = new THREE.BloomPass(0.4);
      effectBleach = new THREE.ShaderPass(THREE.BleachBypassShader);
      hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
      vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
      bluriness = 2;
      hblur.uniforms["h"].value = bluriness / this.SCREEN_WIDTH;
      vblur.uniforms["v"].value = bluriness / this.SCREEN_HEIGHT;
      hblur.uniforms["r"].value = vblur.uniforms["r"].value = 0.5;
      effectBleach.uniforms["opacity"].value = 0.65;
      this.composer = new THREE.EffectComposer(this.renderer, this.renderTarget);
      renderModel = new THREE.RenderPass(FW.scene, FW.camera);
      vblur.renderToScreen = true;
      this.composer = new THREE.EffectComposer(this.renderer, this.renderTarget);
      this.composer.addPass(renderModel);
      this.composer.addPass(effectBloom);
      this.composer.addPass(hblur);
      this.composer.addPass(vblur);
      this.renderer.initWebGLObjects(FW.scene);
      window.addEventListener("resize", (function() {
        return _this.onWindowResize();
      }), false);
      document.addEventListener("keydown", (function() {
        return _this.onKeyDown(event);
      }), false);
    }

    World.prototype.onWindowResize = function(event) {
      this.SCREEN_WIDTH = window.innerWidth;
      this.SCREEN_HEIGHT = window.innerHeight - 2 * this.MARGIN;
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      FW.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
      return FW.camera.updateProjectionMatrix();
    };

    World.prototype.onKeyDown = function(event) {
      switch (event.keyCode) {
        case 78:
          return this.lightDir *= -1;
        case 77:
          return this.animDeltaDir *= -1;
      }
    };

    World.prototype.applyShader = function(shader, texture, target) {
      var meshTmp, sceneTmp, shaderMaterial;
      shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: THREE.UniformsUtils.clone(shader.uniforms)
      });
      shaderMaterial.uniforms["tDiffuse"].value = texture;
      sceneTmp = new THREE.Scene();
      meshTmp = new THREE.Mesh(new THREE.PlaneGeometry(this.SCREEN_WIDTH, this.SCREEN_HEIGHT), shaderMaterial);
      meshTmp.position.z = -500;
      sceneTmp.add(meshTmp);
      return this.renderer.render(sceneTmp, this.cameraOrtho, target, true);
    };

    World.prototype.loadTextures = function() {
      this.textureCounter += 1;
      if (this.textureCounter === 3) {
        return this.terrain.visible = true;
      }
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      return this.render();
    };

    World.prototype.render = function() {
      var delta, fHigh, fLow, time, valNorm;
      delta = this.clock.getDelta();
      this.stats.update();
      this.groundControl.update();
      if (this.terrain.visible) {
        this.controls.update(delta);
        time = Date.now() * 0.001;
        fLow = 0.1;
        fHigh = 0.8;
        this.lightVal = THREE.Math.clamp(this.lightVal + 0.5 * delta * this.lightDir, fLow, fHigh);
        valNorm = (this.lightVal - fLow) / (fHigh - fLow);
        FW.scene.fog.color.setHSL(0.1, 0.5, this.lightVal);
        this.renderer.setClearColor(FW.scene.fog.color, 1);
        this.directionalLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.1, 1.15);
        this.pointLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.9, 1.5);
        this.uniformsTerrain["uNormalScale"].value = THREE.Math.mapLinear(valNorm, 0, 1, 0.6, 3.5);
        if (this.updateNoise) {
          this.animDelta = THREE.Math.clamp(this.animDelta + 0.00075 * this.animDeltaDir, 0, 0.05);
          this.uniformsNoise["time"].value += delta * this.animDelta;
          this.uniformsNoise["offset"].value.x += delta * 0.05;
          this.uniformsTerrain["uOffset"].value.x = 4 * this.uniformsNoise["offset"].value.x;
          this.quadTarget.material = this.mlib["heightmap"];
          this.renderer.render(this.sceneRenderTarget, this.cameraOrtho, this.heightMap, true);
          this.quadTarget.material = this.mlib["normal"];
          this.renderer.render(this.sceneRenderTarget, this.cameraOrtho, this.normalMap, true);
        }
        this.updateNoise = true;
        return this.composer.render(0.1);
      }
    };

    return World;

  })();

}).call(this);
