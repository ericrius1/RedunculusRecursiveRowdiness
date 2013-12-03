FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->
    @speed = .1
    @dir = rnd(-1, 1)
    #create a few different emmitters and add to pool

    
    @meteorTail = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    });

    sphereGeo = new THREE.SphereGeometry(5, 5, 5 )
    @meteorHead = new THREE.Mesh(sphereGeo, FW.rocketMat)
    @meteorHead.position.set -992, 820, 1165
    # FW.scene.add(@meteorHead)

    @emitter = new ShaderParticleEmitter
      position: new THREE.Vector3(-992, 820, 1165)
      size: rnd(0.01, 1.3),
      sizeSpread: rnd(0.1, 1.0),
      acceleration: new THREE.Vector3(1, 0, 0),
      accelerationSpread: new THREE.Vector3(.1, .1, .1),
      particlesPerSecond: rnd(100, 500),
      opacityEnd: 0.5
    @meteorTail.addEmitter @emitter
    FW.scene.add(@meteorTail.mesh)
    
  startShower: ->
    setTimeout(()=>
    500)

    
  tick: ->
    @meteorHead.translateX(@speed * @dir)
    @meteorHead.translateY(@speed * @dir)
    @emitter.position.x = @meteorHead.position.x
    @meteorTail.tick(0.16)
    


