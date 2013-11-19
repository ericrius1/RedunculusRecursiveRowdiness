(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FW.World = World = (function() {
    var onWindowResize, time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      var geometry, light, material, mesh, moonlight, rnd;
      this.clock = new THREE.Clock();
      this.projector = new THREE.Projector();
      this.targetVec = new THREE.Vector3();
      this.launchSpeed = 1;
      this.explosionDelay = 1000;
      this.shootDirection = new THREE.Vector3();
      this.rockets = [];
      rnd = FW.rnd;
      this.launchSound = new Audio('./assets/launch.mp3');
      this.explodeSound = new Audio('./assets/explosion.mp3');
      this.crackleSound = new Audio('./assets/crackle.mp3');
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.z = 1;
      this.rocketMat = new THREE.ShaderMaterial({
        uniforms: uniforms1,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragment_shader1').textContent
      });
      this.rocketGeo = new THREE.CylinderGeometry(.1, 1, 1);
      light = new THREE.DirectionalLight(0xff00ff);
      this.light = new THREE.PointLight(0xffeeee, 0.0, 500);
      this.light.position.set(1, 1, 1);
      this.scene.add(this.light);
      geometry = new THREE.SphereGeometry(0.5, 32, 32);
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      mesh = new THREE.Mesh(geometry, material);
      mesh.scale.multiplyScalar(17);
      mesh.position.set(-50, 20, -100);
      moonlight = new THREE.DirectionalLight(0xffeeee, 1.0);
      this.scene.add(mesh);
      mesh.add(moonlight);
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      material.needsUpdate = true;
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -200;
      this.scene.add(mesh);
      this.g = new grow3.System(this.scene, this.camera, RULES.bush);
      this.g.build(void 0, new THREE.Vector3(rnd(100, 300), 10, 10));
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

    World.prototype.explode = function(position) {
      var _this = this;
      this.light.intensity = 1.0;
      this.light.position.set(position.x, position.y, position.z);
      this.firework.createExplosion(position);
      return setTimeout(function() {
        _this.explodeSound.play();
        return setTimeout(function() {
          return _this.crackleSound.play();
        }, 400);
      }, 800);
    };

    World.prototype.launchRocket = function() {
      var ray, rocket, vector,
        _this = this;
      this.launchSound.load();
      this.explodeSound.load();
      this.crackleSound.load();
      rocket = new THREE.Mesh(this.rocketGeo, this.rocketMat);
      rocket.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.rockets.push(rocket);
      vector = new THREE.Vector3();
      vector.set(0, 0, 1);
      this.projector.unprojectVector(vector, this.camera);
      ray = new THREE.Ray(this.camera.position, vector.sub(this.camera.position).normalize());
      this.scene.add(rocket);
      this.target = vector.sub(this.camera.position).normalize();
      rocket.shootDirection = new THREE.Vector3();
      rocket.shootDirection.x = ray.direction.x;
      rocket.shootDirection.y = ray.direction.y;
      rocket.shootDirection.z = ray.direction.z;
      this.launchSound.play();
      return setTimeout(function() {
        _this.scene.remove(rocket);
        return _this.explode(rocket.position);
      }, this.explosionDelay);
    };

    onWindowResize = function() {
      FW.myWorld.camera.aspect = window.innerWidth / window.innerHeight;
      FW.myWorld.camera.updateProjectionMatrix();
      return FW.myWorld.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    World.prototype.animate = function() {
      var delta, rocket, _i, _len, _ref;
      if (this.light.intensity > 0) {
        this.light.intensity -= 0.01;
      }
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
      rocket.translateX(this.launchSpeed * rocket.shootDirection.x);
      rocket.translateY(this.launchSpeed * rocket.shootDirection.y);
      return rocket.translateZ(this.launchSpeed * rocket.shootDirection.z);
    };

    return World;

  })();

}).call(this);
