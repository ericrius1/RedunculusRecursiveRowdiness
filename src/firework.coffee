FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    @groups = []
    #create a few different emmitters and add to pool
    @color = new THREE.Color()
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 13
    });

    @particleGroup.addPool( 1, @generateEmitter(), true )
    @particleGroup.addPool( 1, @generateEmitter(), true) 
    @particleGroup.addPool( 1, @generateEmitter(), true )
    @particleGroup.addPool( 1, @generateEmitter(), true ) 
    @particleGroup.addPool( 1, @generateEmitter(), true )
    @particleGroup.addPool( 1, @generateEmitter(), true) 
    @particleGroup.addPool( 1, @generateEmitter(), true )
    @particleGroup.addPool( 1, @generateEmitter(), true )      
    FW.scene.add(@particleGroup.mesh)

  generateEmitter : ->
    @color.setRGB(rnd(255), rnd(255), rnd(255))
    emitterSettings = 
      size: 0.2,
      acceleration: new THREE.Vector3(0, -0.01, 0),
      accelerationSpread: new THREE.Vector3(.2, .2, .02),
      colorStart: @color,
      particlesPerSecond: 100,
      alive: 0,  
      emitterDuration: 2.0

  createExplosion: (pos)->
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)
