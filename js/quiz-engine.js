/**
 * VECTORES LAB - Multi-Level Interactive Quiz Engine
 * Features 4 difficulty tiers: Conceptual, Calculation, Application, and Physics.
 * Includes detailed mathematical step-by-step procedural explanations,
 * quadrant/sign rigor, and unit tracking.
 */

const ALL_QUIZ_QUESTIONS = [
  // ==========================================
  // NIVEL 1: CONCEPTUAL
  // ==========================================
  {
    id: 1,
    level: 1,
    levelName: "Nivel 1 — Conceptual",
    topic: "Escalares vs Vectores",
    question: "¿Cuál de las siguientes magnitudes físicas es estrictamente VECTORIAL y requiere especificar dirección y sentido además de su magnitud?",
    options: [
      "La masa de un cuerpo (ej. 10 kg) y la temperatura de un gas (ej. 300 K)",
      "El desplazamiento efectuado por un vehículo y la fuerza gravitacional",
      "El tiempo transcurrido en un experimento y la energía cinética",
      "La distancia total recorrida sobre una trayectoria sinuosa"
    ],
    answer: 1,
    explanation: "El desplazamiento y la fuerza son magnitudes vectoriales porque su efecto depende intrínsecamente de la recta sobre la que actúan (dirección) y hacia dónde apuntan (sentido). La masa, temperatura, tiempo, energía y distancia son magnitudes escalares que quedan completas con un número y su unidad."
  },
  {
    id: 2,
    level: 1,
    levelName: "Nivel 1 — Conceptual",
    topic: "Dirección vs Sentido",
    question: "En cinemática vectorial, ¿cuál es la diferencia geométrica fundamental entre la 'dirección' y el 'sentido' de un vector?",
    options: [
      "No existe diferencia: son sinónimos exactos en física clásica.",
      "La dirección es la recta de acción (o ángulo de inclinación), mientras que el sentido indica cuál de las dos orientaciones sobre esa recta sigue la saeta.",
      "La dirección indica la longitud del vector, mientras que el sentido es su origen.",
      "La dirección depende del marco de referencia pero el sentido no."
    ],
    answer: 1,
    explanation: "Una recta en el espacio determina una única DIRECCIÓN (por ejemplo, el eje horizontal a 0°/180°). Sobre esa misma recta existen dos SENTIDOS opuestos posibles: hacia el Este (+) o hacia el Oeste (-)."
  },
  {
    id: 3,
    level: 1,
    levelName: "Nivel 1 — Conceptual",
    topic: "Vector Unitario",
    question: "Si se tiene un vector no nulo A, su vector unitario û = A / |A| cumple que:",
    options: [
      "Su magnitud es siempre igual a cero y su dirección es indefinida.",
      "Tiene magnitud adimensional igual a 1 y conserva exactamente la dirección y el sentido de A.",
      "Posee las mismas unidades físicas que A (ej. Newtons o metros).",
      "Su ángulo con el eje X es siempre 0° independientemente de A."
    ],
    answer: 1,
    explanation: "Un vector unitario se obtiene dividiendo el vector entre su propio módulo: |û| = |A| / |A| = 1. Es adimensional y sirve para aislar e indicar la orientación espacial sin aportar magnitud numérica."
  },
  {
    id: 4,
    level: 1,
    levelName: "Nivel 1 — Conceptual",
    topic: "Multiplicación por Escalar Negativo",
    question: "Si multiplicamos un vector de velocidad v por un escalar k = -2, ¿cómo se transforma el nuevo vector resultante kv?",
    options: [
      "Su rapidez se reduce a la mitad y mantiene el mismo sentido.",
      "Su magnitud se duplica (|kv| = 2|v|) y su sentido se invierte 180°.",
      "El vector rota 90° convirtiéndose en una aceleración.",
      "La magnitud se vuelve negativa: |-2v| = -2|v|."
    ],
    answer: 1,
    explanation: "La magnitud siempre es estrictamente positiva: |k·v| = |k|·|v| = |-2|·|v| = 2|v| (se duplica). El signo negativo del escalar k < 0 invierte el sentido de la saeta en exactamente 180°."
  },

  // ==========================================
  // NIVEL 2: CÁLCULO
  // ==========================================
  {
    id: 5,
    level: 2,
    levelName: "Nivel 2 — Cálculo",
    topic: "Magnitud 2D",
    question: "Dado el vector A = (3, 4) en metros, ¿cuál es su magnitud o módulo |A|?",
    options: [
      "|A| = 7 m",
      "|A| = 5 m",
      "|A| = 1 m",
      "|A| = 25 m"
    ],
    answer: 1,
    explanation: "Por el Teorema de Pitágoras: |A| = √(Ax² + Ay²) = √(3² + 4²) = √(9 + 16) = √25 = 5 m. Nótese que nunca se deben sumar directamente las magnitudes algebraicas 3 + 4 = 7."
  },
  {
    id: 6,
    level: 2,
    levelName: "Nivel 2 — Cálculo",
    topic: "Ángulo y Cuadrantes (atan2)",
    question: "Para el vector B = (-4, 4) m, ¿cuál es su dirección angular θ medida desde el eje X positivo en sentido antihorario?",
    options: [
      "θ = -45° (IV Cuadrante)",
      "θ = 45° (I Cuadrante)",
      "θ = 135° (II Cuadrante)",
      "θ = 225° (III Cuadrante)"
    ],
    answer: 2,
    explanation: "Como Bx = -4 < 0 y By = 4 > 0, el vector se encuentra en el II Cuadrante. Aplicando la función rigurosa de cuadrantes: θ = atan2(By, Bx) = atan2(4, -4) = 180° - 45° = 135°. Si se usara únicamente arctan(4 / -4) = -45° sin ajuste, se obtendría un error de cuadrante."
  },
  {
    id: 7,
    level: 2,
    levelName: "Nivel 2 — Cálculo",
    topic: "Suma Analítica",
    question: "Dados A = (5, -2) y B = (-3, 6), ¿cuáles son las componentes del vector resultante R = A + B?",
    options: [
      "R = (2, 4)",
      "R = (8, -8)",
      "R = (-15, -12)",
      "R = (2, -8)"
    ],
    answer: 0,
    explanation: "La suma analítica se efectúa componente a componente: Rx = Ax + Bx = 5 + (-3) = 2; Ry = Ay + By = -2 + 6 = 4. Por lo tanto, R = (2, 4)."
  },
  {
    id: 8,
    level: 2,
    levelName: "Nivel 2 — Cálculo",
    topic: "Magnitud en 3D",
    question: "Dado el vector tridimensional C = (2, 3, 6) en Newtons, ¿cuál es su módulo |C|?",
    options: [
      "|C| = 11 N",
      "|C| = 7 N",
      "|C| = 49 N",
      "|C| = 6 N"
    ],
    answer: 1,
    explanation: "En ℝ³: |C| = √(Cx² + Cy² + Cz²) = √(2² + 3² + 6²) = √(4 + 9 + 36) = √49 = 7 N."
  },

  // ==========================================
  // NIVEL 3: APLICACIÓN
  // ==========================================
  {
    id: 9,
    level: 3,
    levelName: "Nivel 3 — Aplicación",
    topic: "Fuerzas Concurrentes",
    question: "Un bloque recibe dos fuerzas horizontales: F₁ = 30 N hacia el Este (+X) y F₂ = 40 N hacia el Norte (+Y). ¿Cuál es la magnitud y dirección de la fuerza neta resultante?",
    options: [
      "|F_net| = 70 N a 45.0°",
      "|F_net| = 50 N a 53.13° respecto al Este",
      "|F_net| = 10 N a 90.0°",
      "|F_net| = 50 N a 36.87° respecto al Este"
    ],
    answer: 1,
    explanation: "Las componentes son F_net = (30, 40) N. Magnitud: |F_net| = √(30² + 40²) = √(900 + 1600) = √2500 = 50 N. Dirección: θ = atan2(40, 30) = arctan(4/3) ≈ 53.13° al Norte del Este."
  },
  {
    id: 10,
    level: 3,
    levelName: "Nivel 3 — Aplicación",
    topic: "Ortogonalidad y Producto Escalar",
    question: "Los vectores A = (k, 3) y B = (6, -2) son estrictamente PERPENDICULARES (ortogonales). ¿Cuál debe ser el valor del parámetro k?",
    options: [
      "k = 0",
      "k = 1",
      "k = -1",
      "k = 6"
    ],
    answer: 1,
    explanation: "Dos vectores son perpendiculares si y solo si su producto escalar es nulo: A · B = 0. Por ende: (k)(6) + (3)(-2) = 0 ⟹ 6k - 6 = 0 ⟹ 6k = 6 ⟹ k = 1."
  },
  {
    id: 11,
    level: 3,
    levelName: "Nivel 3 — Aplicación",
    topic: "Método del Polígono",
    question: "Al sumar gráficamente cuatro vectores sucesivos A, B, C y D usando el método punta-cola, si la punta del último vector D coincide exactamente con el origen del primero A, ¿cuánto vale la resultante?",
    options: [
      "Es el vector suma de los perímetros |A|+|B|+|C|+|D|.",
      "El vector resultante es nulo: R = 0 (polígono cerrado en equilibrio).",
      "R = 2A.",
      "No es posible que un polígono vectorial se cierre."
    ],
    answer: 1,
    explanation: "En el método del polígono, la resultante une el origen del primer vector con el extremo final del último. Si el extremo final regresa al origen inicial, el desplazamiento neto es cero: R = (0, 0). Esto representa la condición geométrica de equilibrio estático (ΣF = 0)."
  },
  {
    id: 12,
    level: 3,
    levelName: "Nivel 3 — Aplicación",
    topic: "Área y Producto Vectorial",
    question: "Dos vectores en el plano XY son A = (4, 0) y B = (2, 3). ¿Cuál es el área del paralelogramo delimitado por ellos?",
    options: [
      "Área = 6 u²",
      "Área = 12 u²",
      "Área = 24 u²",
      "Área = 8 u²"
    ],
    answer: 1,
    explanation: "El área del paralelogramo equivale a la magnitud del producto vectorial |A × B|: en 2D es |Ax·By - Ay·Bx| = |(4)(3) - (0)(2)| = |12 - 0| = 12 u²."
  },

  // ==========================================
  // NIVEL 4: FÍSICA
  // ==========================================
  {
    id: 13,
    level: 4,
    levelName: "Nivel 4 — Física",
    topic: "Segunda Ley de Newton (ΣF = ma)",
    question: "Una masa m = 4 kg está sometida a dos fuerzas concurrentes F₁ = (12, 5) N y F₂ = (-4, 3) N. ¿Cuál es el vector aceleración 'a' que experimenta la masa?",
    options: [
      "a = (8, 8) m/s²",
      "a = (2, 2) m/s²",
      "a = (32, 32) m/s²",
      "a = (4, 2) m/s²"
    ],
    answer: 1,
    explanation: "Paso 1: Fuerza neta ΣF = F₁ + F₂ = (12 + (-4), 5 + 3) = (8, 8) N. Paso 2: Por Newton ΣF = m·a ⟹ a = ΣF / m = (8/4, 8/4) = (2, 2) m/s². Módulo: |a| = √(2² + 2²) = 2√2 ≈ 2.83 m/s²."
  },
  {
    id: 14,
    level: 4,
    levelName: "Nivel 4 — Física",
    topic: "Trabajo Mecánico (W = F · d)",
    question: "Una fuerza constante de tensión F = 50 N tira de un cajón desplazándolo d = 10 m en línea recta horizontal. Si la cuerda forma un ángulo de 60° con el suelo, ¿cuál es el trabajo realizado?",
    options: [
      "W = 500 Joules (J)",
      "W = 250 Joules (J)",
      "W = 433 Joules (J)",
      "W = 0 Joules (J)"
    ],
    answer: 1,
    explanation: "El trabajo mecánico es el producto escalar de fuerza y desplazamiento: W = F · d = |F||d|cos(θ) = (50 N) · (10 m) · cos(60°) = 500 · 0.5 = 250 Joules (J)."
  },
  {
    id: 15,
    level: 4,
    levelName: "Nivel 4 — Física",
    topic: "Movimiento Circular y Vectores",
    question: "En un movimiento circular uniforme con velocidad v y aceleración centrípeta a_c, ¿cuál es el valor del producto escalar v · a_c y qué significado físico tiene?",
    options: [
      "v · a_c > 0; la rapidez aumenta constantemente.",
      "v · a_c = 0; la aceleración solo cambia la dirección de la velocidad sin alterar su rapidez.",
      "v · a_c < 0; la partícula se está frenando hasta detenerse.",
      "v · a_c = |v||a_c|; son vectores paralelos en todo momento."
    ],
    answer: 1,
    explanation: "En el movimiento circular uniforme, la velocidad es tangencial a la circunferencia y la aceleración apunta radialmente al centro. Por ello son perpendiculares (θ = 90°), y su producto escalar v · a_c = |v||a_c|cos(90°) = 0. Como no hay componente de aceleración paralela a la velocidad, la rapidez escalar |v| se mantiene constante."
  },
  {
    id: 16,
    level: 4,
    levelName: "Nivel 4 — Física",
    topic: "Equilibrio Vectorial",
    question: "Para que una partícula permanezca en reposo absoluto o velocidad constante (Primera Ley de Newton), la condición vectorial necesaria y suficiente es:",
    options: [
      "Que no actúe ninguna fuerza sobre ella en ningún momento.",
      "Que la suma vectorial de todas las fuerzas concurrentes sea idénticamente el vector nulo: ΣF = 0.",
      "Que todas las fuerzas tengan igual magnitud sin importar su sentido.",
      "Que el producto escalar entre dos fuerzas cualesquiera sea cero."
    ],
    answer: 1,
    explanation: "El equilibrio de traslación exige que la fuerza neta sea cero: ΣF = 0, lo cual implica simultáneamente ΣFx = 0 y ΣFy = 0. Pueden actuar múltiples fuerzas intensas, siempre que sus componentes se anulen mutuamente."
  }
];

class QuizEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentLevel = 'all'; // 'all' | 1 | 2 | 3 | 4
    this.questions = [...ALL_QUIZ_QUESTIONS];
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.isFinished = false;

    this.render();
  }

  filterByLevel(level) {
    this.currentLevel = level;
    if (level === 'all') {
      this.questions = [...ALL_QUIZ_QUESTIONS];
    } else {
      this.questions = ALL_QUIZ_QUESTIONS.filter(q => q.level === Number(level));
    }
    this.restart();
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  selectOption(optionIndex) {
    if (this.userAnswers[this.currentIndex] !== null) return;

    const q = this.getCurrentQuestion();
    const isCorrect = optionIndex === q.answer;
    this.userAnswers[this.currentIndex] = {
      chosen: optionIndex,
      isCorrect: isCorrect
    };

    if (isCorrect) {
      this.score++;
    }

    this.render();
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.render();
    } else {
      this.isFinished = true;
      this.render();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  }

  restart() {
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.isFinished = false;
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.isFinished) {
      this.renderResults();
      return;
    }

    const q = this.getCurrentQuestion();
    const state = this.userAnswers[this.currentIndex];
    const total = this.questions.length;
    const progress = ((this.currentIndex + 1) / total) * 100;

    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
      let extraClass = '';
      let badge = '';

      if (state !== null) {
        if (idx === q.answer) {
          extraClass = 'correct-opt';
          badge = '<span class="opt-feedback-tag correct">✓ Correcta</span>';
        } else if (idx === state.chosen) {
          extraClass = 'wrong-opt';
          badge = '<span class="opt-feedback-tag wrong">✗ Tu respuesta</span>';
        }
      }

      optionsHtml += `
        <button class="quiz-option-btn ${extraClass}" onclick="window.quizApp.selectOption(${idx})" ${state !== null ? 'disabled' : ''}>
          <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="opt-text">${opt}</span>
          ${badge}
        </button>
      `;
    });

    let explanationHtml = '';
    if (state !== null) {
      const alertClass = state.isCorrect ? 'alert-success' : 'alert-danger';
      const icon = state.isCorrect ? '🎉 ¡Correcto!' : '💡 Procedimiento matemático riguroso:';
      explanationHtml = `
        <div class="quiz-explanation ${alertClass}">
          <strong>${icon}</strong>
          <p style="margin-top:0.35rem;">${q.explanation}</p>
        </div>
      `;
    }

    // Filter Buttons Bar
    const levels = [
      { id: 'all', label: 'Todos (16)' },
      { id: 1, label: 'Nivel 1: Conceptual' },
      { id: 2, label: 'Nivel 2: Cálculo' },
      { id: 3, label: 'Nivel 3: Aplicación' },
      { id: 4, label: 'Nivel 4: Física' }
    ];

    let filterButtonsHtml = levels.map(l => {
      const activeClass = String(this.currentLevel) === String(l.id) ? 'active' : '';
      return `<button class="quiz-filter-btn ${activeClass}" onclick="window.quizApp.filterByLevel('${l.id}')">${l.label}</button>`;
    }).join('');

    this.container.innerHTML = `
      <div class="quiz-level-filter-bar">
        ${filterButtonsHtml}
      </div>

      <div class="quiz-card">
        <div class="quiz-header">
          <div class="quiz-meta">
            <span class="quiz-level-badge">${q.levelName}</span>
            <span class="quiz-badge">Tema: ${q.topic}</span>
            <span class="quiz-counter">Pregunta ${this.currentIndex + 1} de ${total}</span>
          </div>
          <div class="quiz-progress-track">
            <div class="quiz-progress-fill" style="width: ${progress}%;"></div>
          </div>
        </div>

        <h3 class="quiz-question-title">${q.question}</h3>

        <div class="quiz-options-list">
          ${optionsHtml}
        </div>

        ${explanationHtml}

        <div class="quiz-footer-actions">
          <button class="btn btn-outline" onclick="window.quizApp.prev()" ${this.currentIndex === 0 ? 'disabled' : ''}>
            ← Anterior
          </button>
          <div class="score-live-pill">
            Aciertos: <strong>${this.score} / ${this.currentIndex + (state !== null ? 1 : 0)}</strong>
          </div>
          <button class="btn btn-primary" onclick="window.quizApp.next()" ${state === null ? 'disabled' : ''}>
            ${this.currentIndex === total - 1 ? 'Ver Resultado Final 🏆' : 'Siguiente →'}
          </button>
        </div>
      </div>
    `;
  }

  renderResults() {
    const total = this.questions.length;
    const percentage = Math.round((this.score / total) * 100);

    let feedbackTitle = '';
    let feedbackDesc = '';
    let medal = '🥇';

    if (percentage >= 85) {
      medal = '🏆';
      feedbackTitle = '¡Dominio Vectorial Sobresaliente!';
      feedbackDesc = 'Has demostrado una comprensión matemática y física impecable de los vectores, el manejo estricto de cuadrantes con atan2, productos escalares y leyes de Newton.';
    } else if (percentage >= 70) {
      medal = '🥈';
      feedbackTitle = '¡Muy Buen Desempeño!';
      feedbackDesc = 'Tienes bases sólidas. Continúa practicando la descomposición rectangular y la regla de la mano derecha en el producto vectorial para consolidar tu aprendizaje.';
    } else if (percentage >= 50) {
      medal = '🥉';
      feedbackTitle = 'Aprobado - Repasa con el Simulador';
      feedbackDesc = 'Comprendes los conceptos básicos, pero te sugerimos revisar los errores frecuentes (suma de magnitudes vs componentes y signos en cuadrantes).';
    } else {
      medal = '📚';
      feedbackTitle = 'Refuerza los Fundamentos';
      feedbackDesc = 'Te recomendamos interactuar con los laboratorios 2D y 3D, arrastrando los vectores y observando cómo cambian las componentes y resultantes en tiempo real.';
    }

    this.container.innerHTML = `
      <div class="quiz-card quiz-results-card">
        <div class="result-medal-badge">${medal}</div>
        <h2 class="result-title">${feedbackTitle}</h2>
        <div class="result-score-highlight">
          <span class="score-large">${this.score}</span>
          <span class="score-denom">/ ${total}</span>
        </div>
        <div class="result-percentage-bar">
          <div class="percentage-fill" style="width: ${percentage}%;"></div>
        </div>
        <p class="result-percentage-text">${percentage}% de aciertos</p>
        <p class="result-description">${feedbackDesc}</p>

        <div class="quiz-result-actions">
          <button class="btn btn-primary" onclick="window.quizApp.restart()">🔄 Reintentar Quiz</button>
          <a href="#lab-2d" class="btn btn-outline">🔬 Volver al Laboratorio 2D</a>
        </div>
      </div>
    `;
  }
}

window.QuizEngine = QuizEngine;
