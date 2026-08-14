# Farmacia Barberis — Landing page

Sitio web de una sola página para **Farmacia Barberis**, Onelli 397, San Carlos de Bariloche, Río Negro.

HTML, CSS y JavaScript puros. Sin build, sin dependencias, sin framework: se sirve tal cual está.

## Estructura

```
index.html     Toda la página (hero, servicios, historia, horarios, ubicación)
styles.css     Estilos
script.js      Menú móvil, estado abierto/cerrado, horario del día
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

Estos datos están cargados con valores estimados y conviene confirmarlos:

- **Horarios**: están en dos lugares y deben coincidir.
  - `script.js` → constante `HORARIOS` (controla el cartel de "Abierto / Cerrado")
  - `index.html` → tabla `#hoursTable` y el bloque `openingHoursSpecification` del JSON-LD
- **WhatsApp**: los botones apuntan a `https://wa.me/542944524500`. Si el WhatsApp del negocio es otro número, cambialo en `index.html`.
- **Puntuación de Google**: el JSON-LD declara `ratingValue: 4.5`. Ajustalo al valor real del perfil.
- **Dominio**: las URLs canónicas usan `https://farmacia-barberis.vercel.app/`. Si se conecta un dominio propio, reemplazalo en `index.html`, `robots.txt` y `sitemap.xml`.

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
