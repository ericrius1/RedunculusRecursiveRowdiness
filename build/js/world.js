(function() {
  var World;

  window.World = World = (function() {
    var animate, render, update;

    function World(parentElement) {
      var ASPECT, FAR, NEAR, SCREEN_HEIGHT, SCREEN_WIDTH, VIEW_ANGLE;
      this.parentElement = parentElement;
      this.isRendering = false;
      this.frameCount = 0;
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;
      VIEW_ANGLE = 45;
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
      NEAR = 0.1;
      FAR = 20000;
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
      this.controls = new THREE.TrackballControls(this.camera, this.container);
      animate();
    }

    animate = function() {
      requestAnimationFrame(animate);
      if (this.isRendering) {
        this.frameCount++;
        render();
        return update();
      } else {
        return this.frameCount = 0;
      }
    };

    render = function() {
      this.renderer.setClearColor(this.g.backgroundColor);
      return this.renderer.render(this.scene, this.camera);
    };

    update = function() {
      return this.controls.update();
    };

    return World;

  })();

}).call(this);
