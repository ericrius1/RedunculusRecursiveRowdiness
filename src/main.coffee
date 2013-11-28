window.FW = {}
SC.initialize({
    client_id: "7da24ca214bf72b66ed2494117d05480",
});

#inspire rameses b
#Give user option between building a permanent structure or launching fire works
window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = FW.Main()


FW.Main = class Main
  constructor: ->
    #RECURSIVE STRUCTURES
    @g = new grow3.System(FW.scene, FW.camera, RULES.bush)
    thing = @g.build(undefined, new THREE.Vector3(-800,  820, 1065))
    FW.camera.lookAt thing.position
    
    @firework = new FW.Firework()
    @groundControl = new FW.Rockets()

    SC.stream "/tracks/rameses-b-inspire", (sound)->
      sound.play()



