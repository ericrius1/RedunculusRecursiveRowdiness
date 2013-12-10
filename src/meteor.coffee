FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->
    @generateSpeed()
    @startingPos = new THREE.Vector3 -290, 1335, 883
    @colorStart = new THREE.Color()
    @colorStart.setRGB(Math.random(),Math.random(),Math.random() )



    @meteorTail = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    sphereGeo = new THREE.SphereGeometry(5, 5, 5 )
    @meteor = new THREE.Object3D()
    @meteor.position = new THREE.Vector3().copy(@startingPos)
    @newMeteor()
    FW.scene.add(@meteorTail.mesh)

    @light = new THREE.PointLight(0xefefef, 2, 1000)
    FW.scene.add(@light)

  generateSpeed: ->
    @speedX = .1
    @speedY = .1
    @speedZ = .1
    @accelX =rnd(.01, .05)
    @accelY = .02
    @accelZ = .01
    @dirX = rnd(0, 0)
    @dirY = -1
    @dirZ = rnd(0, 0)


  newMeteor: ->
    @emitter = new ShaderParticleEmitter
      position: @meteor.position
      size: rnd(0.01, 1.3),
      sizeSpread: rnd(0.1, 1.0),
      acceleration: new THREE.Vector3(-@dirX, -@dirY, -@dirZ),
      accelerationSpread: new THREE.Vector3(.2, .2, .2),
      particlesPerSecond: 1000
      opacityEnd: 0.5
      colorStart: @colorStart
      colorEnd: @colorEnd
    
    @meteorTail.addEmitter @emitter
    @calcPosition()
    
  calcPosition: ->

    distance =  FW.camera.position.distanceTo(@meteor.position)
    #meteor is off screen, respawn it somewhere
    if distance > FW.camera.far
      @generateSpeed()
      @meteor.position = new THREE.Vector3().copy(@startingPos)

    setInterval(=>
      @calcPosition()
    20000)
    
    
  tick: ->
    @speedX += @accelX
    @speedY += @accelY
    @speedZ += @accelZ
    # @meteor.translateX(@speedX * @dirX)
    @meteor.translateY( @dirY)
    # @meteor.translateZ(@speedZ * @dirZ)
    @emitter.position = new THREE.Vector3().copy(@meteor.position)
    @light.position = new THREE.Vector3().copy(@meteor.position)
    @meteorTail.tick(0.16)
    


