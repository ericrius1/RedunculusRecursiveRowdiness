window.uniforms1 = {
  time: {
    type: "f",
    value: 1.0
  },
  resolution: {
    type: "v2",
    value: new THREE.Vector2()
  }
};
window.FW = {}
SC?.initialize({
    client_id: "7da24ca214bf72b66ed2494117d05480",
});
window.soundOn = true
FW.sfxVolume = 0.4

#inspire rameses b
#Give user option between building a permanent structure or laun@stars fire works
window.onload = ->
  FW.startingPos = new THREE.Vector3(3537, 500, -324)
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = new FW.Main()
  FW.camera.lookAt FW.startingPos 


FW.Main = class Main
  constructor: ->
    if soundOn
      SC.stream "/tracks/rameses-b-inspire", (sound)->
         # sound.play()





FW.rocketMat= new THREE.ShaderMaterial({
  uniforms: uniforms1,
  vertexShader: document.getElementById('rocketVertexShader').textContent,
  fragmentShader: document.getElementById('fragment_shader1').textContent
})

