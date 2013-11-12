(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.World = World = (function() {
    function World(parentElement) {
      var ASPECT, FAR, NEAR, Pi, SCREEN_HEIGHT, SCREEN_WIDTH, VIEW_ANGLE, face, geometry, i, l, material, mesh, vertex;
      this.parentElement = parentElement;
      this.animate = __bind(this.animate, this);
      this.isRendering = true;
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;
      VIEW_ANGLE = 45;
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
      NEAR = 0.1;
      FAR = 20000;
      this.entities = [];
      Pi = 3.141592653589793;
      this.time = Date.now();
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.y = 1;
      this.camera.position.z = 10;
      this.camera.lookAt(0);
      THREEx.FullScreen.bindKey({
        charCode: "f".charCodeAt(0)
      });
      THREEx.WindowResize(this.renderer, this.camera);
      this.scene = new THREE.Scene();
      this.controls = new THREE.FirstPersonControls(this.camera);
      this.controls.lookSpeed = 0.0001;
      this.controls.movementSpeed = 0.05;
      this.scene.add(this.controls);
      this.controls.enabled = true;
      geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      i = 0;
      l = geometry.vertices.length;
      while (i < l) {
        vertex = geometry.vertices[i];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;
        i++;
      }
      i = 0;
      l = geometry.faces.length;
      while (i < l) {
        face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        i++;
      }
      material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors
      });
      mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
    }

    World.prototype.addEntity = function(script) {
      var diff, start;
      this.isRendering = false;
      this.frameCount = 0;
      this.g = new grow3.System(this.scene, this.camera, script);
      start = (new Date).getTime();
      this.entities.push(this.g.build());
      diff = (new Date).getTime() - start;
      return console.debug("Building time: " + diff + "ms");
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.controls.update(Date.now() - this.time);
      this.renderer.render(this.scene, this.camera);
      return this.time = Date.now();
    };

    return World;

  })();

}).call(this);
