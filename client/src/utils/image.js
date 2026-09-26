// Procesa la imagen que el usuario sube para una tarjeta: la recorta a la
// proporción estándar de una tarjeta de crédito (ISO/IEC 7810, 1.586:1) y la
// reescala a una resolución nítida (HD). Así, sin importar el tamaño o la
// forma de la foto original, siempre se ve completa dentro del contenedor,
// sin desbordarse ni deformarse.

const CARD_RATIO = 1.586; // ancho / alto
const TARGET_WIDTH = 1200;
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
          const canvas = document.createElement('canvas');
          canvas.width = TARGET_WIDTH;
          canvas.height = TARGET_HEIGHT;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          const srcRatio = img.width / img.height;
          let sx, sy, sw, sh;
          if (srcRatio > CARD_RATIO) {
            // la foto es más ancha que la tarjeta: recorta los lados
            sh = img.height;
            sw = sh * CARD_RATIO;
            sx = (img.width - sw) / 2;
            sy = 0;
          } else {
            // la foto es más alta que la tarjeta: recorta arriba/abajo
            sw = img.width;
            sh = sw / CARD_RATIO;
            sx = 0;
            sy = (img.height - sh) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
