window.FW = {}
SC?.initialize({
    client_id: "7da24ca214bf72b66ed2494117d05480",
});
window.soundOn = true

#inspire rameses b
#Give user option between building a permanent structure or laun@stars fire works
window.onload = ->
  FW.startingPos = new THREE.Vector3(-580, 913, 1009)
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = new FW.Main()
  FW.main.makeStars()
  FW.camera.lookAt FW.main.stars.position  


FW.Main = class Main
  constructor: ->
    if soundOn
      SC.stream "/tracks/rameses-b-inspire", (sound)->
         sound.play()

  makeStars: ->
    @grow = new grow3.System(FW.scene, FW.camera, RULES.bush)
    @stars = @grow.build(undefined, new THREE.Vector3().copy(FW.startingPos))
    setTimeout(()=>
      FW.scene.remove(@stars)
      @makeStars()
    40000)


    



FW.rocketMat= new THREE.ShaderMaterial({
  uniforms: uniforms1,
  vertexShader: document.getElementById('rocketVertexShader').textContent,
  fragmentShader: document.getElementById('fragment_shader1').textContent
})