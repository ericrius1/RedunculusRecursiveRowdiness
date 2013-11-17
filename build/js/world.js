(function() {
  var World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.World = World = (function() {
    var onWindowResize, time;

    time = Date.now();

    function World() {
      this.animate = __bind(this.animate, this);
      var geometry, light, material, mesh;
      this.entities = [];
      this.clock = new THREE.Clock();
      this.projector = new THREE.Projector();
      this.targetVec = new THREE.Vector3();
      this.bulletVel = 15;
      this.shootDirection = new THREE.Vector3();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.z = 100;
      this.bulletMat = new THREE.ShaderMaterial({
        uniforms: uniforms1,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragment_shader1').textContent
      });
      this.bulletGeo = new THREE.CubeGeometry(1, 1, 1);
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
      geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      material = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      material.opacity = 0.6;
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -20;
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

    World.prototype.addEntity = function(script) {
      this.g = new grow3.System(this.scene, this.camera, script);
      return this.entities.push(this.g.build());
    };

    World.prototype.castSpell = function() {
      var ray, vector;
      this.bullet = new THREE.Mesh(this.bulletGeo, this.bulletMat);
      this.bullet.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      vector = this.shootDirection;
      this.shootDirection.set(0, 0, 1);
      this.projector.unprojectVector(vector, this.camera);
      ray = new THREE.Ray(this.camera.position, vector.sub(this.camera.position).normalize());
      this.scene.add(this.bullet);
      this.target = vector.sub(this.camera.position).normalize();
      this.shootDirection.x = ray.direction.x;
      this.shootDirection.y = ray.direction.y;
      return this.shootDirection.z = ray.direction.z;
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
      if (this.bullet != null) {
        this.bullet.translateX(.1 * this.shootDirection.x);
        this.bullet.translateY(.1 * this.shootDirection.y);
        this.bullet.translateZ(.1 * this.shootDirection.z);
      }
      uniforms1.time.value += delta * 5;
      this.stats.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      time = Date.now();
      return uniforms1.time.value += delta * 5;
    };

    return World;

  })();

}).call(this);
