import { useEffect, useRef } from 'react';

/**
 * Login backdrop (web): "signals grid" — a faint blueprint grid over the navy
 * ground with glowing teal pulses that travel the lines and briefly light up
 * the intersections they cross. Reads as live leads/signals flowing in.
 * Canvas-based, additive glow. Decorative (pointerEvents none); remove
 * <LoginBackground /> to drop it. Native uses a static grid fallback.
 */
export function LoginBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    if (!ctx || !parent) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const GRID = 46; // px between grid lines
    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cols = Math.ceil(W / GRID);
      rows = Math.ceil(H / GRID);
      canvas.width = Math.max(1, Math.floor(W * DPR));
      canvas.height = Math.max(1, Math.floor(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const TEAL = '39,183,206';
    const TEAL_LT = '95,211,227';

    // A signal travels along one grid line (a row or a column).
    type Signal = {
      axis: 'h' | 'v';
      line: number; // row or column index
      pos: number; // px position of the head along the axis
      speed: number; // px per frame (sign = direction)
      tail: number; // px length of the glowing tail
      rgb: string;
    };
    const signals: Signal[] = [];
    const MAX = 16;

    const spawn = () => {
      const axis: 'h' | 'v' = Math.random() < 0.55 ? 'h' : 'v';
      const line = axis === 'h' ? Math.floor(Math.random() * (rows + 1)) : Math.floor(Math.random() * (cols + 1));
      const span = axis === 'h' ? W : H;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed = (1.1 + Math.random() * 1.6) * dir;
      const tail = 90 + Math.random() * 130;
      signals.push({
        axis,
        line,
        pos: dir > 0 ? -tail : span + tail,
        speed,
        tail,
        rgb: Math.random() < 0.35 ? TEAL_LT : TEAL,
      });
    };

    const drawGrid = () => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(95,211,227,0.06)';
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * GRID;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * GRID;
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();

      // faint node dots at intersections
      ctx.fillStyle = 'rgba(95,211,227,0.10)';
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          ctx.fillRect(c * GRID - 0.8, r * GRID - 0.8, 1.6, 1.6);
        }
      }
    };

    const drawSignal = (s: Signal) => {
      const along = s.axis === 'h' ? W : H;
      const fixed = s.line * GRID;
      const headX = s.axis === 'h' ? s.pos : fixed;
      const headY = s.axis === 'h' ? fixed : s.pos;
      const tailPos = s.pos - Math.sign(s.speed) * s.tail;
      const tailX = s.axis === 'h' ? tailPos : fixed;
      const tailY = s.axis === 'h' ? fixed : tailPos;

      // glowing trail
      const g = ctx.createLinearGradient(tailX, tailY, headX, headY);
      g.addColorStop(0, `rgba(${s.rgb},0)`);
      g.addColorStop(1, `rgba(${s.rgb},0.55)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      // bright head + bloom
      ctx.save();
      ctx.shadowColor = `rgba(${s.rgb},0.9)`;
      ctx.shadowBlur = 14;
      ctx.fillStyle = `rgba(${s.rgb},0.95)`;
      ctx.beginPath();
      ctx.arc(headX, headY, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // light up the intersection the head is nearest to
      const snap = Math.round(s.pos / GRID) * GRID;
      if (Math.abs(snap - s.pos) < 6) {
        const nx = s.axis === 'h' ? snap : fixed;
        const ny = s.axis === 'h' ? fixed : snap;
        ctx.fillStyle = `rgba(${s.rgb},0.5)`;
        ctx.beginPath();
        ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      s.pos += s.speed;
      return s.speed > 0 ? s.pos - s.tail <= along : s.pos + s.tail >= 0;
    };

    let raf = 0;
    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = signals.length - 1; i >= 0; i--) {
        const alive = drawSignal(signals[i]);
        if (!alive) signals.splice(i, 1);
      }
      ctx.restore();
    };

    const loop = () => {
      frame++;
      if (frame % 26 === 0 && signals.length < MAX) spawn();
      render();
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      drawGrid();
    } else {
      for (let i = 0; i < 5; i++) spawn();
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
