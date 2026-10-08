/**
 * VECTORES LAB - Polygon Method Interactive Simulator
 * Supports adding 2 to 5 vectors, head-to-tail animated chaining,
 * step-by-step navigation, and real-time resultant R = A + B + C + D...
 */

class PolygonSimulator {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvasWrapper = new VectorCanvas2D(canvasId, {
      range: 12,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: false,
      showAngles: false,
      lockOrigin: true
    });

    this.palette = [
      { name: 'A', color: '#3b82f6' },
      { name: 'B', color: '#a855f7' },
      { name: 'C', color: '#06b6d4' },
      { name: 'D', color: '#eab308' },
      { name: 'E', color: '#ec4899' }
    ];

    // Initial default vectors
    this.vectorList = [
      { id: 'poly_A', name: 'A', color: '#3b82f6', vec: new Vec2(4, 2), currentOrigin: new Vec2(0, 0) },
      { id: 'poly_B', name: 'B', color: '#a855f7', vec: new Vec2(2, 4), currentOrigin: new Vec2(0, 0) },
      { id: 'poly_C', name: 'C', color: '#06b6d4', vec: new Vec2(-3, 2), currentOrigin: new Vec2(0, 0) }
    ];

    this.currentStep = 0; // 0 = origin, 1..N = chain, N+1 = resultant
    this.isAutoPlaying = false;
    this.animationTimer = null;

    this.init();
  }

  init() {
    this.updateCanvas();
  }

  addVector() {
    if (this.vectorList.length >= 5) return;
    const idx = this.vectorList.length;
    const meta = this.palette[idx] || { name: `V${idx + 1}`, color: '#94a3b8' };

    const defaults = [new Vec2(3, 1), new Vec2(-2, 3), new Vec2(2, -3), new Vec2(-3, -2)];
    const chosenVec = defaults[idx % defaults.length].clone();

    this.vectorList.push({
      id: `poly_${meta.name}`,
      name: meta.name,
      color: meta.color,
      vec: chosenVec,
      currentOrigin: new Vec2(0, 0)
    });

    this.reset();
  }

  removeVector() {
    if (this.vectorList.length <= 2) return;
    this.vectorList.pop();
    this.reset();
  }

  calculatePolygonOrigins() {
    const origins = [new Vec2(0, 0)];
    let accum = new Vec2(0, 0);
    for (let i = 0; i < this.vectorList.length - 1; i++) {
      accum = accum.add(this.vectorList[i].vec);
      origins.push(accum.clone());
    }
    return origins;
  }

  getResultant() {
    let r = new Vec2(0, 0);
    for (const v of this.vectorList) {
      r = r.add(v.vec);
    }
    return r;
  }

  reset() {
    this.stopAutoPlay();
    this.currentStep = 0;
    for (const v of this.vectorList) {
      v.currentOrigin = new Vec2(0, 0);
    }
    this.updateCanvas();
    this.triggerUIUpdate();
  }

  setStep(step) {
    const maxSteps = this.vectorList.length + 1;
    this.currentStep = Math.max(0, Math.min(maxSteps, step));

    const polygonOrigins = this.calculatePolygonOrigins();

    for (let i = 0; i < this.vectorList.length; i++) {
      if (this.currentStep > i) {
        this.vectorList[i].currentOrigin = polygonOrigins[i];
      } else {
        this.vectorList[i].currentOrigin = new Vec2(0, 0);
      }
    }

    this.updateCanvas();
    this.triggerUIUpdate();
  }

  nextStep() {
    if (this.currentStep < this.vectorList.length + 1) {
      this.setStep(this.currentStep + 1);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.setStep(this.currentStep - 1);
    }
  }

  startAutoPlay() {
    this.reset();
    this.isAutoPlaying = true;
    let step = 0;
    const maxSteps = this.vectorList.length + 1;

    const runNext = () => {
      if (!this.isAutoPlaying) return;
      if (step <= maxSteps) {
        this.setStep(step);
        step++;
        this.animationTimer = setTimeout(runNext, 1100);
      } else {
        this.isAutoPlaying = false;
        const btn = document.getElementById('btnPolyAuto');
        if (btn) btn.textContent = '▶ Construcción Automática';
      }
    };
    runNext();
  }

  stopAutoPlay() {
    this.isAutoPlaying = false;
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
    const btn = document.getElementById('btnPolyAuto');
    if (btn) btn.textContent = '▶ Construcción Automática';
  }

  toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      const btn = document.getElementById('btnPolyAuto');
      if (btn) btn.textContent = '⏸ Pausar Animación';
      this.startAutoPlay();
    }
  }

  updateCanvas() {
    this.canvasWrapper.clearVectors();

    for (const v of this.vectorList) {
      this.canvasWrapper.setVector(v.id, {
        name: v.name,
        color: v.color,
        origin: v.currentOrigin,
        vec: v.vec,
        draggable: false,
        showProjections: false,
        showAngle: false
      });
    }

    const maxSteps = this.vectorList.length + 1;
    if (this.currentStep === maxSteps) {
      const r = this.getResultant();
      this.canvasWrapper.setVector('poly_R', {
        name: 'R',
        color: '#10b981', // Emerald green
        origin: new Vec2(0, 0),
        vec: r,
        draggable: false,
        isResultant: true,
        showProjections: false,
        showAngle: true
      });
    }

    this.canvasWrapper.render();
  }

  triggerUIUpdate() {
    if (window.updatePolygonUI) {
      window.updatePolygonUI(this);
    }
  }
}

window.PolygonSimulator = PolygonSimulator;
