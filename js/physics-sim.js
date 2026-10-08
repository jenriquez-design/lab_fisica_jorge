/**
 * VECTORES LAB - Real-World Physics Interactive Simulations
 * Section 13: Forces & Newton's 2nd Law, River Crossing, Circular Motion,
 * Electric Field Superposition, and Mechanical Work.
 */

class PhysicsSimManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.currentMode = 'forces'; // 'forces' | 'river' | 'circular' | 'work'
    this.isRunning = false;
    this.animId = null;

    // Simulation state
    this.forcesState = {
      m: 2.0, // kg
      f1: new Vec2(6, 2),  // N
      f2: new Vec2(-2, 5), // N
      pos: new Vec2(0, 0), // m
      vel: new Vec2(0, 0), // m/s
      trail: []
    };

    this.riverState = {
      vRiver: 3.0, // m/s (East)
      vBoat: 5.0,  // m/s
      boatAngle: 60, // degrees
      boatPos: { x: 50, y: 350 },
      trail: [],
      t: 0
    };

    this.circularState = {
      radius: 120,
      omega: 1.2, // rad/s
      angle: 0
    };

    this.workState = {
      force: 20, // N
      angle: 35, // deg
      distance: 10, // m
      boxX: 100
    };

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initLoop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 600;
    this.height = rect.height || 420;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  setMode(mode) {
    this.currentMode = mode;
    this.resetSim();
  }

  resetSim() {
    this.isRunning = false;
    this.forcesState.pos = new Vec2(0, 0);
    this.forcesState.vel = new Vec2(0, 0);
    this.forcesState.trail = [];

    this.riverState.boatPos = { x: 50, y: this.height - 60 };
    this.riverState.trail = [];
    this.riverState.t = 0;

    this.workState.boxX = 100;
    this.render();
  }

  togglePlay() {
    this.isRunning = !this.isRunning;
    const btn = document.getElementById('btnPhysicsPlay');
    if (btn) btn.textContent = this.isRunning ? '⏸ Pausar' : '▶ Iniciar Simulación';
  }

  initLoop() {
    const loop = () => {
      if (this.isRunning) {
        this.updatePhysics();
      }
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  updatePhysics() {
    const dt = 0.025; // 25ms time step

    if (this.currentMode === 'forces') {
      const s = this.forcesState;
      const fNet = s.f1.add(s.f2);
      const accel = fNet.scale(1 / s.m);

      s.vel = s.vel.add(accel.scale(dt));
      s.pos = s.pos.add(s.vel.scale(dt));

      s.trail.push(s.pos.clone());
      if (s.trail.length > 80) s.trail.shift();

      // Bound reset if object moves off screen
      const cx = this.width / 2 + s.pos.x * 20;
      const cy = this.height / 2 - s.pos.y * 20;
      if (cx < 20 || cx > this.width - 20 || cy < 20 || cy > this.height - 20) {
        s.pos = new Vec2(0, 0);
        s.vel = new Vec2(0, 0);
        s.trail = [];
      }
    } else if (this.currentMode === 'river') {
      const r = this.riverState;
      const rad = (r.boatAngle * Math.PI) / 180;
      const vx = r.vRiver + r.vBoat * Math.cos(rad);
      const vy = -r.vBoat * Math.sin(rad); // negative because canvas Y is downward

      r.boatPos.x += vx * dt * 25;
      r.boatPos.y += vy * dt * 25;

      r.trail.push({ ...r.boatPos });
      if (r.trail.length > 120) r.trail.shift();

      if (r.boatPos.y < 80 || r.boatPos.x > this.width - 20) {
        this.isRunning = false;
        const btn = document.getElementById('btnPhysicsPlay');
        if (btn) btn.textContent = '▶ Iniciar Simulación';
      }
    } else if (this.currentMode === 'circular') {
      this.circularState.angle += this.circularState.omega * dt;
    } else if (this.currentMode === 'work') {
      if (this.workState.boxX < this.width - 150) {
        this.workState.boxX += 1.5;
      } else {
        this.isRunning = false;
        const btn = document.getElementById('btnPhysicsPlay');
        if (btn) btn.textContent = '▶ Iniciar Simulación';
      }
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.currentMode === 'forces') {
      this.renderForcesMode();
    } else if (this.currentMode === 'river') {
      this.renderRiverMode();
    } else if (this.currentMode === 'circular') {
      this.renderCircularMode();
    } else if (this.currentMode === 'work') {
      this.renderWorkMode();
    }
  }

  // 1. Forces and Newton's Second Law
  renderForcesMode() {
    const ctx = this.ctx;
    const s = this.forcesState;
    const fNet = s.f1.add(s.f2);
    const accel = fNet.scale(1 / s.m);

    const scale = 22; // px per meter
    const cx = this.width / 2 + s.pos.x * scale;
    const cy = this.height / 2 - s.pos.y * scale;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
    }

    // Trajectory Trail
    if (s.trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2.5;
      s.trail.forEach((p, idx) => {
        const tx = this.width / 2 + p.x * scale;
        const ty = this.height / 2 - p.y * scale;
        if (idx === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      });
      ctx.stroke();
    }

    // Draw mass block
    const boxSize = 44;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillRect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize);
    ctx.strokeRect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize);

    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.fillText(`m = ${s.m} kg`, cx, cy + 4);

    // Draw vectors originating from mass center
    const fScale = 14; // px per Newton
    this.drawArrow(cx, cy, cx + s.f1.x * fScale, cy - s.f1.y * fScale, '#3b82f6', 'F₁', 3);
    this.drawArrow(cx, cy, cx + s.f2.x * fScale, cy - s.f2.y * fScale, '#a855f7', 'F₂', 3);
    this.drawArrow(cx, cy, cx + fNet.x * fScale, cy - fNet.y * fScale, '#10b981', 'F_net = m·a', 4, true);

    // Update real-time info display
    this.updateForcesUI(fNet, accel);
  }

  updateForcesUI(fNet, accel) {
    const fNetEl = document.getElementById('physFNetDisplay');
    const aEl = document.getElementById('physAccelDisplay');
    if (fNetEl) fNetEl.textContent = `(${MathFormat.fixed(fNet.x, 2)}, ${MathFormat.fixed(fNet.y, 2)}) N [|F| = ${MathFormat.fixed(fNet.mag(), 2)} N]`;
    if (aEl) aEl.textContent = `(${MathFormat.fixed(accel.x, 2)}, ${MathFormat.fixed(accel.y, 2)}) m/s² [|a| = ${MathFormat.fixed(accel.mag(), 2)} m/s²]`;
  }

  // 2. River Crossing & Velocity Composition
  renderRiverMode() {
    const ctx = this.ctx;
    const r = this.riverState;

    // Draw River banks and water
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.fillRect(0, 90, this.width, this.height - 180);

    // River flow arrows
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.lineWidth = 1.5;
    for (let y = 140; y < this.height - 100; y += 50) {
      for (let x = 40; x < this.width - 40; x += 120) {
        this.drawArrow(x, y, x + 40, y, 'rgba(6, 182, 212, 0.45)', '', 2);
      }
    }

    // River Bank Labels
    ctx.font = '600 12px "Outfit", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Orilla Norte (Destino)', 20, 75);
    ctx.fillText('Orilla Sur (Origen)', 20, this.height - 30);

    // Boat trajectory trail
    if (r.trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      r.trail.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Boat representation
    const bx = r.boatPos.x;
    const by = r.boatPos.y;

    ctx.save();
    ctx.translate(bx, by);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Velocities breakdown
    const rad = (r.boatAngle * Math.PI) / 180;
    const vScale = 16;
    const vBoatVec = new Vec2(r.vBoat * Math.cos(rad), r.vBoat * Math.sin(rad));
    const vRiverVec = new Vec2(r.vRiver, 0);
    const vRes = vBoatVec.add(vRiverVec);

    this.drawArrow(bx, by, bx + vBoatVec.x * vScale, by - vBoatVec.y * vScale, '#3b82f6', 'v_barco', 3);
    this.drawArrow(bx, by, bx + vRiverVec.x * vScale, by, '#a855f7', 'v_rio', 3);
    this.drawArrow(bx, by, bx + vRes.x * vScale, by - vRes.y * vScale, '#10b981', 'v_resultante', 4, true);

    const riverUI = document.getElementById('physRiverDisplay');
    if (riverUI) {
      riverUI.textContent = `|v_res| = ${MathFormat.fixed(vRes.mag(), 2)} m/s (θ = ${MathFormat.fixed(vRes.angleDeg(), 1)}°)`;
    }
  }

  // 3. Circular Motion & Centripetal Acceleration
  renderCircularMode() {
    const ctx = this.ctx;
    const c = this.circularState;
    const cx = this.width / 2;
    const cy = this.height / 2;

    // Orbit path
    ctx.beginPath();
    ctx.arc(cx, cy, c.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center pivot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#64748b';
    ctx.fill();

    // Particle position
    const px = cx + c.radius * Math.cos(c.angle);
    const py = cy + c.radius * Math.sin(c.angle);

    // Radius line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Particle
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    // Tangential Velocity v (perpendicular to radius)
    const vMag = 80;
    const vx = -Math.sin(c.angle) * vMag;
    const vy = Math.cos(c.angle) * vMag;
    this.drawArrow(px, py, px + vx, py + vy, '#3b82f6', 'v (tangencial)', 3);

    // Centripetal Acceleration a_c (pointing toward center)
    const aMag = 70;
    const ax = -Math.cos(c.angle) * aMag;
    const ay = -Math.sin(c.angle) * aMag;
    this.drawArrow(px, py, px + ax, py + ay, '#ef4444', 'a_c (hacia el centro)', 3);

    // Orthogonality reminder
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('v · a_c = 0 (Perpendiculares: θ = 90°)', cx, this.height - 25);
  }

  // 4. Mechanical Work (W = F · d)
  renderWorkMode() {
    const ctx = this.ctx;
    const w = this.workState;
    const groundY = this.height - 110;
    const boxW = 55;
    const boxH = 45;
    const bx = w.boxX;
    const by = groundY - boxH;

    // Ground plane
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, groundY);
    ctx.lineTo(this.width - 40, groundY);
    ctx.stroke();

    // Ground hatching
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 40; x < this.width - 40; x += 15) {
      ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x - 10, groundY + 12); ctx.stroke();
    }

    // Displacement vector d
    this.drawArrow(100, groundY + 30, 100 + w.distance * 28, groundY + 30, '#10b981', `d = ${w.distance} m`, 3);

    // Box
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillRect(bx, by, boxW, boxH);
    ctx.strokeRect(bx, by, boxW, boxH);

    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.fillText('Bloque', bx + boxW / 2, by + boxH / 2 + 4);

    // Force vector pulling at angle theta
    const rad = (w.angle * Math.PI) / 180;
    const fLen = w.force * 4.5;
    const fx = Math.cos(rad) * fLen;
    const fy = -Math.sin(rad) * fLen;
    const attachX = bx + boxW;
    const attachY = by + boxH / 2;

    this.drawArrow(attachX, attachY, attachX + fx, attachY + fy, '#3b82f6', `F = ${w.force} N`, 3.5);

    // Angle arc
    ctx.beginPath();
    ctx.arc(attachX, attachY, 35, 0, -rad, true);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f97316';
    ctx.fillText(`θ = ${w.angle}°`, attachX + 48, attachY - 12);

    // Projections of Force: Parallel (W) and Normal
    const fParallel = w.force * Math.cos(rad);
    const fNormal = w.force * Math.sin(rad);
    const totalWork = fParallel * w.distance;

    this.drawArrow(attachX, attachY, attachX + fParallel * 4.5, attachY, '#f97316', `F_x = F cos(θ)`, 2);

    const workUI = document.getElementById('physWorkDisplay');
    if (workUI) {
      workUI.textContent = `W = F · d = (${w.force} N) · (${w.distance} m) · cos(${w.angle}°) = ${MathFormat.fixed(totalWork, 2)} Julios (J)`;
    }
  }

  drawArrow(ox, oy, tx, ty, color, label = '', lineWidth = 2.5, glow = false) {
    const ctx = this.ctx;
    const angle = Math.atan2(ty - oy, tx - ox);
    const headLen = 12;

    ctx.save();
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // Arrow Head
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - headLen * Math.cos(angle - Math.PI / 6), ty - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tx - headLen * Math.cos(angle + Math.PI / 6), ty - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.shadowBlur = 0;
      ctx.font = 'bold 12px "Outfit", sans-serif';
      const midX = (ox + tx) / 2;
      const midY = (oy + ty) / 2;
      const perpX = -Math.sin(angle) * 14;
      const perpY = Math.cos(angle) * 14;
      ctx.textAlign = 'center';
      ctx.fillText(label, midX + perpX, midY + perpY + 4);
    }

    ctx.restore();
  }
}

window.PhysicsSimManager = PhysicsSimManager;
