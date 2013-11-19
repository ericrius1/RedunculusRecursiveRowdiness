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
      rnd = FW.rnd;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.z = 1;
      light = new THREE.DirectionalLight(0xff00ff);
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
      uniforms1.time.value += delta * 5;
      this.stats.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      return time = Date.now();
    };

    return World;

  })();

}).call(this);
