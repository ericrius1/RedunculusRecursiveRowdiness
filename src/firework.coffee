FW.Firework = class Firework
  constructor: ()->
    @fireworkGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 100,
      blending: THREE.AdditiveBlending
    });
    @fireworkEmitter = new ShaderParticleEmitter({
      type: 'sphere',

      radius: 0.3,
      speed: 2,

      colorStart: new THREE.Color('red'),
      colorSpread: new THREE.Vector3(0, 0.5, 0),
      colorEnd: new THREE.Color('red'),
      size: 1,
      sizeEnd: 0,

      particlesPerSecond: 1000
    });
    @fireworkGroup.addEmitter(@fireworkEmitter)

  explode: (pos)->
    FW.myWorld.scene.add(@fireworkGroup.mesh)
    @fireworkEmitter.position.set(pos.x, pos.y, pos.z)
    @exploding = true
    
  tick: ->
    @fireworkGroup.tick(0.16)