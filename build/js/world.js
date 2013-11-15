(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.World = World = (function() {
    var onWindowResize, time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      var light;
      this.entities = [];
      this.clock = new THREE.Clock();
      this.projector = new THREE.Projector();
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      this.scene = new THREE.Scene();
      light = new THREE.DirectionalLight(0xffeeee, 1.0);
      light.position.set(1, 1, 1);
      this.scene.add(light);
      light = new THREE.DirectionalLight(0xffffff, 0.75);
      light.position.set(-1, -0.5, -1);
      this.scene.add(light);
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
      this.controls.movementSpeed = .03;
      this.controls.lookSpeed = .0002;
      this.scene.add(this.controls);
      window.addEventListener("resize", onWindowResize, false);
    }

    World.prototype.addEntity = function(script) {
      this.g = new grow3.System(this.scene, this.camera, script);
      return this.entities.push(this.g.build());
    };

    World.prototype.castSpell = function(x, y) {
      var vector;
      vector = new THREE.Vector3(x, y, 1);
      this.projector.unprojectVector(vector, this.camera);
      return this.addEntity(RULES.bush);
    };

    onWindowResize = function() {
      myWorld.camera.aspect = window.innerWidth / window.innerHeight;
      myWorld.camera.updateProjectionMatrix();
      return myWorld.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    World.prototype.animate = function() {
      var delta;
      requestAnimationFrame(this.animate);
      delta = this.clock.getDelta();
      uniforms1.time.value += delta * 5;
      this.stats.update();
      this.controls.update(Date.now() - time);
      this.renderer.render(this.scene, this.camera);
      time = Date.now();
      return uniforms1.time.value += delta * 5;
    };

    return World;

  })();

}).call(this);
