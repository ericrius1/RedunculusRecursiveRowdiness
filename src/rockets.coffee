
#handle rocket stuff
FW.Rockets = class Rockets
  rnd = FW.rnd
  constructor: ()->
    rnd = FW.rnd
    @rockets = []
    @launchSound = new Audio('./assets/launch.mp3');
    @explodeSound = new Audio('./assets/explosion.mp3');
    @crackleSound = new Audio('./assets/crackle.mp3');
    @soundOn = false
    @color = new THREE.Color()
    @color.setRGB(200, 10, 0)


    @firework = new FW.Firework(@color)

    @projector = new THREE.Projector()
    @launchSpeed = 2.1
    @explosionDelay = 1000
    @shootDirection = new THREE.Vector3()


    @dimmingSpeed = 0.008
    @explosionLightIntensity = 2.0

    @rocketMat= new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader: document.getElementById('rocketVertexShader').textContent,
    fragmentShader: document.getElementById('fragment_shader1').textContent

    })
    @rocketGeo = new THREE.CylinderGeometry(.1, 1, 1);


    #LIGHTS
    @light = new THREE.PointLight(0xffeeee, 0.0, 4000)
    @light.position.set(1, 1, 1);
    FW.scene.add(@light)




  explode: (rocket)->
    FW.scene.remove(rocket)
    @light.intensity = @explosionLightIntensity
    @light.position.set rocket.position.x, rocket.position.y, rocket.position.z
    console.log @rockets
    @rockets.splice(@rockets.indexOf(rocket), 1) 
    @firework.createExplosion(rocket.position)

    
    #set timeout for speed of sound delay!
    if @soundOn
        setTimeout(()=>
          @explodeSound.play()
          setTimeout(()=>
            #@crackleSound.play()
          400)
        500)


  launchRocket: ()->
    @launchSound.load();
    @explodeSound.load()
    @crackleSound.load()
    rocket = new THREE.Mesh(@rocketGeo, @rocketMat)
    rocket.position.set(FW.camera.position.x, FW.camera.position.y, FW.camera.position.z)
    rocket.scale.set(0.1, 0.1, 0.1)
    vector = new THREE.Vector3()
    vector.set(0,0,1)
    @projector.unprojectVector(vector, FW.camera)
    ray = new THREE.Ray(FW.camera.position, vector.sub(FW.camera.position).normalize() );
    FW.scene.add(rocket)
    rocket.shootDirection = new THREE.Vector3()
    rocket.shootDirection.x = ray.direction.x;
    rocket.shootDirection.y = ray.direction.y;
    rocket.shootDirection.z = ray.direction.z;
    rocket.launchSpeedY = 0.0
    rocket.translateX(rocket.shootDirection.x)
    rocket.translateY(rocket.shootDirection.y)
    rocket.translateZ(rocket.shootDirection.z)
    if @soundOn
        @launchSound.play();
    @rockets.push(rocket)
    setTimeout(()=>
      @explode(rocket)
    @explosionDelay)

  update: ()->
    if @light.intensity > 0
      @light.intensity -= @dimmingSpeed * @explosionLightIntensity
    @updateRocket rocket for rocket in @rockets
    @firework.tick()


  updateRocket: (rocket)->
    rocket.translateX(@launchSpeed * rocket.shootDirection.x)
    rocket.translateY( @launchSpeed * rocket.shootDirection.y)
    rocket.translateZ(@launchSpeed * rocket.shootDirection.z)
    rocket.translateY(rocket.launchSpeedY)
    rocket.launchSpeedY -=.005

