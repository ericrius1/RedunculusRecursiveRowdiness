FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    });
    @exploding = false

    @emitterSettings =
      size: 0.1,
      sizeEnd: 0.09, 
      acceleration: new THREE.Vector3(0, -0.1, 0),
      accelerationSpread: new THREE.Vector3(.2, .2, .2),
      color: new THREE.Vector3(rnd(255), rnd(255), rnd(255))
      colorSpread: new THREE.Vector3(rnd(20), rnd(20), rnd(10))
      particlesPerSecond: 200,
      alive: 0,  
      emitterDuration: 1.0
      opacityEnd: 0.1

    @particleGroup.addPool( 100, @emitterSettings, false );
    FW.myWorld.scene.add(@particleGroup.mesh)


  createExplosion: (pos)->
    @exploding = true
    @particleGroup.triggerPoolEmitter(1, pos)
    
  tick: ->
    @particleGroup.tick(0.16)