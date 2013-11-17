window.FW = {}

window.onload = ->
  FW.myWorld = new FW.World()
  FW.myWorld.firework = new FW.Firework()
  FW.myWorld.firework.init()
  FW.myWorld.animate()


