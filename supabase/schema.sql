-- ==============================================================================
-- LMS CONSULTORA DE CAPACITACIÓN EN SALUD (AULA VIRTUAL)
-- Esquema Inicial de Base de Datos y Políticas de Seguridad (RLS) para Supabase
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
    profession TEXT DEFAULT 'Profesional de la Salud',
    national_id TEXT, -- RUT / DNI / Matrícula profesional
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. TABLA: COURSES
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    duration_hours INTEGER NOT NULL DEFAULT 20,
    category TEXT DEFAULT 'Capacitación Médica Continua',
    target_audience TEXT DEFAULT 'Médicos, Enfermeros, Técnicos Paramédicos',
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. TABLA: MODULES
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. TABLA: LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_markdown TEXT,
    video_url TEXT, -- Soporta YouTube/Vimeo embed
    order_index INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. TABLA: ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    enrolled_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

-- 7. TABLA: LESSON_PROGRESS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- 8. TABLA: QUIZZES
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    passing_score INTEGER NOT NULL DEFAULT 75 CHECK (passing_score BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT unique_course_quiz UNIQUE (course_id)
);

-- 9. TABLA: QUIZ_QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array de strings: ["Opción A", "Opción B", ...]
    correct_option_index INTEGER NOT NULL DEFAULT 0 CHECK (correct_option_index >= 0),
    explanation TEXT,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- 10. TABLA: QUIZ_ATTEMPTS
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL CHECK (score BETWEEN 0 AND 100),
    passed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 11. TABLA: CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    certificate_code TEXT UNIQUE NOT NULL, -- ej. MED-2026-A9X7KQ
    issued_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    verification_url TEXT NOT NULL,
    CONSTRAINT unique_user_course_certificate UNIQUE (user_id, course_id)
);

-- ÍNDICES PARA RENDIMIENTO ÓPTIMO
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON public.certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);

-- ==============================================================================
-- TRIGGER PARA SINCRONIZAR USUARIOS DESDE AUTH.USERS A PUBLIC.PROFILES
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, profession, national_id)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Profesional de la Salud'),
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        COALESCE(new.raw_user_meta_data->>'profession', 'Médico / Personal Clínico'),
        new.raw_user_meta_data->>'national_id'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Helper function: verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLÍTICAS: PROFILES
CREATE POLICY "Lectura pública de perfiles básicos o propio"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- POLÍTICAS: COURSES
CREATE POLICY "Cursos publicados son visibles por todos"
    ON public.courses FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins pueden crear cursos"
    ON public.courses FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins pueden actualizar cursos"
    ON public.courses FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins pueden borrar cursos"
    ON public.courses FOR DELETE
    USING (public.is_admin());

-- POLÍTICAS: MODULES
CREATE POLICY "Módulos de cursos publicados o admin son visibles"
    ON public.modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = modules.course_id
            AND (courses.is_published = true OR public.is_admin())
        )
    );

CREATE POLICY "Admins pueden gestionar módulos"
    ON public.modules FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: LESSONS
CREATE POLICY "Lecciones visibles para usuarios inscritos o admin"
    ON public.lessons FOR SELECT
    USING (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.modules
            JOIN public.courses ON courses.id = modules.course_id
            WHERE modules.id = lessons.module_id
            AND (
                courses.is_published = true
            )
        )
    );

CREATE POLICY "Admins pueden gestionar lecciones"
    ON public.lessons FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: ENROLLMENTS
CREATE POLICY "Alumnos pueden ver sus propias inscripciones"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Alumnos pueden inscribirse en cursos publicados"
    ON public.enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Alumnos o admins pueden actualizar inscripción"
    ON public.enrollments FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- POLÍTICAS: LESSON_PROGRESS
CREATE POLICY "Alumnos pueden ver su propio progreso"
    ON public.lesson_progress FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Alumnos pueden registrar y modificar su progreso"
    ON public.lesson_progress FOR ALL
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- POLÍTICAS: QUIZZES
CREATE POLICY "Quizzes son visibles para inscritos o admin"
    ON public.quizzes FOR SELECT
    USING (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.enrollments
            WHERE enrollments.course_id = quizzes.course_id
            AND enrollments.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins pueden gestionar quizzes"
    ON public.quizzes FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: QUIZ_QUESTIONS
CREATE POLICY "Preguntas visibles para inscritos o admin"
    ON public.quiz_questions FOR SELECT
    USING (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.quizzes
            JOIN public.enrollments ON enrollments.course_id = quizzes.course_id
            WHERE quizzes.id = quiz_questions.quiz_id
            AND enrollments.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins pueden gestionar preguntas"
    ON public.quiz_questions FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: QUIZ_ATTEMPTS
CREATE POLICY "Alumnos pueden ver sus propios intentos"
    ON public.quiz_attempts FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Alumnos pueden registrar sus intentos"
    ON public.quiz_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- POLÍTICAS: CERTIFICATES
CREATE POLICY "Cualquier persona puede verificar certificados públicos"
    ON public.certificates FOR SELECT
    USING (true);

CREATE POLICY "Solo sistema o admin puede emitir certificados"
    ON public.certificates FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- DATOS SEMILLA DE PRUEBA (MOCK DATA MÉDICO)
-- ==============================================================================

-- Curso 1: Soporte Vital Avanzado en Trauma (ATLS Updates)
INSERT INTO public.courses (id, title, slug, description, image_url, duration_hours, category, target_audience, is_published)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Soporte Vital Avanzado en Trauma y Reanimación en Urgencias',
    'soporte-vital-avanzado-trauma',
    'Actualización integral en protocolos de triaje, manejo de vía aérea quirúrgica, control de hemorragia exanguinante y protocolo de transfusión masiva para médicos y reanimadores de urgencia.',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    40,
    'Urgencias y Cuidados Críticos',
    'Médicos Cirujanos, Médicos Urgenciólogos, Enfermeros de Reanimación',
    true
) ON CONFLICT (slug) DO NOTHING;

-- Módulo 1 y Lecciones Curso 1
INSERT INTO public.modules (id, course_id, title, order_index)
VALUES 
    ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Módulo 1: Evaluación Primaria y Enfoque <XABCDE>', 1),
    ('b1111111-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'Módulo 2: Manejo Avanzado de la Vía Aérea y Ventilación', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (id, module_id, title, content_markdown, video_url, order_index, duration_minutes)
VALUES 
    (
        'c1111111-1111-1111-1111-111111111111',
        'b1111111-1111-1111-1111-111111111111',
        'Priorización de <X>: Control de Hemorragia Exanguinante',
        '### Fundamentos del Control Exanguinante (XABCDE)

En la atención moderna del paciente politraumatizado severo, la hemorragia externa masiva representa la principal causa de muerte prevenible en los primeros minutos post-evento.

#### Pasos Clave de Actuación Inmediata:
1. **Identificación Temprana**: Buscar sangrados pulsátiles o en sábana en extremidades y zonas de unión.
2. **Uso de Torniquetes Militares / Comerciales (CAT, SOFTT)**:
   - Aplicar 5-7 cm proximal a la lesión sangrante (nunca sobre una articulación).
   - Ajustar hasta cesar pulso distal y hemorragia activa.
   - Anotar hora exacta de colocación en la frente o cinta visible.
3. **Empaquetamiento de Heridas (Wound Packing)**:
   - Empleo de gasas hemostáticas con caolín o quitosano.
   - Presión directa continua mínima durante 3 minutos.

> **Regla de Oro**: La hipoperfusión celular y la triada letal (hipotermia, acidosis, coagulopatía) comienzan en los primeros 15 minutos si no se cohíbe el sangrado.',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        1,
        25
    ),
    (
        'c1111111-1111-1111-1111-111111111112',
        'b1111111-1111-1111-1111-111111111111',
        'Evaluación de A y B: Vía Aérea con Control Cervical y Ventilación',
        '### Enfoque de Vía Aérea Rápida

La apertura y protección de la vía aérea en trauma requiere estricta inmovilización en línea de columna cervical.

#### Indicaciones de Intubación Inmediata:
* Escala de Coma de Glasgow (ECG) ≤ 8 puntos.
* Insuficiencia respiratoria refractaria con fatiga de musculatura accesoria.
* Lesión por inhalación de humo con edema laríngeo progresivo.
* Trauma maxilofacial inestable con sangrado masivo hacia orofaringe.

#### Preparación para Secuencia de Intubación Rápida (SIR):
* **Preoxigenación**: FiO2 100% durante 3-5 minutos o 8 respiraciones a capacidad vital.
* **Premedicación**: Fentanilo 1-2 mcg/kg si hemodinamia es estable.
* **Inducción**: Ketamina (1.5-2 mg/kg) o Etomidato (0.3 mg/kg) preferidos en trauma hipotenso.
* **Bloqueo neuromuscular**: Rocuronio (1.2 mg/kg) o Succinilcolina (1.5 mg/kg).',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        2,
        30
    )
ON CONFLICT (id) DO NOTHING;

-- Quiz Curso 1
INSERT INTO public.quizzes (id, course_id, title, passing_score)
VALUES (
    'd1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Evaluación Final: Protocolos de Soporte Vital en Trauma',
    80
) ON CONFLICT (course_id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question_text, options, correct_option_index, explanation, order_index)
VALUES 
    (
        'e1111111-1111-1111-1111-111111111111',
        'd1111111-1111-1111-1111-111111111111',
        'En un paciente politraumatizado con hemorragia femoral activa exanguinante, ¿cuál es la primera prioridad según el protocolo XABCDE?',
        '["Colocar collarín cervical e intubar al paciente", "Aplicar inmediatamente un torniquete proximal compresivo para control de sangrado (X)", "Infundir 2000 ml de solución salina normal al 0.9%", "Tomar tomografía computarizada de cuerpo entero"]'::jsonb,
        1,
        'La letra X antepone el control de la hemorragia exanguinante crítica a cualquier otra medida, ya que el desangramiento masivo es la principal causa de paro cardíaco hipovolémico prevenible.',
        1
    ),
    (
        'e1111111-1111-1111-1111-111111111112',
        'd1111111-1111-1111-1111-111111111111',
        '¿Cuál es el agente inductor de elección para intubación en secuencia rápida en un paciente politraumatizado con inestabilidad hemodinámica e hipotensión severa?',
        '["Propofol a 2.5 mg/kg", "Tiopental sódico a 4 mg/kg", "Ketamina a 1.5 - 2 mg/kg o Etomidato a 0.3 mg/kg", "Midazolam a dosis altas sin analgesia"]'::jsonb,
        2,
        'La ketamina y el etomidato conservan la estabilidad hemodinámica y la presión de perfusión sin provocar la vasodilatación severa ni depresión miocárdica característica del propofol.',
        2
    ),
    (
        'e1111111-1111-1111-1111-111111111113',
        'd1111111-1111-1111-1111-111111111111',
        '¿Cuáles son los tres componentes que integran la conocida Tríada Letal en el paciente con hemorragia crítica?',
        '["Hipertensión, bradicardia y disnea", "Acidosis metabólica, hipotermia y coagulopatía", "Hiperkalemia, hiponatremia y arritmias", "Taquicardia, fiebre y leucocitosis"]'::jsonb,
        1,
        'La tríada letal consiste en hipotermia, acidosis y coagulopatía, un círculo vicioso que amplifica la mortalidad si no se aplica control de daños precoz.',
        3
    )
ON CONFLICT (id) DO NOTHING;

-- Curso 2: Farmacología Clínica en Cuidados Intensivos
INSERT INTO public.courses (id, title, slug, description, image_url, duration_hours, category, target_audience, is_published)
VALUES (
    'a2222222-2222-2222-2222-222222222222',
    'Farmacología Clínica y Dosificación en Cuidados Intensivos (UCI)',
    'farmacologia-clinica-cuidados-intensivos',
    'Manejo de drogas vasoactivas, sedoanalgesia multimodal, antibióticos PK/PD en falla renal y terapia de reemplazo en pacientes críticos.',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    30,
    'Medicina Crítica e Intensiva',
    'Médicos Intensivistas, Enfermeros UCI, Químicos Farmacéuticos Clínicos',
    true
) ON CONFLICT (slug) DO NOTHING;

-- Curso 3: Prevención y Control de IAAS
INSERT INTO public.courses (id, title, slug, description, image_url, duration_hours, category, target_audience, is_published)
VALUES (
    'a3333333-3333-3333-3333-333333333333',
    'Infecciones Asociadas a la Atención de Salud (IAAS) y Bioseguridad',
    'infecciones-asociadas-atencion-salud-iaas',
    'Estrategias de contención microbiológica, precauciones estándar y adicionales, vigilancia epidemiológica y paquetes de medidas (bundles) de prevención.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    20,
    'Epidemiología y Calidad Asistencial',
    'Enfermeros, Médicos, TENS, Tecnólogos Médicos',
    true
) ON CONFLICT (slug) DO NOTHING;
