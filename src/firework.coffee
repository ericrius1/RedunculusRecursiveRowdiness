FW.Firework = class Firework
  rnd = FW.rnd
  constructor: (color)->

    @color = color
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 7
    });
    console.log color, @color
    @emitterSettings = 
      size: 0.2,
      acceleration: new THREE.Vector3(0, -0.1, 0),
      accelerationSpread: new THREE.Vector3(.2, .2, .2),
      colorStart: @color,
      particlesPerSecond: 500,
      alive: 0,  
      emitterDuration: 1.0
   
    @particleGroup.addPool( 10, @emitterSettings, false );
    FW.myWorld.scene.add(@particleGroup.mesh)


  createExplosion: (pos)->
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)
