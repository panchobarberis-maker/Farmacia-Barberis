# Farmacia Barberis — Landing page

Sitio web de una sola página para **Farmacia Barberis**, Onelli 397, San Carlos de Bariloche, Río Negro.

HTML, CSS y JavaScript puros. Sin build, sin dependencias, sin framework: se sirve tal cual está.

## Estructura

```
index.html     Toda la página (hero, servicios, historia, horarios, ubicación)
styles.css     Estilos
script.js      Menú móvil, estado abierto/cerrado, horario del día
fachada.webp   Foto del local (hero)
favicon.svg    Ícono del sitio
og.svg         Imagen para compartir en redes / WhatsApp
vercel.json    Cabeceras y caché
robots.txt     SEO
sitemap.xml    SEO
```

## Ver el sitio localmente

```bash
npx serve .
# o
python3 -m http.server 8000
```

Después abrí http://localhost:8000

## Publicar en Vercel

**Opción A — desde la web (recomendado):**

1. Entrá a https://vercel.com/new
2. Importá el repositorio `panchobarberis-maker/Farmacia-Barberis`
3. Framework Preset: **Other**. Build Command: vacío. Output Directory: vacío (raíz).
4. Deploy.

Cada push a la rama principal vuelve a publicar el sitio automáticamente.

**Opción B — desde la terminal:**

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Qué hay que revisar antes de publicar

Datos confirmados:

- **Teléfono**: 0294 452-4500
- **WhatsApp**: 2944 12-9060 (`https://wa.me/5492944129060`)
- **Horarios**: lunes a sábado de 09:00 a 20:00

Pendientes de confirmar:

- **Domingo**: figura 10:00 – 13:00, es una estimación. Si no abren, borrá la línea `0:` de `HORARIOS` en `script.js`, la fila del domingo en la tabla y su entrada en el JSON-LD.
- **Puntuación de Google**: el JSON-LD declara `ratingValue: 4.5`. Ajustalo al valor real del perfil.

Si cambian los horarios hay que tocar **tres** lugares y deben coincidir:

- `script.js` → constante `HORARIOS` (controla el cartel de "Abierto / Cerrado")
- `index.html` → tabla `#hoursTable`
- `index.html` → bloque `openingHoursSpecification` del JSON-LD
- `index.html` → columna "Horarios" del pie

**Dominio**: las URLs canónicas usan `https://farmacia-barberis.vercel.app/`. Si se conecta un dominio propio, reemplazalo en `index.html`, `robots.txt` y `sitemap.xml`.

## Cambiar los horarios

En `script.js`:

```js
var HORARIOS = {
  0: { abre: "10:00", cierra: "13:00" },  // domingo
  1: { abre: "09:00", cierra: "21:00" },  // lunes
  // ...
};
```

Para un día cerrado, borrá la línea de ese día. El cartel del hero y el bloque
"Hoy" se recalculan solos usando la hora de Argentina, sin importar desde dónde
se visite el sitio.
