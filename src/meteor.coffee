FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->
    #create a few different emmitters and add to pool

    
    @meteorTail = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    });

    sphereGeo = new THREE.SphereGeometry(5, 5, 5 )
    @meteorHead = new THREE.Mesh(sphereGeo, FW.rocketMat)
    @meteorHead.position.set -992, 820, 1165
    FW.scene.add(@meteorHead)

    @emitterSettings = 
      size: rnd(0.01, 1.3),
      sizeSpread: rnd(0.1, 1.0),
      velocity: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1))
      acceleration: new THREE.Vector3(0, -0.01, 0),
      accelerationSpread: new THREE.Vector3(rnd(-2, 0), rnd(-2, 0), rnd(-2, 0)),
      particlesPerSecond: rnd(100, 500),
      alive: 0,  
      emitterDuration: rnd(1.0, 5.0)
      opacityEnd: 0.5
    @meteorTail.addPool(5, @emitterSettings, true)
    FW.scene.add(@meteorTail.mesh)
    
  startShower: ->
    setInterval(()=>
      console.log "Spakrle!!!!"
      @meteorTail.triggerPoolEmitter(1, @meteorHead.position)
    5000) 

    
  tick: ->
    @meteorTail.tick(0.16)
    


