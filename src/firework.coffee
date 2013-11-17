FW.Firework = class Firework
  constructor: ()->
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 4
    });
    @exploding = false


    @emitterSettings =
      type: 'sphere',
      radius: 10,
      size: 0.1,
      acceleration: new THREE.Vector3(1, 1, 1),
      colorStart: new THREE.Color('yellow'),
      colorEnd: new THREE.Color('purple'),
      particlesPerSecond: 1000,
      alive: 0,
      opacityEnd: 1,
      emitterDuration: 1.15


  init: ->
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('./assets/star.png'),
      })
    @particleGroup.addPool( 10, @emitterSettings, false );
    FW.myWorld.scene.add(@particleGroup.mesh)

  createExplosion: (pos)->
    @exploding = true
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)