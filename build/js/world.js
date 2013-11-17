(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FW.World = World = (function() {
    var onWindowResize, time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      this.explode = __bind(this.explode, this);
      var geometry, light, material, mesh;
      this.clock = new THREE.Clock();
      this.projector = new THREE.Projector();
      this.targetVec = new THREE.Vector3();
      this.launchSpeed = 1.0;
      this.explosionDelay = 500;
      this.shootDirection = new THREE.Vector3();
      this.rockets = [];
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.z = 1;
      this.rocketMat = new THREE.ShaderMaterial({
        uniforms: uniforms1,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragment_shader1').textContent
      });
      this.rocketGeo = new THREE.CubeGeometry(1, 1, 1);
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
      geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      material = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -200;
      this.scene.add(mesh);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.scene.add(this.controls);
      window.addEventListener("resize", onWindowResize, false);
    }

    World.prototype.addEntity = function(position) {
      var rootNode;
      this.g = new grow3.System(this.scene, this.camera, RULES.bush);
      rootNode = this.g.build(void 0, position, false);
      debugger;
    };

    World.prototype.explode = function(rocket) {
      this.scene.remove(rocket);
      return this.firework.createExplosion(rocket.position);
    };

    World.prototype.launchRocket = function() {
      var ray, rocket, vector,
        _this = this;
      rocket = new THREE.Mesh(this.rocketGeo, this.rocketMat);
      rocket.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.rockets.push(rocket);
      vector = this.shootDirection;
      this.shootDirection.set(0, 0, 1);
      this.projector.unprojectVector(vector, this.camera);
      ray = new THREE.Ray(this.camera.position, vector.sub(this.camera.position).normalize());
      this.scene.add(rocket);
      this.target = vector.sub(this.camera.position).normalize();
      this.shootDirection.x = ray.direction.x;
      this.shootDirection.y = ray.direction.y;
      this.shootDirection.z = ray.direction.z;
      return setTimeout(function() {
        _this.explode(rocket);
        return _this.addEntity(rocket.position);
      }, FW.rnd(100, 1000));
    };

    onWindowResize = function() {
      FW.myWorld.camera.aspect = window.innerWidth / window.innerHeight;
      FW.myWorld.camera.updateProjectionMatrix();
      return FW.myWorld.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    World.prototype.animate = function() {
      var delta, rocket, _i, _len, _ref;
      requestAnimationFrame(this.animate);
      delta = this.clock.getDelta();
      _ref = this.rockets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rocket = _ref[_i];
        this.updateRocket(rocket);
      }
      if (this.firework.exploding) {
        this.firework.tick();
      }
      uniforms1.time.value += delta * 5;
      this.stats.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      return time = Date.now();
    };

    World.prototype.updateRocket = function(rocket) {
      rocket.translateX(this.launchSpeed * this.shootDirection.x);
      rocket.translateY(this.launchSpeed * this.shootDirection.y);
      return rocket.translateZ(this.launchSpeed * this.shootDirection.z);
    };

    return World;

  })();

}).call(this);
