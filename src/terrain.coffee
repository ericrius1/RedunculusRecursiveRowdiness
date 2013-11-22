FW.Terrain= class Terrain
	constructor: ->
		geometryTerrain = new THREE.PlaneGeometry(6000, 6000, 256, 256)
		material = new THREE.MeshPhongMaterial( { color: 0xff00ff, transparent: true, blending: THREE.AdditiveBlending } ) 
		material.opacity = 0.6
		material.needsUpdate = true
		sceneRenderTarget = new THREE.Scene();
		textureCounter = 0

		cameraOrtho = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, -10000, 10000 );
		cameraOrtho.position.z = 100;
		sceneRenderTarget.add( cameraOrtho );

		@ground = new THREE.Mesh(geometryTerrain, material)
		@ground.rotation.x = -Math.PI / 2;
		@ground.position.set 0, -125, 0
		FW.myWorld.scene.add @ground


		normalShader = THREE.NormalMapShader
		rx = 256
		ry = 256
		pars =
		  minFilter: THREE.LinearMipmapLinearFilter
		  magFilter: THREE.LinearFilter
		  format: THREE.RGBFormat

		heightMap = new THREE.WebGLRenderTarget(rx, ry, pars)
		normalMap = new THREE.WebGLRenderTarget(rx, ry, pars)
		uniformsNoise =
		  time:
		    type: "f"
		    value: 1.0

		  scale:
		    type: "v2"
		    value: new THREE.Vector2(1.5, 1.5)

		  offset:
		    type: "v2"
		    value: new THREE.Vector2(0, 0)

		uniformsNormal = THREE.UniformsUtils.clone(normalShader.uniforms)
		uniformsNormal.height.value = 0.05
		uniformsNormal.resolution.value.set rx, ry
		uniformsNormal.heightMap.value = heightMap
		vertexShader = document.getElementById("terrainVertexShader").textContent

		#TEXTURES
		specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars)
		diffuseTexture1 = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big.jpg", null, ->
		  loadTextures()
		  applyShader THREE.LuminosityShader, diffuseTexture1, specularMap
		)
		diffuseTexture2 = THREE.ImageUtils.loadTexture("lib/textures/backgrounddetailed6.jpg", null, loadTextures)
		detailTexture = THREE.ImageUtils.loadTexture("lib/textures/grasslight-big-nm.jpg", null, loadTextures)
		diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping
		diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping
		detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping
		specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping

		applyShader = (shader, texture, target) ->
			shaderMaterial = new THREE.ShaderMaterial(
				fragmentShader: shader.fragmentShader
				vertexShader: shader.vertexShader
				uniforms: THREE.UniformsUtils.clone(shader.uniforms)
			)
			shaderMaterial.uniforms["tDiffuse"].value = texture
			sceneTmp = new THREE.Scene()
			meshTmp = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT), shaderMaterial)
			meshTmp.position.z = -500
			sceneTmp.add meshTmp
			FW.myWorld.renderer.render sceneTmp, cameraOrtho, target, true

		loadTextures = ->
		  textureCounter += 1
		  if textureCounter is 3
		    @visible = true

	update: ->
		console.log('shnur')
