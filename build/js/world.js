(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.World = World = (function() {
    var onWindowResize, setUpControls, time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      var geometry, light, material, mesh;
      this.blocker = document.getElementById("blocker");
      this.entities = [];
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.z = 100;
      this.scene = new THREE.Scene();
      light = new THREE.DirectionalLight(0xffffff, 1.5);
      light.position.set(1, 1, 1);
      this.scene.add(light);
      light = new THREE.DirectionalLight(0xffffff, 0.75);
      light.position.set(-1, -0.5, -1);
      this.scene.add(light);
      this.controls = new THREE.PointerLockControls(this.camera);
      this.scene.add(this.controls.getObject());
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      material = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      window.addEventListener("resize", onWindowResize, false);
      setUpControls();
    }

    World.prototype.addEntity = function(script) {
      var start;
      this.g = new grow3.System(this.scene, this.camera, script);
      start = (new Date).getTime();
      return this.entities.push(this.g.build());
    };

    onWindowResize = function() {
      myWorld.camera.aspect = window.innerWidth / window.innerHeight;
      myWorld.camera.updateProjectionMatrix();
      return myWorld.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.stats.update();
      this.controls.update(Date.now() - time);
      this.renderer.render(this.scene, this.camera);
      return time = Date.now();
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
            myWorld.addEntity(bush);
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
