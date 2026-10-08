/**
 * VECTORES LAB - Three.js 3D Vector Laboratory Engine
 * Handles 3D scenes for Cross Product (Section 10) and 3D Vectors Space (Section 11).
 *
 * Theme & Color Specification:
 * - Background: Dark High-Tech Laboratory (0x050811)
 * - Vector A: 0x3b82f6 (Sapphire Blue)
 * - Vector B: 0xa855f7 (Vivid Purple)
 * - Resultant R / Cross Vector C: 0x10b981 (Emerald Green)
 * - Axes: X (0xef4444 Red), Y (0x22c55e Green), Z (0x3b82f6 Blue)
 */

class VectorScene3D {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Container #${containerId} not found.`);
      return;
    }

    this.options = Object.assign({
      showGrid: true,
      showAxes: true,
      gridSize: 22,
      gridDivisions: 22,
      defaultCamPos: [15, 12, 16],
      enableShadows: false
    }, options);

    this.initScene();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  initScene() {
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 440;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050811); // Deep dark space lab

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(...this.options.defaultCamPos);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 65;
      this.controls.minDistance = 3;
    }

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight1.position.set(20, 30, 20);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.3);
    dirLight2.position.set(-20, -10, -20);
    this.scene.add(dirLight2);

    // 6. Helpers: Grid & Axes
    this.helpersGroup = new THREE.Group();
    this.scene.add(this.helpersGroup);

    this.grid = new THREE.GridHelper(this.options.gridSize, this.options.gridDivisions, 0x334155, 0x1e293b);
    this.grid.position.y = 0;
    this.helpersGroup.add(this.grid);

    if (this.options.showAxes) {
      this.createAxesMarkers();
    }

    // Dynamic objects container
    this.objectsGroup = new THREE.Group();
    this.scene.add(this.objectsGroup);

    // Resize listener
    window.addEventListener('resize', () => this.onResize());
  }

  createAxesMarkers() {
    const axisLen = this.options.gridSize / 2;
    // X Axis: Red (#ef4444)
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLen, 0xef4444, 0.9, 0.4);
    // Y Axis: Green (#22c55e)
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLen, 0x22c55e, 0.9, 0.4);
    // Z Axis: Blue (#3b82f6)
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLen, 0x3b82f6, 0.9, 0.4);

    this.helpersGroup.add(arrowX, arrowY, arrowZ);

    // Text sprites for X, Y, Z
    this.helpersGroup.add(this.createTextSprite('+X', '#ef4444', new THREE.Vector3(axisLen + 0.9, 0, 0)));
    this.helpersGroup.add(this.createTextSprite('+Y', '#22c55e', new THREE.Vector3(0, axisLen + 0.9, 0)));
    this.helpersGroup.add(this.createTextSprite('+Z', '#3b82f6', new THREE.Vector3(0, 0, axisLen + 0.9)));
  }

  createTextSprite(text, color, pos) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2, 1, 1);
    sprite.position.copy(pos);
    return sprite;
  }

  createVectorMesh(dir, length, colorHex, radius = 0.13) {
    const group = new THREE.Group();
    if (length < 0.01) return group;

    const headLength = Math.min(1.3, length * 0.28);
    const headRadius = radius * 2.5;
    const shaftLength = length - headLength;

    // Shaft (Cylinder)
    const shaftGeo = new THREE.CylinderGeometry(radius, radius, shaftLength, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.3,
      metalness: 0.3
    });
    const shaft = new THREE.Mesh(shaftGeo, mat);
    shaft.position.y = shaftLength / 2;
    group.add(shaft);

    // Head (Cone)
    const headGeo = new THREE.ConeGeometry(headRadius, headLength, 20);
    const headMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.2,
      metalness: 0.4
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = shaftLength + headLength / 2;
    group.add(head);

    // Orient group along dir vector
    const normalizedDir = dir.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normalizedDir);
    group.quaternion.copy(quaternion);

    return group;
  }

  setVector(id, v, colorHex, origin = new THREE.Vector3(0, 0, 0), labelText = '') {
    const existing = this.objectsGroup.getObjectByName(id);
    if (existing) {
      this.objectsGroup.remove(existing);
    }

    const length = v.length();
    if (length < 0.05) return;

    const vGroup = new THREE.Group();
    vGroup.name = id;
    vGroup.position.copy(origin);

    const mesh = this.createVectorMesh(v, length, colorHex);
    vGroup.add(mesh);

    if (labelText) {
      const tipPos = origin.clone().add(v).add(new THREE.Vector3(0, 0.5, 0));
      const sprite = this.createTextSprite(labelText, `#${new THREE.Color(colorHex).getHexString()}`, tipPos);
      vGroup.add(sprite);
    }

    this.objectsGroup.add(vGroup);
  }

  setComponentBox(id, v, colorHex = 0xf97316) {
    const existing = this.objectsGroup.getObjectByName(id);
    if (existing) this.objectsGroup.remove(existing);

    const group = new THREE.Group();
    group.name = id;

    const lineMat = new THREE.LineDashedMaterial({
      color: colorHex,
      dashSize: 0.35,
      gapSize: 0.25,
      opacity: 0.65,
      transparent: true
    });

    const createDashedLine = (p1, p2) => {
      const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(geo, lineMat);
      line.computeLineDistances();
      return line;
    };

    const X = new THREE.Vector3(v.x, 0, 0);
    const Y = new THREE.Vector3(0, v.y, 0);
    const Z = new THREE.Vector3(0, 0, v.z);
    const XY = new THREE.Vector3(v.x, v.y, 0);
    const XZ = new THREE.Vector3(v.x, 0, v.z);
    const XYZ = new THREE.Vector3(v.x, v.y, v.z);

    // Box wireframe
    group.add(createDashedLine(XYZ, XZ));
    group.add(createDashedLine(XZ, X));
    group.add(createDashedLine(XZ, Z));
    group.add(createDashedLine(XYZ, XY));
    group.add(createDashedLine(XY, Y));
    group.add(createDashedLine(XY, X));

    this.objectsGroup.add(group);
  }

  setParallelogram(id, vA, vB, colorHex = 0xf59e0b) {
    const existing = this.objectsGroup.getObjectByName(id);
    if (existing) this.objectsGroup.remove(existing);

    const group = new THREE.Group();
    group.name = id;

    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = vA.clone();
    const p2 = vA.clone().add(vB);
    const p3 = vB.clone();

    const vertices = new Float32Array([
      p0.x, p0.y, p0.z,
      p1.x, p1.y, p1.z,
      p2.x, p2.y, p2.z,

      p0.x, p0.y, p0.z,
      p2.x, p2.y, p2.z,
      p3.x, p3.y, p3.z
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const edgeGeo = new THREE.BufferGeometry().setFromPoints([p0, p1, p2, p3, p0]);
    const edgeMat = new THREE.LineBasicMaterial({ color: colorHex, opacity: 0.6, transparent: true });
    const edgeLine = new THREE.Line(edgeGeo, edgeMat);
    group.add(edgeLine);

    this.objectsGroup.add(group);
  }

  toggleGrid(visible) {
    if (this.grid) {
      this.grid.visible = visible !== undefined ? visible : !this.grid.visible;
    }
  }

  resetCamera() {
    if (this.controls) {
      this.controls.reset();
    }
    this.camera.position.set(...this.options.defaultCamPos);
    this.camera.lookAt(0, 0, 0);
  }

  setTheme(isDark) {
    this.scene.background = new THREE.Color(isDark ? 0x050811 : 0xf8fafc);
    if (this.grid) {
      this.helpersGroup.remove(this.grid);
      this.grid = new THREE.GridHelper(
        this.options.gridSize,
        this.options.gridDivisions,
        isDark ? 0x334155 : 0x94a3b8,
        isDark ? 0x1e293b : 0xe2e8f0
      );
      this.helpersGroup.add(this.grid);
    }
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.VectorScene3D = VectorScene3D;
