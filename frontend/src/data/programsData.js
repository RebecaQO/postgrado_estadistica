export const programsData = [
  {
    id: "msc-ciencia-datos",
    title: "Maestría en Estadística Aplicada",
    degree: "Magíster Scientiarum (M.Sc.)",
    type: "Maestría",
    typeFilter: "maestria",
    area: "Data Science & Machine Learning",
    resolution: "Res. HCU Nº 142/2024 - Acreditación CEUB",
    code: "POS-EST-2026-M01",
    duration: "2 Años (4 Semestres Académicos)",
    credits: "72 Créditos Académicos (SNC-CEUB)",
    modality: "Híbrida (Clases Virtuales Síncronas + Laboratorios FCPN)",
    status: "Convocatoria Abierta",
    featured: true,
    description: "Programa de alto nivel enfocado en la modelización estocástica, computación estadística intensiva, inferencia causal y arquitectura de pipelines de Big Data para la toma de decisiones empresariales y científicas.",
    investment: {
      tuitionBob: 18000,
      matriculaBob: 1200,
      cashDiscountPercent: 12,
      maxInstallments: 18,
      cuotaInitialBob: 2000,
      cptCode: "CPT-UMSA-99420"
    },
    targetAudience: "Licenciados en Estadística, Matemáticas, Informática, Economía, Ingenierías y áreas con sólida base cuantitativa.",
    graduateProfile: "Capacidad para formular modelos predictivos y explicativos complejos, liderar equipos de ciencia de datos, diseñar arquitecturas analíticas y producir investigación reproducible.",
    titulationOptions: [
      {
        name: "Tesis de Grado de Maestría",
        desc: "Investigación científica original con defensa pública ante tribunal evaluador acreditado."
      },
      {
        name: "Artículo Científico Indexado",
        desc: "Publicación de al menos un artículo como autor principal en revista Scopus / SciELO / Web of Science."
      },
      {
        name: "Trabajo Dirigido de Posgrado",
        desc: "Resolución de un problema estadístico complejo en una entidad estatal o privada con impacto medible."
      }
    ],
    curriculum: [
      {
        semester: "Semestre I",
        modules: [
          { code: "EST-801", name: "Fundamentos Matemáticos para Estadística", credits: 5, hours: 80, desc: "Álgebra lineal avanzada, cálculo multivariado y optimización convexa." },
          { code: "EST-802", name: "Inferencia Estadística Avanzada", credits: 5, hours: 80, desc: "Teoría asintótica, estimación puntual, pruebas de hipótesis y remuestreo Bootstrap/Jackknife." },
          { code: "EST-803", name: "Programación Estadística con R y Python", credits: 4, hours: 64, desc: "Estructuras de datos analíticas, tidyverse, numpy, pandas y desarrollo de paquetes." }
        ]
      },
      {
        semester: "Semestre II",
        modules: [
          { code: "EST-811", name: "Modelos Lineales Generalizados (GLM)", credits: 5, hours: 80, desc: "Regresión logística, Poisson, cuasi-verosimilitud y modelos aditivos generalizados (GAM)." },
          { code: "EST-812", name: "Aprendizaje Estadístico y Machine Learning", credits: 5, hours: 80, desc: "Algoritmos supervisados, ensamblados (Random Forest, XGBoost), regularización Lasso/Ridge." },
          { code: "EST-813", name: "Muestreo Complejo y Diseño de Experimentos", credits: 4, hours: 64, desc: "Diseños bietápicos, calibración de factores de ponderación y análisis de varianza avanzado." }
        ]
      },
      {
        semester: "Semestre III",
        modules: [
          { code: "EST-821", name: "Análisis Multivariante y Reducción Dimensional", credits: 5, hours: 80, desc: "PCA, t-SNE, UMAP, análisis factorial confirmatorio y clustering jerárquico." },
          { code: "EST-822", name: "Series Temporales y Pronósticos Estocásticos", credits: 5, hours: 80, desc: "Modelos ARIMA, SARIMAX, GARCH, redes neuronales recurrentes (LSTM) y Prophet." },
          { code: "EST-823", name: "Taller de Tesis I: Protocolo de Investigación", credits: 4, hours: 64, desc: "Formulación del problema, revisión de literatura sistemática y aprobación de perfil de tesis." }
        ]
      },
      {
        semester: "Semestre IV",
        modules: [
          { code: "EST-831", name: "Minería de Datos Masivos y Big Data Analytics", credits: 5, hours: 80, desc: "Computación distribuida con Apache Spark, PySpark, Dask y bases de datos NoSQL." },
          { code: "EST-832", name: "Estadística Bayesiana Computacional (MCMC)", credits: 5, hours: 80, desc: "Modelado jerárquico bayesiano con Stan, PyMC y algoritmos de Monte Carlo." },
          { code: "EST-833", name: "Taller de Tesis II y Defensa de Grado", credits: 5, hours: 80, desc: "Redacción final, validación experimental de resultados y defensa ante tribunal oficial." }
        ]
      }
    ]
  },
  {
    id: "msc-bioestadistica",
    title: "Maestría en Bioestadística y Modelamiento Epidemiológico",
    degree: "Magíster Scientiarum (M.Sc.)",
    type: "Maestría",
    typeFilter: "maestria",
    area: "Bioestadística & Salud Pública",
    resolution: "Res. HCU Nº 089/2023 - FCPN UMSA",
    code: "POS-EST-2026-M02",
    duration: "2 Años (4 Semestres Académicos)",
    credits: "72 Créditos Académicos",
    modality: "Virtual con Clases Síncronas",
    status: "Convocatoria Abierta",
    featured: true,
    description: "Especialización científica en análisis de sobrevida, ensayos clínicos controlados, epidemiología espacial y modelización matemática de dinámicas de transmisión de enfermedades.",
    investment: {
      tuitionBob: 17500,
      matriculaBob: 1200,
      cashDiscountPercent: 10,
      maxInstallments: 18,
      cuotaInitialBob: 1800,
      cptCode: "CPT-UMSA-99421"
    },
    targetAudience: "Profesionales en Estadística, Biología, Medicina, Epidemiología, Bioquímica, Salud Pública y Ciencias Biomédicas.",
    graduateProfile: "Diseñador de protocolos clínicos, analista de supervivencia para farmacovigilancia y modelador de riesgos epidemiológicos para organismos nacionales e internacionales.",
    titulationOptions: [
      { name: "Tesis de Maestría", desc: "Estudio bioestadístico observacional o experimental con datos de salud." },
      { name: "Artículo Científico Indexado", desc: "Publicación en revista médica/estadística de impacto (JCR/Scimago)." }
    ],
    curriculum: [
      {
        semester: "Semestre I",
        modules: [
          { code: "BIO-801", name: "Bioestadística Fundamental y Probabilidad", credits: 5, hours: 80, desc: "Distribuciones discretas y continuas en salud, tablas de contingencia y odds ratio." },
          { code: "BIO-802", name: "Diseño de Estudios Epidemiológicos y Ensayos Clínicos", credits: 5, hours: 80, desc: "Estudios de cohortes, casos y controles, aleatorización y fases clínicas I-IV." },
          { code: "BIO-803", name: "Software Bioestadístico (R & Stata)", credits: 4, hours: 64, desc: "Manejo de registros clínicos electrónicos, microdatos de salud y visualización bioestadística." }
        ]
      },
      {
        semester: "Semestre II",
        modules: [
          { code: "BIO-811", name: "Análisis de Sobrevida y Tiempo hasta el Evento", credits: 5, hours: 80, desc: "Kaplan-Meier, modelo de riesgos proporcionales de Cox y riesgos competitivos." },
          { code: "BIO-812", name: "Modelos Mixtos y Datos Longitudinales", credits: 5, hours: 80, desc: "Efectos fijos y aleatorios en medidas repetidas en pacientes a lo largo del tiempo." },
          { code: "BIO-813", name: "Epidemiología Cuantitativa y Causalidad", credits: 4, hours: 64, desc: "Gráficos acíclicos dirigidos (DAGs) y puntajes de propensión (Propensity Score Matching)." }
        ]
      },
      {
        semester: "Semestre III",
        modules: [
          { code: "BIO-821", name: "Epidemiología Espacial y Análisis Geoestadístico", credits: 5, hours: 80, desc: "Modelos espaciales autorregresivos (CAR/SAR), mapeo de enfermedades en QGIS/R." },
          { code: "BIO-822", name: "Modelos Matemáticos de Transmisión (SIR/SEIR)", credits: 5, hours: 80, desc: "Sistemas de ecuaciones diferenciales y simulación de brotes infecciosos." },
          { code: "BIO-823", name: "Taller de Tesis I", credits: 4, hours: 64, desc: "Aprobación de protocolo bioestadístico con aval de comité de bioética." }
        ]
      },
      {
        semester: "Semestre IV",
        modules: [
          { code: "BIO-831", name: "Genómica Estadística y Bioinformática", credits: 5, hours: 80, desc: "Análisis de secuenciación masiva (RNA-Seq), GWAS y microarrays genéticos." },
          { code: "BIO-832", name: "Meta-análisis y Revisiones Sistemáticas Cuantitativas", credits: 5, hours: 80, desc: "Forest plots, evaluación de sesgo de publicación y modelos de efectos fijos/aleatorios." },
          { code: "BIO-833", name: "Taller de Tesis II y Defensa Pública", credits: 5, hours: 80, desc: "Sustentación de tesis de grado." }
        ]
      }
    ]
  },
  {
    id: "dip-machine-learning",
    title: "Diplomado en Machine Learning y Modelos Estadísticos Avanzados",
    degree: "Diplomado de Posgrado",
    type: "Diplomado",
    typeFilter: "diplomado",
    area: "Inteligencia Artificial & Modelos Predictivos",
    resolution: "Res. Facultativa FCPN Nº 310/2025",
    code: "POS-EST-2026-D01",
    duration: "6 Meses (5 Módulos Intensivos)",
    credits: "20 Créditos Académicos",
    modality: "100% Virtual con Talleres Prácticos",
    status: "Convocatoria Abierta",
    featured: true,
    description: "Programa intensivo orientado a la aplicación de modelos predictivos modernos, redes neuronales profundas y validación rigurosa de algoritmos de machine learning sobre casos reales.",
    investment: {
      tuitionBob: 5800,
      matriculaBob: 500,
      cashDiscountPercent: 10,
      maxInstallments: 5,
      cuotaInitialBob: 1200,
      cptCode: "CPT-UMSA-99422"
    },
    targetAudience: "Profesionales y técnicos que requieran dominar herramientas modernas de Machine Learning con fundamento teórico estadístico.",
    graduateProfile: "Especialista en entrenamiento, ajuste de hiperparámetros, interpretabilidad y despliegue (MLOps) de modelos analíticos.",
    titulationOptions: [
      { name: "Monografía de Posgrado", desc: "Proyecto práctico aplicado con código reproducible en GitHub." }
    ],
    curriculum: [
      {
        semester: "Módulos del Diplomado",
        modules: [
          { code: "DML-01", name: "Fundamentos de Probabilidad y Álgebra Computacional", credits: 4, hours: 40, desc: "Optimización por descenso de gradiente y matrices de covarianza." },
          { code: "DML-02", name: "Aprendizaje Supervisado: Modelos Lineales y Árboles", credits: 4, hours: 40, desc: "SVM, XGBoost, LightGBM y validación cruzada estratificada." },
          { code: "DML-03", name: "Aprendizaje No Supervisado y Detección de Anomalías", credits: 4, hours: 40, desc: "Isolation Forests, Autoencoders y análisis de agrupamiento." },
          { code: "DML-04", name: "Deep Learning y Redes Neuronales con PyTorch", credits: 4, hours: 40, desc: "Perceptrones multicapa, CNNs para visión y Transformers para texto." },
          { code: "DML-05", name: "Interpretabilidad de Modelos (XAI) y Despliegue MLOps", credits: 4, hours: 40, desc: "SHAP, LIME, FastAPI, Docker y monitorización de sesgo algorítmico." }
        ]
      }
    ]
  },
  {
    id: "dip-actuarial",
    title: "Diplomado en Estadística Actuarial, Seguros y Gestión de Riesgos",
    degree: "Diplomado de Posgrado",
    type: "Diplomado",
    typeFilter: "diplomado",
    area: "Finanzas Cuantitativas & Actuaria",
    resolution: "Res. HCU Nº 215/2024",
    code: "POS-EST-2026-D02",
    duration: "6 Meses (5 Módulos)",
    credits: "20 Créditos Académicos",
    modality: "Virtual Síncrona",
    status: "Próxima Apertura",
    featured: false,
    description: "Formación especializada en cálculo de primas, reservas matemáticas, tablas biométricas de mortalidad y modelos de solvencia financiera para el mercado asegurador y previsional boliviano.",
    investment: {
      tuitionBob: 6200,
      matriculaBob: 500,
      cashDiscountPercent: 10,
      maxInstallments: 5,
      cuotaInitialBob: 1300,
      cptCode: "CPT-UMSA-99423"
    },
    targetAudience: "Estadísticos, Economistas, Actuarios, Financieros y Auditores.",
    graduateProfile: "Diseñador de planes de contingencia previsional y tarifador actuarial bajo normas ASFI y APS.",
    titulationOptions: [
      { name: "Monografía Actuarial", desc: "Estudio de solvencia o cálculo de reservas para ramo de seguros." }
    ],
    curriculum: [
      {
        semester: "Módulos del Diplomado",
        modules: [
          { code: "ACT-01", name: "Matemática Financiera y Tasas de Interés Estocásticas", credits: 4, hours: 40, desc: "Anualidades continuas y discretas bajo incertidumbre." },
          { code: "ACT-02", name: "Modelos de Supervivencia y Tablas de Mortalidad", credits: 4, hours: 40, desc: "Leyes de Makeham, Gompertz y proyecciones Lee-Carter." },
          { code: "ACT-03", name: "Teoría del Riesgo y Pérdidas Agregadas", credits: 4, hours: 40, desc: "Distribuciones de severidad, frecuencia de siniestros y reaseguro." },
          { code: "ACT-04", name: "Cálculo de Primas y Reservas Matemáticas", credits: 4, hours: 40, desc: "Primas netas y comerciales para seguros de vida y ramos generales." },
          { code: "ACT-05", name: "Regulación Financiera y Solvencia (Basilea / Solvencia II)", credits: 4, hours: 40, desc: "Pruebas de estrés y requerimientos de capital de solvencia." }
        ]
      }
    ]
  }
];
