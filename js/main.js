/**
 * VECTORES LAB - Main Application Controller
 * Coordinates simulations, UI synchronization, 2D/3D state, Teacher Mode,
 * and Pedagogical Progressions across all 23 Sections.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Teacher Mode State
  let teacherMode = false;

  window.toggleTeacherMode = function (forceState) {
    teacherMode = forceState !== undefined ? forceState : !teacherMode;
    const btn = document.getElementById('btnTeacherMode');
    const banner = document.getElementById('teacherBanner');

    if (btn) btn.classList.toggle('active', teacherMode);
    if (banner) banner.classList.toggle('visible', teacherMode);

    const targets = document.querySelectorAll('.math-val-result');
    targets.forEach(el => {
      if (teacherMode) {
        el.classList.add('teacher-masked');
        el.classList.remove('revealed');
        el.onclick = () => el.classList.toggle('revealed');
      } else {
        el.classList.remove('teacher-masked', 'revealed');
        el.onclick = null;
      }
    });
  };

  window.teacherRevealAll = function () {
    document.querySelectorAll('.teacher-masked').forEach(el => el.classList.add('revealed'));
  };

  window.teacherHideAll = function () {
    document.querySelectorAll('.teacher-masked').forEach(el => el.classList.remove('revealed'));
  };

  // Scroll Progress Bar Tracker
  window.addEventListener('scroll', () => {
    const scrollBar = document.getElementById('progressBar');
    if (!scrollBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollBar.style.width = `${progress}%`;
  });

  // Dark/Light Theme Toggle
  const themeBtn = document.getElementById('btnThemeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      themeBtn.textContent = isLight ? '🌙' : '☀️';

      if (window.conceptCanvas) window.conceptCanvas.render();
      if (window.plane2DCanvas) window.plane2DCanvas.render();
      if (window.scalarCanvas) window.scalarCanvas.render();
      if (window.parallelogramCanvas) window.parallelogramCanvas.render();
      if (window.componentCanvas) window.componentCanvas.render();
      if (window.sumCanvas) window.sumCanvas.render();
      if (window.diffCanvas) window.diffCanvas.render();
      if (window.dotCanvas) window.dotCanvas.render();
      if (window.polygonSim) window.polygonSim.updateCanvas();
      if (window.crossProductScene) window.crossProductScene.setTheme(!isLight);
      if (window.space3DScene) window.space3DScene.setTheme(!isLight);
      if (window.physicsSim) window.physicsSim.render();
    });
  }

  /* ==========================================================================
     1. HERO CANVAS ANIMATION
     ========================================================================== */
  const initHeroCanvas = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const heroVectors = [
      { x: 0.22, y: 0.32, len: 90, angle: 0.6, speed: 0.007, color: '#3b82f6', name: 'A' },
      { x: 0.48, y: 0.48, len: 120, angle: -0.8, speed: -0.005, color: '#a855f7', name: 'B' },
      { x: 0.74, y: 0.62, len: 110, angle: 2.1, speed: 0.006, color: '#10b981', name: 'R' },
      { x: 0.35, y: 0.75, len: 80, angle: -2.3, speed: -0.004, color: '#f97316', name: 'Comp' }
    ];

    let mousePos = { x: -100, y: -100 };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    });

    const drawHeroArrow = (ox, oy, len, angle, color, name) => {
      const tx = ox + len * Math.cos(angle);
      const ty = oy + len * Math.sin(angle);
      const headLen = 13;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - headLen * Math.cos(angle - Math.PI / 6), ty - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(tx - headLen * Math.cos(angle + Math.PI / 6), ty - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ox, oy, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillText(name, (ox + tx) / 2 + 10, (oy + ty) / 2 - 8);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 20; x < width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      heroVectors.forEach(v => {
        v.angle += v.speed;
        const ox = v.x * width;
        const oy = v.y * height;

        const dx = mousePos.x - ox;
        const dy = mousePos.y - oy;
        const dist = Math.hypot(dx, dy);
        let effAngle = v.angle;
        if (dist < 180 && dist > 0) {
          effAngle += (Math.atan2(dy, dx) - effAngle) * 0.15;
        }

        drawHeroArrow(ox, oy, v.len, effAngle, v.color, v.name);
      });

      requestAnimationFrame(animate);
    };
    animate();
  };
  initHeroCanvas();

  /* ==========================================================================
     2. ¿QUÉ ES UN VECTOR? (Section 3)
     ========================================================================== */
  const initConceptSection = () => {
    const canvas = new VectorCanvas2D('conceptCanvas', {
      range: 8,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: true,
      showAngles: true
    });
    window.conceptCanvas = canvas;

    let vecA = new Vec2(5, 3);
    canvas.setVector('vA', {
      name: 'A',
      color: '#3b82f6',
      origin: new Vec2(0, 0),
      vec: vecA,
      draggable: true
    });

    const updateUI = () => {
      const v = canvas.getVector('vA').vec;
      document.getElementById('conceptAx').value = v.x;
      document.getElementById('conceptAy').value = v.y;
      document.getElementById('conceptAxSlider').value = v.x;
      document.getElementById('conceptAySlider').value = v.y;

      document.getElementById('conceptCompDisplay').textContent = `(${MathFormat.fixed(v.x, 1)}, ${MathFormat.fixed(v.y, 1)})`;
      document.getElementById('conceptMagDisplay').textContent = MathFormat.fixed(v.mag(), 2);
      document.getElementById('conceptAngleDisplay').textContent = `${MathFormat.fixed(v.angleDeg(), 1)}°`;
      document.getElementById('conceptUnitDisplay').textContent = MathFormat.formatUnitVec2(v, 2);

      let cuadrante = '';
      if (v.x > 0 && v.y >= 0) cuadrante = 'Cuadrante I (+X, +Y)';
      else if (v.x < 0 && v.y >= 0) cuadrante = 'Cuadrante II (-X, +Y) ➔ atan2 añade 180°';
      else if (v.x < 0 && v.y < 0) cuadrante = 'Cuadrante III (-X, -Y) ➔ atan2 añade 180°';
      else if (v.x > 0 && v.y < 0) cuadrante = 'Cuadrante IV (+X, -Y) ➔ atan2 añade 360°';
      else cuadrante = 'Sobre el eje coordenado';
      document.getElementById('conceptSentidoDisplay').textContent = cuadrante;
    };

    canvas.onUpdateCallback = () => updateUI();

    const setCoords = (x, y) => {
      canvas.setVector('vA', {
        name: 'A',
        color: '#3b82f6',
        origin: new Vec2(0, 0),
        vec: new Vec2(x, y),
        draggable: true
      });
      updateUI();
    };

    document.getElementById('conceptAxSlider').addEventListener('input', (e) => {
      const cur = canvas.getVector('vA').vec;
      setCoords(parseFloat(e.target.value), cur.y);
    });
    document.getElementById('conceptAySlider').addEventListener('input', (e) => {
      const cur = canvas.getVector('vA').vec;
      setCoords(cur.x, parseFloat(e.target.value));
    });
    document.getElementById('conceptAx').addEventListener('change', (e) => {
      const cur = canvas.getVector('vA').vec;
      setCoords(parseFloat(e.target.value) || 0, cur.y);
    });
    document.getElementById('conceptAy').addEventListener('change', (e) => {
      const cur = canvas.getVector('vA').vec;
      setCoords(cur.x, parseFloat(e.target.value) || 0);
    });

    document.getElementById('conceptSnapGrid').addEventListener('change', (e) => {
      canvas.snapToGrid = e.target.checked;
    });

    document.getElementById('btnResetConcept').addEventListener('click', () => {
      setCoords(5, 3);
    });

    updateUI();
  };
  initConceptSection();

  /* ==========================================================================
     3. LABORATORIO DE VECTORES 2D COMPLETO (Section 4)
     ========================================================================== */
  const initPlane2DSection = () => {
    const canvas = new VectorCanvas2D('plane2DCanvas', {
      range: 10,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: true,
      showAngles: true,
      lockOrigin: true
    });
    window.plane2DCanvas = canvas;

    let vA = new Vec2(4, 3);
    let vB = new Vec2(-2, 4);

    const updateAll = () => {
      const a = canvas.getVector('plane_A').vec;
      const b = canvas.getVector('plane_B').vec;
      const r = a.add(b);

      canvas.setVector('plane_R', {
        name: 'R',
        color: '#10b981',
        origin: new Vec2(0, 0),
        vec: r,
        draggable: false,
        isResultant: true,
        showProjections: false,
        showAngle: true
      });

      document.getElementById('planeAx').value = a.x;
      document.getElementById('planeAy').value = a.y;
      document.getElementById('planeBx').value = b.x;
      document.getElementById('planeBy').value = b.y;

      document.getElementById('planeMagA').textContent = MathFormat.fixed(a.mag(), 2);
      document.getElementById('planeAngleA').textContent = `${MathFormat.fixed(a.angleDeg(), 1)}°`;
      document.getElementById('planeMagB').textContent = MathFormat.fixed(b.mag(), 2);
      document.getElementById('planeAngleB').textContent = `${MathFormat.fixed(b.angleDeg(), 1)}°`;
      document.getElementById('planeAngleBetween').textContent = `${MathFormat.fixed(a.angleBetweenDeg(b), 1)}°`;

      // Live Resultant Display
      const rRx = document.getElementById('planeRxVal');
      const rRy = document.getElementById('planeRyVal');
      const rMag = document.getElementById('planeRMagVal');
      const rAngle = document.getElementById('planeRAngleVal');
      if (rRx) rRx.textContent = MathFormat.fixed(r.x, 1);
      if (rRy) rRy.textContent = MathFormat.fixed(r.y, 1);
      if (rMag) rMag.textContent = MathFormat.fixed(r.mag(), 2);
      if (rAngle) rAngle.textContent = `${MathFormat.fixed(r.angleDeg(), 1)}°`;
    };

    canvas.setVector('plane_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: vA, draggable: true });
    canvas.setVector('plane_B', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: vB, draggable: true });

    canvas.onUpdateCallback = () => updateAll();

    const updateFromInputs = () => {
      const ax = parseFloat(document.getElementById('planeAx').value) || 0;
      const ay = parseFloat(document.getElementById('planeAy').value) || 0;
      const bx = parseFloat(document.getElementById('planeBx').value) || 0;
      const by = parseFloat(document.getElementById('planeBy').value) || 0;

      canvas.setVector('plane_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: new Vec2(ax, ay), draggable: true });
      canvas.setVector('plane_B', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: new Vec2(bx, by), draggable: true });
      updateAll();
    };

    ['planeAx', 'planeAy', 'planeBx', 'planeBy'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', updateFromInputs);
    });

    document.getElementById('planeShowProj')?.addEventListener('change', (e) => {
      canvas.showProjections = e.target.checked;
      canvas.render();
    });
    document.getElementById('planeShowAngles')?.addEventListener('change', (e) => {
      canvas.showAngles = e.target.checked;
      canvas.render();
    });

    // Zoom & Pan Buttons
    document.getElementById('btnZoomIn2D')?.addEventListener('click', () => canvas.zoomIn());
    document.getElementById('btnZoomOut2D')?.addEventListener('click', () => canvas.zoomOut());
    document.getElementById('btnResetZoom2D')?.addEventListener('click', () => canvas.resetView());

    document.getElementById('btnResetPlane2D')?.addEventListener('click', () => {
      document.getElementById('planeAx').value = 4;
      document.getElementById('planeAy').value = 3;
      document.getElementById('planeBx').value = -2;
      document.getElementById('planeBy').value = 4;
      canvas.resetView();
      updateFromInputs();
    });

    updateAll();
  };
  initPlane2DSection();

  /* ==========================================================================
     4. OPERACIONES: SUMA, RESTA Y MULTIPLICACIÓN POR ESCALAR (Section 5)
     ========================================================================== */
  // 4.1 Suma de Vectores
  const initSumSection = () => {
    const canvas = new VectorCanvas2D('sumCanvas', {
      range: 12,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: false,
      showAngles: false,
      lockOrigin: true
    });
    window.sumCanvas = canvas;

    let vA = new Vec2(5, 2);
    let vB = new Vec2(2, 5);

    const updateSum = () => {
      const a = canvas.getVector('sum_A').vec;
      const b = canvas.getVector('sum_B').vec;
      const r = a.add(b);

      canvas.setVector('sum_R', {
        name: 'R',
        color: '#10b981',
        origin: new Vec2(0, 0),
        vec: r,
        draggable: false,
        isResultant: true,
        showProjections: false,
        showAngle: true
      });

      document.getElementById('sumAx').value = a.x;
      document.getElementById('sumAy').value = a.y;
      document.getElementById('sumBx').value = b.x;
      document.getElementById('sumBy').value = b.y;

      document.getElementById('sumAxVal').textContent = a.x;
      document.getElementById('sumBxVal').textContent = b.x;
      document.getElementById('sumRxVal').textContent = r.x;

      document.getElementById('sumAyVal').textContent = a.y;
      document.getElementById('sumByVal').textContent = b.y;
      document.getElementById('sumRyVal').textContent = r.y;

      document.getElementById('sumRMag').textContent = MathFormat.fixed(r.mag(), 2);
      document.getElementById('sumRAngle').textContent = `${MathFormat.fixed(r.angleDeg(), 1)}°`;
    };

    canvas.setVector('sum_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: vA, draggable: true });
    canvas.setVector('sum_B', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: vB, draggable: true });
    canvas.onUpdateCallback = () => updateSum();

    const updateInputs = () => {
      const ax = parseFloat(document.getElementById('sumAx').value) || 0;
      const ay = parseFloat(document.getElementById('sumAy').value) || 0;
      const bx = parseFloat(document.getElementById('sumBx').value) || 0;
      const by = parseFloat(document.getElementById('sumBy').value) || 0;

      canvas.setVector('sum_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: new Vec2(ax, ay), draggable: true });
      canvas.setVector('sum_B', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: new Vec2(bx, by), draggable: true });
      updateSum();
    };

    ['sumAx', 'sumAy', 'sumBx', 'sumBy'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', updateInputs);
    });

    document.getElementById('btnResetSum')?.addEventListener('click', () => {
      document.getElementById('sumAx').value = 5;
      document.getElementById('sumAy').value = 2;
      document.getElementById('sumBx').value = 2;
      document.getElementById('sumBy').value = 5;
      updateInputs();
    });

    updateSum();
  };
  initSumSection();

  // 4.2 Resta de Vectores (A - B)
  const initDiffSection = () => {
    const canvas = new VectorCanvas2D('diffCanvas', {
      range: 10,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: false,
      showAngles: false,
      lockOrigin: true
    });
    window.diffCanvas = canvas;

    let vA = new Vec2(5, 3);
    let vB = new Vec2(2, 4);

    const updateDiff = () => {
      const a = canvas.getVector('diff_A').vec;
      const b = canvas.getVector('diff_B').vec;
      const negB = b.negate();
      const diff = a.sub(b);

      const showOpposite = document.getElementById('toggleDiffOpposite')?.checked ?? true;

      if (showOpposite) {
        canvas.setVector('diff_negB', {
          name: '-B',
          color: '#ec4899',
          origin: new Vec2(0, 0),
          vec: negB,
          draggable: false,
          dashed: true
        });
      } else {
        canvas.removeVector('diff_negB');
      }

      canvas.setVector('diff_R', {
        name: 'D',
        color: '#10b981',
        origin: new Vec2(0, 0),
        vec: diff,
        draggable: false,
        isResultant: true
      });

      document.getElementById('diffAx').value = a.x;
      document.getElementById('diffAy').value = a.y;
      document.getElementById('diffBx').value = b.x;
      document.getElementById('diffBy').value = b.y;

      document.getElementById('diffNegBxVal').textContent = negB.x;
      document.getElementById('diffNegByVal').textContent = negB.y;

      document.getElementById('diffAxVal').textContent = a.x;
      document.getElementById('diffBxVal').textContent = b.x;
      document.getElementById('diffRxVal').textContent = diff.x;

      document.getElementById('diffAyVal').textContent = a.y;
      document.getElementById('diffByVal').textContent = b.y;
      document.getElementById('diffRyVal').textContent = diff.y;

      document.getElementById('diffRMag').textContent = MathFormat.fixed(diff.mag(), 2);
      document.getElementById('diffRAngle').textContent = `${MathFormat.fixed(diff.angleDeg(), 1)}°`;
    };

    canvas.setVector('diff_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: vA, draggable: true });
    canvas.setVector('diff_B', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: vB, draggable: true });
    canvas.onUpdateCallback = () => updateDiff();

    const updateDiffInputs = () => {
      const ax = parseFloat(document.getElementById('diffAx').value) || 0;
      const ay = parseFloat(document.getElementById('diffAy').value) || 0;
      const bx = parseFloat(document.getElementById('diffBx').value) || 0;
      const by = parseFloat(document.getElementById('diffBy').value) || 0;

      canvas.setVector('diff_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: new Vec2(ax, ay), draggable: true });
      canvas.setVector('diff_B', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: new Vec2(bx, by), draggable: true });
      updateDiff();
    };

    ['diffAx', 'diffAy', 'diffBx', 'diffBy'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', updateDiffInputs);
    });

    document.getElementById('toggleDiffOpposite')?.addEventListener('change', () => updateDiff());

    document.getElementById('btnResetDiff')?.addEventListener('click', () => {
      document.getElementById('diffAx').value = 5;
      document.getElementById('diffAy').value = 3;
      document.getElementById('diffBx').value = 2;
      document.getElementById('diffBy').value = 4;
      updateDiffInputs();
    });

    updateDiff();
  };
  initDiffSection();

  // 4.3 Multiplicación por Escalar (kA)
  const initScalarSection = () => {
    const canvas = new VectorCanvas2D('scalarCanvas', {
      range: 10,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: false,
      showAngles: false,
      lockOrigin: true
    });
    window.scalarCanvas = canvas;

    let vA = new Vec2(3, 2);
    let kVal = 1.5;

    const updateScalar = () => {
      const scaled = vA.scale(kVal);

      // Original vector A (dashed or solid)
      canvas.setVector('scalar_origA', {
        name: 'A',
        color: '#3b82f6',
        origin: new Vec2(0, 0),
        vec: vA,
        draggable: true,
        dashed: true
      });

      // Scaled vector kA
      canvas.setVector('scalar_kA', {
        name: `k·A (${kVal >= 0 ? '+' : ''}${kVal})`,
        color: kVal >= 0 ? '#10b981' : '#ec4899',
        origin: new Vec2(0, 0),
        vec: scaled,
        draggable: false,
        isResultant: true
      });

      document.getElementById('scalarKVal').textContent = kVal.toFixed(1);
      document.getElementById('scalarKSlider').value = kVal;

      document.getElementById('scalarAxDisplay').textContent = vA.x;
      document.getElementById('scalarAyDisplay').textContent = vA.y;
      document.getElementById('scalarKAxDisplay').textContent = MathFormat.fixed(scaled.x, 2);
      document.getElementById('scalarKAyDisplay').textContent = MathFormat.fixed(scaled.y, 2);
      document.getElementById('scalarMagDisplay').textContent = MathFormat.fixed(scaled.mag(), 2);

      // Pedagogical explanation tag
      let expl = '';
      if (kVal > 1) {
        expl = '🔍 k > 1 : Dilatación (El vector se alarga conservando su sentido)';
      } else if (kVal > 0 && kVal < 1) {
        expl = '🔎 0 < k < 1 : Contracción (El vector se acorta conservando su sentido)';
      } else if (kVal === 0) {
        expl = '⚪ k = 0 : Vector Nulo (Magnitud 0 u, sin dirección definida)';
      } else {
        expl = '🔄 k < 0 : Inversión de Sentido (Gira 180° y se escala por |k|)';
      }
      const explEl = document.getElementById('scalarEffectDisplay');
      if (explEl) explEl.textContent = expl;
    };

    canvas.onUpdateCallback = (updatedV) => {
      vA = updatedV.vec.clone();
      updateScalar();
    };

    const slider = document.getElementById('scalarKSlider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        kVal = parseFloat(e.target.value);
        updateScalar();
      });
    }

    // Scalar presets
    document.querySelectorAll('.scalar-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        kVal = parseFloat(e.currentTarget.getAttribute('data-k'));
        updateScalar();
      });
    });

    updateScalar();
  };
  initScalarSection();

  /* ==========================================================================
     5. MÉTODO DEL PARALELOGRAMO PASO A PASO (Section 6)
     ========================================================================== */
  const initParallelogramSection = () => {
    const canvas = new VectorCanvas2D('parallelogramCanvas', {
      range: 10,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: false,
      showAngles: false,
      lockOrigin: true
    });
    window.parallelogramCanvas = canvas;

    let vA = new Vec2(5, 1);
    let vB = new Vec2(2, 4);
    let currentStep = 5; // 1 to 5

    const toggles = {
      parallels: true,
      parallelogram: true,
      resultant: true,
      components: false,
      values: true
    };

    canvas.onCustomRender = (ctx) => {
      const pO = canvas.mathToPixel(new Vec2(0, 0));
      const pA = canvas.mathToPixel(vA);
      const pB = canvas.mathToPixel(vB);
      const pR = canvas.mathToPixel(vA.add(vB));

      // Step 3 or 4: Parallels & Parallelogram
      if (currentStep >= 3 && toggles.parallels) {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 5]);

        // Parallel to B from tip of A
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();

        // Parallel to A from tip of B
        ctx.beginPath();
        ctx.moveTo(pB.x, pB.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();

        ctx.restore();
      }

      // Parallelogram fill
      if (currentStep >= 4 && toggles.parallelogram) {
        ctx.save();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
        ctx.beginPath();
        ctx.moveTo(pO.x, pO.y);
        ctx.lineTo(pA.x, pA.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    };

    const updateParaView = () => {
      canvas.clearVectors();

      // Step 1: Vector A
      if (currentStep >= 1) {
        canvas.setVector('pA', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: vA, draggable: true });
      }

      // Step 2: Vector B
      if (currentStep >= 2) {
        canvas.setVector('pB', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: vB, draggable: true });
      }

      // Step 5: Resultant R
      if (currentStep >= 5 && toggles.resultant) {
        canvas.setVector('pR', {
          name: 'R = A + B',
          color: '#10b981',
          origin: new Vec2(0, 0),
          vec: vA.add(vB),
          draggable: false,
          isResultant: true
        });
      }

      canvas.showProjections = toggles.components;
      canvas.render();

      const r = vA.add(vB);
      const valBox = document.getElementById('paraValuesCard');
      if (valBox) valBox.style.display = toggles.values ? 'block' : 'none';

      document.getElementById('paraRxVal').textContent = r.x;
      document.getElementById('paraRyVal').textContent = r.y;
      document.getElementById('paraRMag').textContent = MathFormat.fixed(r.mag(), 2);
      document.getElementById('paraRAngle').textContent = `${MathFormat.fixed(r.angleDeg(), 1)}°`;

      // Update Step node pills
      document.querySelectorAll('.para-step-node').forEach(node => {
        const s = parseInt(node.getAttribute('data-step'));
        node.classList.toggle('active', s === currentStep);
      });
    };

    canvas.onUpdateCallback = (v, target) => {
      if (target.vectorIndex === 0) vA = v.vec.clone();
      else if (target.vectorIndex === 1) vB = v.vec.clone();
      updateParaView();
    };

    // Step navigation buttons
    document.querySelectorAll('.para-step-node').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentStep = parseInt(e.currentTarget.getAttribute('data-step'));
        updateParaView();
      });
    });

    document.getElementById('btnParaPrev')?.addEventListener('click', () => {
      if (currentStep > 1) { currentStep--; updateParaView(); }
    });
    document.getElementById('btnParaNext')?.addEventListener('click', () => {
      if (currentStep < 5) { currentStep++; updateParaView(); }
    });

    // Toggles
    ['paraTogParallels', 'paraTogParallelogram', 'paraTogResultant', 'paraTogComp', 'paraTogValues'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          const key = e.target.getAttribute('data-target');
          if (key) toggles[key] = e.target.checked;
          updateParaView();
        });
      }
    });

    updateParaView();
  };
  initParallelogramSection();

  /* ==========================================================================
     6. MÉTODO DEL POLÍGONO (Section 7)
     ========================================================================== */
  const initPolygonSection = () => {
    const polySim = new PolygonSimulator('polygonCanvas');
    window.polygonSim = polySim;

    window.updatePolygonUI = (sim) => {
      const r = sim.getResultant();
      const bubble = document.getElementById('polyStepBubble');
      const text = document.getElementById('polyStepText');
      const prevBtn = document.getElementById('btnPolyPrev');
      const nextBtn = document.getElementById('btnPolyNext');

      if (bubble) bubble.textContent = sim.currentStep;

      if (prevBtn) prevBtn.disabled = sim.currentStep === 0;
      if (nextBtn) nextBtn.disabled = sim.currentStep === sim.vectorList.length + 1;

      if (text) {
        if (sim.currentStep === 0) {
          text.innerHTML = '<strong>Paso 0:</strong> Todos los vectores parten del origen común. Haz clic en "Construcción Automática" o "Paso Siguiente" para ver cómo se concatenan cabeza a cola.';
        } else if (sim.currentStep <= sim.vectorList.length) {
          const v = sim.vectorList[sim.currentStep - 1];
          text.innerHTML = `<strong>Paso ${sim.currentStep}:</strong> El vector <strong>${v.name}</strong> se ha trasladado al extremo del vector anterior.`;
        } else {
          text.innerHTML = '<strong>Paso Final:</strong> El <strong>vector resultante R (Verde)</strong> une el origen del primer vector con el extremo final del último vector.';
        }
      }

      document.getElementById('polyRxVal').textContent = MathFormat.fixed(r.x, 2);
      document.getElementById('polyRyVal').textContent = MathFormat.fixed(r.y, 2);
      document.getElementById('polyRMag').textContent = MathFormat.fixed(r.mag(), 2);
      document.getElementById('polyRAngle').textContent = `${MathFormat.fixed(r.angleDeg(), 1)}°`;

      // Render vector config list
      const listContainer = document.getElementById('polyVectorsList');
      if (listContainer) {
        listContainer.innerHTML = sim.vectorList.map((v, i) => `
          <div class="vector-config-item">
            <span style="font-weight:700; color:${v.color};">Vector ${v.name}:</span>
            <span>(${v.vec.x}, ${v.vec.y}) | ${MathFormat.fixed(v.vec.mag(), 1)} u</span>
          </div>
        `).join('');
      }
    };

    document.getElementById('btnPolyAuto')?.addEventListener('click', () => polySim.toggleAutoPlay());
    document.getElementById('btnPolyNext')?.addEventListener('click', () => polySim.nextStep());
    document.getElementById('btnPolyPrev')?.addEventListener('click', () => polySim.prevStep());
    document.getElementById('btnPolyReset')?.addEventListener('click', () => polySim.reset());
    document.getElementById('btnPolyAdd')?.addEventListener('click', () => polySim.addVector());
    document.getElementById('btnPolyRemove')?.addEventListener('click', () => polySim.removeVector());

    window.updatePolygonUI(polySim);
  };
  initPolygonSection();

  /* ==========================================================================
     7. COMPONENTES DE UN VECTOR (Section 8)
     ========================================================================== */
  const initComponentSection = () => {
    const canvas = new VectorCanvas2D('componentCanvas', {
      range: 8,
      snapToGrid: true,
      gridStep: 1,
      showGrid: true,
      showProjections: true,
      showAngles: true
    });
    window.componentCanvas = canvas;

    let vecA = new Vec2(4, 3);

    const updateCompUI = () => {
      const v = canvas.getVector('comp_A').vec;
      const mag = v.mag();
      const deg = v.angleDeg();
      const rad = v.angleRad();

      document.getElementById('compAngleSlider').value = Math.round(deg);
      document.getElementById('compAngleDisplay').textContent = `${MathFormat.fixed(deg, 1)}°`;
      document.getElementById('compMagSlider').value = mag.toFixed(1);
      document.getElementById('compMagDisplay').textContent = MathFormat.fixed(mag, 2);

      document.getElementById('compAxVal').textContent = MathFormat.fixed(v.x, 2);
      document.getElementById('compAyVal').textContent = MathFormat.fixed(v.y, 2);
      document.getElementById('compUnitFormat').textContent = `${v.x >= 0 ? '' : '-'}${Math.abs(v.x).toFixed(2)} î ${v.y >= 0 ? '+' : '-'} ${Math.abs(v.y).toFixed(2)} ĵ`;

      let quad = '';
      if (v.x >= 0 && v.y >= 0) quad = 'I Cuadrante (Ax > 0, Ay > 0)';
      else if (v.x < 0 && v.y >= 0) quad = 'II Cuadrante (Ax < 0, Ay > 0)';
      else if (v.x < 0 && v.y < 0) quad = 'III Cuadrante (Ax < 0, Ay < 0)';
      else quad = 'IV Cuadrante (Ax > 0, Ay < 0)';
      document.getElementById('compQuadrantDisplay').textContent = quad;
    };

    canvas.setVector('comp_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: vecA, draggable: true });
    canvas.onUpdateCallback = () => updateCompUI();

    document.getElementById('compAngleSlider')?.addEventListener('input', (e) => {
      const deg = parseFloat(e.target.value);
      const mag = parseFloat(document.getElementById('compMagSlider').value) || 5;
      const newVec = Vec2.fromMagAngle(mag, deg);
      canvas.setVector('comp_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: newVec, draggable: true });
      updateCompUI();
    });

    document.getElementById('compMagSlider')?.addEventListener('input', (e) => {
      const mag = parseFloat(e.target.value);
      const deg = parseFloat(document.getElementById('compAngleSlider').value) || 36.87;
      const newVec = Vec2.fromMagAngle(mag, deg);
      canvas.setVector('comp_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: newVec, draggable: true });
      updateCompUI();
    });

    updateCompUI();
  };
  initComponentSection();

  /* ==========================================================================
     8. PRODUCTO ESCALAR (Section 9)
     ========================================================================== */
  const initDotSection = () => {
    const canvas = new VectorCanvas2D('dotCanvas', {
      range: 8,
      snapToGrid: false,
      showGrid: true,
      showProjections: false,
      showAngles: true
    });
    window.dotCanvas = canvas;

    let magA = 6.0;
    let magB = 5.0;
    let angleDeg = 45.0;

    const updateDot = () => {
      const vA = new Vec2(magA, 0); // Aligned along X axis
      const vB = Vec2.fromMagAngle(magB, angleDeg);

      canvas.clearVectors();
      canvas.setVector('dot_A', { name: 'A', color: '#3b82f6', origin: new Vec2(0, 0), vec: vA, draggable: false });
      canvas.setVector('dot_B', { name: 'B', color: '#a855f7', origin: new Vec2(0, 0), vec: vB, draggable: false });

      // Projection shadow on A
      canvas.onCustomRender = (ctx) => {
        const rad = (angleDeg * Math.PI) / 180;
        const projLen = magB * Math.cos(rad);
        const pO = canvas.mathToPixel(new Vec2(0, 0));
        const pProj = canvas.mathToPixel(new Vec2(projLen, 0));
        const pB = canvas.mathToPixel(vB);

        ctx.save();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pB.x, pB.y);
        ctx.lineTo(pProj.x, pProj.y);
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(pO.x, pO.y);
        ctx.lineTo(pProj.x, pProj.y);
        ctx.stroke();
        ctx.restore();
      };
      canvas.render();

      const rad = (angleDeg * Math.PI) / 180;
      const cosVal = Math.cos(rad);
      const dotProduct = magA * magB * cosVal;

      document.getElementById('dotAngle').textContent = `${angleDeg.toFixed(1)}°`;
      document.getElementById('dotAngleSlider').value = angleDeg;
      document.getElementById('dotResultVal').textContent = MathFormat.fixed(dotProduct, 2);

      document.getElementById('dotMagA').textContent = magA.toFixed(1);
      document.getElementById('dotMagB').textContent = magB.toFixed(1);
      document.getElementById('dotCos').textContent = cosVal.toFixed(3);

      // Gauge needle percentage (-1 to +1 -> 0% to 100%)
      const maxRange = magA * magB;
      const pct = 50 + (dotProduct / (maxRange || 1)) * 50;
      const needle = document.getElementById('dotGaugeNeedle');
      if (needle) needle.style.left = `${Math.max(0, Math.min(100, pct))}%`;

      // Mechanical Work callout
      const work = dotProduct;
      document.getElementById('physicsWorkVal').textContent = `${MathFormat.fixed(work, 1)} Joules (J)`;
    };

    document.getElementById('dotAngleSlider')?.addEventListener('input', (e) => {
      angleDeg = parseFloat(e.target.value);
      updateDot();
    });
    document.getElementById('dotMagASlider')?.addEventListener('input', (e) => {
      magA = parseFloat(e.target.value);
      updateDot();
    });
    document.getElementById('dotMagBSlider')?.addEventListener('input', (e) => {
      magB = parseFloat(e.target.value);
      updateDot();
    });

    document.querySelectorAll('.case-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        angleDeg = parseFloat(e.currentTarget.getAttribute('data-angle'));
        updateDot();
      });
    });

    document.getElementById('btnResetDot')?.addEventListener('click', () => {
      magA = 6.0; magB = 5.0; angleDeg = 45.0;
      updateDot();
    });

    updateDot();
  };
  initDotSection();

  /* ==========================================================================
     9. PRODUCTO VECTORIAL 3D (Section 10)
     ========================================================================== */
  const initCrossProductSection = () => {
    const scene = new VectorScene3D('crossProduct3DContainer', {
      gridSize: 18,
      defaultCamPos: [12, 10, 14]
    });
    window.crossProductScene = scene;

    let angleDeg = 60.0;
    let magA = 5.0;
    let magB = 4.0;
    let invertOrder = false;

    const updateCross = () => {
      const rad = (angleDeg * Math.PI) / 180;
      const vA = new THREE.Vector3(magA, 0, 0); // On X
      const vB = new THREE.Vector3(magB * Math.cos(rad), 0, magB * Math.sin(rad)); // In XZ ground plane

      const vCross = new THREE.Vector3();
      if (!invertOrder) {
        vCross.crossVectors(vA, vB); // Points +Y
      } else {
        vCross.crossVectors(vB, vA); // Points -Y
      }

      scene.setVector('cross_A', vA, 0x3b82f6, new THREE.Vector3(0, 0, 0), 'A');
      scene.setVector('cross_B', vB, 0xa855f7, new THREE.Vector3(0, 0, 0), 'B');
      scene.setVector('cross_C', vCross, 0x10b981, new THREE.Vector3(0, 0, 0), invertOrder ? 'B × A' : 'A × B');
      scene.setParallelogram('cross_para', vA, vB, 0xf59e0b);

      const sinVal = Math.sin(rad);
      const crossMag = magA * magB * sinVal;

      document.getElementById('crossAngle').textContent = `${angleDeg.toFixed(1)}°`;
      document.getElementById('crossAngleSlider').value = angleDeg;
      document.getElementById('crossMagA').textContent = magA.toFixed(1);
      document.getElementById('crossMagB').textContent = magB.toFixed(1);
      document.getElementById('crossSin').textContent = sinVal.toFixed(3);
      document.getElementById('crossResultMag').textContent = MathFormat.fixed(crossMag, 2);
      document.getElementById('crossAreaVal').textContent = `${MathFormat.fixed(crossMag, 2)} u²`;
    };

    document.getElementById('crossAngleSlider')?.addEventListener('input', (e) => {
      angleDeg = parseFloat(e.target.value);
      updateCross();
    });

    document.getElementById('crossOrderToggle')?.addEventListener('change', (e) => {
      invertOrder = e.target.checked;
      const lbl = document.getElementById('crossOrderLabel');
      if (lbl) lbl.textContent = invertOrder ? 'B × A' : 'A × B';
      updateCross();
    });

    document.querySelectorAll('.cross-case-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        angleDeg = parseFloat(e.currentTarget.getAttribute('data-angle'));
        updateCross();
      });
    });

    document.getElementById('btnResetCamCross')?.addEventListener('click', () => scene.resetCamera());

    updateCross();
  };
  initCrossProductSection();

  /* ==========================================================================
     10. LABORATORIO 3D COMPLETO (Section 11)
     ========================================================================== */
  const initSpace3DSection = () => {
    const scene = new VectorScene3D('space3DContainer', {
      gridSize: 22,
      defaultCamPos: [16, 14, 18]
    });
    window.space3DScene = scene;

    let currentOp = 'sum'; // 'sum' | 'sub' | 'cross'

    const updateSpace = () => {
      const ax = parseFloat(document.getElementById('spaceAx').value) || 0;
      const ay = parseFloat(document.getElementById('spaceAy').value) || 0;
      const az = parseFloat(document.getElementById('spaceAz').value) || 0;

      const bx = parseFloat(document.getElementById('spaceBx').value) || 0;
      const by = parseFloat(document.getElementById('spaceBy').value) || 0;
      const bz = parseFloat(document.getElementById('spaceBz').value) || 0;

      const vA = new THREE.Vector3(ax, ay, az);
      const vB = new THREE.Vector3(bx, by, bz);

      let vR = new THREE.Vector3();
      let rLabel = 'R (Suma)';

      if (currentOp === 'sum') {
        vR.addVectors(vA, vB);
        rLabel = 'R = A + B';
      } else if (currentOp === 'sub') {
        vR.subVectors(vA, vB);
        rLabel = 'D = A - B';
      } else if (currentOp === 'cross') {
        vR.crossVectors(vA, vB);
        rLabel = 'C = A × B';
      }

      scene.setVector('space_A', vA, 0x3b82f6, new THREE.Vector3(0, 0, 0), 'A');
      scene.setVector('space_B', vB, 0xa855f7, new THREE.Vector3(0, 0, 0), 'B');
      scene.setVector('space_R', vR, 0x10b981, new THREE.Vector3(0, 0, 0), rLabel);

      const showBoxes = document.getElementById('spaceShowBoxes')?.checked ?? true;
      if (showBoxes) {
        scene.setComponentBox('box_A', vA, 0x3b82f6);
        scene.setComponentBox('box_B', vB, 0xa855f7);
      } else {
        const bA = scene.objectsGroup.getObjectByName('box_A');
        const bB = scene.objectsGroup.getObjectByName('box_B');
        if (bA) scene.objectsGroup.remove(bA);
        if (bB) scene.objectsGroup.remove(bB);
      }

      // Metrics
      const magA = vA.length();
      const magB = vB.length();
      const dotVal = vA.dot(vB);
      let angleBetween = 0;
      if (magA > 0 && magB > 0) {
        const cosTheta = Math.max(-1, Math.min(1, dotVal / (magA * magB)));
        angleBetween = (Math.acos(cosTheta) * 180) / Math.PI;
      }

      document.getElementById('spaceMagA').textContent = MathFormat.fixed(magA, 2);
      document.getElementById('spaceMagB').textContent = MathFormat.fixed(magB, 2);
      document.getElementById('spaceAngleBetween').textContent = `${MathFormat.fixed(angleBetween, 1)}°`;
      document.getElementById('spaceDotVal').textContent = MathFormat.fixed(dotVal, 2);

      if (magA > 0) {
        document.getElementById('spaceCosAlpha').textContent = (ax / magA).toFixed(2);
        document.getElementById('spaceCosBeta').textContent = (ay / magA).toFixed(2);
        document.getElementById('spaceCosGamma').textContent = (az / magA).toFixed(2);
      }

      document.getElementById('spaceRx').textContent = MathFormat.fixed(vR.x, 2);
      document.getElementById('spaceRy').textContent = MathFormat.fixed(vR.y, 2);
      document.getElementById('spaceRz').textContent = MathFormat.fixed(vR.z, 2);
      document.getElementById('spaceRMag').textContent = MathFormat.fixed(vR.length(), 2);
    };

    ['spaceAx', 'spaceAy', 'spaceAz', 'spaceBx', 'spaceBy', 'spaceBz'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', updateSpace);
    });

    document.querySelectorAll('.btn-space-op').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-space-op').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentOp = e.currentTarget.getAttribute('data-op');
        updateSpace();
      });
    });

    document.getElementById('spaceShowBoxes')?.addEventListener('change', updateSpace);
    document.getElementById('btnResetCamSpace')?.addEventListener('click', () => scene.resetCamera());
    document.getElementById('btnToggleGridSpace')?.addEventListener('click', () => scene.toggleGrid());

    document.getElementById('btnResetSpace3D')?.addEventListener('click', () => {
      document.getElementById('spaceAx').value = 4;
      document.getElementById('spaceAy').value = 5;
      document.getElementById('spaceAz').value = 3;
      document.getElementById('spaceBx').value = -3;
      document.getElementById('spaceBy').value = 3;
      document.getElementById('spaceBz').value = 5;
      updateSpace();
    });

    updateSpace();
  };
  initSpace3DSection();

  /* ==========================================================================
     11. APLICACIONES FÍSICAS EN EL MUNDO REAL (Section 13)
     ========================================================================== */
  const initPhysicsSection = () => {
    const physSim = new PhysicsSimManager('physicsSimCanvas');
    window.physicsSim = physSim;

    document.querySelectorAll('.btn-physics-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-physics-tab').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.getAttribute('data-tab');
        physSim.setMode(mode);

        document.querySelectorAll('.phys-tab-content').forEach(p => p.style.display = 'none');
        const targetCard = document.getElementById(`physCard_${mode}`);
        if (targetCard) targetCard.style.display = 'block';
      });
    });

    document.getElementById('btnPhysicsPlay')?.addEventListener('click', () => physSim.togglePlay());
    document.getElementById('btnPhysicsReset')?.addEventListener('click', () => physSim.resetSim());

    // Forces Mass Slider
    document.getElementById('physMassSlider')?.addEventListener('input', (e) => {
      physSim.forcesState.m = parseFloat(e.target.value);
      const mVal = document.getElementById('physMassVal');
      if (mVal) mVal.textContent = `${physSim.forcesState.m} kg`;
    });
  };
  initPhysicsSection();

  /* ==========================================================================
     12. PREGUNTAS DE PREDICCIÓN ACTIVA (Section 22)
     ========================================================================== */
  const initPredictions = () => {
    document.querySelectorAll('.prediction-box').forEach(box => {
      const buttons = box.querySelectorAll('.btn-prediction-opt');
      const feedback = box.querySelector('.prediction-feedback');

      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          buttons.forEach(b => b.disabled = true);
          const isCorrect = btn.getAttribute('data-correct') === 'true';

          if (isCorrect) {
            btn.classList.add('selected-correct');
            feedback.className = 'prediction-feedback visible alert-success';
            feedback.innerHTML = `<strong>🎉 ¡Exacto!</strong> ${box.getAttribute('data-expl-correct')}`;
          } else {
            btn.classList.add('selected-wrong');
            feedback.className = 'prediction-feedback visible alert-danger';
            feedback.innerHTML = `<strong>💡 Piénsalo de nuevo:</strong> ${box.getAttribute('data-expl-wrong')}`;
          }
        });
      });
    });
  };
  initPredictions();

  /* ==========================================================================
     13. QUIZ INTERACTIVO MULTINIVEL (Section 14)
     ========================================================================== */
  window.quizApp = new QuizEngine('quizContainer');

  /* ==========================================================================
     14. RETO FINAL (Section 23)
     ========================================================================== */
  window.challengeApp = new ChallengeEngine('challengeContainer');
});
