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
      maxAge: 13
    });
    @emitterSettings = 
      size: 0.2,
      acceleration: new THREE.Vector3(0, -0.01, 0),
      accelerationSpread: new THREE.Vector3(.2, .2, .02),
      colorStart: @color,
      particlesPerSecond: 100,
      alive: 0,  
      emitterDuration: 2.0
   
   #Might want to get rid of pools
    @particleGroup.addPool( 20, @emitterSettings, true );
    @color.setRGB(0, 0, 200)
    @emitterSettings.colorStart = @color
    @particleGroup.addPool( 1, @emitterSettings, true );
    FW.scene.add(@particleGroup.mesh)


  createExplosion: (pos)->
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)
