FW.Stars = class Stars
  rnd = FW.rnd
  constructor: ()->

    @colorStart = new THREE.Color()
    @colorStart.setRGB(Math.random(),Math.random(),Math.random() )

    @starGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    @createStars()
    FW.scene.add(@starGroup.mesh)

  createStars: ->
    @starEmitter = new ShaderParticleEmitter
      position: FW.startingPos
      positionSpread: new THREE.Vector3(10, 1000, 1000)
      size: 100
      particlesPerSecond: 1000
      opacityEnd: 0.5
      colorStart: @colorStart
      colorEnd: @colorEnd
    
    @starGroup.addEmitter @starEmitter
 
    
  tick: ->
    @starGroup.tick(0.16)
    


