
FW.World = class World
  constructor : ->
    @textureCounter = 0
    @animDelta = 0
    @animDeltaDir = 1
    @lightVal = 0
    @lightDir = -1
    @clock = new THREE.Clock()
    @updateNoise = true
    @animateTerrain = false
    @mlib = {}
    @MARGIN = 10
    @SCREEN_WIDTH = window.innerWidth
    @SCREEN_HEIGHT = window.innerHeight - 2 * @MARGIN

    # CAMERA
    FW.camera = new THREE.PerspectiveCamera(40, @SCREEN_WIDTH / @SCREEN_HEIGHT, 2, 4000)
    FW.camera.position.set  -1200, 800, 1200
    
    #CONTROLS
    @controls = new THREE.FlyControls(FW.camera)
    @controls.movementSpeed = 60;
    @controls.rollSpeed =  Math.PI / 8;
    @controls.dragToLook = true

    #STATS
    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);
    
    # SCENE (RENDER TARGET)
    @sceneRenderTarget = new THREE.Scene()
    @cameraOrtho = new THREE.OrthographicCamera(@SCREEN_WIDTH / -2, @SCREEN_WIDTH / 2, @SCREEN_HEIGHT / 2, @SCREEN_HEIGHT / -2, -10000, 10000)
    @cameraOrtho.position.z = 100
    @sceneRenderTarget.add @cameraOrtho
    
    
    # SCENE (FINAL)
    FW.scene = new THREE.Scene()
    FW.scene.fog = new THREE.Fog(0x000000, 100, 4000)


    #FUN
    @firework = new FW.Firework()
    @groundControl = new FW.Rockets()
    @meteor = new FW.Meteor()
    @meteor.startShower()





    
    # LIGHTS
    # FW.scene.add new THREE.AmbientLight(0xffffff)
    @directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
    @directionalLight.position.set 500, 2000, 0
    FW.scene.add @directionalLight
    @pointLight = new THREE.PointLight(0xff4400, 1.5)
    @pointLight.position.set 0, 0, 0
    # FW.scene.add @pointLight
    
    # HEIGHT + NORMAL MAPS
    normalShader = THREE.NormalMapShader
    rx = 256
    ry = 256
    pars =
      minFilter: THREE.LinearMipmapLinearFilter
      magFilter: THREE.LinearFilter
      format: THREE.RGBFormat

    @heightMap = new THREE.WebGLRenderTarget(rx, ry, pars)
    @normalMap = new THREE.WebGLRenderTarget(rx, ry, pars)
    @uniformsNoise =
      time:
        type: "f"
        value: 1.0

      scale:
        type: "v2"
        value: new THREE.Vector2(1.5, 1.5)

      offset:
        type: "v2"
        value: new THREE.Vector2(0, 0)

    @uniformsNormal = THREE.UniformsUtils.clone(normalShader.uniforms)
    @uniformsNormal.height.value = 0.05
    @uniformsNormal.resolution.value.set rx, ry
    @uniformsNormal.heightMap.value = @heightMap
    @vertexShader = document.getElementById("vertexShader").textContent
    
    # TEXTURES
    specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars)
    diffuseTexture1 = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big.jpg", null, =>
      @loadTextures()
      @applyShader THREE.LuminosityShader, diffuseTexture1, specularMap
    )
    diffuseTexture2 = THREE.ImageUtils.loadTexture("lib/textures/backgrounddetailed6.jpg", null, =>
     @loadTextures()
    )
    detailTexture = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big-nm.jpg", null, =>
      @loadTextures()
    )
    diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping
    diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping
    detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping
    specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping
    
    # TERRAIN SHADER
    @terrainShader = THREE.ShaderTerrain["terrain"]
    @uniformsTerrain = THREE.UniformsUtils.clone(@terrainShader.uniforms)
    @uniformsTerrain["tNormal"].value = @normalMap
    @uniformsTerrain["uNormalScale"].value = 3.5
    @uniformsTerrain["tDisplacement"].value = @heightMap
    @uniformsTerrain["tDiffuse1"].value = diffuseTexture1
    @uniformsTerrain["tDiffuse2"].value = diffuseTexture2
    @uniformsTerrain["tSpecular"].value = specularMap
    @uniformsTerrain["tDetail"].value = detailTexture
    @uniformsTerrain["enableDiffuse1"].value = true
    @uniformsTerrain["enableDiffuse2"].value = true
    @uniformsTerrain["enableSpecular"].value = true
    @uniformsTerrain["uDiffuseColor"].value.setHex 0xffffff
    @uniformsTerrain["uSpecularColor"].value.setHex 0xffffff
    @uniformsTerrain["uAmbientColor"].value.setHex 0x111111
    @uniformsTerrain["uShininess"].value = 30
    @uniformsTerrain["uDisplacementScale"].value = 375
    @uniformsTerrain["uRepeatOverlay"].value.set 6, 6
    params = [["heightmap", document.getElementById("fragmentShaderNoise").textContent, @vertexShader, @uniformsNoise, false], ["normal", normalShader.fragmentShader, normalShader.vertexShader, @uniformsNormal, false], ["@terrain", @terrainShader.fragmentShader, @terrainShader.vertexShader, @uniformsTerrain, true]]
    i = 0

    while i < params.length
      material = new THREE.ShaderMaterial(
        uniforms: params[i][3]
        vertexShader: params[i][2]
        fragmentShader: params[i][1]
        lights: params[i][4]
        fog: true
      )
      @mlib[params[i][0]] = material
      i++
    plane = new THREE.PlaneGeometry(@SCREEN_WIDTH, @SCREEN_HEIGHT)
    @quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial(color: 0x000000))
    @quadTarget.position.z = -500
    @sceneRenderTarget.add @quadTarget
    
    # TERRAIN MESH
    @geometryTerrain = new THREE.PlaneGeometry(6000, 6000 ,256, 256)
    @geometryTerrain.computeFaceNormals()
    @geometryTerrain.computeVertexNormals()
    @geometryTerrain.computeTangents()
    @terrain = new THREE.Mesh(@geometryTerrain, @mlib["@terrain"])
    # @terrain.position.set 0, -125, 0
    @terrain.rotation.x = -Math.PI / 2
    @terrain.visible = false
    FW.scene.add @terrain
    
    # RENDERER
    @renderer = new THREE.WebGLRenderer({antialias: true})
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    @renderer.setClearColor FW.scene.fog.color, 1
    @renderer.domElement.style.position = "absolute"
    @renderer.domElement.style.top = @MARGIN + "px"
    @renderer.domElement.style.left = "0px"
    document.body.appendChild @renderer.domElement
    @renderer.gammaInput = true
    @renderer.gammaOutput = true
    

    
    
    
    # EVENTS
    @onWindowResize()

    
    # COMPOSER
    @renderer.autoClear = false
    renderTargetParameters =
      minFilter: THREE.LinearFilter
      magFilter: THREE.LinearFilter
      format: THREE.RGBFormat
      stencilBuffer: false

    @renderTarget = new THREE.WebGLRenderTarget(@SCREEN_WIDTH, @SCREEN_HEIGHT, renderTargetParameters)
    effectBloom = new THREE.BloomPass(0.4)
    effectBleach = new THREE.ShaderPass(THREE.BleachBypassShader)
    hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader)
    vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader)
    bluriness = 0
    hblur.uniforms["h"].value = bluriness / @SCREEN_WIDTH
    vblur.uniforms["v"].value = bluriness / @SCREEN_HEIGHT
    hblur.uniforms["r"].value = vblur.uniforms["r"].value = 0.5
    effectBleach.uniforms["opacity"].value = 0.65
    @composer = new THREE.EffectComposer(@renderer, @renderTarget)
    renderModel = new THREE.RenderPass(FW.scene, FW.camera)
    vblur.renderToScreen = true
    @composer = new THREE.EffectComposer(@renderer, @renderTarget)
    @composer.addPass renderModel
    @composer.addPass effectBloom
    
    #@composer.addPass( effectBleach );
    @composer.addPass hblur
    @composer.addPass vblur
    
    # PRE-INIT
    @renderer.initWebGLObjects FW.scene

    window.addEventListener "resize", (=>
      @onWindowResize()
    ), false
    document.addEventListener "keydown", (=>
      @onKeyDown(event)
    ), false


  #
  onWindowResize : (event) ->
    @SCREEN_WIDTH = window.innerWidth
    @SCREEN_HEIGHT = window.innerHeight - 2 * @MARGIN
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    FW.camera.aspect = @SCREEN_WIDTH / @SCREEN_HEIGHT
    FW.camera.updateProjectionMatrix()

  #
  onKeyDown : (event) =>
    switch event.keyCode
      when 78
        @lightDir *= -1 #N
      when 77
        @animDeltaDir *= -1 #M

  #
  applyShader : (shader, texture, target) ->
    shaderMaterial = new THREE.ShaderMaterial(
      fragmentShader: shader.fragmentShader
      vertexShader: shader.vertexShader
      uniforms: THREE.UniformsUtils.clone(shader.uniforms)
    )
    shaderMaterial.uniforms["tDiffuse"].value = texture
    sceneTmp = new THREE.Scene()
    meshTmp = new THREE.Mesh(new THREE.PlaneGeometry(@SCREEN_WIDTH, @SCREEN_HEIGHT), shaderMaterial)
    meshTmp.position.z = -500
    sceneTmp.add meshTmp
    @renderer.render sceneTmp, @cameraOrtho, target, true

  loadTextures : ->
    @textureCounter += 1
    @terrain.visible = true  if @textureCounter is 3

  #
  animate : =>
    requestAnimationFrame @animate
    @render()
  render : ->
    delta = @clock.getDelta()
    @stats.update()
    @groundControl.update()
    @meteor.tick()
    uniforms1.time.value += delta * 5;
    if @terrain.visible
      @controls.update(delta)
      time = Date.now() * 0.001
      fLow = 0.1
      fHigh = 0.8
      @lightVal = THREE.Math.clamp(@lightVal + 0.5 * delta * @lightDir, fLow, fHigh)
      valNorm = (@lightVal - fLow) / (fHigh - fLow)
      FW.scene.fog.color.setHSL 0.1, 0.5, @lightVal
      @renderer.setClearColor '0x000000', 1
      @directionalLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.1, 1.15)
      @pointLight.intensity = THREE.Math.mapLinear(valNorm, 0, 1, 0.9, 1.5)
      @uniformsTerrain["uNormalScale"].value = THREE.Math.mapLinear(valNorm, 0, 1, 0.6, 3.5)
      if @updateNoise
        @animDelta = THREE.Math.clamp(@animDelta + 0.00075 * @animDeltaDir, 0, 0.05)
        @uniformsNoise["time"].value += delta * @animDelta
        @uniformsNoise["offset"].value.x += delta * 0.05
        @uniformsTerrain["uOffset"].value.y = 2 * @uniformsNoise["offset"].value.y
        @quadTarget.material = @mlib["heightmap"]
        @renderer.render @sceneRenderTarget, @cameraOrtho, @heightMap, true
        @quadTarget.material = @mlib["normal"]
        @renderer.render @sceneRenderTarget, @cameraOrtho, @normalMap, true
      
      @updateNoise = true;
      
      # @renderer.render( FW.scene, FW.camera );
      @composer.render 0.1


    
