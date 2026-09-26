// Procesa la imagen que el usuario sube para una tarjeta:
// 1) detecta y recorta el margen blanco/transparente "de sobra" que traen
//    muchas fotos y mockups (para que no quede un marco vacío alrededor),
// 2) recorta lo que queda a la proporción estándar de una tarjeta de
//    crédito (ISO/IEC 7810, 1.586:1),
// 3) la reescala a una resolución nítida (HD).
// Así, sin importar el tamaño, forma o el margen que traiga la foto
// original, la tarjeta llena todo el espacio, sin desbordarse ni deformarse.

const CARD_RATIO = 1.586; // ancho / alto
const TARGET_WIDTH = 1600;
const TARGET_HEIGHT = Math.round(TARGET_WIDTH / CARD_RATIO);

export function processCardImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo procesar la imagen.'));
      img.onload = () => {
        try {
          const content = findContentBounds(img);

          const canvas = document.createElement('canvas');
          canvas.width = TARGET_WIDTH;
          canvas.height = TARGET_HEIGHT;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Muchas fotos/logos (PNG, WEBP, etc.) tienen fondo transparente.
          // JPEG no soporta transparencia: sin este relleno, esas zonas se
          // pintan de negro solas al exportar. Lo dejamos blanco primero.
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

          // A partir de aquí trabajamos solo sobre el área "con contenido"
          // (content), no sobre la imagen completa, para no volver a meter
          // el margen que acabamos de detectar y descartar.
          const { x: cx, y: cy, width: cw, height: ch } = content;
          const srcRatio = cw / ch;
          let sx, sy, sw, sh;
          if (srcRatio > CARD_RATIO) {
            sh = ch;
            sw = sh * CARD_RATIO;
            sx = cx + (cw - sw) / 2;
            sy = cy;
          } else {
            sw = cw;
            sh = sw / CARD_RATIO;
            sx = cx;
            sy = cy + (ch - sh) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Encuentra el rectángulo de la imagen que tiene contenido "real",
// ignorando el margen blanco o transparente de alrededor (típico de
// mockups, logos exportados con canvas de sobra, capturas con bordes, etc.)
function findContentBounds(img) {
  // Analizamos en baja resolución: es mucho más rápido y el resultado es
  // igual de bueno para detectar dónde empieza/termina el contenido.
  const SCAN = 220;
  const scale = Math.min(1, SCAN / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const fallback = { x: 0, y: 0, width: img.width, height: img.height };

  let data;
  try {
    const scanCanvas = document.createElement('canvas');
    scanCanvas.width = w;
    scanCanvas.height = h;
    const sctx = scanCanvas.getContext('2d');
    sctx.drawImage(img, 0, 0, w, h);
    data = sctx.getImageData(0, 0, w, h).data;
  } catch {
    // Si el navegador no deja leer los píxeles, usamos la imagen completa.
    return fallback;
  }

  const WHITE = 246; // umbral: más claro que esto se considera "vacío"
  let minX = w, minY = h, maxX = -1, maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 12) continue; // transparente
      if (data[i] > WHITE && data[i + 1] > WHITE && data[i + 2] > WHITE) continue; // casi blanco
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) {
    // Toda la imagen es blanca/transparente: no hay nada que recortar.
    return fallback;
  }

  // Un pequeño margen para no pegarnos justo al borde del contenido.
  const padX = (maxX - minX) * 0.04;
  const padY = (maxY - minY) * 0.04;
  minX = Math.max(0, minX - padX);
  minY = Math.max(0, minY - padY);
  maxX = Math.min(w - 1, maxX + padX);
  maxY = Math.min(h - 1, maxY + padY);

  // Escalamos las coordenadas de vuelta al tamaño real de la imagen.
  return {
    x: minX / scale,
    y: minY / scale,
    width: (maxX - minX) / scale,
    height: (maxY - minY) / scale,
  };
}
