window.FW = {}


#Give user option between building a permannt structure or launching fire works
window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.init()

  FW.myWorld.animate()



