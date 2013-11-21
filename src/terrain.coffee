FW.Terrain= class Terrain
	constructor: ->
	    geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256)
	    material = new THREE.MeshPhongMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
	    material.opacity = 0.6
	    material.needsUpdate = true

	    @terrain = new THREE.Mesh(geometryTerrain, material)
	    @terrain.rotation.x = -Math.PI / 2;
	    @terrain.position.y = -200
	    FW.myWorld.scene.add @terrain