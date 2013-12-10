FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    #create a few different emmitters and add to pool
    @colorStart = new THREE.Color()
    @colorEnd = new THREE.Color()
    @numFireworksPerExplosion = 3
    @lightIndex = 0
    @fwSpread = 100
    @fwAge = 15
    @lightRange = 1000
    @startLightIntensity = 4
    @lightDimmingFactor = .5/@fwAge

    @explodeSound = new Audio('./assets/explosion.mp3');
    @crackleSound = new Audio('./assets/crackle.mp3');
    @lights = []
    
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 6
    });

    for i in [1..10]
      @particleGroup.addPool( 1, @generateEmitter(), false )     
    FW.scene.add(@particleGroup.mesh)

  generateEmitter : ->
    @colorStart.setRGB(Math.random(), Math.random(),Math.random())
    @colorEnd.setRGB(Math.random(), Math.random(),Math.random())
    light = new THREE.PointLight(@colorStart, 0.0, @lightRange)
    FW.scene.add(light)
    @lights.push(light)
    emitterSettings = 
      velocity: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1))
      acceleration: new THREE.Vector3(0, -0.01, 0),
      accelerationSpread: new THREE.Vector3(rnd(-2, 0), rnd(-2, 0), rnd(-2, 0)),
      colorStart: @colorStart,
      colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5)),
      colorEnd: @colorEnd,
      particlesPerSecond: 100
      alive: 0,  
      emitterDuration: 1.0
      opacityEnd: 0.4

  createExplosion: (origPos, newPos = origPos, count=0)->
    emitter = @particleGroup.triggerPoolEmitter(1, newPos)
    light = @lights[@lightIndex++]
    if @lightIndex is @lights.length
      @lightIndex = 0
    light.position.set(newPos.x, newPos.y, newPos.z)
    light.intensity = @startLightIntensity
    if count < @numFireworksPerExplosion
      setTimeout =>
        @explodeSound.load()
        #set timeout for speed of sound delay!
        if soundOn
          setTimeout(()=>
            @explodeSound.play()
            setTimeout(()=>
              @crackleSound.play()
            100)
          100)
        count++
        newPos = new THREE.Vector3(rnd(origPos.x - @fwSpread, origPos.x+@fwSpread), rnd(origPos.y - @fwSpread, origPos.y+@fwSpread), rnd(origPos.z - @fwSpread, origPos.z+@fwSpread))
        @createExplosion(origPos, newPos, count++)
      ,rnd(100, 700)

    
  tick: ->
    @particleGroup.tick(0.16)
    for light in @lights
      if light.intensity > 0
        light.intensity -=@lightDimmingFactor


