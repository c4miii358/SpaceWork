import type { Accent } from '../types/quiz';
import type { CardModel } from './cardModel';

// --- Dibujo en canvas ---------------------------------------------------------

const W = 1080;
const H = 1350;
const BG = '#0c0b1d';
const SURFACE = '#17162b';
const LINE = '#2f2e4d';
const TEXT = '#f2f1fa';
const MUTED = '#b3b2cc';
const DISPLAY = '"Bricolage Grotesque Variable", "Trebuchet MS", system-ui, sans-serif';
const BODY = '"Figtree Variable", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

const ACCENT_HEX: Record<Accent, string> = {
  violet: '#8b7bff',
  lime: '#c8f542',
  pink: '#ff5c93',
  cyan: '#3fd8f0',
  amber: '#ffbe3d',
};

/** Divide un texto en líneas que caben en `maxWidth` según la función de medida. */
export function wrapLines(
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
  maxLines = Number.POSITIVE_INFINITY,
): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (current === '' || measure(candidate) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1]}…`;
    return kept;
  }
  return lines;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function loadFonts(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load(`800 120px ${DISPLAY}`),
      document.fonts.load(`700 60px ${DISPLAY}`),
      document.fonts.load(`500 34px ${BODY}`),
      document.fonts.load(`700 38px ${BODY}`),
    ]);
  } catch {
    /* si las fuentes no cargan se usan las de respaldo */
  }
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number,
): number {
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

/** Dibuja la tarjeta (1080×1350) y devuelve un PNG. */
export async function renderCard(model: CardModel): Promise<Blob> {
  await loadFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas no disponible');

  const accent = ACCENT_HEX[model.accent];
  const cx = W / 2;
  const x = 70;
  const y = 70;
  const w = W - 140;
  const h = H - 140;
  const notchY = 940;
  const measure = (text: string) => ctx.measureText(text).width;

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Boleto: cuerpo, borde de acento y muescas laterales.
  roundedRect(ctx, x, y, w, h, 56);
  ctx.fillStyle = SURFACE;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = accent;
  ctx.stroke();

  // Marca
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#c8f542';
  ctx.beginPath();
  ctx.arc(150, 168, 20, 0.9, 5.6);
  ctx.stroke();
  ctx.fillStyle = '#8b7bff';
  ctx.beginPath();
  ctx.arc(150, 168, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = TEXT;
  ctx.font = `700 40px ${BODY}`;
  ctx.fillText('RetoLoop', 190, 182);

  // Emoji y rótulo
  ctx.textAlign = 'center';
  ctx.font = `140px ${EMOJI}`;
  ctx.fillStyle = TEXT;
  ctx.fillText(model.emoji, cx, 360);
  ctx.font = `500 34px ${BODY}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(model.kicker, cx, 440);

  // Resultado principal
  let cursor: number;
  if (model.big) {
    ctx.font = `800 200px ${DISPLAY}`;
    ctx.fillStyle = accent;
    ctx.fillText(model.big, cx, 640);
    ctx.font = `700 64px ${DISPLAY}`;
    ctx.fillStyle = TEXT;
    cursor = drawLines(ctx, wrapLines(measure, model.headline, w - 160, 2), cx, 735, 72);
  } else {
    ctx.font = `800 92px ${DISPLAY}`;
    ctx.fillStyle = TEXT;
    cursor = drawLines(ctx, wrapLines(measure, model.headline, w - 140, 2), cx, 580, 100);
  }

  ctx.font = `500 32px ${BODY}`;
  ctx.fillStyle = MUTED;
  const captionStart = Math.max(cursor, model.big ? 810 : 770);
  drawLines(ctx, wrapLines(measure, model.caption, w - 200, 4), cx, captionStart, 46);

  // Línea punteada y muescas
  ctx.setLineDash([14, 12]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = LINE;
  ctx.beginPath();
  ctx.moveTo(x + 60, notchY);
  ctx.lineTo(x + w - 60, notchY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = BG;
  for (const nx of [x, x + w]) {
    ctx.beginPath();
    ctx.arc(nx, notchY, 36, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = accent;
  ctx.beginPath();
  ctx.arc(x, notchY, 36, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + w, notchY, 36, Math.PI / 2, (Math.PI * 3) / 2);
  ctx.stroke();

  // Talón: cuestionario e invitación
  ctx.font = `700 40px ${BODY}`;
  ctx.fillStyle = TEXT;
  let stubY = drawLines(ctx, wrapLines(measure, model.quizTitle, w - 160, 2), cx, 1030, 52);
  if (model.footnote) {
    ctx.font = `500 28px ${BODY}`;
    ctx.fillStyle = MUTED;
    ctx.fillText(model.footnote, cx, stubY + 8);
    stubY += 48;
  }
  ctx.font = `700 38px ${BODY}`;
  ctx.fillStyle = accent;
  ctx.fillText(model.invite, cx, Math.max(stubY + 40, 1210));

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('No se pudo crear la imagen'))), 'image/png');
  });
}
