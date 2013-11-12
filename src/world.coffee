
window.World = class World
  
  constructor: ()->
    @time = Date.now()
    @blocker = document.getElementById("blocker")
    @entities = []

    
    #CAMERA
    @camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    @camera.position.z = 100
    @camera.position.y = 10

    @scene = new THREE.Scene()
    light = new THREE.DirectionalLight(0xffffff, 1.5)
    light.position.set 1, 1, 1

    light = new THREE.DirectionalLight(0xffffff, 1.5)
    light.position.set 1, 1, 1
    @scene.add light



    #CONTROLS
    @controls = new THREE.PointerLockControls(@camera)
    @scene.add @controls.getObject()

    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';

    # floor
    @geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
    @geometry.applyMatrix new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    i = 0
    l = @geometry.vertices.length

    while i < l
      vertex = @geometry.vertices[i]
      vertex.x += Math.random() * 20 - 10
      vertex.y += Math.random() * 2
      vertex.z += Math.random() * 20 - 10
      i++
    i = 0
    l = @geometry.faces.length

    while i < l
      face = @geometry.faces[i]
      face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      i++
    @material = new THREE.MeshBasicMaterial(vertexColors: THREE.VertexColors)
    @mesh = new THREE.Mesh(@geometry, @material)
    @scene.add @mesh
    
    
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize window.innerWidth, window.innerHeight
    document.body.appendChild @renderer.domElement
    
    window.addEventListener "resize", onWindowResize, false

    setUpControls()


   addEntity: (script)->


    # GROW3
    @g = new grow3.System(@scene, @camera, script)
    start = (new Date).getTime()
    @entities.push @g.build()
    diff = (new Date).getTime() - start
    console.debug "Building time: " + diff + "ms"



  onWindowResize = ->
    myWorld.camera.aspect = window.innerWidth / window.innerHeight
    myWorld.camera.updateProjectionMatrix()
    myWorld.renderer.setSize window.innerWidth, window.innerHeight

  animate: =>
    requestAnimationFrame @animate
    @stats.begin()

    @controls.update Date.now() - @time
    @renderer.render @scene, @camera
    @time = Date.now()
    @stats.end()




  setUpControls = ->
    instructions = document.getElementById("instructions")
    havePointerLock = "pointerLockElement" of document or "mozPointerLockElement" of document or "webkitPointerLockElement" of document
    if havePointerLock
      element = document.body
      pointerlockchange = (event) ->
        if document.pointerLockElement is element or document.mozPointerLockElement is element or document.webkitPointerLockElement is element
          myWorld.controls.enabled = true
          myWorld.addEntity(bush)

          myWorld.blocker.style.display = "none"
        else
          myWorld.controls.enabled = false
          myWorld.blocker.style.display = "-webkit-box"
          myWorld.blocker.style.display = "-moz-box"
          myWorld.blocker.style.display = "box"
          instructions.style.display = ""

      pointerlockerror = (event) ->
        instructions.style.display = ""

      document.addEventListener "pointerlockchange", pointerlockchange, false
      document.addEventListener "mozpointerlockchange", pointerlockchange, false
      document.addEventListener "webkitpointerlockchange", pointerlockchange, false
      document.addEventListener "pointerlockerror", pointerlockerror, false
      document.addEventListener "mozpointerlockerror", pointerlockerror, false
      document.addEventListener "webkitpointerlockerror", pointerlockerror, false
      instructions.addEventListener "click", ((event) ->
        instructions.style.display = "none"
        element.requestPointerLock = element.requestPointerLock or element.mozRequestPointerLock or element.webkitRequestPointerLock
        if /Firefox/i.test(navigator.userAgent)
          fullscreenchange = (event) ->
            if document.fullscreenElement is element or document.mozFullscreenElement is element or document.mozFullScreenElement is element
              document.removeEventListener "fullscreenchange", fullscreenchange
              document.removeEventListener "mozfullscreenchange", fullscreenchange
              element.requestPointerLock()

          document.addEventListener "fullscreenchange", fullscreenchange, false
          document.addEventListener "mozfullscreenchange", fullscreenchange, false
          element.requestFullscreen = element.requestFullscreen or element.mozRequestFullscreen or element.mozRequestFullScreen or element.webkitRequestFullscreen
          element.requestFullscreen()
        else
          element.requestPointerLock()
      ), false
    else
      instructions.innerHTML = "Your browser doesn't seem to support Pointer Lock API"
  
