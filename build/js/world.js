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
      var directionalLight;
      this.scene = new THREE.Scene();
      this.firework = new FW.Firework();
      this.groundControl = new FW.Rockets();
      this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2, 4000);
      this.camera.position.set(-1200, 800, 1200);
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
      directionalLight.position.set(500, 2000, 0);
      this.scene.add(directionalLight);
      this.g = new grow3.System(this.scene, this.camera, RULES.bush);
      this.g.build(void 0, new THREE.Vector3(100, 10, 10));
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
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
