'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  distributeSphere,
  frameAt,
  gaussianFalloff,
  HOLD_FORCE,
  POINTS,
  projectPoint,
  stepSpring,
  WAVE_IMPULSE,
  WAVE_RADIUS_FACTOR,
} from '@/lib/particle-sphere';

interface ParticleSphereProps {
  size?: number;
  className?: string;
}

// Арт-сфера из точек (fibonacci-распределение): медленно вращается с лёгкой
// прецессией, точки у силуэта ярче и крупнее. Тап толкает точки волной от
// эпицентра; зажатый палец выдавливает их непрерывно и «дырка» едет за ним.
//
// Раскладка: в потоке стоит невидимый якорь size×size - он задаёт положение
// сферы (двигается отступами/порядком как обычный блок). Рисование - на
// canvas во весь экран (pointer-events: none, клики проходят насквозь),
// поэтому у разлёта нет границ. Жесты слушаются на window: начатый в сфере
// жест корректно отпускается где угодно.
export function ParticleSphere({ size = 224, className }: ParticleSphereProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Canvas рисуем порталом в body: внутри трансформируемого предка (ScreenTransition)
  // position: fixed искажается, и на входе сфера сплющивается. Портал ставит его
  // прямо во вьюпорт. Флаг ставим после первого кадра - без рассинхрона гидрации.
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPortalReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const anchor = anchorRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!anchor || !canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const radius = (size / 2) * 0.92 * dpr;
    const sigma = radius * WAVE_RADIUS_FACTOR;
    let centerX = 0;
    let centerY = 0;

    // Центр сферы - центр якоря; буфер canvas - весь вьюпорт.
    // Смена width/height стирает canvas, поэтому буфер трогаем только по делу.
    const resize = () => {
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;

      const rect = anchor.getBoundingClientRect();
      centerX = (rect.left + rect.width / 2) * dpr;
      centerY = (rect.top + rect.height / 2) * dpr;
    };
    resize();

    const points = distributeSphere(POINTS);

    // Смещения волны (ox, oy, vx, vy на точку) и экранные позиции точек.
    const offsets = new Float32Array(POINTS * 4);
    const screen = new Float32Array(POINTS * 2);
    const hold = { active: false, x: 0, y: 0 };

    const color = getComputedStyle(canvas).color;

    const drawFrame = (t: number) => {
      const f = frameAt(t);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      for (let i = 0; i < POINTS; i++) {
        const { x, y, edge } = projectPoint(points[i], f);

        const px = centerX + x * radius + offsets[i * 4];
        const py = centerY + y * radius + offsets[i * 4 + 1];
        screen[i * 2] = px;
        screen[i * 2 + 1] = py;

        // У силуэта (edge→1) точки ярче и крупнее - объём читается без 3D.
        ctx.globalAlpha = 0.16 + edge * 0.84;
        ctx.beginPath();
        ctx.arc(px, py, (0.65 + edge * 0.75) * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const stepWave = (dt: number) => {
      for (let i = 0; i < POINTS; i++) {
        const j = i * 4;
        const ox = offsets[j];
        const oy = offsets[j + 1];
        let vx = offsets[j + 2];
        let vy = offsets[j + 3];

        if (hold.active) {
          // Зажатый палец непрерывно выдавливает точки от себя.
          const dx = screen[i * 2] - hold.x;
          const dy = screen[i * 2 + 1] - hold.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = HOLD_FORCE * dpr * gaussianFalloff(d, sigma) * dt;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        } else if (ox * ox + oy * oy + vx * vx + vy * vy < 0.01) {
          continue;
        }

        [offsets[j], offsets[j + 2]] = stepSpring(ox, vx, dt);
        [offsets[j + 1], offsets[j + 3]] = stepSpring(oy, vy, dt);
      }
    };

    // Тап внутри сферы: разовый толчок от эпицентра + включение удержания.
    const onDown = (e: PointerEvent) => {
      const x = e.clientX * dpr;
      const y = e.clientY * dpr;
      if (Math.hypot(x - centerX, y - centerY) > radius * 1.05) return;

      hold.active = true;
      hold.x = x;
      hold.y = y;

      for (let i = 0; i < POINTS; i++) {
        const dx = screen[i * 2] - x;
        const dy = screen[i * 2 + 1] - y;
        const d = Math.hypot(dx, dy) || 1;
        const kick = WAVE_IMPULSE * dpr * gaussianFalloff(d, sigma);
        offsets[i * 4 + 2] += (dx / d) * kick;
        offsets[i * 4 + 3] += (dy / d) * kick;
      }
    };

    // Проводка: «дырка» едет за пальцем, покинутые места затягиваются пружиной.
    const onMove = (e: PointerEvent) => {
      if (!hold.active) return;

      hold.x = e.clientX * dpr;
      hold.y = e.clientY * dpr;
    };

    const onEnd = () => {
      hold.active = false;
    };

    let raf = 0;
    let last = 0;
    let start = 0;
    const loop = (now: number) => {
      const t = now / 1000;
      const dt = Math.min(t - (last || t), 0.05);
      last = t;
      if (!start) start = t;

      // Первые полсекунды входная анимация экрана двигает якорь - доводим центр.
      if (t - start < 0.5) resize();

      stepWave(dt);
      drawFrame(t);
      raf = requestAnimationFrame(loop);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      drawFrame(0);
      return;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      cancelAnimationFrame(raf);
    };
  }, [size, portalReady]);

  return (
    <>
      <div
        ref={anchorRef}
        aria-hidden="true"
        className={className}
        style={{ width: size, height: size }}
      />
      {portalReady &&
        createPortal(
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="text-foreground pointer-events-none fixed inset-0 h-screen w-screen"
          />,
          document.body,
        )}
    </>
  );
}
