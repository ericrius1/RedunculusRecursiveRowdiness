FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    @groups = []
    #create a few different emmitters and add to pool
    @color = new THREE.Color()
    @color.setRGB(200, 0, 0)
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 7
    });
    @emitterSettings = 
      size: 0.2,
      acceleration: new THREE.Vector3(0, -0.1, 0),
      accelerationSpread: new THREE.Vector3(.2, .2, .2),
      colorStart: @color,
      particlesPerSecond: 500,
      alive: 0,  
      emitterDuration: 1.0
   
    @particleGroup.addPool( 5, @emitterSettings, false );
    @color.setRGB(0, 0, 200)
    @emitterSettings.colorStart = @color
    @particleGroup.addPool( 5, @emitterSettings, false );
    FW.myWorld.scene.add(@particleGroup.mesh)


  createExplosion: (pos)->
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)
