FW.Terrain= class Terrain
	constructor: ->
		geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256)
		material = new THREE.MeshPhongMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
		material.opacity = 0.6
		material.needsUpdate = true
		sceneRenderTarget = new THREE.Scene();

		cameraOrtho = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, -10000, 10000 );
		cameraOrtho.position.z = 100;
		sceneRenderTarget.add( cameraOrtho );

		@ground = new THREE.Mesh(geometryTerrain, material)
		@ground.rotation.x = -Math.PI / 2;
		@ground.position.set 0, -125, 0
		FW.myWorld.scene.add @groun