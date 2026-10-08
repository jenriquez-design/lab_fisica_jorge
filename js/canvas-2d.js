/**
 * VECTORES LAB - High-Performance 2D Vector Canvas Renderer
 * Supports interactive dragging (mouse & touch), coordinate grid, zoom, pan,
 * vector arrows, angle arcs, projections, and animations.
 *
 * Color Specification:
 * - 🔵 Vector A: #3b82f6
 * - 🟣 Vector B: #a855f7
 * - 🟢 Vector Resultante: #10b981
 * - 🟠 Componentes / Proyecciones: #f97316
 * - 🔴 Ejes, referencias: #ef4444
 */

class VectorCanvas2D {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`Canvas with id ${canvasId} not found.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');

    // Scale and coordinate system configuration
    this.baseRange = options.range || 10;
    this.range = this.baseRange;
    this.zoomLevel = 1.0;
    this.panOffset = { x: 0, y: 0 };
    this.snapToGrid = options.snapToGrid !== undefined ? options.snapToGrid : true;
    this.gridStep = options.gridStep || 1;
    this.showGrid = options.showGrid !== undefined ? options.showGrid : true;
    this.showProjections = options.showProjections !== undefined ? options.showProjections : true;
    this.showAngles = options.showAngles !== undefined ? options.showAngles : true;
    this.showLabels = options.showLabels !== undefined ? options.showLabels : true;
    this.lockOrigin = options.lockOrigin !== undefined ? options.lockOrigin : true;

    // Vectors collection: array of { id, name, color, origin: Vec2, vec: Vec2, draggable: bool, dashed: bool, isResultant: bool }
    this.vectors = [];

    // Interaction state
    this.draggingTarget = null; // { vectorIndex, handle: 'tip' | 'origin' }
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.hoverTarget = null;
    this.onUpdateCallback = null;

    // Responsive setup
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Event listeners
    this.setupEvents();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 500;
    this.height = rect.height || 400;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);

    // Calculate scale factor: pixels per math unit
    this.unitPx = (Math.min(this.width, this.height) / (this.range * 2.2)) * this.zoomLevel;
    this.originPx = {
      x: this.width / 2 + this.panOffset.x,
      y: this.height / 2 + this.panOffset.y
    };

    this.render();
  }

  zoomIn() {
    this.zoomLevel = Math.min(2.5, this.zoomLevel * 1.2);
    this.resize();
  }

  zoomOut() {
    this.zoomLevel = Math.max(0.4, this.zoomLevel / 1.2);
    this.resize();
  }

  resetView() {
    this.zoomLevel = 1.0;
    this.panOffset = { x: 0, y: 0 };
    this.resize();
  }

  // Coordinate transformations
  mathToPixel(v) {
    return {
      x: this.originPx.x + v.x * this.unitPx,
      y: this.originPx.y - v.y * this.unitPx // canvas Y is inverted
    };
  }

  pixelToMath(px, py) {
    let mx = (px - this.originPx.x) / this.unitPx;
    let my = (this.originPx.y - py) / this.unitPx;

    if (this.snapToGrid) {
      mx = Math.round(mx / this.gridStep) * this.gridStep;
      my = Math.round(my / this.gridStep) * this.gridStep;
    }

    return new Vec2(
      Math.max(-25, Math.min(25, mx)),
      Math.max(-25, Math.min(25, my))
    );
  }

  setupEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const findTarget = (pos) => {
      const threshold = 18; // hit tolerance in px
      for (let i = this.vectors.length - 1; i >= 0; i--) {
        const v = this.vectors[i];
        if (!v.draggable) continue;

        const tipPos = this.mathToPixel(v.origin.add(v.vec));
        const distTip = Math.hypot(pos.x - tipPos.x, pos.y - tipPos.y);
        if (distTip < threshold) {
          return { vectorIndex: i, handle: 'tip' };
        }

        if (!this.lockOrigin && !v.lockOrigin) {
          const originPos = this.mathToPixel(v.origin);
          const distOrigin = Math.hypot(pos.x - originPos.x, pos.y - originPos.y);
          if (distOrigin < threshold) {
            return { vectorIndex: i, handle: 'origin' };
          }
        }
      }
      return null;
    };

    const handlePointerDown = (e) => {
      const pos = getPos(e);
      // Right-click or middle-click or alt-click for Pan
      if (e.button === 2 || e.button === 1 || e.altKey) {
        this.isPanning = true;
        this.panStart = { x: pos.x - this.panOffset.x, y: pos.y - this.panOffset.y };
        e.preventDefault();
        return;
      }

      const target = findTarget(pos);
      if (target) {
        this.draggingTarget = target;
        this.canvas.style.cursor = 'grabbing';
        e.preventDefault();
      }
    };

    const handlePointerMove = (e) => {
      const pos = getPos(e);
      if (this.isPanning) {
        this.panOffset.x = pos.x - this.panStart.x;
        this.panOffset.y = pos.y - this.panStart.y;
        this.resize();
        return;
      }

      if (this.draggingTarget) {
        e.preventDefault();
        const v = this.vectors[this.draggingTarget.vectorIndex];
        const mathCoord = this.pixelToMath(pos.x, pos.y);

        if (this.draggingTarget.handle === 'tip') {
          v.vec = mathCoord.sub(v.origin);
        } else if (this.draggingTarget.handle === 'origin') {
          v.origin = mathCoord;
        }

        this.render();
        if (this.onUpdateCallback) this.onUpdateCallback(v, this.draggingTarget);
      } else {
        const target = findTarget(pos);
        this.hoverTarget = target;
        this.canvas.style.cursor = target ? 'grab' : 'crosshair';
      }
    };

    const handlePointerUp = () => {
      this.draggingTarget = null;
      this.isPanning = false;
      this.canvas.style.cursor = this.hoverTarget ? 'grab' : 'crosshair';
    };

    this.canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    // Mouse wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    }, { passive: false });
  }

  // Draw Cartesian Grid
  drawGrid() {
    const ctx = this.ctx;
    const isDark = !document.body.classList.contains('light-theme');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const axisColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.45)';
    const textColor = isDark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(71, 85, 105, 0.85)';

    ctx.save();
    ctx.lineWidth = 1;

    const visibleRange = Math.ceil(this.range / this.zoomLevel) + 2;

    if (this.showGrid) {
      ctx.strokeStyle = gridColor;
      for (let x = -visibleRange; x <= visibleRange; x += this.gridStep) {
        const p1 = this.mathToPixel(new Vec2(x, -visibleRange));
        ctx.beginPath();
        ctx.moveTo(p1.x, 0);
        ctx.lineTo(p1.x, this.height);
        ctx.stroke();
      }
      for (let y = -visibleRange; y <= visibleRange; y += this.gridStep) {
        const p1 = this.mathToPixel(new Vec2(-visibleRange, y));
        ctx.beginPath();
        ctx.moveTo(0, p1.y);
        ctx.lineTo(this.width, p1.y);
        ctx.stroke();
      }
    }

    // Main Axes X and Y
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, this.originPx.y);
    ctx.lineTo(this.width, this.originPx.y);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(this.originPx.x, 0);
    ctx.lineTo(this.originPx.x, this.height);
    ctx.stroke();

    // Axis Arrows in Coral Red (#ef4444)
    this.drawSmallArrow(this.width - 6, this.originPx.y, 0, '#ef4444');
    this.drawSmallArrow(this.originPx.x, 6, -Math.PI / 2, '#ef4444');

    // Axis Labels
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'right';
    ctx.fillText('X', this.width - 12, this.originPx.y - 8);
    ctx.fillText('Y', this.originPx.x + 18, 16);

    // Numeric Ticks (every 2 units to prevent clutter)
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = textColor;
    for (let i = -visibleRange; i <= visibleRange; i += 2) {
      if (i === 0) continue;
      const pX = this.mathToPixel(new Vec2(i, 0));
      const pY = this.mathToPixel(new Vec2(0, i));

      // X tick mark
      if (pX.x >= 0 && pX.x <= this.width) {
        ctx.beginPath();
        ctx.moveTo(pX.x, this.originPx.y - 3);
        ctx.lineTo(pX.x, this.originPx.y + 3);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), pX.x, this.originPx.y + 14);
      }

      // Y tick mark
      if (pY.y >= 0 && pY.y <= this.height) {
        ctx.beginPath();
        ctx.moveTo(this.originPx.x - 3, pY.y);
        ctx.lineTo(this.originPx.x + 3, pY.y);
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillText(i.toString(), this.originPx.x - 8, pY.y + 3);
      }
    }

    // Origin (0,0) label
    ctx.textAlign = 'right';
    ctx.fillText('0', this.originPx.x - 6, this.originPx.y + 14);

    ctx.restore();
  }

  drawSmallArrow(x, y, angle, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-7, -4);
    ctx.lineTo(-7, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw vector projection components Ax and Ay (Color Naranja: #f97316)
  drawVectorProjections(origin, vec, color) {
    const ctx = this.ctx;
    const isDark = !document.body.classList.contains('light-theme');
    const compColor = '#f97316'; // Orange for components per spec
    const pOrigin = this.mathToPixel(origin);
    const pCorner = this.mathToPixel(new Vec2(origin.x + vec.x, origin.y));
    const pTip = this.mathToPixel(origin.add(vec));

    ctx.save();
    ctx.lineWidth = 1.75;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = compColor;
    ctx.globalAlpha = 0.75;

    // Horizontal projection line from origin to (x+Ax, y)
    ctx.beginPath();
    ctx.moveTo(pOrigin.x, pOrigin.y);
    ctx.lineTo(pCorner.x, pCorner.y);
    ctx.stroke();

    // Vertical projection line from (x+Ax, y) to tip
    ctx.beginPath();
    ctx.moveTo(pCorner.x, pCorner.y);
    ctx.lineTo(pTip.x, pTip.y);
    ctx.stroke();

    // Projection dashed drop to axes if origin is (0,0)
    if (origin.x === 0 && origin.y === 0) {
      const pYAxis = this.mathToPixel(new Vec2(0, vec.y));
      ctx.beginPath();
      ctx.moveTo(pTip.x, pTip.y);
      ctx.lineTo(pYAxis.x, pYAxis.y);
      ctx.stroke();
    }

    // Component magnitude labels
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = compColor;

    // Label for Ax
    const midX = (pOrigin.x + pCorner.x) / 2;
    ctx.textAlign = 'center';
    ctx.fillText(`${vec.x > 0 ? '+' : ''}${MathFormat.fixed(vec.x, 1)}`, midX, pOrigin.y + (vec.y >= 0 ? 14 : -6));

    // Label for Ay
    const midY = (pCorner.y + pTip.y) / 2;
    ctx.textAlign = vec.x >= 0 ? 'left' : 'right';
    ctx.fillText(`${vec.y > 0 ? '+' : ''}${MathFormat.fixed(vec.y, 1)}`, pCorner.x + (vec.x >= 0 ? 8 : -8), midY);

    ctx.restore();
  }

  // Draw angle arc
  drawAngleArc(origin, vec, color) {
    if (vec.mag() < 0.2) return;
    const ctx = this.ctx;
    const pOrigin = this.mathToPixel(origin);
    const radius = Math.min(36, vec.mag() * this.unitPx * 0.45);
    let startAngle = 0; // along positive X axis (0 radians)
    let endAngle = -vec.angleRad(); // inverted canvas Y

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.fillStyle = color.replace(')', ', 0.15)').replace('rgb', 'rgba');

    ctx.beginPath();
    ctx.moveTo(pOrigin.x, pOrigin.y);
    // Draw arc
    ctx.arc(pOrigin.x, pOrigin.y, radius, startAngle, endAngle, vec.y > 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Angle label text
    const midAngle = -vec.angleRad() / 2;
    const labelDist = radius + 15;
    const lx = pOrigin.x + labelDist * Math.cos(midAngle);
    const ly = pOrigin.y + labelDist * Math.sin(midAngle);

    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(`${MathFormat.fixed(vec.angleDeg(), 1)}°`, lx, ly + 4);

    ctx.restore();
  }

  // Draw single vector arrow
  drawVectorArrow(vObj) {
    const ctx = this.ctx;
    const origin = vObj.origin || new Vec2(0, 0);
    const vec = vObj.vec;
    const color = vObj.color || '#3b82f6';
    const isResultant = !!vObj.isResultant;
    const pOrigin = this.mathToPixel(origin);
    const pTip = this.mathToPixel(origin.add(vec));

    if (vec.mag() === 0) return;

    ctx.save();

    // Glow or shadow for resultant or main vectors
    if (isResultant) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = isResultant ? 3.8 : 3.0;

    if (vObj.dashed) {
      ctx.setLineDash([6, 4]);
    }

    const angle = Math.atan2(pTip.y - pOrigin.y, pTip.x - pOrigin.x);
    const headLen = isResultant ? 16 : 13;

    // Vector line
    const shaftEndX = pTip.x - (headLen - 2) * Math.cos(angle);
    const shaftEndY = pTip.y - (headLen - 2) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(pOrigin.x, pOrigin.y);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vector Arrow Head
    ctx.beginPath();
    ctx.moveTo(pTip.x, pTip.y);
    ctx.lineTo(
      pTip.x - headLen * Math.cos(angle - Math.PI / 7),
      pTip.y - headLen * Math.sin(angle - Math.PI / 7)
    );
    ctx.lineTo(
      pTip.x - (headLen * 0.7) * Math.cos(angle),
      pTip.y - (headLen * 0.7) * Math.sin(angle)
    );
    ctx.lineTo(
      pTip.x - headLen * Math.cos(angle + Math.PI / 7),
      pTip.y - headLen * Math.sin(angle + Math.PI / 7)
    );
    ctx.closePath();
    ctx.fill();

    // Draggable Handle on Tip
    if (vObj.draggable) {
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(pTip.x, pTip.y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    // Origin point circle
    ctx.beginPath();
    ctx.arc(pOrigin.x, pOrigin.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Label with badge
    if (this.showLabels && vObj.name) {
      const midX = (pOrigin.x + pTip.x) / 2;
      const midY = (pOrigin.y + pTip.y) / 2;
      const perpX = -Math.sin(angle) * 18;
      const perpY = Math.cos(angle) * 18;

      ctx.shadowBlur = 0;
      ctx.font = 'bold 14px "Outfit", sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(vObj.name, midX + perpX, midY + perpY + 4);
    }

    ctx.restore();
  }

  // Master Render Loop
  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Cartesian coordinate grid & axes
    this.drawGrid();

    // Draw projections
    if (this.showProjections) {
      for (const v of this.vectors) {
        if (v.showProjections !== false && !v.isResultant) {
          this.drawVectorProjections(v.origin || new Vec2(0, 0), v.vec, v.color);
        }
      }
    }

    // Draw angle arcs
    if (this.showAngles) {
      for (const v of this.vectors) {
        if (v.showAngle !== false && !v.isResultant) {
          this.drawAngleArc(v.origin || new Vec2(0, 0), v.vec, v.color);
        }
      }
    }

    // Custom background decorations (parallelograms, guides, etc.)
    if (this.onCustomRender) {
      this.onCustomRender(this.ctx);
    }

    // Draw all vector arrows
    for (const v of this.vectors) {
      this.drawVectorArrow(v);
    }
  }

  // Helper to add or update vector
  setVector(id, { name, color, origin = new Vec2(0, 0), vec, draggable = true, isResultant = false, dashed = false, showProjections = true, showAngle = true }) {
    const idx = this.vectors.findIndex(v => v.id === id);
    const item = { id, name, color, origin, vec, draggable, isResultant, dashed, showProjections, showAngle };
    if (idx >= 0) {
      this.vectors[idx] = item;
    } else {
      this.vectors.push(item);
    }
    this.render();
  }

  getVector(id) {
    return this.vectors.find(v => v.id === id);
  }

  removeVector(id) {
    this.vectors = this.vectors.filter(v => v.id !== id);
    this.render();
  }

  clearVectors() {
    this.vectors = [];
    this.render();
  }
}

window.VectorCanvas2D = VectorCanvas2D;
