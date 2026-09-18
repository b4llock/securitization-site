"use client";

import { useEffect, useRef } from "react";

import { isLand } from "@/lib/worldMask";

/* ============================================================================
   Campo de Cessão — the hero's interactive field.

   A left-to-right flow that states the whole business in one image:

     recebíveis        estruturação              capital
     (scattered,       (snapped onto a grid      (nine rails converge into
      cool, round,      of nine rails, square      three brass streams that
      wandering)        and ordered)               accelerate off-screen)

   Chaos is drawn round and cool; structure is drawn square; capital is drawn
   as warm accelerating dashes. The cursor disturbs the scattered side and is
   resisted by the structured side.

   The flow begins on the mark itself: a dotted globe whose continents come
   from the same brand plate the logo is built on, turning slowly under a light
   that falls from the capital side. The scattered receivables drift off its lit
   limb, so the composition reads as origin -> structure -> capital.

   The drawing is paced like an architectural elevation rather than a particle
   demo: fewer marks, firmer rules, and a flow slow enough that you notice it
   without it ever asking for attention.

   Canvas 2D rather than WebGL: no dependency, no shader compile, ~12kb of
   logic, and the composition is line-art, which canvas draws better anyway.
   ========================================================================== */

const ROWS = 9;
const STREAM_OF_ROW = [0, 0, 0, 1, 1, 1, 2, 2, 2] as const;
const STREAM_V = [0.3, 0.5, 0.7] as const;

const ORIGIN_END = 0.26; // end of the scattered zone
const SNAP_SPAN = 0.11; // how long the snap onto a rail takes
const LOCK_END = 0.58; // end of the structured zone
const MERGE_SPAN = 0.16; // how long the merge into a stream takes

const COOL: [number, number, number] = [154, 186, 206];
const BRASS: [number, number, number] = [176, 141, 79];
const INK: [number, number, number] = [11, 28, 40]; // --mc-ink

const TAU = Math.PI * 2;
const DEG = 180 / Math.PI;

const GLOBE_T = 0.16; // where the globe sits along the flow, in flow units
const GLOBE_T_NARROW = 0.42;
const GLOBE_TILT = 0.34; // axis tilt, radians
const GLOBE_SPIN = 0.085; // rad/s — one turn every ~74s
const GLOBE_LIGHT = [0.58, 0.26, 0.77] as const; // from the capital side
const CITY_SHARE = 0.07; // land dots that twinkle brass, like the brand plate
const ALPHA_STEPS = 6; // dots are batched into this many fills per frame

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type GlobeDot = {
  sinLat: number;
  cosLat: number;
  sinLon: number;
  cosLon: number;
  size: number;
  bright: number;
  city: boolean;
  phase: number;
};

type Particle = {
  t: number;
  speed: number;
  row: number;
  scatterV: number;
  wobPhase: number;
  wobAmp: number;
  wobRate: number;
  size: number;
  bright: number;
  dx: number; // cursor-induced displacement, relaxes back to 0
  dy: number;
};

export default function HeroField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const context = node.getContext("2d", { alpha: true });
    if (!context) return;

    // Explicit annotations so the narrowing survives inside the hoisted
    // function declarations below.
    const canvas: HTMLCanvasElement = node;
    const ctx: CanvasRenderingContext2D = context;

    const host = canvas.parentElement ?? canvas;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let globeDots: GlobeDot[] = [];
    let spin = 0.55; // current rotation, radians
    let spinRate = 1; // eased multiplier — the globe quickens under the cursor

    // Scratch buffers — filled once per frame, then drawn in batched passes.
    let bufX = new Float32Array(0);
    let bufY = new Float32Array(0);
    let bufA = new Float32Array(0);
    let bufS = new Float32Array(0);
    let bufMode = new Uint8Array(0);

    // Pointer state, in CSS pixels relative to the canvas.
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;
    let lensX = -9999;
    let lensY = -9999;
    let lensOpacity = 0;
    // Whole-field parallax, eased toward the pointer offset.
    let parallaxX = 0;
    let parallaxY = 0;
    let parallaxTargetX = 0;
    let parallaxTargetY = 0;

    let raf = 0;
    let running = false;
    let lastTs = 0;
    let clock = 0;

    /* ---------------------------------------------------------------- setup */

    function build() {
      const rand = mulberry32(20260913);
      const density = width < 640 ? 3200 : width < 1100 ? 2600 : 2200;
      const count = Math.max(80, Math.min(360, Math.round((width * height) / density / 2.1)));

      particles = new Array(count);
      for (let i = 0; i < count; i++) {
        particles[i] = {
          t: rand(),
          speed: 0.0085 + rand() * 0.011,
          row: Math.floor(rand() * ROWS),
          scatterV: rand(),
          wobPhase: rand() * Math.PI * 2,
          wobAmp: 0.008 + rand() * 0.032,
          wobRate: 0.12 + rand() * 0.24,
          size: 1.25 + rand() * 0.9,
          bright: rand() < 0.07 ? 1.4 : 0.78 + rand() * 0.34,
          dx: 0,
          dy: 0,
        };
      }

      bufX = new Float32Array(count);
      bufY = new Float32Array(count);
      bufA = new Float32Array(count);
      bufS = new Float32Array(count);
      bufMode = new Uint8Array(count);

      buildGlobe();
    }

    // A Fibonacci lattice keeps the dots evenly spread whatever the count, and
    // the land mask throws away everything that would fall in the sea. Only the
    // survivors are stored, so the per-frame loop is already the drawn set.
    function buildGlobe() {
      const r = globeRadius();
      if (r < 24) {
        globeDots = [];
        return;
      }
      const samples = Math.max(1600, Math.min(6400, Math.round(r * r * 0.26)));
      const rand = mulberry32(19730426);
      const golden = Math.PI * (3 - Math.sqrt(5));
      const dots: GlobeDot[] = [];

      for (let i = 0; i < samples; i++) {
        const sinLat = 1 - ((i + 0.5) / samples) * 2;
        const lonRad = ((i * golden) % TAU) - Math.PI;
        if (!isLand(Math.asin(sinLat) * DEG, lonRad * DEG)) continue;
        dots.push({
          sinLat,
          cosLat: Math.sqrt(Math.max(0, 1 - sinLat * sinLat)),
          sinLon: Math.sin(lonRad),
          cosLon: Math.cos(lonRad),
          size: 0.95 + rand() * 0.58,
          bright: 0.7 + rand() * 0.45,
          city: rand() < CITY_SHARE,
          phase: rand() * TAU,
        });
      }

      globeDots = dots;
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      const nextW = Math.max(1, Math.round(rect.width));
      const nextH = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      if (nextW === width && nextH === height) return;
      width = nextW;
      height = nextH;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(0);
    }

    /* ------------------------------------------------------------- geometry */

    // Horizontal band the flow occupies, and the x mapping that lets the flow
    // bleed past both edges so it reads as passing through, not starting here.
    // On wide screens the headline owns the left half, so the whole flow is
    // anchored to the right of it — otherwise the scattered and structured
    // zones sit under the type and only the exit streams ever read.
    function isNarrow() {
      return width < 1024;
    }
    function bandHeight() {
      return Math.min(height * 0.82, isNarrow() ? 460 : 640);
    }
    function centerY() {
      return height * (isNarrow() ? 0.52 : 0.5);
    }
    function fieldAlpha() {
      // The field sits under the copy on narrow screens; hold it back there.
      return isNarrow() ? 0.6 : 1;
    }
    function armatureAlpha() {
      // Rails and streams are the highest-contrast marks and the ones that
      // would cut through body copy on a phone, so they are damped further.
      return isNarrow() ? 0.28 : 1;
    }
    function fx(t: number) {
      const originX = isNarrow() ? -0.09 : 0.32;
      const spanX = isNarrow() ? 1.18 : 0.74;
      return (originX + t * spanX) * width + parallaxX;
    }
    function fy(v: number) {
      return centerY() + (v - 0.5) * bandHeight() + parallaxY;
    }
    function rowV(row: number) {
      return 0.1 + (row / (ROWS - 1)) * 0.8;
    }

    // Sized against the band, not the viewport, so it stays in proportion with
    // the rails it feeds; capped against width so it never crowds the headline.
    function globeRadius() {
      return isNarrow()
        ? Math.min(bandHeight() * 0.26, width * 0.34)
        : Math.min(bandHeight() * 0.24, width * 0.115);
    }
    function globeX() {
      return fx(isNarrow() ? GLOBE_T_NARROW : GLOBE_T);
    }
    function globeY() {
      return fy(0.5);
    }

    /* ----------------------------------------------------------------- draw */

    function drawArmature() {
      const c = ctx;
      const railStart = fx(ORIGIN_END + SNAP_SPAN * 0.55);
      const railEnd = fx(LOCK_END);
      const gateA = fx(ORIGIN_END);
      const gateB = fx(LOCK_END);
      const top = fy(0.06);
      const bottom = fy(0.94);

      // Structured rails — nine hairlines, fading in at the snap point.
      c.lineWidth = 1;
      for (let r = 0; r < ROWS; r++) {
        const y = Math.round(fy(rowV(r))) + 0.5;
        const grad = c.createLinearGradient(railStart, 0, railEnd, 0);
        grad.addColorStop(0, "rgba(154,186,206,0)");
        grad.addColorStop(0.16, `rgba(154,186,206,${0.4 * armatureAlpha()})`);
        grad.addColorStop(0.86, `rgba(154,186,206,${0.4 * armatureAlpha()})`);
        grad.addColorStop(1, `rgba(154,186,206,${0.1 * armatureAlpha()})`);
        c.strokeStyle = grad;
        c.beginPath();
        c.moveTo(railStart, y);
        c.lineTo(railEnd, y);
        c.stroke();
      }

      // Grid uprights inside the structured zone.
      const uprights = 6;
      for (let i = 1; i < uprights; i++) {
        const x = Math.round(lerp(railStart, railEnd, i / uprights)) + 0.5;
        const grad = c.createLinearGradient(0, fy(0.1), 0, fy(0.9));
        grad.addColorStop(0, "rgba(154,186,206,0)");
        grad.addColorStop(0.5, `rgba(154,186,206,${0.2 * armatureAlpha()})`);
        grad.addColorStop(1, "rgba(154,186,206,0)");
        c.strokeStyle = grad;
        c.beginPath();
        c.moveTo(x, fy(0.1));
        c.lineTo(x, fy(0.9));
        c.stroke();
      }

      // The two gates: where scatter becomes structure, and structure becomes capital.
      for (const [gx, warm] of [
        [gateA, false],
        [gateB, true],
      ] as const) {
        const x = Math.round(gx) + 0.5;
        const grad = c.createLinearGradient(0, top, 0, bottom);
        const base = warm ? "176,141,79" : "154,186,206";
        grad.addColorStop(0, `rgba(${base},0)`);
        grad.addColorStop(0.5, `rgba(${base},${(warm ? 0.62 : 0.48) * armatureAlpha()})`);
        grad.addColorStop(1, `rgba(${base},0)`);
        c.strokeStyle = grad;
        c.beginPath();
        c.moveTo(x, top);
        c.lineTo(x, bottom);
        c.stroke();

        // Tick marks where each rail meets the gate.
        c.strokeStyle = `rgba(${base},${(warm ? 0.85 : 0.65) * armatureAlpha()})`;
        for (let r = 0; r < ROWS; r++) {
          const y = Math.round(fy(rowV(r))) + 0.5;
          c.beginPath();
          c.moveTo(x - 3, y);
          c.lineTo(x + 3, y);
          c.stroke();
        }
      }

      // Consolidation spines: nine rails bending into three streams.
      for (let r = 0; r < ROWS; r++) {
        const y0 = fy(rowV(r));
        const y1 = fy(STREAM_V[STREAM_OF_ROW[r]]);
        const x0 = gateB;
        const x1 = fx(LOCK_END + MERGE_SPAN);
        const x2 = fx(1.02);
        const grad = c.createLinearGradient(x0, 0, x2, 0);
        grad.addColorStop(0, `rgba(176,141,79,${0.42 * armatureAlpha()})`);
        grad.addColorStop(0.55, `rgba(176,141,79,${0.32 * armatureAlpha()})`);
        grad.addColorStop(1, "rgba(176,141,79,0)");
        c.strokeStyle = grad;
        c.beginPath();
        c.moveTo(x0, y0);
        c.bezierCurveTo(lerp(x0, x1, 0.55), y0, lerp(x0, x1, 0.45), y1, x1, y1);
        c.lineTo(x2, y1);
        c.stroke();
      }
    }

    /* ---------------------------------------------------------------- globe */

    // Orthographic projection by hand: rotate about the pole, tilt about x,
    // then drop z. The dots carry sin/cos of their own longitude so the spin
    // costs an angle-addition rather than two trig calls per dot per frame.
    function drawGlobe() {
      const c = ctx;
      const r = globeRadius();
      if (r < 24 || globeDots.length === 0) return;

      const cx = globeX();
      const cy = globeY();
      const alpha = fieldAlpha();
      const sinSpin = Math.sin(spin);
      const cosSpin = Math.cos(spin);
      const sinTilt = Math.sin(GLOBE_TILT);
      const cosTilt = Math.cos(GLOBE_TILT);
      const [lx, ly, lz] = GLOBE_LIGHT;

      // An ink disc first: the rails and the gate have already been drawn, and
      // this is what makes them read as passing behind the planet rather than
      // through it. Over the section's own ink background it is invisible.
      c.fillStyle = `rgba(${INK[0]},${INK[1]},${INK[2]},${0.78 * alpha})`;
      c.beginPath();
      c.arc(cx, cy, r, 0, TAU);
      c.fill();

      // Body: a held-back sphere, lit from the same side as the flow's exit.
      const body = c.createRadialGradient(
        cx + r * 0.3,
        cy - r * 0.32,
        r * 0.04,
        cx,
        cy,
        r,
      );
      body.addColorStop(0, `rgba(154,186,206,${0.1 * alpha})`);
      body.addColorStop(0.55, `rgba(154,186,206,${0.042 * alpha})`);
      body.addColorStop(1, "rgba(154,186,206,0)");
      c.fillStyle = body;
      c.beginPath();
      c.arc(cx, cy, r, 0, TAU);
      c.fill();

      // Atmosphere: a thin bloom outside the limb, so the sphere sits in front
      // of the field instead of being cut out of it.
      const halo = c.createRadialGradient(cx, cy, r * 0.93, cx, cy, r * 1.16);
      halo.addColorStop(0, `rgba(154,186,206,${0.11 * alpha})`);
      halo.addColorStop(1, "rgba(154,186,206,0)");
      c.fillStyle = halo;
      c.beginPath();
      c.arc(cx, cy, r * 1.16, 0, TAU);
      c.fill();

      // Land, batched into a handful of alpha steps: one fill per step instead
      // of one per dot, which is what keeps a few thousand of them cheap.
      const steps: Path2D[] = [];
      for (let i = 0; i < ALPHA_STEPS; i++) steps.push(new Path2D());
      const far = new Path2D();
      const cities: { x: number; y: number; s: number; a: number }[] = [];

      for (let i = 0; i < globeDots.length; i++) {
        const d = globeDots[i];
        // Longitude + spin, as an angle addition.
        const sinA = d.sinLon * cosSpin + d.cosLon * sinSpin;
        const cosA = d.cosLon * cosSpin - d.sinLon * sinSpin;
        const x = d.cosLat * sinA;
        const yUp = d.sinLat * cosTilt - d.cosLat * cosA * sinTilt;
        const z = d.sinLat * sinTilt + d.cosLat * cosA * cosTilt;

        const sx = cx + x * r;
        const sy = cy - yUp * r;

        if (z <= 0) {
          // The far side stays as a whisper — enough to read as a sphere you
          // can see through, never enough to muddy the near side.
          const s = d.size * 0.62;
          far.moveTo(sx + s, sy);
          far.arc(sx, sy, s, 0, TAU);
          continue;
        }

        const light = Math.max(0, x * lx + yUp * ly + z * lz);
        const a = (0.16 + 0.84 * light) * (0.42 + 0.58 * z) * d.bright * alpha;
        if (a <= 0.02) continue;
        const s = d.size * (0.74 + 0.26 * z);

        if (d.city) {
          const twinkle = 0.55 + 0.45 * Math.sin(clock * 0.9 + d.phase);
          cities.push({ x: sx, y: sy, s: s * 1.45, a: Math.min(1, a * twinkle * 1.6) });
          continue;
        }

        const step = Math.min(ALPHA_STEPS - 1, Math.floor(a * ALPHA_STEPS));
        steps[step].moveTo(sx + s, sy);
        steps[step].arc(sx, sy, s, 0, TAU);
      }

      c.fillStyle = `rgba(${COOL[0]},${COOL[1]},${COOL[2]},1)`;
      c.globalAlpha = 0.07 * alpha;
      c.fill(far);
      for (let i = 0; i < ALPHA_STEPS; i++) {
        c.globalAlpha = ((i + 0.65) / ALPHA_STEPS) * 0.92;
        c.fill(steps[i]);
      }

      // City nodes: the brand plate's lit capitals, carried onto the sphere.
      c.fillStyle = `rgba(${BRASS[0]},${BRASS[1]},${BRASS[2]},1)`;
      for (let i = 0; i < cities.length; i++) {
        const node = cities[i];
        c.globalAlpha = node.a;
        c.beginPath();
        c.arc(node.x, node.y, node.s, 0, TAU);
        c.fill();
      }
      c.globalAlpha = 1;

      // The mark's ring, brass where the light lands.
      const ring = c.createLinearGradient(cx - r, cy, cx + r, cy);
      ring.addColorStop(0, `rgba(154,186,206,${0.08 * alpha})`);
      ring.addColorStop(0.45, `rgba(154,186,206,${0.2 * alpha})`);
      ring.addColorStop(1, `rgba(176,141,79,${0.46 * alpha})`);
      c.strokeStyle = ring;
      c.lineWidth = 1.1;
      c.beginPath();
      c.arc(cx, cy, r, 0, TAU);
      c.stroke();
    }

    function drawLens() {
      if (lensOpacity <= 0.01 || isNarrow()) return;
      const c = ctx;
      c.save();
      c.globalAlpha = lensOpacity;
      c.strokeStyle = "rgba(176,141,79,0.5)";
      c.lineWidth = 1;
      c.beginPath();
      c.arc(lensX, lensY, 46, 0, Math.PI * 2);
      c.stroke();
      c.strokeStyle = "rgba(176,141,79,0.75)";
      for (const [ax, ay] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        c.beginPath();
        c.moveTo(lensX + ax * 40, lensY + ay * 40);
        c.lineTo(lensX + ax * 52, lensY + ay * 52);
        c.stroke();
      }
      c.restore();
    }

    function draw(dt: number) {
      const c = ctx;
      c.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      // Ease the field toward the pointer for a slow parallax plane.
      parallaxX += (parallaxTargetX - parallaxX) * Math.min(1, dt * 1.5);
      parallaxY += (parallaxTargetY - parallaxY) * Math.min(1, dt * 1.5);
      lensX += (pointerX - lensX) * Math.min(1, dt * 5.5);
      lensY += (pointerY - lensY) * Math.min(1, dt * 5.5);
      const lensTarget = pointerActive ? 1 : 0;
      lensOpacity += (lensTarget - lensOpacity) * Math.min(1, dt * 6);

      // The globe quickens while the cursor is on it, then settles back.
      const overGlobe =
        pointerActive &&
        Math.hypot(pointerX - globeX(), pointerY - globeY()) < globeRadius() * 1.35;
      spinRate += ((overGlobe ? 2.4 : 1) - spinRate) * Math.min(1, dt * 1.6);
      spin += GLOBE_SPIN * spinRate * dt;

      drawArmature();
      drawGlobe();

      const band = bandHeight();
      const influence = 130;
      const influenceSq = influence * influence;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (dt > 0) {
          p.t += p.speed * dt;
          if (p.t > 1) p.t -= 1;
        }
        const t = p.t;

        const wob =
          Math.sin(clock * p.wobRate + p.wobPhase) * p.wobAmp +
          Math.sin(clock * p.wobRate * 0.41 + p.wobPhase * 1.7) * p.wobAmp * 0.6;
        const scatterV = 0.5 + (p.scatterV - 0.5) * 0.94 + wob;
        const railV = rowV(p.row);
        const streamV = STREAM_V[STREAM_OF_ROW[p.row]];

        let v: number;
        let mode: number;
        if (t < LOCK_END) {
          const k = smoothstep(ORIGIN_END, ORIGIN_END + SNAP_SPAN, t);
          v = lerp(scatterV, railV, k);
          mode = k > 0.85 ? 1 : 0;
        } else {
          const k = smoothstep(LOCK_END, LOCK_END + MERGE_SPAN, t);
          v = lerp(railV, streamV, k);
          mode = 2;
        }

        let x = fx(t);
        let y = fy(v);

        // Cursor interaction: the scattered side is disturbed, the structured
        // side resists and only brightens. That asymmetry is the whole point.
        let boost = 0;
        if (pointerActive) {
          const ddx = x - pointerX;
          const ddy = y - pointerY;
          const distSq = ddx * ddx + ddy * ddy;
          if (distSq < influenceSq) {
            const dist = Math.sqrt(distSq) || 1;
            const falloff = 1 - dist / influence;
            boost = falloff * falloff;
            if (mode === 0) {
              const push = falloff * falloff * 22;
              p.dx += ((ddx / dist) * push - p.dx) * Math.min(1, dt * 6);
              p.dy += ((ddy / dist) * push - p.dy) * Math.min(1, dt * 6);
            }
          }
        }
        p.dx += (0 - p.dx) * Math.min(1, dt * 1.8);
        p.dy += (0 - p.dy) * Math.min(1, dt * 1.8);
        x += p.dx;
        y += p.dy;

        const envelope = smoothstep(0, 0.05, t) * (1 - smoothstep(0.9, 1, t));
        bufX[i] = x;
        bufY[i] = y;
        bufS[i] = p.size;
        bufMode[i] = mode;
        bufA[i] = Math.min(1, envelope * p.bright * (0.8 + boost * 0.7) * fieldAlpha());
      }

      // Pass 1 — scattered receivables: round, cool, unresolved.
      c.fillStyle = `rgba(${COOL[0]},${COOL[1]},${COOL[2]},1)`;
      for (let i = 0; i < particles.length; i++) {
        if (bufMode[i] !== 0 || bufA[i] <= 0.01) continue;
        c.globalAlpha = bufA[i] * 0.8;
        c.beginPath();
        c.arc(bufX[i], bufY[i], bufS[i], 0, Math.PI * 2);
        c.fill();
      }

      // Pass 2 — structured: square, aligned, sitting on the rails.
      for (let i = 0; i < particles.length; i++) {
        if (bufMode[i] !== 1 || bufA[i] <= 0.01) continue;
        const s = bufS[i] * 1.5;
        c.globalAlpha = bufA[i];
        c.fillStyle = `rgba(${COOL[0]},${COOL[1]},${COOL[2]},1)`;
        c.fillRect(Math.round(bufX[i] - s / 2), Math.round(bufY[i] - s / 2), s, s);
      }

      // Pass 3 — capital: warm dashes that lengthen as they accelerate out.
      c.lineCap = "round";
      for (let i = 0; i < particles.length; i++) {
        if (bufMode[i] !== 2 || bufA[i] <= 0.01) continue;
        const p = particles[i];
        const accel = smoothstep(LOCK_END, 1, p.t);
        const len = 5 + accel * 20;
        c.globalAlpha = bufA[i];
        c.strokeStyle = `rgba(${BRASS[0]},${BRASS[1]},${BRASS[2]},1)`;
        c.lineWidth = bufS[i] * 1.1;
        c.beginPath();
        c.moveTo(bufX[i] - len, bufY[i]);
        c.lineTo(bufX[i], bufY[i]);
        c.stroke();
      }

      c.globalAlpha = 1;
      drawLens();
      void band;
    }

    /* ----------------------------------------------------------------- loop */

    function frame(ts: number) {
      if (!running) return;
      const dt = lastTs === 0 ? 0.016 : Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      clock += dt;
      draw(dt);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion.matches) return;
      running = true;
      lastTs = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    /* -------------------------------------------------------------- pointer */

    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (!pointerActive) {
        lensX = pointerX;
        lensY = pointerY;
      }
      pointerActive = true;
      parallaxTargetX = (pointerX / Math.max(1, width) - 0.5) * -16;
      parallaxTargetY = (pointerY / Math.max(1, height) - 0.5) * -11;
    }

    function onPointerLeave() {
      pointerActive = false;
      pointerX = -9999;
      pointerY = -9999;
      parallaxTargetX = 0;
      parallaxTargetY = 0;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    /* ------------------------------------------------------------ lifecycle */

    resize();

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(host);

    const target = host as HTMLElement;
    target.addEventListener("pointermove", onPointerMove, { passive: true });
    target.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionPreferenceChange = () => {
      if (reduceMotion.matches) {
        stop();
        draw(0);
      } else {
        start();
      }
    };
    reduceMotion.addEventListener("change", onMotionPreferenceChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      target.removeEventListener("pointermove", onPointerMove);
      target.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionPreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
