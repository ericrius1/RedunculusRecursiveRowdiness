(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.World = World = (function() {
    function World(parentElement) {
      var ASPECT, FAR, NEAR, Pi, SCREEN_HEIGHT, SCREEN_WIDTH, VIEW_ANGLE, geometry, material, plane;
      this.parentElement = parentElement;
      this.animate = __bind(this.animate, this);
      this.isRendering = false;
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;
      VIEW_ANGLE = 45;
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
      NEAR = 0.1;
      FAR = 20000;
      this.noLighting = true;
      this.entities = [];
      Pi = 3.141592653589793;
      if (Detector.webgl) {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          preserveDrawingBuffer: true
        });
      } else {
        this.parentElement.appendChild(Detector.getWebGLErrorMessage());
        this.renderer = new THREE.CanvasRenderer();
      }
      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      this.container = document.createElement("div");
      this.parentElement.appendChild(this.container);
      this.container.appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      THREEx.FullScreen.bindKey({
        charCode: "f".charCodeAt(0)
      });
      THREEx.WindowResize(this.renderer, this.camera);
      this.controls = new THREE.OrbitControls(this.camera, this.container);
      this.controls.minPolarAngle = 0.1;
      this.controls.maxPolarAngle = Pi - 1;
      this.animate();
      this.scene = new THREE.Scene();
      this.scene.add(this.camera);
      this.camera.position.set(-25, 50, 10);
      this.camera.up = new THREE.Vector3(0, 0, 1);
      this.camera.lookAt(0);
      geometry = new THREE.PlaneGeometry(300, 300);
      material = new THREE.MeshPhongMaterial({
        ambient: 0x030303,
        color: 0xdddddd,
        specular: 0x009900,
        shininess: 30,
        shading: THREE.FlatShading
      });
      plane = new THREE.Mesh(geometry, material);
      plane.receiveShadow = false;
      this.scene.add(plane);
    }

    World.prototype.addEntity = function(script) {
      var diff, light, light2, start;
      this.isRendering = false;
      this.frameCount = 0;
      this.g = new grow3.System(this.scene, this.camera, script);
      start = (new Date).getTime();
      this.entities.push(this.g.build());
      diff = (new Date).getTime() - start;
      console.debug("Building time: " + diff + "ms");
      if (this.noLighting) {
        light = new THREE.PointLight(0xffeeee, 1.3);
        light.position.set(10, 10, 10);
        this.scene.add(light);
        light2 = new THREE.PointLight(0xeeeeff, 1.0);
        light2.position.set(-10, -10, -10);
        this.scene.add(light2);
        this.noLighting = false;
      }
      return this.isRendering = true;
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      if (this.isRendering) {
        this.render();
        return this.update();
      } else {

      }
    };

    World.prototype.render = function() {
      this.renderer.setClearColor(this.g.backgroundColor);
      return this.renderer.render(this.scene, this.camera);
    };

    World.prototype.update = function() {
      return this.controls.update();
    };

    return World;

  })();

}).call(this);
