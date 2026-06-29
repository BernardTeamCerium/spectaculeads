/**
 * Generates the Spectaculeads app icons (SL mark) as crisp PNGs using pngjs.
 * No native deps: glyphs are rasterized via signed-distance to stroke polylines
 * (analytic anti-aliasing), then area-downsampled to each target size.
 *
 *   node scripts/gen-icons.js preview   # ASCII preview of the mark
 *   node scripts/gen-icons.js           # write PNGs into public/
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const NAVY = [25, 28, 59];
const INDIGO = [32, 35, 78];
const TEAL_DEEP = [26, 138, 160];
const TEAL_LIGHT = [95, 211, 227];
const WHITE = [255, 255, 255];

const M = 1024; // master render resolution

function arc(cx, cy, r, a0, a1, steps = 90) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = (a0 + ((a1 - a0) * i) / steps) * (Math.PI / 180);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

// Build the "S" centerline as two stacked arcs (top + bottom lobe).
function buildS(cx, top, h) {
  const r = h / 4;
  const topC = [cx, top + r];
  const botC = [cx, top + 3 * r];
  // y-down angles: 270=up, 90=down, 0=right, 180=left.
  // Top lobe: leave a gap at lower-right (~30deg); sweep the long way over the top.
  const topArc = arc(topC[0], topC[1], r, 30, -240, 120); // 30 -> over top/left -> down-left
  // Bottom lobe: leave a gap at upper-left (~210deg); sweep the long way under the bottom.
  const botArc = arc(botC[0], botC[1], r, 210, 480, 120); // 210 -> bottom/right -> up-right
  return topArc.concat(botArc);
}

// "L": vertical stroke + horizontal foot.
function buildL(x, top, h, footW) {
  return [
    [x, top],
    [x, top + h],
    [x + footW, top + h],
  ];
}

function distToPolyline(px, py, pts) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = x1 + t * dx;
    const cy = y1 + t * dy;
    const d = Math.hypot(px - cx, py - cy);
    if (d < best) best = d;
  }
  return best;
}

// Render the mark into an RGBA buffer at resolution n. logoScale ~ fraction of canvas.
function renderMaster(n, logoScale, bg) {
  const data = Buffer.alloc(n * n * 4);
  // Glyph geometry in master space, then scaled to n.
  const s = n / M;
  const H = M * logoScale; // glyph height
  const top = (M - H) / 2;
  const hw = H * 0.085; // stroke half-width

  // S lobe radius r = H/4; S spans width ~2r. L vertical + foot.
  const r = H / 4;
  const sW = 2 * r;
  const gap = H * 0.1;
  const footW = H * 0.34;
  const lW = footW;
  const totalW = sW + gap + lW;
  const startX = (M - totalW) / 2;
  const sCx = startX + r;
  const lX = startX + sW + gap;

  const sPts = buildS(sCx, top, H).map(([x, y]) => [x * s, y * s]);
  const lPts = buildL(lX, top, H, footW).map(([x, y]) => [x * s, y * s]);
  const hwn = hw * s;

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = (y * n + x) * 4;
      // background
      let rr = bg[0], gg = bg[1], bb = bg[2];
      // S (teal gradient by diagonal position)
      const ds = distToPolyline(x, y, sPts);
      const covS = Math.max(0, Math.min(1, hwn - ds + 0.5));
      if (covS > 0) {
        const t = Math.max(0, Math.min(1, (x + y) / (2 * n)));
        const tr = TEAL_DEEP[0] + (TEAL_LIGHT[0] - TEAL_DEEP[0]) * t;
        const tg = TEAL_DEEP[1] + (TEAL_LIGHT[1] - TEAL_DEEP[1]) * t;
        const tb = TEAL_DEEP[2] + (TEAL_LIGHT[2] - TEAL_DEEP[2]) * t;
        rr = rr * (1 - covS) + tr * covS;
        gg = gg * (1 - covS) + tg * covS;
        bb = bb * (1 - covS) + tb * covS;
      }
      // L (white)
      const dl = distToPolyline(x, y, lPts);
      const covL = Math.max(0, Math.min(1, hwn - dl + 0.5));
      if (covL > 0) {
        rr = rr * (1 - covL) + WHITE[0] * covL;
        gg = gg * (1 - covL) + WHITE[1] * covL;
        bb = bb * (1 - covL) + WHITE[2] * covL;
      }
      data[i] = Math.round(rr);
      data[i + 1] = Math.round(gg);
      data[i + 2] = Math.round(bb);
      data[i + 3] = 255;
    }
  }
  return { data, n };
}

function areaDownscale(src, sn, dn) {
  const dst = Buffer.alloc(dn * dn * 4);
  for (let y = 0; y < dn; y++) {
    const sy0 = Math.floor((y * sn) / dn);
    const sy1 = Math.max(sy0 + 1, Math.floor(((y + 1) * sn) / dn));
    for (let x = 0; x < dn; x++) {
      const sx0 = Math.floor((x * sn) / dn);
      const sx1 = Math.max(sx0 + 1, Math.floor(((x + 1) * sn) / dn));
      let r = 0, g = 0, b = 0, a = 0, cnt = 0;
      for (let yy = sy0; yy < sy1; yy++) {
        for (let xx = sx0; xx < sx1; xx++) {
          const i = (yy * sn + xx) * 4;
          r += src[i]; g += src[i + 1]; b += src[i + 2]; a += src[i + 3]; cnt++;
        }
      }
      const di = (y * dn + x) * 4;
      dst[di] = Math.round(r / cnt);
      dst[di + 1] = Math.round(g / cnt);
      dst[di + 2] = Math.round(b / cnt);
      dst[di + 3] = Math.round(a / cnt);
    }
  }
  return dst;
}

function writePng(file, data, n) {
  const png = new PNG({ width: n, height: n });
  data.copy(png.data);
  fs.writeFileSync(file, PNG.sync.write(png));
  console.log('wrote', path.relative(process.cwd(), file), `(${n}x${n})`);
}

function asciiPreview(master, n) {
  const cols = 54, rows = 27;
  const ramp = ' .:-=+*#%@';
  let out = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const sx = Math.floor((x / cols) * n);
      const sy = Math.floor((y / rows) * n);
      const i = (sy * n + sx) * 4;
      // brightness relative to indigo bg → highlights the glyph
      const lum = (master[i] + master[i + 1] + master[i + 2]) / 3;
      const k = Math.max(0, Math.min(ramp.length - 1, Math.round((lum / 255) * (ramp.length - 1))));
      out += ramp[k];
    }
    out += '\n';
  }
  console.log(out);
}

const mode = process.argv[2];
if (mode === 'preview') {
  const { data } = renderMaster(M, 0.46, INDIGO);
  asciiPreview(data, M);
} else {
  const outDir = path.join(__dirname, '..', 'public');
  // Full-bleed mark (any) — letters larger.
  const any = renderMaster(M, 0.5, INDIGO);
  // Maskable — letters smaller to sit inside the ~80% safe zone, full-bleed bg.
  const mask = renderMaster(M, 0.38, INDIGO);
  // Apple touch — opaque, slightly smaller letters, navy bg.
  const apple = renderMaster(M, 0.46, NAVY);

  writePng(path.join(outDir, 'icon-512.png'), areaDownscale(any.data, M, 512), 512);
  writePng(path.join(outDir, 'icon-192.png'), areaDownscale(any.data, M, 192), 192);
  writePng(path.join(outDir, 'icon-maskable.png'), areaDownscale(mask.data, M, 512), 512);
  writePng(path.join(outDir, 'apple-touch-icon.png'), areaDownscale(apple.data, M, 180), 180);
  // Refresh the primary icon used elsewhere (manifest fallback / app icon).
  writePng(path.join(outDir, 'icon.png'), areaDownscale(any.data, M, 512), 512);
}
