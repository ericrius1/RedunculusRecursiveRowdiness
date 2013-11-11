window.World = class World
  constructor: (@parentElement)->
    @isRendering = false
    SCREEN_WIDTH = window.innerWidth
    SCREEN_HEIGHT = window.innerHeight
    VIEW_ANGLE = 45
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
    NEAR = 0.1
    FAR = 20000
    @noLighting = true
    @entities = []
    Pi = 3.141592653589793


    # RENDERER
    if Detector.webgl
      @renderer = new THREE.WebGLRenderer(
        antialias: true
        preserveDrawingBuffer: true
      )
    else
      @parentElement.appendChild Detector.getWebGLErrorMessage()
      @renderer = new THREE.CanvasRenderer()
    
    @renderer.setSize SCREEN_WIDTH, SCREEN_HEIGHT
    @container = document.createElement("div")
    @parentElement.appendChild @container
    @container.appendChild @renderer.domElement

    # CAMERA
    @camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

    # EVENTS
    THREEx.FullScreen.bindKey charCode: "f".charCodeAt(0)
    THREEx.WindowResize @renderer, @camera

    # CONTROLS
    @controls = new THREE.OrbitControls(@camera, @container)
    @controls.minPolarAngle = 0.1
    @controls.maxPolarAngle = Pi - 1 
    @animate()

    # SCENE WITH CAM
    @scene = new THREE.Scene()
    @scene.add @camera
    @camera.position.set -25,50, 10 
    @camera.up = new THREE.Vector3(0,0,1)
    @camera.lookAt 0

    geometry = new THREE.PlaneGeometry(300,300)
    material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } )
    plane = new THREE.Mesh(geometry, material)
    plane.receiveShadow = false
    @scene.add(plane)


  addEntity: (script)->
    @isRendering = false
    @frameCount = 0


    # GROW3
    @g = new grow3.System(@scene, @camera, script)
    start = (new Date).getTime()
    @entities.push @g.build()
    diff = (new Date).getTime() - start
    console.debug "Building time: " + diff + "ms"
    
    if @noLighting
      # default lighting
      light = new THREE.PointLight(0xffeeee, 1.3)
      light.position.set 10, 10, 10
      @scene.add light
      light2 = new THREE.PointLight(0xeeeeff, 1.0) # soft white light
      light2.position.set -10, -10, -10
      @scene.add light2
      @noLighting = false;
    @isRendering = true

  animate : =>
    requestAnimationFrame @animate
    if @isRendering
      @render()
      @update()
    else

  render : ->
    @renderer.setClearColor @g.backgroundColor
    @renderer.render @scene, @camera

  update : ->
    @controls.update()