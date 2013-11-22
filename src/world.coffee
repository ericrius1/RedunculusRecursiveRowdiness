
FW.World = class World
  
  time = Date.now() 
  constructor: ()->
    @clock = new THREE.Clock()
    @rnd = FW.rnd


    

  init: ->
    #scene
    @scene = new THREE.Scene()

    @firework = new FW.Firework()
    @groundControl = new FW.Rockets()

    #CAMERA
    @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    @camera.position.z = 1;

    # #MOON
    geometry = new THREE.SphereGeometry(0.5, 32, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffffff})
    mesh = new THREE.Mesh(geometry, material );
    # mesh.scale.multiplyScalar(17);
    mesh.position.set(-50, 20, -100)
    @scene.add( mesh );
    moonlight = new THREE.DirectionalLight(0xffeeee, 1.0)
    mesh.add(moonlight)

    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);

    #TERRAIN
    @terrain = new FW.Terrain()

    #RECURSIVE STRUCTURES
    @g = new grow3.System(@scene, @camera, RULES.bush)
    @g.build(undefined, new THREE.Vector3(@rnd(100,300), 10, 10))
    
    @renderer = new THREE.WebGLRenderer({antialias: true})
    @renderer.setClearColor( 0x000000, 1 );
    @renderer.setSize window.innerWidth, window.innerHeight
    document.body.appendChild @renderer.domElement

    #CONTROLS
    @controls = new THREE.TrackballControls( @camera );
    @controls.target.set( 0, 0, 0 );

    @controls.rotateSpeed = 1.0;
    @controls.zoomSpeed = 1.2;
    @controls.panSpeed = 0.8;

    @controls.noZoom = false;
    @controls.noPan = false;

    @controls.staticMoving = false;
    @controls.dynamicDampingFactor = 0.15;

    @controls.keys = [ 65, 83, 68, 32 ];

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
    delta = @clock.getDelta();

    uniforms1.time.value += delta * 5;
    @stats.update()
    @controls.update()
    @renderer.render @scene, @camera
    time = Date.now()
