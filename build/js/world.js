(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.SCREEN_WIDTH = window.innerWidth;

  window.SCREEN_HEIGHT = window.innerHeight;

  FW.World = World = (function() {
    var time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.clock = new THREE.Clock();
      this.rnd = FW.rnd;
    }

    World.prototype.init = function() {
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
      this.g = new grow3.System(this.scene, this.camera, RULES.bush);
      this.g.build(void 0, new THREE.Vector3(100, 10, 10));
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(this.scene.fog.color, 1);
      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      document.body.appendChild(this.renderer.domElement);
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      this.scene.add(new THREE.AmbientLight(0x111111));
      this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
      this.directionalLight.position.set(500, 2000, 0);
      this.scene.add(this.directionalLight);
      this.pointLight = new THREE.PointLight(0xff4400, 1.5);
      this.pointLight.position.set(0, 0, 0);
      this.scene.add(this.pointLight);
      this.terrain = new FW.Terrain();
      this.terrain.init();
      this.controls = new THREE.OrbitControls(this.camera);
      return window.addEventListener("resize", this.onWindowResize, false);
    };

    World.prototype.onWindowResize = function() {
      var SCREEN_HEIGHT, SCREEN_WIDTH;
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;
      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
      this.camera.updateProjectionMatrix();
      return this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.groundControl.update();
      this.delta = this.clock.getDelta();
      if (this.terrainVisible) {
        this.terrain.update();
      }
      uniforms1.time.value += this.delta * 5;
      this.stats.update();
      this.controls.update();
      return time = Date.now();
    };

    return World;

  })();

}).call(this);
