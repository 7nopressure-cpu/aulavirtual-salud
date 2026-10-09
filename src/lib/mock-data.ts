import { Course, Module, Lesson, Quiz, QuizQuestion, Profile, Certificate, Enrollment } from './types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user-student-1',
    full_name: 'Dra. Camila Valenzuela Méndez',
    email: 'c.valenzuela@hospital.med',
    role: 'student',
    profession: 'Médico Urgenciólogo',
    national_id: 'RUT: 18.492.381-4',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-student-2',
    full_name: 'Lic. Javier Morales Rivas',
    email: 'j.morales@salud.cl',
    role: 'student',
    profession: 'Enfermero Reanimador SAMU',
    national_id: 'RUT: 16.712.903-8',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-admin-1',
    full_name: 'Dr. Rodrigo Soto Alvarado',
    email: 'admin@saludcapacita.com',
    role: 'admin',
    profession: 'Director Médico y Coordinador Académico',
    national_id: 'RUT: 14.102.839-K',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-trauma-1',
    title: 'Soporte Vital Avanzado en Trauma y Reanimación en Urgencias',
    slug: 'soporte-vital-avanzado-trauma',
    description: 'Actualización integral en protocolos de triaje hospitalario, manejo de vía aérea quirúrgica, control de hemorragia exanguinante (XABCDE) y protocolo de transfusión masiva para personal médico y de enfermería crítica.',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    duration_hours: 40,
    category: 'Urgencias y Cuidados Críticos',
    target_audience: 'Médicos Cirujanos, Médicos Urgenciólogos, Enfermeros de Reanimación, TENS',
    is_published: true,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'course-farmaco-2',
    title: 'Farmacología Clínica y Dosificación en Cuidados Intensivos (UCI)',
    slug: 'farmacologia-clinica-cuidados-intensivos',
    description: 'Protocolos actualizados de titulación de drogas vasoactivas (noradrenalina, vasopresina, milrinona), analgesia y sedación multimodal (RASS/CAM-ICU) y monitorización PK/PD de antimicrobianos en pacientes sépticos.',
    image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    duration_hours: 30,
    category: 'Medicina Crítica e Intensiva',
    target_audience: 'Médicos Intensivistas, Enfermeros de UCI/UTI, Químicos Farmacéuticos Clínicos',
    is_published: true,
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'course-iaas-3',
    title: 'Infecciones Asociadas a la Atención de Salud (IAAS) y Bioseguridad Hospitalaria',
    slug: 'infecciones-asociadas-atencion-salud-iaas',
    description: 'Curso habilitante ministerial de 80 horas pedagógicas: epidemiología hospitalaria, precauciones basadas en el mecanismo de transmisión, bundles de prevención de NAVM, ITU-AC e ITACS, y manejo de brotes multirresistentes.',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    duration_hours: 80,
    category: 'Calidad Asistencial y Epidemiología',
    target_audience: 'Equipo Multidisciplinario de Salud (Médicos, Enfermeros, TENS, Matronas)',
    is_published: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'course-ecg-4',
    title: 'Electrocardiografía de Urgencia y Manejo de Arritmias Complejas',
    slug: 'electrocardiografia-urgencia-arritmias',
    description: 'Interpretación sistemática de ECG de 12 derivaciones, reconocimiento precoz de SCA con y sin supradesnivel ST, taquiarritmias de complejo ancho/estrecho y algoritmos de cardioversión sincronizada.',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    duration_hours: 35,
    category: 'Cardiología y Urgencias',
    target_audience: 'Médicos Generales, Residentes, Enfermeros de Urgencia',
    is_published: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_MODULES: Record<string, Module[]> = {
  'course-trauma-1': [
    {
      id: 'mod-trauma-1',
      course_id: 'course-trauma-1',
      title: 'Módulo 1: Cinemática del Trauma y Abordaje <XABCDE>',
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'mod-trauma-2',
      course_id: 'course-trauma-1',
      title: 'Módulo 2: Manejo Avanzado de Vía Aérea y Ventilación en Trauma',
      order_index: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'mod-trauma-3',
      course_id: 'course-trauma-1',
      title: 'Módulo 3: Shock Hipovolémico, Control de Daños y Reanimación Hemostática',
      order_index: 3,
      created_at: new Date().toISOString(),
    },
  ],
  'course-farmaco-2': [
    {
      id: 'mod-farmaco-1',
      course_id: 'course-farmaco-2',
      title: 'Módulo 1: Farmacocinética y Farmacodinámica del Paciente Crítico',
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'mod-farmaco-2',
      course_id: 'course-farmaco-2',
      title: 'Módulo 2: Drogas Vasoactivas e Inotrópicos',
      order_index: 2,
      created_at: new Date().toISOString(),
    },
  ],
  'course-iaas-3': [
    {
      id: 'mod-iaas-1',
      course_id: 'course-iaas-3',
      title: 'Módulo 1: Marco Normativo y Epidemiología de las IAAS',
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'mod-iaas-2',
      course_id: 'course-iaas-3',
      title: 'Módulo 2: Bundles de Prevención de Infecciones Críticas',
      order_index: 2,
      created_at: new Date().toISOString(),
    },
  ],
  'course-ecg-4': [
    {
      id: 'mod-ecg-1',
      course_id: 'course-ecg-4',
      title: 'Módulo 1: Análisis Sistemático del Trazado Electrocardiográfico',
      order_index: 1,
      created_at: new Date().toISOString(),
    },
  ],
};

export const INITIAL_LESSONS: Record<string, Lesson[]> = {
  'mod-trauma-1': [
    {
      id: 'les-t1-1',
      module_id: 'mod-trauma-1',
      title: '1.1 Priorización de <X>: Control Inmediato de Sangrado Exanguinante',
      order_index: 1,
      duration_minutes: 25,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      content_markdown: `### Fundamentos del Control Exanguinante (XABCDE)

En la atención moderna del paciente politraumatizado grave, la hemorragia externa masiva se ha consolidado como la primera causa de muerte potencialmente evitable en los primeros minutos post-evento.

#### Principios Tácticos y Clínicos:
1. **Identificación Inmediata**: Búsqueda activa de sangrados pulsátiles o en sábana en extremidades y zonas de unión (axilar e inguinal).
2. **Aplicación de Torniquetes de Extremidad (CAT / SOFTT)**:
   - Debe colocarse a **5-7 cm proximal** a la lesión sangrante (o de forma alta y apretada si no es visible la fuente exacta).
   - Ajustar el molinete hasta el cese total del sangrado y la desaparición del pulso distal.
   - Si un torniquete no detiene el sangrado por completo, colocar un segundo torniquete inmediatamente proximal al primero.
   - Rotular con marcador indeleble la hora exacta de colocación en el campo frontal del dispositivo ("TIME").
3. **Empaquetamiento de Heridas en Zonas de Unión**:
   - En heridas axilares o inguinales donde no se puede colocar torniquete, introducir gasas hemostáticas (impregnadas con caolín o quitosano).
   - Mantener presión manual firme y constante durante al menos 3 minutos continuos antes de colocar vendaje compresivo.

> **Alerta Clínica**: Nunca aflojar un torniquete de forma intermitente para "evaluar la perfusión". Dicha práctica restablece el sangrado y favorece la coagulopatía de consumo.`,
    },
    {
      id: 'les-t1-2',
      module_id: 'mod-trauma-1',
      title: '1.2 Evaluación Primaria Sistematizada y Triaje Hospitalario',
      order_index: 2,
      duration_minutes: 30,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      content_markdown: `### Protocolo Sistematizado de Recepción del Trauma

El objetivo de la evaluación primaria no es el diagnóstico anatómico definitivo, sino la detección y resolución secuencial de amenazas inmediatas para la vida.

#### Nemotecnia Operativa:
- **X (Exsanguinating Hemorrhage)**: Hemorragia masiva externa.
- **A (Airway & C-Spine)**: Vía aérea permeable con control manual y alineación cervical estricta.
- **B (Breathing)**: Descartar neumotórax a tensión, hemotórax masivo y tórax volante.
- **C (Circulation)**: Evaluación de pulsos periféricos, llenado capilar, color cutáneo y foco de hemorragia interna (tórax, abdomen, pelvis y huesos largos).
- **D (Disability)**: Escala de Coma de Glasgow y reactividad pupilar simétrica.
- **E (Exposure & Hypothermia Prevention)**: Desvestir para examen corporal completo y cubrir inmediatamente con mantas térmicas para evitar la hipotermia.`,
    },
  ],
  'mod-trauma-2': [
    {
      id: 'les-t2-1',
      module_id: 'mod-trauma-2',
      title: '2.1 Secuencia de Intubación Rápida (SIR) en Paciente Traumatizado',
      order_index: 1,
      duration_minutes: 35,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      content_markdown: `### Enfoque de Vía Aérea en Trauma Crítico

Todo paciente traumatizado se asume como estómago lleno y potencial vía aérea difícil anatómica o fisiológica.

#### Las 7 "P" de la Secuencia de Intubación Rápida:
1. **Preparación**: Equipo de videolaringoscopía, bougie o guía semirrígida, aspiración de alto flujo y rescate con kit de cricotiroidotomía quirúrgica.
2. **Preoxigenación**: Mascarilla de no reinhalación a 15 L/min durante 3-5 minutos o cánula nasal de alto flujo (oxigenación apneica).
3. **Pretratamiento**: Optimización hemodinámica con bolo de cristaloides o inicio de noradrenalina para evitar paro post-inducción por vasoplejia.
4. **Parálisis con Inducción simultánea**:
   - *Inductor*: Ketamina (1.5 - 2 mg/kg IV) o Etomidato (0.3 mg/kg IV).
   - *Relajante muscular*: Rocuronio (1.2 mg/kg IV) o Succinilcolina (1.5 mg/kg IV).
5. **Posicionamiento y Protección**: Estabilización manual en línea (MILS) retirando la valva anterior del collar cervical.
6. **Paso del tubo endotraqueal**: Introducción bajo visión directa o por videolaringoscopio con confirmación visual del paso por las cuerdas vocales.
7. **Post-intubación y Cuidados**: Confirmación con capnografía cuantitativa en onda continua (estándar de oro) y fijación mecánica del tubo.`,
    },
  ],
  'mod-trauma-3': [
    {
      id: 'les-t3-1',
      module_id: 'mod-trauma-3',
      title: '3.1 Reanimación de Control de Daños y Protocolo de Transfusión Masiva',
      order_index: 1,
      duration_minutes: 30,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      content_markdown: `### Reanimación Hemostática Moderna

Se aleja del concepto obsoleto de sobrecarga hídrica masiva con cristaloides, priorizando la reposición balanceada de componentes sanguíneos.

#### Principios Rectores:
* **Hipotensión Permisiva**: Mantener PAS 80-90 mmHg (PAM 60-65 mmHg) hasta el control quirúrgico del sangrado, salvo en presencia de Traumatismo Encéfalo Craneano (donde se busca PAS ≥ 100-110 mmHg para preservar la Presión de Perfusión Cerebral).
* **Protocolo de Transfusión Masiva (PTM)**: Ratio balanceado 1:1:1 (1 unidad de Glóbulos Rojos : 1 unidad de Plasma Fresco Congelado : 1 unidad de Plaquetas).
* **Ácido Tranexámico (TXA)**: Administrar 1 g en infusión en 10 minutos antes de las primeras 3 horas del trauma, seguido de 1 g en infusión continua de 8 horas (evidencia CRASH-2).
* **Calcio Iónico**: Mantener calcio iónico > 1.1 mmol/L infundiendo 1-2 g de gluconato de calcio por cada 4 concentrados de glóbulos rojos transfundidos.`,
    },
  ],
  'mod-farmaco-1': [
    {
      id: 'les-f1-1',
      module_id: 'mod-farmaco-1',
      title: '1.1 Alteraciones Farmacocinéticas en la Sepsis y Choque Séptico',
      order_index: 1,
      duration_minutes: 20,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      content_markdown: `### Fisiopatología Farmacológica en Cuidados Críticos

En el paciente con sepsis severa ocurren dos fenómenos determinantes:
1. **Aumento masivo del volumen de distribución (Vd)** por fuga capilar endotelial generalizada.
2. **Aclaramiento renal aumentado (ARC)** en fases iniciales o fallo multiorgánico con reducción drástica de la depuración.

#### Implicancias Clínicas:
- Los antibióticos hidrofílicos (betalactámicos, aminoglucósidos, vancomicina) requieren dosis de carga significativamente mayores para alcanzar concentraciones terapéuticas efectivas en las primeras 24 horas.`,
    },
  ],
  'mod-iaas-1': [
    {
      id: 'les-i1-1',
      module_id: 'mod-iaas-1',
      title: '1.1 Higiene de Manos Hospitalaria y los 5 Momentos de la OMS',
      order_index: 1,
      duration_minutes: 20,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      content_markdown: `### El Pilar Central de la Bioseguridad Asistencial

La transmisión cruzada de patógenos multirresistentes (BLEE, KPC, SAMR) a través de las manos de los profesionales sanitarios continúa siendo el principal vector de IAAS.

#### Los 5 Momentos Clave:
1. Antes de tocar al paciente.
2. Antes de realizar una tarea limpia / aséptica.
3. Después del riesgo de exposición a líquidos corporales.
4. Después de tocar al paciente.
5. Después de tocar el entorno del paciente.`,
    },
  ],
  'mod-ecg-1': [
    {
      id: 'les-e1-1',
      module_id: 'mod-ecg-1',
      title: '1.1 Lectura Rápida de Isquemia y Lesión Miocárdica Aguda',
      order_index: 1,
      duration_minutes: 25,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      content_markdown: `### Criterios Diagnósticos del Síndrome Coronario Agudo

Identificación topográfica de las derivaciones coronarias:
- **Pared Anterior**: V1 - V4 (Arteria Descendente Anterior - DA)
- **Pared Lateral**: DI, aVL, V5, V6 (Arteria Circunfleja - Cx)
- **Pared Inferior**: DII, DIII, aVF (Arteria Coronaria Derecha - CD)
- **Pared Posterior**: Depresión recíproca ST en V1-V3 y elevación en V7-V9.`,
    },
  ],
};

export const INITIAL_QUIZZES: Record<string, Quiz> = {
  'course-trauma-1': {
    id: 'quiz-trauma-1',
    course_id: 'course-trauma-1',
    title: 'Evaluación de Certificación: Soporte Vital Avanzado en Trauma',
    passing_score: 80,
    created_at: new Date().toISOString(),
    questions: [
      {
        id: 'q-t1',
        quiz_id: 'quiz-trauma-1',
        order_index: 1,
        question_text: 'En un paciente politraumatizado que ingresa al shock room con hemorragia femoral exanguinante a chorro, ¿cuál es la primera conducta terapéutica de acuerdo a la nemotecnia XABCDE?',
        options: [
          'Alinear columna cervical e intubar al paciente de inmediato',
          'Colocar inmediatamente un torniquete de extremidad en zona proximal al sangrado (X)',
          'Administrar 2000 ml de Solución Fisiológica tibia a chorro',
          'Trasladar a sala de tomografía computarizada para angio-TAC urgente',
        ],
        correct_option_index: 1,
        explanation: 'En el algoritmo de trauma militar y civil moderno, la letra "X" (eXanguinating hemorrhage) prima sobre cualquier otra intervención, ya que la exanguinación masiva causa paro cardíaco hipovolémico irreversible en menos de 3 a 5 minutos.',
      },
      {
        id: 'q-t2',
        quiz_id: 'quiz-trauma-1',
        order_index: 2,
        question_text: '¿Cuál es el fármaco de inducción de preferencia para Secuencia de Intubación Rápida en un paciente con politraumatismo severo, shock hipovolémico y PAM de 52 mmHg?',
        options: [
          'Propofol a 2.5 mg/kg IV',
          'Tiopental sódico a 4 mg/kg IV',
          'Ketamina a 1.5 - 2 mg/kg IV o Etomidato a 0.3 mg/kg IV',
          'Midazolam en bolo alto de 0.3 mg/kg sin analgesia previa',
        ],
        correct_option_index: 2,
        explanation: 'La ketamina y el etomidato conservan la estabilidad hemodinámica mediante estimulación simpática indirecta o mínimo impacto vascular periférico, evitando el colapso hemodinámico letal que precipita el propofol en hipovolemia severa.',
      },
      {
        id: 'q-t3',
        quiz_id: 'quiz-trauma-1',
        order_index: 3,
        question_text: '¿Cuáles son los tres pilares fisiopatológicos que componen la denominada "Tríada Letal" en el paciente con hemorragia traumática grave?',
        options: [
          'Hipertensión intracraneana, bradicardia y depresión respiratoria (Cushing)',
          'Hipotermia (<35°C), Acidosis metabólica (pH < 7.2) y Coagulopatía de consumo',
          'Hiperkalemia, hiponatremia y arritmias ventriculares refractarias',
          'Taquicardia, hipotensión arterial e hipoglicemia de estrés',
        ],
        correct_option_index: 1,
        explanation: 'La tríada letal consiste en Hipotermia, Acidosis y Coagulopatía. Se retroalimentan entre sí anulando la cascada de coagulación enzimática y multiplicando exponencialmente la mortalidad si no se detiene precozmente.',
      },
      {
        id: 'q-t4',
        quiz_id: 'quiz-trauma-1',
        order_index: 4,
        question_text: 'Según las guías internacionales y el estudio clínico CRASH-2, ¿cuál es el margen de tiempo óptimo para la administración de Ácido Tranexámico (TXA) en trauma hemorrágico?',
        options: [
          'Dentro de las primeras 3 horas posteriores al trauma',
          'Únicamente entre las 6 y 12 horas post-trauma',
          'Solo después de confirmar coagulograma con dímero D elevado en laboratorio central',
          'Al finalizar la cirugía de control de daños en sala de recuperación',
        ],
        correct_option_index: 0,
        explanation: 'El ácido tranexámico reduce significativamente la mortalidad por sangrado si se administra dentro de las 3 primeras horas del evento. Su administración tardía (> 3 horas) carece de beneficio e incrementa el riesgo de complicaciones trombóticas.',
      },
      {
        id: 'q-t5',
        quiz_id: 'quiz-trauma-1',
        order_index: 5,
        question_text: '¿Cuál es el método considerado estándar de oro (Gold Standard) para confirmar la correcta ubicación del tubo endotraqueal tras la intubación?',
        options: [
          'Auscultación de murmullo pulmonar en ambos hemitórax y epigastrio únicamente',
          'Capnografía cuantitativa con forma de onda continua',
          'Visualización de condensación de vapor en las paredes del tubo endotraqueal',
          'Radiografía de tórax portátil solicitada a los 30 minutos',
        ],
        correct_option_index: 1,
        explanation: 'La capnografía en forma de onda continua (detección de CO2 espirado) es el método confirmatorio indiscutido para certificar la ubicación intratraqueal del tubo y alertar de inmediato sobre cualquier desplazamiento o extubación accidental.',
      },
    ],
  },
  'course-farmaco-2': {
    id: 'quiz-farmaco-2',
    course_id: 'course-farmaco-2',
    title: 'Evaluación de Certificación: Farmacología Clínica en Paciente Crítico',
    passing_score: 75,
    created_at: new Date().toISOString(),
    questions: [
      {
        id: 'q-f1',
        quiz_id: 'quiz-farmaco-2',
        order_index: 1,
        question_text: '¿Cuál es el vasopresor de primera línea recomendado en el choque séptico según las guías Surviving Sepsis Campaign?',
        options: [
          'Dopamina a dosis dopaminérgica (2 mcg/kg/min)',
          'Noradrenalina (Norepinefrina) con titulación para PAM ≥ 65 mmHg',
          'Fenilefrina en infusión periférica continua',
          'Epinefrina en bolo intravenoso repetido',
        ],
        correct_option_index: 1,
        explanation: 'La noradrenalina es el vasopresor de primera elección debido a su potente efecto alfa-1 vasoconstrictor con menor incidencia de arritmias taquicardizantes en comparación con la dopamina.',
      },
    ],
  },
  'course-iaas-3': {
    id: 'quiz-iaas-3',
    course_id: 'course-iaas-3',
    title: 'Evaluación de Certificación: Prevención y Control de IAAS',
    passing_score: 75,
    created_at: new Date().toISOString(),
    questions: [
      {
        id: 'q-i1',
        quiz_id: 'quiz-iaas-3',
        order_index: 1,
        question_text: '¿Cuál es la medida más costo-efectiva demostrada para prevenir la transmisión cruzada de infecciones intrahospitalarias?',
        options: [
          'Uso rutinario de doble guante de látex en todas las atenciones',
          'Higiene adecuada de manos con solución alcohólica en los 5 momentos clave',
          'Fumigación química diaria de salas de internación',
          'Prescripción profiláctica de antibióticos de amplio espectro a todos los ingresos',
        ],
        correct_option_index: 1,
        explanation: 'La higiene de manos realizada con la técnica correcta y en los momentos oportunos es la medida unitaria de mayor impacto para reducir las IAAS en todo el mundo.',
      },
    ],
  },
};

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-1',
    user_id: 'user-student-1',
    course_id: 'course-trauma-1',
    status: 'in_progress',
    enrolled_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    progress_percentage: 67,
  },
  {
    id: 'enr-2',
    user_id: 'user-student-1',
    course_id: 'course-iaas-3',
    status: 'completed',
    enrolled_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    progress_percentage: 100,
  },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-sample-1',
    user_id: 'user-student-1',
    course_id: 'course-iaas-3',
    certificate_code: 'MED-2026-IAAS-9482',
    issued_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    verification_url: '/verify/MED-2026-IAAS-9482',
    profile: INITIAL_PROFILES[0],
    course: INITIAL_COURSES[2],
  },
];
