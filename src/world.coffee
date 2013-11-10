window.World = class World
  constructor: (@parentElement)->
    @isRendering = false
    @frameCount = 0
    SCREEN_WIDTH = window.innerWidth
    SCREEN_HEIGHT = window.innerHeight
    VIEW_ANGLE = 45
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
    NEAR = 0.1
    FAR = 20000

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
    @controls = new THREE.TrackballControls(@camera, @container)
    animate()

  animate = ->
    requestAnimationFrame animate
    if @isRendering
      @frameCount++
      render()
      update()
    else
      @frameCount = 0

  render = ->
    @renderer.setClearColor @g.backgroundColor
    @renderer.render @scene, @camera

  update = ->
    @controls.update()