
FW.World = class World
  
  time = Date.now() 
  constructor: ()->

    @clock = new THREE.Clock()
    @projector = new THREE.Projector()
    @targetVec = new THREE.Vector3()
    @launchSpeed = 3.7
    @explosionDelay = 2000
    @shootDirection = new THREE.Vector3()
    @rockets = []
  
    #scene
    @scene = new THREE.Scene()

    #CAMERA
    @camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    @camera.position.z = 1;




    #ROCKET
    @rocketMat= new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragment_shader1').textContent

    })
    @rocketGeo = new THREE.CubeGeometry(1,1,1);

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

    # floor
    geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    geometry.applyMatrix new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    material = new THREE.MeshBasicMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
    material.opacity = 0.6

    mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = -200
    @scene.add mesh
    
    
    @renderer = new THREE.WebGLRenderer({antialias: true})
    @renderer.setClearColor( 0x000000, 1 );
    @renderer.setSize window.innerWidth, window.innerHeight
    document.body.appendChild @renderer.domElement

    #CONTROLS
    @controls = new THREE.OrbitControls(@camera, @renderer.domElement)
    @scene.add @controls
    
    window.addEventListener "resize", onWindowResize, false



  addEntity: (position)->

    # GROW3
    @g = new grow3.System(@scene, @camera, RULES.bush)
    @g.build(undefined, position)

  explode: (rocket)=>
    @scene.remove(rocket)
    @firework.createExplosion(rocket.position)

  launchRocket: ()->
    rocket = new THREE.Mesh(@rocketGeo, @rocketMat)
    rocket.position.set(@camera.position.x, @camera.position.y, @camera.position.z)
    @rockets.push(rocket)
    vector = @shootDirection
    @shootDirection.set(0,0,1)
    @projector.unprojectVector(vector, @camera)
    ray = new THREE.Ray(@camera.position, vector.sub(@camera.position).normalize() );
    @scene.add(rocket)
    @target =  vector.sub(@camera.position).normalize()
    @shootDirection.x = ray.direction.x;
    @shootDirection.y = ray.direction.y;
    @shootDirection.z = ray.direction.z;
    setTimeout(()=>@explode(rocket), 
    @explosionDelay)

  onWindowResize = ->
    FW.myWorld.camera.aspect = window.innerWidth / window.innerHeight
    FW.myWorld.camera.updateProjectionMatrix()
    FW.myWorld.renderer.setSize window.innerWidth, window.innerHeight

  animate: =>

    requestAnimationFrame @animate

    delta = @clock.getDelta();

    # if @rocket?
    #   @rocket.translateX(@launchSpeed * @shootDirection.x)
    #   @rocket.translateY( @launchSpeed * @shootDirection.y)
    #   @rocket.translateZ(@launchSpeed * @shootDirection.z)
    @updateRocket rocket for rocket in @rockets
 
    if @firework.exploding
      @firework.tick()
    # uniforms1.time.value += delta * 5;
    @stats.update()
    @controls.update()
    @renderer.render @scene, @camera
    time = Date.now()


  updateRocket: (rocket)->
    rocket.translateX(@launchSpeed * @shootDirection.x)
    rocket.translateY( @launchSpeed * @shootDirection.y)
    rocket.translateZ(@launchSpeed * @shootDirection.z)
