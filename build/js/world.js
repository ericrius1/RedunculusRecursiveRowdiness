(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.SCREEN_WIDTH = window.innerWidth;

  window.SCREEN_HEIGHT = window.innerHeight;

  FW.World = World = (function() {
    var onWindowResize, time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      this.clock = new THREE.Clock();
      this.rnd = FW.rnd;
    }

    World.prototype.init = function() {
      var directionalLight, pointLight;
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0x050505, 2000, 4000);
      this.firework = new FW.Firework();
      this.groundControl = new FW.Rockets();
      this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2, 4000);
      this.camera.position.set(-1200, 800, 1200);
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      this.scene.add(new THREE.AmbientLight(0x111111));
      directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
      directionalLight.position.set(500, 2000, 0);
      this.scene.add(directionalLight);
      pointLight = new THREE.PointLight(0xff4400, 1.5);
      pointLight.position.set(0, 0, 0);
      this.scene.add(pointLight);
      this.g = new grow3.System(this.scene, this.camera, RULES.bush);
      this.g.build(void 0, new THREE.Vector3(100, 10, 10));
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(this.scene.fog.color, 1);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      document.body.appendChild(this.renderer.domElement);
      this.terrain = new FW.Terrain();
      this.controls = new THREE.OrbitControls(this.camera);
      return window.addEventListener("resize", onWindowResize, false);
    };

    onWindowResize = function() {
      FW.myWorld.camera.aspect = window.innerWidth / window.innerHeight;
      FW.myWorld.camera.updateProjectionMatrix();
      return FW.myWorld.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    World.prototype.animate = function() {
      var delta;
      requestAnimationFrame(this.animate);
      this.groundControl.update();
      delta = this.clock.getDelta();
      if (this.terrain.visible) {
        this.terrain.update();
      }
      uniforms1.time.value += delta * 5;
      this.stats.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      return time = Date.now();
    };

    return World;

  })();

}).call(this);
