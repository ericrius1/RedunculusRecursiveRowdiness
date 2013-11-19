
FW.World = class World
  
  time = Date.now() 
  constructor: ()->
    @clock = new THREE.Clock()
    rnd = FW.rnd


    #scene
    @scene = new THREE.Scene()

    #CAMERA
    @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    @camera.position.z = 1;

    #MOON
    light = new THREE.DirectionalLight(0xff00ff)
    geometry = new THREE.SphereGeometry(0.5, 32, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffffff})
    mesh = new THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(17);
    mesh.position.set(-50, 20, -100)
    moonlight = new THREE.DirectionalLight(0xffeeee, 1.0)
    @scene.add( mesh );
    mesh.add(moonlight)

    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);

    # FLOOR
    geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    geometry.applyMatrix new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    material = new THREE.MeshPhongMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
    material.opacity = 0.6
    material.needsUpdate = true

    mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = -200
    @scene.add mesh

    #RECURSIVE STRUCTURES
    # @g = new grow3.System(@scene, @camera, RULES.bush)
    # @g.build(undefined, new THREE.Vector3(rnd(100,300), 10, 10))
    
    @renderer = new THREE.WebGLRenderer({antialias: true})
    @renderer.setClearColor( 0x000000, 1 );
    @renderer.setSize window.innerWidth, window.innerHeight
    document.body.appendChild @renderer.domElement

    #CONTROLS
    @controls = new THREE.OrbitControls(@camera, @renderer.domElement)
    @scene.add @controls
    
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
