(function() {
  var MARGIN, SCREEN_HEIGHT, SCREEN_WIDTH, Terrain, animDelta, animDeltaDir, animate, animateTerrain, applyShader, camera, cameraOrtho, clock, container, directionalLight, heightMap, init, lightDir, lightVal, loadTextures, mlib, normalMap, onKeyDown, onWindowResize, pointLight, quadTarget, render, scene, sceneRenderTarget, stats, terrain, textMesh1, textureCounter, uniformsNoise, uniformsNormal, updateNoise;

  window.Terrain = Terrain = (function() {
    function Terrain() {}

    return Terrain;

  })();

  init = function() {
    var bluriness, camera, cameraOrtho, composer, controls, detailTexture, diffuseTexture1, diffuseTexture2, directionalLight, effectBleach, effectBloom, geometryTerrain, hblur, heightMap, i, material, normalMap, normalShader, params, pars, plane, pointLight, quadTarget, renderModel, renderTarget, renderTargetParameters, renderer, rx, ry, scene, sceneRenderTarget, specularMap, terrain, terrainShader, uniformsNoise, uniformsNormal, uniformsTerrain, vblur, vertexShader;
    sceneRenderTarget = new THREE.Scene();
    cameraOrtho = new THREE.OrthographicCamera(SCREEN_WIDTH / -2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2, -10000, 10000);
    cameraOrtho.position.z = 100;
    sceneRenderTarget.add(cameraOrtho);
    camera = new THREE.PerspectiveCamera(40, SCREEN_WIDTH / SCREEN_HEIGHT, 2, 4000);
    camera.position.set(-1200, 800, 1200);
    controls = new THREE.TrackballControls(camera);
    controls.target.set(0, 0, 0);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.15;
    controls.keys = [65, 83, 68];
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 2000, 4000);
    scene.add(new THREE.AmbientLight(0x111111));
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
    directionalLight.position.set(500, 2000, 0);
    scene.add(directionalLight);
    pointLight = new THREE.PointLight(0xff4400, 1.5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
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
    vertexShader = document.getElementById("vertexShader").textContent;
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
      mlib[params[i][0]] = material;
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
    terrain = new THREE.Mesh(geometryTerrain, mlib["terrain"]);
    terrain.position.set(0, -125, 0);
    terrain.rotation.x = -Math.PI / 2;
    terrain.visible = false;
    scene.add(terrain);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(scene.fog.color, 1);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = MARGIN + "px";
    renderer.domElement.style.left = "0px";
    document.body.appendChild(renderer.domElement);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("keydown", onKeyDown, false);
    renderer.autoClear = false;
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
    composer = new THREE.EffectComposer(renderer, renderTarget);
    renderModel = new THREE.RenderPass(scene, camera);
    vblur.renderToScreen = true;
    composer = new THREE.EffectComposer(renderer, renderTarget);
    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(hblur);
    composer.addPass(vblur);
    return renderer.initWebGLObjects(scene);
  };

  onWindowResize = function(event) {
    var SCREEN_HEIGHT, SCREEN_WIDTH;
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    return camera.updateProjectionMatrix();
  };

  onKeyDown = function(event) {
    switch (event.keyCode) {
      case 78:
        return lightDir *= -1;
      case 77:
        return animDeltaDir *= -1;
      case 66:
        return soundDir *= -1;
    }
  };

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
    return renderer.render(sceneTmp, cameraOrtho, target, true);
  };

  loadTextures = function() {
    textureCounter += 1;
    if (textureCounter === 3) {
      return terrain.visible = true;
    }
  };

  animate = function() {
    requestAnimationFrame(animate);
    return render();
  };

  render = function() {
    var animDelta, delta, fHigh, fLow, lightVal, time, valNorm;
    delta = clock.getDelta();
    if (terrain.visible) {
      controls.update();
      time = Date.now() * 0.001;
      fLow = 0.1;
      fHigh = 0.8;
      lightVal = THREE.Math.clamp(lightVal + 0.5 * delta * lightDir, fLow, fHigh);
      valNorm = (lightVal - fLow) / (fHigh - fLow);
      scene.fog.color.setHSL(0.1, 0.5, lightVal);
      renderer.setClearColor(scene.fog.color, 1);
      directionalLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.1, 1.15);
      pointLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.9, 1.5);
      uniformsTerrain["uNormalScale"].value = THREE.Math.mapLinear(valNorm, 0, 1, 0.6, 3.5);
      if (updateNoise) {
        animDelta = THREE.Math.clamp(animDelta + 0.00075 * animDeltaDir, 0, 0.05);
        uniformsNoise["time"].value += delta * animDelta;
        uniformsNoise["offset"].value.x += delta * 0.05;
        uniformsTerrain["uOffset"].value.x = 4 * uniformsNoise["offset"].value.x;
        quadTarget.material = mlib["heightmap"];
        renderer.render(sceneRenderTarget, cameraOrtho, heightMap, true);
        quadTarget.material = mlib["normal"];
        renderer.render(sceneRenderTarget, cameraOrtho, normalMap, true);
      }
      return composer.render(0.1);
    }
  };

  MARGIN = 100;

  SCREEN_WIDTH = window.innerWidth;

  SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

  window.renderer = void 0;

  container = void 0;

  stats = void 0;

  camera = void 0;

  scene = void 0;

  cameraOrtho = void 0;

  sceneRenderTarget = void 0;

  uniformsNoise = void 0;

  uniformsNormal = void 0;

  heightMap = void 0;

  normalMap = void 0;

  quadTarget = void 0;

  directionalLight = void 0;

  pointLight = void 0;

  terrain = void 0;

  textureCounter = 0;

  animDelta = 0;

  animDeltaDir = -1;

  lightVal = 0;

  lightDir = 1;

  clock = new THREE.Clock();

  updateNoise = true;

  animateTerrain = false;

  textMesh1 = void 0;

  mlib = {};

  init();

  animate();

}).call(this);
