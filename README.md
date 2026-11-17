# Paul Velastegui · Portafolio

Portafolio de **Paul Velastegui**, desarrollador full stack y estudiante de Ingeniería de Software (Universidad Técnica de Ambato, Ecuador).

🔗 **En vivo:** https://paul-23ve.github.io

## Secciones

- **Inicio** con presentación y accesos directos.
- **Sobre mí**: quién soy, formación y qué hago.
- **Habilidades**: frontend, backend, bases de datos y herramientas.
- **Proyectos**: Mushuc Granja (pasantías), FuelWise, Farma Ya, Marketplace Multiempresa y Pixel Odyssey. Cada uno es una escena 3D con sus capturas apiladas en profundidad que pasan solas, con filtros por tipo y visor ampliado.
- **Certificados y CV**: carrusel 3D con los certificados (visor ampliado y PDF) y el CV con vista previa y descarga.
- **Contacto**: formulario (abre tu cliente de correo), copia de email y redes.

## Stack

Next.js 16 (exportación estática) · React 19 · TypeScript · Tailwind CSS · Framer Motion · React Three Fiber (fondo de estrellas).

## Desarrollo

```bash
npm install
npm run dev      # servidor local en http://localhost:3000
npm run build    # genera el sitio estático en /out
npm run deploy   # compila y publica /out en la rama gh-pages
```

## Editar el contenido

Todo el contenido (textos, habilidades, proyectos, enlaces) está en [`constants/index.ts`](constants/index.ts). Las capturas de los proyectos van en `public/images/`.

Para mostrar el botón **Descargar CV**, sube el PDF a `public/` y pon su ruta en `SITE.cv`.

## Créditos

Basado en la plantilla [Space Portfolio](https://github.com/sanidhyy/space-portfolio) de Sanidhya Kumar Verma, bajo licencia [MIT](LICENSE). Adaptado y ampliado con contenido propio, secciones nuevas (Sobre mí, Contacto), galería de proyectos y diseño responsive.
