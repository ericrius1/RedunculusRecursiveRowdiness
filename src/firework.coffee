FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    #create a few different emmitters and add to pool
    @colorStart = new THREE.Color()
    @colorEnd = new THREE.Color()
    @lightIndex = 0
    @fwSpread = 200
    @fwAge = 15
    @lightRange = 1000
    @startLightIntensity = 2
    @lightDimmingFactor = .5/@fwAge

    @explodeSound = new Audio('./assets/explosion.mp3');
    @explodeSound.volume = FW.sfxVolume
    @crackleSound = new Audio('./assets/crackle.mp3');
    @crackleSound.volume = FW.sfxVolume * 0.5
    @lights = []
    
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 9
    });

    for i in [1..10]
      @particleGroup.addPool( 1, @generateEmitter(), false )     
    FW.scene.add(@particleGroup.mesh)

  generateEmitter : ->
    @colorStart.setRGB(Math.random(), Math.random(),Math.random())
    light = new THREE.PointLight(@colorStart, 0.0, @lightRange)
    FW.scene.add(light)
    @lights.push(light)
    @colorEnd.setRGB(Math.random(), Math.random(),Math.random())
    emitterSettings = 
      type: 'sphere'
      radius: 4
      radiusScale: new THREE.Vector3(rnd(1, 1.5), rnd(1, 1.5), rnd(1, 1.5))
      speed: 10
      speedSpread: 10
      colorStart: @colorStart,
      colorSpread: new THREE.Vector3(.2, .2, .2)
      colorEnd: @colorEnd,
      particlesPerSecond: 400
      size: rnd(50, 200)
      sizeSpread: 100
      alive: 0,  
      emitterDuration: 1.0

  createExplosion: (origPos, newPos = origPos, count=0)->
    emitter = @particleGroup.triggerPoolEmitter(1, newPos)
    light = @lights[@lightIndex++]
    if @lightIndex is @lights.length
      @lightIndex = 0
    light.position.set(newPos.x, newPos.y, newPos.z)
    light.intensity = @startLightIntensity
    if count < FW.numExplosionsPerRocket-1
      setTimeout =>
        #set timeout for speed of sound delay!
        if soundOn
          setTimeout(()=>
            @explodeSound.load()
            @explodeSound.play()
            setTimeout(()=>
              @crackleSound.load()
              @crackleSound.play()
            100)
          50)
        count++
        newPos = new THREE.Vector3(rnd(origPos.x - @fwSpread, origPos.x+@fwSpread), rnd(origPos.y - @fwSpread, origPos.y+@fwSpread), rnd(origPos.z - @fwSpread, origPos.z+@fwSpread))
        @createExplosion(origPos, newPos, count++)
      ,rnd(10, 300)

    
  tick: ->
    @particleGroup.tick(FW.tickRate)
    for light in @lights
      if light.intensity > 0
        light.intensity -=@lightDimmingFactor


