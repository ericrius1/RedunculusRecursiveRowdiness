
window.World = class World
  
  time = Date.now() 
  constructor: ()->
    @blocker = document.getElementById("blocker")
    @entities = []

    
    #CAMERA
    @camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)


    @scene = new THREE.Scene()
    light = new THREE.DirectionalLight(0xffffff, 1.5)
    light.position.set 1, 1, 1
    @scene.add(light)

    light = new THREE.DirectionalLight( 0xffffff, 0.75 );
    light.position.set( -1, - 0.5, -1 );
    @scene.add( light );



    #CONTROLS
    @controls = new THREE.PointerLockControls(@camera)
    @scene.add @controls.getObject()

    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);

    # floor
    geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    geometry.applyMatrix new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    material = new THREE.MeshBasicMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
    material.opacity = 0.6
    mesh = new THREE.Mesh(geometry, material)
    @scene.add mesh
    
    
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
    @gameOn = true




  onWindowResize = ->
    myWorld.camera.aspect = window.innerWidth / window.innerHeight
    myWorld.camera.updateProjectionMatrix()
    myWorld.renderer.setSize window.innerWidth, window.innerHeight

  animate: =>
    requestAnimationFrame @animate
    @stats.update()
    @controls.update Date.now() - time
    @renderer.render @scene, @camera
    time = Date.now()




  setUpControls = ->
    instructions = document.getElementById("instructions")
    havePointerLock = "pointerLockElement" of document or "mozPointerLockElement" of document or "webkitPointerLockElement" of document
    if havePointerLock
      element = document.body
      @pointerlockchange = (event) ->
        if myWorld.gameOn 
          return
        if document.pointerLockElement is element or document.mozPointerLockElement is element or document.webkitPointerLockElement is element
          myWorld.controls.enabled = true
          myWorld.addEntity(bush)

          myWorld.blocker.style.display = "none"
          document.removeEventListener "pointerlockchange", pointerlockchange, false
          console.log 'removed'
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
  
