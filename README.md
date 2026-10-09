# MedEduca Salud - Plataforma LMS de Capacitación Médica Continua

Plataforma web de tipo LMS (Learning Management System) moderna, minimalista y de alto rendimiento, diseñada específicamente para consultoras de educación continua y acreditación de competencias al personal de salud (**Médicos, Enfermeros/as, Técnicos en Enfermería / TENS, Kinesiólogos, Químicos Farmacéuticos**).

Optimizado para despliegue directo en **Vercel** con base de datos PostgreSQL, autenticación y Row Level Security (RLS) en **Supabase**.

---

## 🌟 Características Principales

### 1. Perfil y Aula del Alumno (Personal Clínico)
- **Autenticación Médica**: Registro e inicio de sesión con correo y contraseña, capturando profesión y cédula/matrícula profesional (RUT/DNI) para validez legal del certificado.
- **Catálogo de Cursos Especializados**: Cursos con horas pedagógicas acreditadas, temarios detallados y módulos curriculares.
- **Aula Virtual Inmersiva**: Visor de clases con reproductor de video (YouTube/Vimeo embed), contenido clínico en Markdown con casos de estudio, algoritmos de reanimación y farmacocinética.
- **Seguimiento de Progreso en Tiempo Real**: Marcación de lecciones completadas con casillas de verificación interactivas sincronizadas con la base de datos.
- **Evaluaciones Clínicas (Quizzes)**: Examen de acreditación con calificación automática, preguntas de opción múltiple, retroalimentación pedagógica y control de nota mínima aprobatoria.
- **Generación y Descarga de Certificados PDF**: Descarga directa de certificados en alta resolución con formato horizontal A4, sello institucional, firmas de la dirección médica y código QR dinámico.

### 2. Panel de Administración (Consultora de Salud)
- **Métricas y Resumen**: Total de cursos, horas pedagógicas acreditadas, alumnos inscritos y tasa de aprobación clínica.
- **Gestor de Cursos**: Crear, editar, publicar o pasar a borrador cursos de formación.
- **Control de Estudiantes**: Seguimiento del avance porcentual, notas obtenidas y estado de acreditación de cada profesional.
- **Registro Central de Certificaciones**: Visualización y auditoría de todos los certificados emitidos.

### 3. Sistema de Validación Pública y Código QR (`/verify/[certificateCode]`)
- Cualquier empleador, hospital, clínica o comité de acreditación asistencial puede verificar la legitimidad de un certificado ingresando el código único (ej: `MED-2026-IAAS-9482`) o escaneando el código QR impreso en el PDF.
- Despliega el nombre del profesional, profesión, RUT/matrícula, programa cursado, horas pedagógicas y fecha de emisión oficial.

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router, Server & Client Components, TypeScript).
- **Estilos e Interfaz**: Tailwind CSS con paleta clínica/médica (azul pizarra, blanco quirúrgico, cian y esmeralda) y Lucide React Icons.
- **Base de Datos y Autenticación**: Supabase (`@supabase/ssr` y `@supabase/supabase-js`).
- **Seguridad**: Row Level Security (RLS) en PostgreSQL para aislamiento estricto de datos.
- **Generación de Certificados PDF**: `jspdf`, `html2canvas` y `qrcode` para exportación vectorial/raster de alta fidelidad desde el navegador sin dependencias nativas complejas.

---

## 🚀 Despliegue en Vercel y Configuración de Supabase

### 1. Variables de Entorno (`.env.local` / Vercel Environment Variables)
Copia `.env.example` y configura tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 2. Migración de Base de Datos en Supabase
1. Ingresa a tu panel de **Supabase** -> **SQL Editor**.
2. Abre y copia el archivo `supabase/schema.sql`.
3. Ejecuta el script. Esto creará:
   - Todas las tablas (`profiles`, `courses`, `modules`, `lessons`, `enrollments`, `lesson_progress`, `quizzes`, `quiz_questions`, `quiz_attempts`, `certificates`).
   - Las políticas de seguridad **Row Level Security (RLS)**.
   - El trigger para sincronizar usuarios de `auth.users` a `public.profiles`.
   - Cursos y casos clínicos iniciales de prueba (Trauma ATLS, UCI Farmacología, IAAS).

### 3. Despliegue en Vercel
1. Conecta tu repositorio de GitHub / GitLab en Vercel.
2. Agrega las variables de entorno de Supabase en la configuración del proyecto.
3. El comando de build es `npm run build`.

---

## 🧑‍⚕️ Credenciales de Prueba (Demo Rápido)

Puedes probar de inmediato las interfaces utilizando los selectores de perfil rápido integrados en la barra de navegación:
- **Rol Alumno**: Dra. Camila Valenzuela Méndez (`c.valenzuela@hospital.med`)
- **Rol Administrador**: Dr. Rodrigo Soto Alvarado (`admin@saludcapacita.com`)
- **Certificado de Muestra para Verificación Pública**: `MED-2026-IAAS-9482` en `/verify/MED-2026-IAAS-9482`.
