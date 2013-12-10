FW.Stars = class Stars
  rnd = FW.rnd
  constructor: ()->

    @colorStart = new THREE.Color()
    @colorStart.setRGB(Math.random(),Math.random(),Math.random() )

    @starGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 100
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    @createStars()
    FW.scene.add(@starGroup.mesh)

  createStars: ->
    @starEmitter = new ShaderParticleEmitter
      type: 'sphere'
      radius: 4000
      position: FW.camera.position
      positionSpread: new THREE.Vector3(1000, 10000, 10000)
      size: 400
      colorSpread: new THREE.Vector3(.3, .3, .3)
      opacityStart: 0
      opacityMiddle: 1
      opacityEnd: 0.0
      colorStart: @colorStart
      colorEnd: @colorEnd
    
    @starGroup.addEmitter @starEmitter
 
    
  tick: ->
    @starGroup.tick(0.16)
    


