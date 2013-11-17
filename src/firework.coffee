FW.Firework = class Firework
  constructor: ()->
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 100,
      blending: THREE.AdditiveBlending
    });
    @exploding = false


    @emitterSettings =
      type: 'sphere',
      positionSpread: new THREE.Vector3(10, 10, 10),
      radius: 1,
      speed: 100,
      size: 30,
      sizeSpread: 30,
      sizeEnd: 0,
      opacityStart: 1,
      opacityEnd: 0,
      colorStart: new THREE.Color('yellow'),
      colorSpread: new THREE.Vector3(0, 10, 0),
      colorEnd: new THREE.Color('red'),
      particlesPerSecond: 2000,
      alive: 0,
      emitterDuration: 0.05

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