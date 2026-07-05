import { useEffect, useRef } from 'react';

/**
 * Login backdrop (web): "aurora ribbons" — soft, layered teal waves that flow
 * across the lower half of the navy screen. Canvas-based with a blur + additive
 * blend for a calm, premium glow. Decorative (pointerEvents none); remove
 * <LoginBackground /> to drop it. Native uses a static glow fallback.
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
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.floor(W * DPR));
      canvas.height = Math.max(1, Math.floor(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // baseY/amp/thickness are fractions of height. rgb is the ribbon colour.
    const ribbons = [
      { base: 0.46, amp: 0.06, thick: 0.15, freq: 1.7, speed: 0.55, rgb: '39,183,206', alpha: 0.34 },
      { base: 0.58, amp: 0.05, thick: 0.18, freq: 1.3, speed: -0.4, rgb: '26,138,160', alpha: 0.32 },
      { base: 0.7, amp: 0.07, thick: 0.2, freq: 2.1, speed: 0.32, rgb: '95,211,227', alpha: 0.26 },
    ];

    let t = 0;
    let raf = 0;

    const drawRibbon = (r: (typeof ribbons)[number], phase: number) => {
      const baseY = r.base * H;
      const amp = r.amp * H;
      const thick = r.thick * H;
      const f = r.freq / W;
      const wave = (x: number, ph: number) =>
        amp * Math.sin(x * f + ph) + 0.35 * amp * Math.sin(x * f * 2.3 + ph * 1.6 + 1.1);

      ctx.beginPath();
      ctx.moveTo(0, baseY + wave(0, phase));
      for (let x = 0; x <= W; x += 10) ctx.lineTo(x, baseY + wave(x, phase));
      for (let x = W; x >= 0; x -= 10) ctx.lineTo(x, baseY + thick + wave(x, phase + 1.4));
      ctx.closePath();

      const g = ctx.createLinearGradient(0, baseY - amp, 0, baseY + thick + amp);
      g.addColorStop(0, `rgba(${r.rgb},0)`);
      g.addColorStop(0.5, `rgba(${r.rgb},${r.alpha})`);
      g.addColorStop(1, `rgba(${r.rgb},0)`);
      ctx.fillStyle = g;
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'blur(28px)';
      for (const r of ribbons) drawRibbon(r, t * r.speed);
      ctx.restore();
    };

    const loop = () => {
      t += 0.01;
      render();
      raf = requestAnimationFrame(loop);
    };

    if (reduce) render();
    else loop();

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
