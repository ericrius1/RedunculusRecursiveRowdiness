FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->
    @generateSpeed()
    @startingPos = new THREE.Vector3 0, 700, 0
    @colorStart = new THREE.Color()
    @colorEnd = new THREE.Color()
    @meteorVisibleDistance = 3000
    @newMeteor()
    @light = new THREE.PointLight(0xefefef, 2, 699)
    FW.scene.add(@light)

  generateSpeed: ->
    @speedX = rnd(5, 10)
    @speedY = rnd(0.1, 0.5)
    @speedZ = rnd(5, 10)
    @accelX = .01
    @accelY =.01 
    @accelZ = .01
    @dirX = rnd(-1, 1)
    @dirY = -1
    @dirZ = rnd(1, -1)


  newMeteor: ->
    @colorStart.setRGB(Math.random(),Math.random(),Math.random() )
    FW.scene.remove(@meteorTail?.mesh)
    @meteorTail = new ShaderParticleGroup
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    @meteor = new THREE.Object3D()
    @meteor.position = new THREE.Vector3().copy(@startingPos)
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    @emitter = new ShaderParticleEmitter
      position: @meteor.position
      size: rnd(0.1, 1.3),
      sizeSpread: rnd(0.1, 1.0),
      acceleration: new THREE.Vector3(-@dirX, -@dirY, -@dirZ),
      accelerationSpread: new THREE.Vector3(.2, .2, .2),
      particlesPerSecond: 1000
      colorStart: @colorStart
      colorEnd: @colorEnd
    FW.scene.add(@meteorTail.mesh)
    @meteorTail.addEmitter @emitter
    @calcPosition()
    
  calcPosition: ->

    distance =  FW.camera.position.distanceTo(@meteor.position)
    #meteor is off screen, respawn it somewhere
    if distance > @meteorVisibleDistance
      @generateSpeed()
      @newMeteor()

    setInterval(=>
      @calcPosition()
    10000)
    

  tick: ->
    @speedX +=@accelX
    @speedY +=@accelY
    @speedZ +=@accelY
    @meteor.translateX(@speedX * @dirX)
    @meteor.translateY( @speedY * @dirY)
    @meteor.translateZ(@speedZ * @dirZ)
    @emitter.position = new THREE.Vector3().copy(@meteor.position)
    @light.position = new THREE.Vector3().copy(@meteor.position)
    @meteorTail.tick(0.16)
    


