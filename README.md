<div align="center">

# ⚽ Paul Velastegui · Portafolio

**Desarrollador Full Stack** · Estudiante de Ingeniería de Software · Universidad Técnica de Ambato, Ecuador

[![Ver en vivo](https://img.shields.io/badge/Ver_en_vivo-paul--23ve.github.io-10B981?style=for-the-badge&logo=githubpages&logoColor=white&labelColor=0B131E)](https://paul-23ve.github.io)

</div>

Portafolio personal con temática de **fútbol nocturno**: un estadio en 3D que acompaña el recorrido de la página, una intro estilo videojuego y un formulario de contacto que envía los mensajes directo al correo.

## 🏟️ Qué incluye

| Sección | Contenido |
| --- | --- |
| **Intro 3D** | Un futbolista entra al estadio, domina el balón y dispara a la cámara; aparece el nombre. Se entra con cualquier tecla, clic o desplazamiento. |
| **Inicio** | Nombre, cargo (Desarrollador Full Stack), presentación y accesos a proyectos, contacto y CV. |
| **Sobre mí** | Quién soy, **objetivo profesional**, formación, servicios y hobbies. |
| **Habilidades** | Tecnologías de frontend, backend, bases de datos y herramientas. |
| **Terminal** | Una terminal interactiva para explorar el perfil con comandos (`help`, `proyectos`, `cv`…). |
| **Experiencia** | Empresas donde trabajé (Euroman Ecuador) y prácticas preprofesionales (Cooperativa Mushuc Runa Ltda.). |
| **Proyectos** | Cada proyecto con descripción, capturas, tecnologías, créditos del equipo y enlace al repositorio (si es público). Filtros por tipo. |
| **Certificados y CV** | Carrusel 3D de certificados con visor y PDF; CV con vista previa y descarga. |
| **Contacto** | Formulario que envía el mensaje a mi correo, más WhatsApp, LinkedIn, GitHub y redes. |

## 🧰 Stack

- **Next.js 16** (exportación estática) · **React 19** · **TypeScript** · **Tailwind CSS**
- **React Three Fiber / three.js**: estadio 3D de fondo e intro con personaje animado
- **Web3Forms**: envío del formulario de contacto sin servidor ni base de datos
- **GitHub Pages**: publicación del sitio (rama `gh-pages`)

## 🚀 Desarrollo

```bash
npm install
npm run dev      # servidor local en http://localhost:3000
npm run build    # genera el sitio estático en /out
npm run deploy   # compila y publica /out en la rama gh-pages
```

## ✏️ Editar el contenido

Todo el contenido está en [`constants/index.ts`](constants/index.ts):

- `SITE`: nombre, cargo, enlaces y redes.
- `ABOUT`, `OBJECTIVE`, `HOBBIES`, `SERVICES`: sección "Sobre mí".
- `SKILL_GROUPS`: habilidades.
- `PROJECTS`: proyectos (capturas en `public/images/`).
- `CERTIFICATES` y `CV`: certificados (en `public/certificados/`) y currículum (en `public/cv/`).
- `CONTACT_FORM_KEY`: clave pública de Web3Forms para el formulario de contacto.

## 🤝 Créditos

- Basado en la plantilla [Space Portfolio](https://github.com/sanidhyy/space-portfolio) de Sanidhya Kumar Verma, bajo licencia [MIT](LICENSE). Rediseñado con temática de fútbol, escenas 3D y contenido propio.
- Personaje y animaciones de la intro: [Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html) y [Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html) de **Quaternius**, licencia CC0.
- Los proyectos en equipo muestran el crédito de cada colaborador en su tarjeta.
