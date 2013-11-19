window.FW = {}


#Give user option between building a permannt structure or launching fire works
window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.firework = new FW.Firework()
  FW.myWorld.groundControl = new FW.Rockets()
  FW.myWorld.animate()


