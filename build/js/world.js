(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.World = World = (function() {
    var onWindowResize, setUpControls;

    function World() {
      this.animate = __bind(this.animate, this);
      var face, i, l, light, vertex;
      this.time = Date.now();
      this.objects = [];
      this.blocker = document.getElementById("blocker");
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xffffff, 0, 750);
      light = new THREE.DirectionalLight(0xffffff, 1.5);
      light.position.set(1, 1, 1);
      this.scene.add(light);
      light = new THREE.DirectionalLight(0xffffff, 0.75);
      light.position.set(-1, -0.5, -1);
      this.scene.add(light);
      this.controls = new THREE.PointerLockControls(this.camera);
      this.scene.add(this.controls.getObject());
      this.ray = new THREE.Raycaster();
      this.ray.ray.direction.set(0, -1, 0);
      console.log('wahh');
      this.geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
      this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      i = 0;
      l = this.geometry.vertices.length;
      while (i < l) {
        vertex = this.geometry.vertices[i];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;
        i++;
      }
      i = 0;
      l = this.geometry.faces.length;
      while (i < l) {
        face = this.geometry.faces[i];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        i++;
      }
      this.material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors
      });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.mesh);
      this.geometry = new THREE.CubeGeometry(20, 20, 20);
      i = 0;
      l = this.geometry.faces.length;
      while (i < l) {
        face = this.geometry.faces[i];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        i++;
      }
      i = 0;
      while (i < 500) {
        this.material = new THREE.MeshPhongMaterial({
          specular: 0xffffff,
          shading: THREE.FlatShading,
          vertexColors: THREE.VertexColors
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        this.mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10;
        this.mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        this.scene.add(this.mesh);
        this.material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        this.objects.push(this.mesh);
        i++;
      }
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      window.addEventListener("resize", onWindowResize, false);
      setUpControls();
      this.animate();
    }

    onWindowResize = function() {
      myWorldcamera.aspect = window.innerWidth / window.innerHeight;
      myWorld.camera.updateProjectionMatrix();
      return myWorldrenderer.setSize(window.innerWidth, window.innerHeight);
    };

    World.prototype.animate = function() {
      var distance, intersections;
      requestAnimationFrame(this.animate);
      this.controls.isOnObject(false);
      this.ray.ray.origin.copy(this.controls.getObject().position);
      this.ray.ray.origin.y -= 10;
      intersections = this.ray.intersectObjects(this.objects);
      if (intersections.length > 0) {
        distance = intersections[0].distance;
        if (distance > 0 && distance < 10) {
          this.controls.isOnObject(true);
        }
      }
      this.controls.update(Date.now() - this.time);
      this.renderer.render(this.scene, this.camera);
      return this.time = Date.now();
    };

    setUpControls = function() {
      var element, havePointerLock, instructions, pointerlockchange, pointerlockerror;
      instructions = document.getElementById("instructions");
      havePointerLock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
      if (havePointerLock) {
        element = document.body;
        pointerlockchange = function(event) {
          if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            myWorld.controls.enabled = true;
            return myWorld.blocker.style.display = "none";
          } else {
            myWorld.controls.enabled = false;
            myWorld.blocker.style.display = "-webkit-box";
            myWorld.blocker.style.display = "-moz-box";
            myWorld.blocker.style.display = "box";
            return instructions.style.display = "";
          }
        };
        pointerlockerror = function(event) {
          return instructions.style.display = "";
        };
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
        document.addEventListener("pointerlockerror", pointerlockerror, false);
        document.addEventListener("mozpointerlockerror", pointerlockerror, false);
        document.addEventListener("webkitpointerlockerror", pointerlockerror, false);
        return instructions.addEventListener("click", (function(event) {
          var fullscreenchange;
          instructions.style.display = "none";
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
          if (/Firefox/i.test(navigator.userAgent)) {
            fullscreenchange = function(event) {
              if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                document.removeEventListener("fullscreenchange", fullscreenchange);
                document.removeEventListener("mozfullscreenchange", fullscreenchange);
                return element.requestPointerLock();
              }
            };
            document.addEventListener("fullscreenchange", fullscreenchange, false);
            document.addEventListener("mozfullscreenchange", fullscreenchange, false);
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            return element.requestFullscreen();
          } else {
            return element.requestPointerLock();
          }
        }), false);
      } else {
        return instructions.innerHTML = "Your browser doesn't seem to support Pointer Lock API";
      }
    };

    return World;

  })();

}).call(this);
