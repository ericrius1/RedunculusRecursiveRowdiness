FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    @groups = []
    #create a few different emmitters and add to pool
    @colorStart = new THREE.Color()
    @colorEnd = new THREE.Color()
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 8
    });

    for i in [1..15]
      @particleGroup.addPool( 1, @generateEmitter(), true )     
    FW.scene.add(@particleGroup.mesh)

  generateEmitter : ->
    @colorStart.setRGB(Math.random(255), Math.random(255),Math.random(255))
    @colorEnd.setRGB(Math.random(255), Math.random(255),Math.random(255))
    emitterSettings = 
      size: 0.2,
      acceleration: new THREE.Vector3(0, -0.01, 0),
      accelerationSpread: new THREE.Vector3(rnd(.02, 1.5), rnd(.02, 1.5), rnd(.02, 1.5)),
      colorStart: @colorStart,
      colorEnd: @colorEnd,
      particlesPerSecond: 300,
      alive: 0,  
      emitterDuration: 3.0

  createExplosion: (pos, count=0)->
    console.log pos
    @particleGroup.triggerPoolEmitter(1, pos)
    if count < 3
      setTimeout =>
        count++
        pos.set(rnd(pos.x-10, pos.x+10), rnd(pos.y-10, pos.y+10), rnd(pos.z-10, pos.z+10))
        @createExplosion(pos, count++)
      ,rnd(100, 500)
    
  tick: ->
    @particleGroup.tick(0.16)
