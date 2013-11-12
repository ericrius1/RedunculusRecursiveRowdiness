window.World = class World
  constructor: (@parentElement)->
    @isRendering = true
    SCREEN_WIDTH = window.innerWidth
    SCREEN_HEIGHT = window.innerHeight
    VIEW_ANGLE = 45
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
    NEAR = 0.1
    FAR = 20000
    @entities = []
    Pi = 3.141592653589793
    @time = Date.now();


    # CAMERA
    @camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    @camera.position.y = 1
    @camera.position.z = 10
    @camera.lookAt(0)

    # EVENTS
    THREEx.FullScreen.bindKey charCode: "f".charCodeAt(0)
    THREEx.WindowResize @renderer, @camera


    # SCENE WITH CAM
    @scene = new THREE.Scene()

    # CONTROLS
    @controls = new THREE.FirstPersonControls( @camera );
    @controls.lookSpeed = 0.0001;
    @controls.movementSpeed = 0.05;
 
    @scene.add(@controls);
    @controls.enabled = true;

    #floor
    geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    i = 0
    l = geometry.vertices.length

    while i < l
      vertex = geometry.vertices[i]
      vertex.x += Math.random() * 20 - 10
      vertex.y += Math.random() * 2
      vertex.z += Math.random() * 20 - 10
      i++
    i = 0
    l = geometry.faces.length

    while i < l
      face = geometry.faces[i]
      face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      i++
    material = new THREE.MeshBasicMaterial(vertexColors: THREE.VertexColors)
    mesh = new THREE.Mesh(geometry, material)
    @scene.add mesh

    @renderer = new THREE.WebGLRenderer();
    @renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( @renderer.domElement );



  addEntity: (script)->
    @isRendering = false
    @frameCount = 0


    # GROW3
    @g = new grow3.System(@scene, @camera, script)
    start = (new Date).getTime()
    @entities.push @g.build()
    diff = (new Date).getTime() - start
    console.debug "Building time: " + diff + "ms"
    


  animate : =>
    requestAnimationFrame @animate
    @controls.update( Date.now() - @time );
    @renderer.render @scene, @camera
    @time = Date.now();
