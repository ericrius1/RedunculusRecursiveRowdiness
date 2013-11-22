window.SCREEN_WIDTH = window.innerWidth
window.SCREEN_HEIGHT = window.innerHeight
FW.World = class World
  
  time = Date.now() 
  constructor: ()->
    @clock = new THREE.Clock()
    @rnd = FW.rnd


  init: ->
    #scene
    @scene = new THREE.Scene()
    @scene.fog = new THREE.Fog( 0x050505, 2000, 4000 );

    @firework = new FW.Firework()
    @groundControl = new FW.Rockets()

    #CAMERA
    
    @camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 2, 4000 );
    @camera.position.set( -1200, 800, 1200 );

    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);


    #RECURSIVE STRUCTURES
    @g = new grow3.System(@scene, @camera, RULES.bush)
    @g.build(undefined, new THREE.Vector3(100, 10, 10))
    

    #RENDERER
    @renderer = new THREE.WebGLRenderer()
    @renderer.setClearColor(@scene.fog.color, 1 );
    @renderer.setSize window.innerWidth, window.innerHeight
    @renderer.gammaInput = true;
    @renderer.gammaOutput = true;
    document.body.appendChild @renderer.domElement

    #LIGHTS

    @scene.add new THREE.AmbientLight(0x111111)
    @directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
    @directionalLight.position.set 500, 2000, 0
    @scene.add @directionalLight
    @pointLight = new THREE.PointLight(0xff4400, 1.5)
    @pointLight.position.set 0, 0, 0
    @scene.add @pointLight
    #TERRAIN
    @terrain = new FW.Terrain()
    @terrain.init()

    #CONTROLS
    @controls = new THREE.OrbitControls( @camera );


    #FOG
    # @scene.fog = new THREE.Fog( 0xff00ff );
    
    window.addEventListener "resize", onWindowResize, false

  onWindowResize = ->
    FW.myWorld.camera.aspect = window.innerWidth / window.innerHeight
    FW.myWorld.camera.updateProjectionMatrix()
    FW.myWorld.renderer.setSize window.innerWidth, window.innerHeight

  animate: =>

    requestAnimationFrame @animate
    @groundControl.update()
    @delta = @clock.getDelta();
    if @terrainVisible
        @terrain.update()


    uniforms1.time.value += @delta * 5;
    @stats.update()
    @controls.update()
    # @renderer.render @scene, @camera
    time = Date.now()
