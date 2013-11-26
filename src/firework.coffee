FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    @groups = []
    #create a few different emmitters and add to pool
    @colorStart = new THREE.Color()
    @colorEnd = new THREE.Color()
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 13
    });

    for i in [1..10]
      @particleGroup.addPool( 1, @generateEmitter(), true )     
    FW.scene.add(@particleGroup.mesh)

  generateEmitter : ->
    @colorStart.setRGB(rnd(255), rnd(255), rnd(255))
    # @colorEnd.setRGB(rnd(255), rnd(255), rnd(255))
    console.log('color start', @colorSTart)
    emitterSettings = 
      size: 0.2,
      acceleration: new THREE.Vector3(0, -0.01, 0),
      accelerationSpread: new THREE.Vector3(rnd(.01, 1), rnd(.01, 1), rnd(.01, 1)),
      colorStart: @colorStart,
      colorSpread: new THREE.Vector3(20, 20, 20)
      # colorEnd: @colorEnd,
      particlesPerSecond: 100,
      alive: 0,  
      emitterDuration: 2.0

  createExplosion: (pos)->
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)
