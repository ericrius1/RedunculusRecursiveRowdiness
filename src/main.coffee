window.FW = {}
SC?.initialize({
    client_id: "7da24ca214bf72b66ed2494117d05480",
});
window.soundOn = true

#inspire rameses b
#Give user option between building a permanent structure or laun@stars fire works
window.onload = ->
  FW.startingPos = new THREE.Vector3(3537, 1000, -324)
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = new FW.Main()
  FW.camera.lookAt FW.startingPos 


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
      console.log ("NEW STARS")
      @makeStars()
    10000)


    



FW.rocketMat= new THREE.ShaderMaterial({
  uniforms: uniforms1,
  vertexShader: document.getElementById('rocketVertexShader').textContent,
  fragmentShader: document.getElementById('fragment_shader1').textContent
})