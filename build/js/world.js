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
      var thing;
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
      thing = this.g.build(void 0, new THREE.Vector3(-1300, 900, 1300));
      this.camera.lookAt(new THREE.Vector3(thing.position));
      this.scene.add(new THREE.AmbientLight(0x111111));
      this.directionalLight = new THREE.DirectionalLight(0xffffff, 10.15);
      this.directionalLight.position.set(500, 2000, 0);
      this.scene.add(this.directionalLight);
      this.pointLight = new THREE.PointLight(0xff4400, 1.5);
      this.pointLight.position.set(0, 0, 0);
      this.scene.add(this.pointLight);
      this.terrain = new FW.Terrain();
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      this.renderer.setClearColor(FW.myWorld.scene.fog.color, 1);
      document.body.appendChild(this.renderer.domElement);
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      this.terrain.init();
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.target.set(0, 0, 0);
      return window.addEventListener("resize", this.onWindowResize, false);
    };

    World.prototype.onWindowResize = function() {
      var SCREEN_HEIGHT, SCREEN_WIDTH;
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;
      this.terrain.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
      this.camera.updateProjectionMatrix();
      return this.terrain.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    };

    World.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.groundControl.update();
      this.delta = this.clock.getDelta();
      if (this.terrainVisible) {
        this.terrain.update();
      }
      this.stats.update();
      return this.controls.update();
    };

    return World;

  })();

}).call(this);
