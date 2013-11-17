FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 5
    });
    @exploding = false

    @emitterSettings =
      size: 0.1,
      accelerationSpread: new THREE.Vector3(.2, .2, .2),
      colorSpread: new THREE.Vector3(200, 0, 200),
      particlesPerSecond: 100,
      alive: 0,
      opacityEnd: .2
      emitterDuration: 2.0

    @particleGroup.addPool( 10, @emitterSettings, false );
    FW.myWorld.scene.add(@particleGroup.mesh)


  createExplosion: (pos)->
    @exploding = true
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)