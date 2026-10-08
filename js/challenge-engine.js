/**
 * VECTORES LAB - Final Laboratory Challenge Engine (Section 23)
 * 7-Step Guided Physical Scenario:
 * 1. Identificar vectores
 * 2. Obtener componentes rectangulares
 * 3. Sumar mediante método del polígono
 * 4. Comprobar analíticamente por componentes
 * 5. Calcular la magnitud de la resultante
 * 6. Calcular su dirección con atan2
 * 7. Interpretar físicamente el resultado (a = F_net / m)
 */

class ChallengeEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentStep = 1; // 1 to 7
    this.problem = null;
    this.userAnswers = {};
    this.stepFeedback = {};
    this.showFullSolution = false;

    this.generateNewProblem();
  }

  generateNewProblem() {
    // Generate clean values: Tugboats pulling a ship
    const mass = 10000; // 10,000 kg
    const f1Mag = (Math.floor(Math.random() * 4) + 3) * 10; // 30, 40, 50, 60 kN
    const f1Angle = 30; // deg
    const f2Mag = (Math.floor(Math.random() * 3) + 2) * 10; // 20, 30, 40 kN
    const f2Angle = -45; // deg

    const rad1 = (f1Angle * Math.PI) / 180;
    const rad2 = (f2Angle * Math.PI) / 180;

    const f1x = f1Mag * Math.cos(rad1);
    const f1y = f1Mag * Math.sin(rad1);

    const f2x = f2Mag * Math.cos(rad2);
    const f2y = f2Mag * Math.sin(rad2);

    const rx = f1x + f2x;
    const ry = f1y + f2y;
    const rMag = Math.sqrt(rx * rx + ry * ry);
    const rAngle = (Math.atan2(ry, rx) * 180) / Math.PI;
    const accel = (rMag * 1000) / mass; // m/s²

    this.problem = {
      mass,
      f1Mag,
      f1Angle,
      f2Mag,
      f2Angle,
      f1x: Number(f1x.toFixed(2)),
      f1y: Number(f1y.toFixed(2)),
      f2x: Number(f2x.toFixed(2)),
      f2y: Number(f2y.toFixed(2)),
      rx: Number(rx.toFixed(2)),
      ry: Number(ry.toFixed(2)),
      rMag: Number(rMag.toFixed(2)),
      rAngle: Number(rAngle.toFixed(2)),
      accel: Number(accel.toFixed(2))
    };

    this.userAnswers = {
      f1x: '',
      f1y: '',
      f2x: '',
      f2y: '',
      rx: '',
      ry: '',
      rMag: '',
      rAngle: '',
      accel: ''
    };

    this.stepFeedback = {};
    this.currentStep = 1;
    this.showFullSolution = false;
    this.render();
  }

  goToStep(stepNum) {
    this.currentStep = Math.max(1, Math.min(7, stepNum));
    this.render();
  }

  toggleFullSolution() {
    this.showFullSolution = !this.showFullSolution;
    this.render();
  }

  checkCurrentStep() {
    const p = this.problem;
    const isClose = (val, target, tol = 0.5) => {
      if (val === '' || isNaN(Number(val))) return false;
      return Math.abs(Number(val) - target) <= tol;
    };

    if (this.currentStep === 2) {
      const ok1 = isClose(this.userAnswers.f1x, p.f1x) && isClose(this.userAnswers.f1y, p.f1y);
      const ok2 = isClose(this.userAnswers.f2x, p.f2x) && isClose(this.userAnswers.f2y, p.f2y);
      this.stepFeedback[2] = {
        correct: ok1 && ok2,
        msg: ok1 && ok2 ? '¡Excelente descomposición! Has calculado las componentes rectangulares correctamente.' : 'Revisa tus cálculos: recuerda usar Fx = F·cos(θ) y Fy = F·sin(θ) considerando el signo del ángulo.'
      };
      if (ok1 && ok2) this.currentStep = 3;
    } else if (this.currentStep === 4) {
      const ok = isClose(this.userAnswers.rx, p.rx) && isClose(this.userAnswers.ry, p.ry);
      this.stepFeedback[4] = {
        correct: ok,
        msg: ok ? '¡Suma analítica exacta! Rx = F1x + F2x y Ry = F1y + F2y coinciden a la perfección.' : 'Revisa la suma por componentes: suma término a término con sus signos algebraicos.'
      };
      if (ok) this.currentStep = 5;
    } else if (this.currentStep === 5) {
      const ok = isClose(this.userAnswers.rMag, p.rMag, 0.8);
      this.stepFeedback[5] = {
        correct: ok,
        msg: ok ? '¡Magnitud correcta! Calculada mediante Pitágoras |R| = √(Rx² + Ry²).' : 'Verifica: |R| = √(Rx² + Ry²). Eleva cada componente al cuadrado y suma antes de extraer la raíz.'
      };
      if (ok) this.currentStep = 6;
    } else if (this.currentStep === 6) {
      const ok = isClose(this.userAnswers.rAngle, p.rAngle, 1.5);
      this.stepFeedback[6] = {
        correct: ok,
        msg: ok ? '¡Dirección exacta! θ = atan2(Ry, Rx) determina el ángulo sin ambigüedad.' : 'Revisa el cálculo: θ = arctan(Ry / Rx). Toma en cuenta los signos de Rx y Ry.'
      };
      if (ok) this.currentStep = 7;
    } else if (this.currentStep === 7) {
      const ok = isClose(this.userAnswers.accel, p.accel, 0.2);
      this.stepFeedback[7] = {
        correct: ok,
        msg: ok ? '¡Interpretación física impecable! Has aplicado a = F_net / m y determinado la aceleración real del buque.' : 'Recuerda: 1 kN = 1000 N. Por la 2ª Ley de Newton, a = (R en Newtons) / (10,000 kg).'
      };
    }
    this.render();
  }

  render() {
    if (!this.container || !this.problem) return;
    const p = this.problem;

    // Stepper navigation bubbles (1 to 7)
    let stepperHtml = '';
    const stepLabels = [
      '1. Identificar',
      '2. Componentes',
      '3. Polígono',
      '4. Suma Analítica',
      '5. Módulo |R|',
      '6. Dirección θ',
      '7. Física a=F/m'
    ];

    for (let i = 1; i <= 7; i++) {
      let cls = '';
      if (i === this.currentStep) cls = 'active';
      else if (i < this.currentStep) cls = 'completed';

      stepperHtml += `
        <div class="stepper-circle ${cls}" onclick="window.challengeApp.goToStep(${i})" title="${stepLabels[i-1]}">
          ${i}
        </div>
      `;
    }

    let stepBodyHtml = '';
    const fb = this.stepFeedback[this.currentStep];
    const feedbackBox = fb ? `
      <div class="quiz-explanation ${fb.correct ? 'alert-success' : 'alert-danger'}">
        <strong>${fb.correct ? '✓ Correcto' : '⚠️ Atención'}</strong>
        <p style="margin-top:0.3rem;">${fb.msg}</p>
      </div>
    ` : '';

    if (this.currentStep === 1) {
      stepBodyHtml = `
        <div class="challenge-step-title">
          <span>🚢</span> Paso 1: Situación Física e Identificación de Vectores
        </div>
        <p>
          Dos remolcadores tiran de un buque portacontenedores de masa <strong>M = ${p.mass.toLocaleString()} kg</strong> para guiarlo a lo largo del canal de acceso al puerto:
        </p>
        <div class="math-display-card">
          <div class="math-row">
            <span style="color:var(--vec-a); font-weight:700;">Remolcador 1 (Fuerza F₁):</span>
            <span>Magnitud |F₁| = <strong>${p.f1Mag} kN</strong> con ángulo <strong>θ₁ = +${p.f1Angle}°</strong> (babor / norte)</span>
          </div>
          <div class="math-row">
            <span style="color:var(--vec-b); font-weight:700;">Remolcador 2 (Fuerza F₂):</span>
            <span>Magnitud |F₂| = <strong>${p.f2Mag} kN</strong> con ángulo <strong>θ₂ = ${p.f2Angle}°</strong> (estribor / sur)</span>
          </div>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem;">
          💡 <em>Ambas fuerzas actúan concurrentemente sobre el buque en el origen O = (0,0).</em>
        </p>
        <button class="btn btn-primary" onclick="window.challengeApp.goToStep(2)">
          Continuar al Paso 2: Descomposición →
        </button>
      `;
    } else if (this.currentStep === 2) {
      stepBodyHtml = `
        <div class="challenge-step-title">
          <span>📐</span> Paso 2: Descomposición en Componentes Rectangulares
        </div>
        <p>Calcula las componentes cartesianas de cada fuerza en <strong>kilonewtons (kN)</strong>:</p>
        <div class="challenge-input-row">
          <div class="input-field-group">
            <label style="color:var(--vec-a)">F₁x = |F₁| cos(θ₁):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="kN" value="${this.userAnswers.f1x}" onchange="window.challengeApp.userAnswers.f1x = this.value">
          </div>
          <div class="input-field-group">
            <label style="color:var(--vec-a)">F₁y = |F₁| sin(θ₁):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="kN" value="${this.userAnswers.f1y}" onchange="window.challengeApp.userAnswers.f1y = this.value">
          </div>
        </div>
        <div class="challenge-input-row" style="margin-top:0.6rem;">
          <div class="input-field-group">
            <label style="color:var(--vec-b)">F₂x = |F₂| cos(θ₂):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="kN" value="${this.userAnswers.f2x}" onchange="window.challengeApp.userAnswers.f2x = this.value">
          </div>
          <div class="input-field-group">
            <label style="color:var(--vec-b)">F₂y = |F₂| sin(θ₂):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="kN" value="${this.userAnswers.f2y}" onchange="window.challengeApp.userAnswers.f2y = this.value">
          </div>
        </div>
        ${feedbackBox}
        <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="window.challengeApp.checkCurrentStep()">
          Comprobar Componentes
        </button>
      `;
    } else if (this.currentStep === 3) {
      stepBodyHtml = `
        <div class="challenge-step-title">
          <span>🧩</span> Paso 3: Suma Gráfica por el Método del Polígono
        </div>
        <p>
          En el método cabeza a cola, trasladamos paralelamente el vector <strong>F₂</strong> hasta que su origen coincida con el extremo de <strong>F₁</strong>:
        </p>
        <div class="math-display-card">
          <div class="math-row">
            <span>Origen de F₁:</span>
            <span>(0, 0)</span>
          </div>
          <div class="math-row">
            <span>Punta de F₁:</span>
            <span>(${p.f1x}, ${p.f1y}) kN</span>
          </div>
          <div class="math-row">
            <span>Punta de F₂ (Extremo final del polígono):</span>
            <span>(${p.f1x} + ${p.f2x}, ${p.f1y} + ${p.f2y}) = <strong>(${p.rx}, ${p.ry}) kN</strong></span>
          </div>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem;">
          El vector resultante <strong>R</strong> se traza uniendo el origen libre (0,0) con el punto final (${p.rx}, ${p.ry}) kN.
        </p>
        <button class="btn btn-primary" onclick="window.challengeApp.goToStep(4)">
          Continuar al Paso 4: Comprobación Analítica →
        </button>
      `;
    } else if (this.currentStep === 4) {
      stepBodyHtml = `
        <div class="challenge-step-title">
          <span>∑</span> Paso 4: Comprobación Analítica por Componentes
        </div>
        <p>Suma algebraicamente las componentes de ambas fuerzas para obtener el vector fuerza neta <strong>R</strong>:</p>
        <div class="challenge-input-row">
          <div class="input-field-group">
            <label>Rx = F₁x + F₂x (kN):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="kN" value="${this.userAnswers.rx}" onchange="window.challengeApp.userAnswers.rx = this.value">
          </div>
          <div class="input-field-group">
            <label>Ry = F₁y + F₂y (kN):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="kN" value="${this.userAnswers.ry}" onchange="window.challengeApp.userAnswers.ry = this.value">
          </div>
        </div>
        ${feedbackBox}
        <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="window.challengeApp.checkCurrentStep()">
          Comprobar Suma Analítica
        </button>
      `;
    } else if (this.currentStep === 5) {
      stepBodyHtml = `
        <div class="challenge-step-title">
          <span>📏</span> Paso 5: Cálculo del Módulo de la Fuerza Resultante (|R|)
        </div>
        <p>
          Con Rx = ${p.rx} kN y Ry = ${p.ry} kN, calcula la magnitud total de la fuerza mediante el teorema de Pitágoras:
          <code>|R| = √(Rx² + Ry²)</code>
        </p>
        <div class="challenge-input-row">
          <div class="input-field-group">
            <label>Magnitud |R| en kilonewtons (kN):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="kN" value="${this.userAnswers.rMag}" onchange="window.challengeApp.userAnswers.rMag = this.value">
          </div>
        </div>
        ${feedbackBox}
        <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="window.challengeApp.checkCurrentStep()">
          Comprobar Magnitud
        </button>
      `;
    } else if (this.currentStep === 6) {
      stepBodyHtml = `
        <div class="challenge-step-title">
          <span>🧭</span> Paso 6: Cálculo de la Dirección (Ángulo θ)
        </div>
        <p>
          Determina el ángulo de inclinación de la fuerza neta respecto al eje horizontal del canal (+X):
          <code>θ = atan2(Ry, Rx)</code>
        </p>
        <div class="challenge-input-row">
          <div class="input-field-group">
            <label>Ángulo θ en grados (°):</label>
            <input type="number" step="0.1" class="challenge-input-field" placeholder="grados" value="${this.userAnswers.rAngle}" onchange="window.challengeApp.userAnswers.rAngle = this.value">
          </div>
        </div>
        ${feedbackBox}
        <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="window.challengeApp.checkCurrentStep()">
          Comprobar Dirección
        </button>
      `;
    } else if (this.currentStep === 7) {
      stepBodyHtml = `
        <div class="challenge-step-title">
          <span>⚙️</span> Paso 7: Interpretación Física del Movimiento
        </div>
        <p>
          El buque tiene masa <strong>M = ${p.mass.toLocaleString()} kg</strong>. De acuerdo con la Segunda Ley de Newton:
          <code>ΣF = M · a ⟹ a = |R| / M</code>
          Convierte la fuerza resultante |R| = ${p.rMag} kN a Newtons (× 1000) y calcula la aceleración que experimenta el buque:
        </p>
        <div class="challenge-input-row">
          <div class="input-field-group">
            <label>Aceleración 'a' en m/s²:</label>
            <input type="number" step="0.01" class="challenge-input-field" placeholder="m/s²" value="${this.userAnswers.accel}" onchange="window.challengeApp.userAnswers.accel = this.value">
          </div>
        </div>
        ${feedbackBox}
        <div class="math-display-card" style="margin-top:0.75rem;">
          <div class="math-row">
            <span>Interpretación náutica:</span>
            <span style="color:var(--text-main);">
              El buque avanza hacia adelante a lo largo del canal con una ligera desviación angular de <strong>${p.rAngle}°</strong>.
            </span>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem; margin-top:0.75rem; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="window.challengeApp.checkCurrentStep()">
            Comprobar Aceleración
          </button>
          <button class="btn btn-outline" onclick="window.challengeApp.toggleFullSolution()">
            ${this.showFullSolution ? 'Ocultar Solución Detallada' : '👁 Ver Solución Completa Paso a Paso'}
          </button>
        </div>
      `;
    }

    let solutionBoxHtml = '';
    if (this.showFullSolution) {
      solutionBoxHtml = `
        <div class="challenge-step-explanation" style="margin-top:1.25rem;">
          <h4 style="color:var(--primary); margin-bottom:0.6rem;">📘 Solución Analítica Completa Paso a Paso:</h4>
          <ol style="margin-left:1.2rem; line-height:1.7;">
            <li><strong>F₁:</strong> F₁x = ${p.f1Mag} · cos(30°) = ${p.f1x} kN; F₁y = ${p.f1Mag} · sin(30°) = ${p.f1y} kN</li>
            <li><strong>F₂:</strong> F₂x = ${p.f2Mag} · cos(-45°) = ${p.f2x} kN; F₂y = ${p.f2Mag} · sin(-45°) = ${p.f2y} kN</li>
            <li><strong>Resultante:</strong> Rx = ${p.f1x} + ${p.f2x} = <strong>${p.rx} kN</strong>; Ry = ${p.f1y} + (${p.f2y}) = <strong>${p.ry} kN</strong></li>
            <li><strong>Magnitud:</strong> |R| = √(${p.rx}² + ${p.ry}²) = <strong>${p.rMag} kN</strong> (${(p.rMag * 1000).toLocaleString()} N)</li>
            <li><strong>Dirección:</strong> θ = atan2(${p.ry}, ${p.rx}) = <strong>${p.rAngle}°</strong></li>
            <li><strong>Aceleración:</strong> a = ${(p.rMag * 1000).toLocaleString()} N / ${p.mass.toLocaleString()} kg = <strong>${p.accel} m/s²</strong> en la dirección θ = ${p.rAngle}°.</li>
          </ol>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="challenge-journey-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="font-size:1.3rem;">Desafío del Laboratorio: Operación de Remolcadores</h3>
          <button class="btn btn-outline btn-sm" onclick="window.challengeApp.generateNewProblem()">
            🔄 Generar Nuevo Reto Físico
          </button>
        </div>

        <div class="challenge-step-stepper">
          ${stepperHtml}
        </div>

        <div class="challenge-step-content">
          ${stepBodyHtml}
          ${solutionBoxHtml}
        </div>
      </div>
    `;
  }
}

window.ChallengeEngine = ChallengeEngine;
