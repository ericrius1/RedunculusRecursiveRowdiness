FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->
    @startingPos = new THREE.Vector3 0, 1000, 0
    @startYRange = 3000
    @meteors = []
    @activeMeteors = []
    @currentMeteorIndex = 0
    @meteorGroup = new ShaderParticleGroup
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    @meteorVisibleDistance = 3000
    for i in [1..10]
      @newMeteor()
    FW.scene.add(@meteorGroup.mesh)
    @activeMeteors.push @meteors[0]
    @calcPositions()
    

  generateSpeed: (meteor)->
    meteor.speedX = rnd(0.1, 1)
    meteor.speedY = .05
    meteor.speedZ = rnd(0.1, 1)
    meteor.accelX = rnd(.01, .1)
    meteor.accelY = 0.005  
    meteor.accelZ = rnd(.01, .1)
    meteor.dirX = rnd(-1, 1)
    meteor.dirY = -1
    meteor.dirZ = rnd(1, -1)


  newMeteor: ->
    colorStart = new THREE.Color()
    colorStart.setRGB(Math.random(),Math.random(),Math.random() )
    meteor = new THREE.Object3D()
    @generateSpeed meteor
    meteor.position = new THREE.Vector3(@startingPos.x, rnd(@startingPos.y, @startingPos.y + @startYRange), @startingPos.z)
    colorEnd = new THREE.Color()
    colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    meteor.light = new THREE.PointLight(colorStart, 0, 1000)
    FW.scene.add(meteor.light)
    meteor.tailEmitter = new ShaderParticleEmitter
      position: meteor.position
      positionSpread: new THREE.Vector3(20, 20, 20)
      size: rnd(100, 200)
      sizeSpread: 100
      sizeEnd: rnd(20, 50)
      acceleration: new THREE.Vector3(meteor.dirX, meteor.dirY, meteor.dirZ),
      accelerationSpread: new THREE.Vector3(.7, .7, .7),
      particlesPerSecond: 100
      colorStart: colorStart
      colorSpread: new THREE.Vector3(rnd(0, .5), rnd(0.5), rnd(0.5))
    @meteorGroup.addEmitter meteor.tailEmitter
    @meteors.push meteor
  
  activateMeteor: ->
    if @currentMeteorIndex is @meteors.length
      @currentMeteorIndex = 0
    @activeMeteors.push @meteors[@currentMeteorIndex++]
    if @activeMeteors.length > @maxActiveMeteors
      @activeMeteors.shift()



  calcPositions: ->
    for meteor in @activeMeteors
      distance =  FW.camera.position.distanceTo(meteor.position)
      #meteor is off screen, respawn it somewhere
      if distance > @meteorVisibleDistance
        @generateSpeed meteor
        meteor.position = new THREE.Vector3(@startingPos.x, rnd(@startingPos.y, @startingPos.y + @startYRange), @startingPos.z)
        @activateMeteor()

    setInterval(=>
      @calcPositions()
    10000)
    

  tick: ->
    for meteor in @activeMeteors
      meteor.speedX +=meteor.accelX
      meteor.speedY +=meteor.accelY
      meteor.speedZ +=meteor.accelZ
      meteor.translateX(meteor.speedX * meteor.dirX)
      meteor.translateY( meteor.speedY * meteor.dirY)
      meteor.translateZ(meteor.speedZ * meteor.dirZ)
      meteor.light.position = new THREE.Vector3().copy(meteor.position)
      meteor.tailEmitter.position = new THREE.Vector3().copy(meteor.position)
    @meteorGroup.tick(FW.tickRate)
    


