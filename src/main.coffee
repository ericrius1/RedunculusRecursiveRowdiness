window.FW = {}


#Give user option between building a permanent structure or launching fire works
window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.animate()
  FW.main = FW.Main()


FW.Main = class Main
  constructor: ->
    #RECURSIVE STRUCTURES
    @g = new grow3.System(FW.scene, FW.camera, RULES.bush)
    thing = @g.build(undefined, new THREE.Vector3(-1137,  800, 1591))
    FW.camera.lookAt thing.position
    
    @firework = new FW.Firework()
    @groundControl = new FW.Rockets()


