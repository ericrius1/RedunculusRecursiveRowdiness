
window.World = class World
  
  time = Date.now() 
  constructor: ()->
    @entities = []

    @clock = new THREE.Clock()
    @projector = new THREE.Projector()
    #CAMERA
    @camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)


    #Training Cube
    @bulletMat= new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragment_shader1').textContent

    })
    @bulletGeo = new THREE.CubeGeometry(1,1,1);


    @scene = new THREE.Scene()
    light = new THREE.DirectionalLight(0xffeeee, 1.0)
    light.position.set 1, 1, 1
    @scene.add(light)

    light = new THREE.DirectionalLight( 0xffffff, 0.75 );
    light.position.set( -1, - 0.5, -1 );
    @scene.add( light );


    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);

    # # floor
    # geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    # geometry.applyMatrix new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    # material = new THREE.MeshBasicMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
    # material.opacity = 0.6
    # mesh = new THREE.Mesh(geometry, material)
    # @scene.add mesh
    
    
    @renderer = new THREE.WebGLRenderer({antialias: true})
    @renderer.setClearColor( 0x000000, 1 );
    @renderer.setSize window.innerWidth, window.innerHeight
    document.body.appendChild @renderer.domElement

    #CONTROLS
    @controls = new THREE.FirstPersonControls(@camera, @renderer.domElement)
    @controls.movementSpeed = .03
    @controls.lookSpeed = .0002
    @scene.add @controls
    
    window.addEventListener "resize", onWindowResize, false



  addEntity: (script)->

    # GROW3
    @g = new grow3.System(@scene, @camera, script)
    @entities.push @g.build()

  castSpell: (x, y)->
    vector = new THREE.Vector3(x, y, 1) 
    @projector.unprojectVector(vector, @camera)
    bullet = new THREE.Mesh(@bulletGeo, @bulletMat)
    bullet.position.set(@camera.position.x, @camera.position.y, @camera.position.z)
    @scene.add(bullet)
    # @addEntity(RULES.bush)


  onWindowResize = ->
    myWorld.camera.aspect = window.innerWidth / window.innerHeight
    myWorld.camera.updateProjectionMatrix()
    myWorld.renderer.setSize window.innerWidth, window.innerHeight

  animate: =>

    requestAnimationFrame @animate

    delta = @clock.getDelta();

    uniforms1.time.value += delta * 5;
    @stats.update()
    @controls.update Date.now() - time
    @renderer.render @scene, @camera
    time = Date.now()
    uniforms1.time.value += delta * 5;



