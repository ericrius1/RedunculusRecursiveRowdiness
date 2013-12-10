FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->
    @startingPos = new THREE.Vector3 0, 700, 0
    @colorStart = new THREE.Color()
    @colorEnd = new THREE.Color()
    @meteors = []
    @meteorGroup = new ShaderParticleGroup
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    @meteorVisibleDistance = 3000
    for i in [1..3]
      @newMeteor()
    FW.scene.add(@meteorGroup.mesh)
    @calcPositions()
    

  generateSpeed: (meteor)->
    meteor.speedX = rnd(0.1, 1)
    meteor.speedY = .05
    meteor.speedZ = rnd(0.1, 1)
    meteor.accelX = .1
    meteor.accelY = 0.001  
    meteor.accelZ = .1
    meteor.dirX = rnd(-1, 1)
    meteor.dirY = -1
    meteor.dirZ = rnd(1, -1)


  newMeteor: ->
    @colorStart.setRGB(Math.random(),Math.random(),Math.random() )
    meteor = new THREE.Object3D()
    @generateSpeed meteor
    meteor.position = new THREE.Vector3().copy(@startingPos)
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    meteor.light = new THREE.PointLight(0xefefef, 2, 799)
    FW.scene.add(meteor.light)
    tailEmitter = new ShaderParticleEmitter
      position: meteor.position
      size: 10
      sizeSpread: 10
      # acceleration: new THREE.Vector3(-@dirX, -@dirY, -@dirZ),
      accelerationSpread: new THREE.Vector3(.4, .4, .4),
      particlesPerSecond: 5000
      colorStart: @colorStart
      colorEnd: @colorEnd
    @meteorGroup.addEmitter tailEmitter
    @meteors.push meteor
    
  calcPositions: ->
    for meteor in @meteors
      distance =  FW.camera.position.distanceTo(meteor.position)
      #meteor is off screen, respawn it somewhere
      if distance > @meteorVisibleDistance
        @generateSpeed meteor
        meteor.position = new THREE.Vector3().copy(@startingPos)

    setInterval(=>
      @calcPositions()
    10000)
    

  tick: ->
    for meteor in @meteors
      meteor.speedX +=meteor.accelX
      meteor.speedY +=meteor.accelY
      meteor.speedZ +=meteor.accelZ
      meteor.translateX(meteor.speedX * meteor.dirX)
      meteor.translateY( meteor.speedY * meteor.dirY)
      meteor.translateZ(meteor.speedZ * meteor.dirZ)
      meteor.light.position = new THREE.Vector3().copy(meteor.position)
    @meteorGroup.tick(0.16)
    


