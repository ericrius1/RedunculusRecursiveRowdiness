FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    @groups = []
    #create a few different emmitters and add to pool
    @colorStart = new THREE.Color()
    @colorEnd = new THREE.Color()
    @numFireworksPerExplosion = 3

    @explodeSound = new Audio('./assets/explosion.mp3');
    @crackleSound = new Audio('./assets/crackle.mp3');
    


    
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 8
    });

    for i in [1..25]
      @particleGroup.addPool( 1, @generateEmitter(), true )     
    FW.scene.add(@particleGroup.mesh)

  generateEmitter : ->
    @colorStart.setRGB(Math.random(), Math.random(),Math.random())
    @colorEnd.setRGB(Math.random(), Math.random(),Math.random())
    emitterSettings = 
      size: rnd(0.01, 0.3),
      velocity: new THREE.Vector3(0, rnd(-2, 2), 0)
      acceleration: new THREE.Vector3(0, -0.01, 0),
      accelerationSpread: new THREE.Vector3(rnd(0, 5), rnd(0, 5), rnd(0, 5)),
      colorStart: @colorStart,
      colorSpread: new THREE.Vector3(.3, .3, .3),
      colorEnd: @colorEnd,
      particlesPerSecond: rnd(100, 500),
      alive: 0,  
      emitterDuration: 3.0

  createExplosion: (origPos, newPos = origPos, count=0)->
    @particleGroup.triggerPoolEmitter(2, newPos)
    if count < @numFireworksPerExplosion
      setTimeout =>
        @explodeSound.load()
            #set timeout for speed of sound delay!

        setTimeout(()=>
          @explodeSound.play()
          setTimeout(()=>
            @crackleSound.play()
          100)
        100)
        count++
        newPos = new THREE.Vector3(rnd(origPos.x - 20, origPos.x+20), rnd(origPos.y - 20, origPos.y+20), rnd(origPos.z - 20, origPos.z+20))
        @createExplosion(origPos, newPos, count++)
      ,rnd(100, 500)
    
  tick: ->
    @particleGroup.tick(0.16)
