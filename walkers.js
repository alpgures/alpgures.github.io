/* Hero walkers v11 — eleven people, two cats, a lived-in city (Round 21).
   v11 (Alp, Nov 16: 'still slightly sluggish'): the v10 gait unchanged, at a
   city-walk cadence. Paces 9-23 u/s (v10: 7-15), strides 11-25 u, so
   1.4-2.2 steps/s (v10: 1.1-1.6), and wider bands so the longer walks fit.

   Alp (Nov 16): 'their torsos move ahead of them, and they just kick back',
   'don't make them move too slowly and at the same pace', 'add more people',
   'these look like zombies'.

   v10 replaces the gait model. v9 swung the legs from a phase while the body
   slid along a rail and the whole figure leaned about its FEET (3.5deg put
   the head ~4 scene units ahead of the toes), with 0.3-leg-length steps and a
   smoothstep speed curve that spent most of every walk speeding up or slowing
   down. Now:

   - FEET ARE PLANTED IN THE WORLD. Each foot's ground contact is a fixed
     street position for the whole stance (61% of the cycle: double support at
     each step). Within stance the foot rolls heel -> flat -> ball: heel strike
     with the toes up (heel rocker), foot flat, heel rise and toe-off about the
     ball (forefoot rocker). The swing foot travels to the next contact on a
     minimum-jerk path with toe clearance. Nothing slides.
   - LEGS BY IK. Hip -> knee -> ankle is solved from the hip and the ankle
     (knee always forward), so the stance leg is nearly straight under the
     body and the swing knee folds (~50deg) on its own.
   - THE BODY RIDES THE LEGS. The hip height is the highest the stance leg(s)
     allow, so the body is HIGH over the planted foot at mid-stance and LOW in
     double support, with no separate bob constant. The hip's forward progress
     surges within each step: slowest just after heel strike, pushing through
     to toe-off. The torso is over the planted foot at mid-stance.
   - LEAN ABOUT THE HIP, small (0.5-2deg by pace), in .w-upper only. The legs
     are never tilted, so the head never runs ahead of the feet.
   - OWN PACE AND STRIDE per person (GAITS): 9-23 u/s, strides 11-25 u (by
     scale), faster walkers take longer strides AND quicker steps. Walks reach
     cruise in RAMP s (about a step) instead of easing over the whole walk.
   - ARMS swing in opposition to the legs, amplitude by pace, forward more
     than back, the elbow bending on the forward swing; near sleeves are a
     shade lighter so the swing reads against the coat. Long coats, robes, the
     hakama and the yukata hang a .w-skirt from the waist that sways with the
     step.
   - The elder's stick is planted with his far foot (a cane moves with the
     opposite leg); the child's pinwheel spins with distance walked.

   The turn (0.35 s squash-and-flip in the pause before a reversal) is
   unchanged from v9.

   Every plan: 90 s total, net distance 0, whole strides, a pause before every
   walk (checked by _build/check_plans.js). The loop seam is continuous: the
   path length is whole strides, so every phase-driven pose repeats.

   ?wt=12.5 freezes the loop at that time (for frame captures).
   Reduced motion: nothing moves. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var LOOP = 90;          // seconds — the master loop
  var RAMP = 0.7;         // s from standing to cruise (and back) — about a step
  var DUTY = 0.61;        // fraction of the cycle a foot is on the ground
  var HEEL_FLAT = 0.07;   // cycle fraction: heel strike -> foot flat
  var HEEL_RISE = 0.34;   // cycle fraction: the heel starts to lift
  var TOE_UP = 14;        // deg, toes up at heel strike
  var TOE_OFF = 30;       // deg, heel up at toe-off
  var CLEAR = 0.11;       // swing-foot lift, as a fraction of the stride
  var STRAIGHT = 0.996;   // the stance knee never quite locks
  var SURGE = 0.1;        // hip speed ripple within each step (+-10%)
  var SURGE_AT = 0.1;     // cycle fraction of the slowest moment (after heel strike)
  var ELBOW_BASE = 6;     // deg, the forearm's resting bend
  var ELBOW_VAR = 0.9;    // extra elbow bend per degree of forward arm swing
  var LANTERN_SWING = 6;  // deg, pendulum lagging the step
  var TURN = 0.35;        // seconds to turn round (squash-and-flip)
  var TURN_LEAD = 0.25;   // the turn ends this long before the walk starts
  var CAT_STRIDE = 4;     // scene units per full gait cycle for the strolling cat
  var CAT_LEG = 13;       // degrees, the cat's leg swing
  var CAT_BOB = 0.4;      // scene units
  var DEG = 180 / Math.PI;

  /* Figure skeleton (figure units, facing +x): hip 25,72; knee y96 (x 26 near,
     24 far); ankle y116; sole y120. Foot points relative to the ankle. */
  var HIP_X = 25, HIP_Y = 72, KNEE_Y = 96, ANKLE_Y = 116, SOLE_Y = 120;
  var HEEL = [-3, 4], BALL = [6.5, 4];

  /* Per-person gait (pace = cruise u/s, stride = scene units per two steps,
     arm = shoulder swing deg, lean = forward lean deg, skirt = coat sway deg)
     and walk plans: [kind, seconds, distance] (+ = right, - = left). */
  var GAITS = {
    0: { pace: 23, stride: 25, arm: 24, lean: 1.6, skirt: 5, home: 420, lane: 798, band: [-25, 75] },
    1: { pace: 16, stride: 19, arm: 22, lean: 1.2, skirt: 0, home: 700, lane: 798, band: [-48, 90] },
    2: { pace: 18.5, stride: 21, arm: 22, lean: 1, skirt: 5, home: 880, lane: 798, band: [-76, 90] },
    3: { pace: 9, stride: 13, arm: 12, lean: 0.5, skirt: 3, home: 250, lane: 798, band: [-60, 16] },
    4: { pace: 17, stride: 20, arm: 20, lean: 1, skirt: 4, home: 560, lane: 798, band: [-50, 50] },
    5: { pace: 13, stride: 17, arm: 18, lean: 0.8, skirt: 4, home: 1150, lane: 798, band: [-88, 65] },
    6: { pace: 22, stride: 22, arm: 26, lean: 2, skirt: 0, home: 335, lane: 798, band: [-55, 45] },
    7: { pace: 20, stride: 22, arm: 22, lean: 1.2, skirt: 0, home: 1325, lane: 799, band: [-80, 95] },
    8: { pace: 9.5, stride: 12, arm: 14, lean: 0.6, skirt: 2.5, home: 1030, lane: 750, band: [-40, 100] },
    9: { pace: 13.5, stride: 16, arm: 20, lean: 1.4, skirt: 0, home: 1270, lane: 750, band: [-32, 46] },
    10: { pace: 12, stride: 11, arm: 24, lean: 1, skirt: 3, home: 1372, lane: 750, band: [-42, 56] }
  };
  var PLANS = {
    0: [["walk", 1.787, -25],
        ["pause", 4.85, 0],
        ["walk", 5.048, 100],
        ["pause", 5.09, 0],
        ["walk", 2.874, -50],
        ["pause", 4.63, 0],
        ["walk", 2.874, 50],
        ["pause", 2.22, 0],
        ["walk", 1.787, -25],
        ["pause", 4.53, 0],
        ["walk", 1.787, 25],
        ["pause", 4.26, 0],
        ["walk", 5.048, -100],
        ["pause", 4.65, 0],
        ["walk", 2.874, 50],
        ["pause", 3.73, 0],
        ["walk", 2.874, -50],
        ["pause", 4.35, 0],
        ["walk", 1.787, 25],
        ["pause", 3.82, 0],
        ["walk", 1.787, -25],
        ["pause", 2.25, 0],
        ["walk", 5.048, 100],
        ["pause", 3.46, 0],
        ["walk", 3.961, -75],
        ["pause", 2.624, 0]],
    1: [["pause", 5.065, 0],
        ["walk", 4.263, 57],
        ["pause", 4.58, 0],
        ["walk", 1.887, -19],
        ["pause", 4.57, 0],
        ["walk", 1.887, 19],
        ["pause", 4.78, 0],
        ["walk", 5.45, -76],
        ["pause", 4.24, 0],
        ["walk", 6.638, 95],
        ["pause", 3.77, 0],
        ["walk", 5.45, -76],
        ["pause", 4.31, 0],
        ["walk", 3.075, 38],
        ["pause", 4.76, 0],
        ["walk", 5.45, -76],
        ["pause", 3, 0],
        ["walk", 7.825, 114],
        ["pause", 3.55, 0],
        ["walk", 5.45, -76]],
    2: [["walk", 4.105, 63],
        ["pause", 3.16, 0],
        ["walk", 7.511, -126],
        ["pause", 2.97, 0],
        ["walk", 7.511, 126],
        ["pause", 5.39, 0],
        ["walk", 4.105, -63],
        ["pause", 3.15, 0],
        ["walk", 2.97, 42],
        ["pause", 4.53, 0],
        ["walk", 6.376, -105],
        ["pause", 4.11, 0],
        ["walk", 1.835, 21],
        ["pause", 4.71, 0],
        ["walk", 1.835, -21],
        ["pause", 3.54, 0],
        ["walk", 8.646, 147],
        ["pause", 2.66, 0],
        ["walk", 5.241, -84],
        ["pause", 5.645, 0]],
    3: [["walk", 3.589, -26],
        ["pause", 6.85, 0],
        ["walk", 5.033, 39],
        ["pause", 4.93, 0],
        ["walk", 2.144, -13],
        ["pause", 5.89, 0],
        ["walk", 2.144, 13],
        ["pause", 7.45, 0],
        ["walk", 7.922, -65],
        ["pause", 3.56, 0],
        ["walk", 7.922, 65],
        ["pause", 7.24, 0],
        ["walk", 7.922, -65],
        ["pause", 5.62, 0],
        ["walk", 6.478, 52],
        ["pause", 5.306, 0]],
    4: [["pause", 4.981, 0],
        ["walk", 3.053, -40],
        ["pause", 4.85, 0],
        ["walk", 4.229, 60],
        ["pause", 3.29, 0],
        ["walk", 4.229, -60],
        ["pause", 4.78, 0],
        ["walk", 5.406, 80],
        ["pause", 6.47, 0],
        ["walk", 1.876, -20],
        ["pause", 2.87, 0],
        ["walk", 1.876, 20],
        ["pause", 4.02, 0],
        ["walk", 5.406, -80],
        ["pause", 3.19, 0],
        ["walk", 5.406, 80],
        ["pause", 6.38, 0],
        ["walk", 4.229, -60],
        ["pause", 3.58, 0],
        ["walk", 3.053, 40],
        ["pause", 4.95, 0],
        ["walk", 1.876, -20]],
    5: [["walk", 2.008, 17],
        ["pause", 7.87, 0],
        ["walk", 5.931, -68],
        ["pause", 6.23, 0],
        ["walk", 7.238, 85],
        ["pause", 4.95, 0],
        ["walk", 5.931, -68],
        ["pause", 7.12, 0],
        ["walk", 2.008, 17],
        ["pause", 7.77, 0],
        ["walk", 3.315, -34],
        ["pause", 5.18, 0],
        ["walk", 8.546, 102],
        ["pause", 5.77, 0],
        ["walk", 4.623, -51],
        ["pause", 5.51, 0]],
    6: [["pause", 5.7, 0],
        ["walk", 1.7, 22],
        ["pause", 4.41, 0],
        ["walk", 3.7, -66],
        ["pause", 3.1, 0],
        ["walk", 4.7, 88],
        ["pause", 5.28, 0],
        ["walk", 4.7, -88],
        ["pause", 2.51, 0],
        ["walk", 2.7, 44],
        ["pause", 5.51, 0],
        ["walk", 1.7, -22],
        ["pause", 5.64, 0],
        ["walk", 3.7, 66],
        ["pause", 3.02, 0],
        ["walk", 3.7, -66],
        ["pause", 5.91, 0],
        ["walk", 1.7, 22],
        ["pause", 4.04, 0],
        ["walk", 1.7, -22],
        ["pause", 4.86, 0],
        ["walk", 2.7, 44],
        ["pause", 5.62, 0],
        ["walk", 1.7, -22]],
    7: [["walk", 1.8, 22],
        ["pause", 5.98, 0],
        ["walk", 5.1, -88],
        ["pause", 4.6, 0],
        ["walk", 8.4, 154],
        ["pause", 6.01, 0],
        ["walk", 4, -66],
        ["pause", 3.96, 0],
        ["walk", 2.9, 44],
        ["pause", 3.84, 0],
        ["walk", 6.2, -110],
        ["pause", 4.39, 0],
        ["walk", 1.8, 22],
        ["pause", 4.27, 0],
        ["walk", 2.9, -44],
        ["pause", 4.54, 0],
        ["walk", 7.3, 132],
        ["pause", 5.23, 0],
        ["walk", 4, -66],
        ["pause", 2.78, 0]],
    8: [["pause", 3.289, 0],
        ["walk", 3.226, -24],
        ["pause", 6.29, 0],
        ["walk", 5.753, 48],
        ["pause", 4.7, 0],
        ["walk", 7.016, -60],
        ["pause", 6.67, 0],
        ["walk", 13.332, 120],
        ["pause", 6.54, 0],
        ["walk", 4.489, -36],
        ["pause", 7.3, 0],
        ["walk", 1.963, 12],
        ["pause", 4.94, 0],
        ["walk", 8.279, -72],
        ["pause", 4.25, 0],
        ["walk", 1.963, 12]],
    9: [["walk", 3.07, -32],
        ["pause", 4.67, 0],
        ["walk", 5.441, 64],
        ["pause", 3.18, 0],
        ["walk", 5.441, -64],
        ["pause", 6.53, 0],
        ["walk", 4.256, 48],
        ["pause", 5.59, 0],
        ["walk", 4.256, -48],
        ["pause", 6.52, 0],
        ["walk", 5.441, 64],
        ["pause", 6.92, 0],
        ["walk", 4.256, -48],
        ["pause", 6.06, 0],
        ["walk", 4.256, 48],
        ["pause", 4.93, 0],
        ["walk", 3.07, -32],
        ["pause", 6.113, 0]],
    10: [["pause", 2.943, 0],
        ["walk", 3.45, 33],
        ["pause", 3.71, 0],
        ["walk", 4.367, -44],
        ["pause", 3.1, 0],
        ["walk", 2.533, 22],
        ["pause", 4.13, 0],
        ["walk", 4.367, -44],
        ["pause", 2.18, 0],
        ["walk", 7.117, 77],
        ["pause", 3.66, 0],
        ["walk", 5.283, -55],
        ["pause", 4.09, 0],
        ["walk", 2.533, 22],
        ["pause", 3.28, 0],
        ["walk", 2.533, -22],
        ["pause", 3.74, 0],
        ["walk", 4.367, 44],
        ["pause", 3.26, 0],
        ["walk", 1.617, 11],
        ["pause", 3.2, 0],
        ["walk", 2.533, -22],
        ["pause", 4.15, 0],
        ["walk", 1.617, 11],
        ["pause", 2.79, 0],
        ["walk", 3.45, -33]]
  };
  /* The strolling cat: 2 u/s, whole cat strides (multiples of 4), turns
     round in its pauses. */
  var CAT_PLAN = [["walk", 8, 16], ["pause", 14, 0], ["walk", 8, -16],
                  ["pause", 15, 0], ["walk", 8, 16], ["pause", 14, 0],
                  ["walk", 8, -16], ["pause", 15, 0]];

  function smoothstep(u) { return u * u * (3 - 2 * u); }
  function minjerk(u) { return u * u * u * (10 + u * (6 * u - 15)); }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function frac(x) { return x - Math.floor(x); }

  function buildSegments(plan, ramp) {
    var segs = [], t = 0, x = 0, s = 0;
    plan.forEach(function (p) {
      segs.push({ t0: t, t1: t + p[1], x0: x, d: p[2], s0: s, kind: p[0],
                  dir: p[2] > 0 ? 1 : p[2] < 0 ? -1 : 0 });
      t += p[1]; x += p[2]; s += Math.abs(p[2]);
    });
    /* Facing through each pause: the previous walk's direction, turning to
       the next walk's direction at the end of the pause (cyclic). */
    segs.forEach(function (g, i) {
      if (g.kind === "walk") return;
      var prev = null, next = null, j;
      for (j = 1; j <= segs.length && !prev; j++) {
        var a = segs[(i - j + segs.length) % segs.length];
        if (a.kind === "walk") prev = a;
      }
      for (j = 1; j <= segs.length && !next; j++) {
        var b = segs[(i + j) % segs.length];
        if (b.kind === "walk") next = b;
      }
      g.from = prev ? prev.dir : 1;
      g.to = next ? next.dir : g.from;
    });
    return { segs: segs, path: s, ramp: ramp };
  }

  /* State at time t: segment g, path length s, speed v, envelope env (0
     standing .. 1 cruising), facing f (-1..1). People: accelerate over RAMP,
     cruise, decelerate over RAMP (smoothstep velocity ramps). The cat keeps
     its smoothstep walk. */
  function stateAt(plan, t) {
    var segs = plan.segs;
    for (var i = 0; i < segs.length; i++) {
      var g = segs[i];
      if (t >= g.t1 && i < segs.length - 1) continue;
      var T = g.t1 - g.t0, tt = clamp(t - g.t0, 0, T);
      if (g.kind === "walk") {
        var D = Math.abs(g.d), dist, v, env;
        if (plan.ramp) {
          var R = plan.ramp, vc = D / (T - R), u;
          if (tt < R) {
            u = tt / R; dist = vc * R * (u * u * u - u * u * u * u / 2); v = vc * smoothstep(u);
          } else if (tt > T - R) {
            u = (T - tt) / R; dist = D - vc * R * (u * u * u - u * u * u * u / 2); v = vc * smoothstep(u);
          } else {
            dist = vc * (tt - R / 2); v = vc;
          }
          env = v / vc;
        } else {
          u = tt / T; dist = D * smoothstep(u); v = D / T * 6 * u * (1 - u);
          env = Math.min(1, v / 1.5);
        }
        return { g: g, s: g.s0 + dist, v: v, env: env, f: g.dir };
      }
      var f = g.from;
      if (g.to !== g.from) {
        /* Turn without vanishing: squash to 60% and flip at the bottom of the
           squash, so it reads as a pivot (v9, unchanged). */
        var k = (t - (g.t1 - TURN_LEAD - TURN)) / TURN;
        if (k > 0) {
          if (k >= 1) f = g.to;
          else {
            var mag = 1 - 0.4 * Math.sin(Math.PI * smoothstep(k));
            f = (k < 0.5 ? g.from : g.to) * mag;
          }
        }
      }
      return { g: g, s: g.s0, v: 0, env: 0, f: f };
    }
  }

  /* Where the hip is along the path (scene units) when the gait has covered
     path length s: s plus a ripple at the step frequency, slowest just after
     each heel strike. Exact at every half-stride, so walks still end on
     whole strides and the loop seam is untouched. */
  function hipPath(W, s) {
    var a = SURGE * W.S / (4 * Math.PI), d = 4 * Math.PI * SURGE_AT;
    return s - a * (Math.sin(4 * Math.PI * s / W.S - d) + Math.sin(d));
  }

  function rotv(v, deg) {       // rotate a foot vector; +deg = toes up
    var a = deg / DEG, c = Math.cos(a), s = Math.sin(a);
    return [v[0] * c + v[1] * s, -v[0] * s + v[1] * c];
  }

  /* One foot at path length s; o = 0 near leg, 0.5 far leg. Returns the ankle
     (x relative to the hip's street position, y in the figure frame with the
     ground at SOLE_Y), the foot angle (deg, + toes up) and a hip-height weight
     (1 while the leg bears weight). All in figure units. */
  function foot(W, s, o) {
    var q = s / W.S + o, k = Math.floor(q), ph = q - k;
    var Sf = W.S * W.k;
    var heel = (k - o) * Sf + W.reach + HEEL[0];   // this step's heel contact (street)
    var hip = hipPath(W, s) * W.k;
    var ax, ay, th, w = 1, r;
    if (ph < DUTY) {
      if (ph < HEEL_FLAT) {                        // heel rocker
        th = TOE_UP * (1 - smoothstep(ph / HEEL_FLAT));
        r = rotv(HEEL, th); ax = heel - r[0]; ay = SOLE_Y - r[1];
      } else if (ph < HEEL_RISE) {                 // foot flat
        th = 0; ax = heel - HEEL[0]; ay = ANKLE_Y;
      } else {                                     // forefoot rocker: heel lifts
        th = -TOE_OFF * smoothstep((ph - HEEL_RISE) / (DUTY - HEEL_RISE));
        r = rotv(BALL, th); ax = heel - HEEL[0] + BALL[0] - r[0]; ay = SOLE_Y - r[1];
      }
    } else {                                       // swing to the next heel strike
      var u = (ph - DUTY) / (1 - DUTY);
      var r0 = rotv(BALL, -TOE_OFF), x0 = heel - HEEL[0] + BALL[0] - r0[0], y0 = SOLE_Y - r0[1];
      var r1 = rotv(HEEL, TOE_UP), x1 = heel + Sf - r1[0], y1 = SOLE_Y - r1[1];
      ax = x0 + (x1 - x0) * minjerk(u);
      ay = y0 + (y1 - y0) * u - CLEAR * Sf * Math.sin(Math.PI * Math.pow(u, 0.8));
      th = -TOE_OFF + (TOE_UP + TOE_OFF) * smoothstep(u);
      w = u < 0.15 ? 1 - smoothstep(u / 0.15) : u > 0.8 ? smoothstep((u - 0.8) / 0.2) : 0;
    }
    return { x: ax - hip, y: ay, th: th, w: w };
  }

  /* Two-bone IK: hip (HIP_X, hipY) to the ankle; knee forward. Returns the
     thigh rotation, the shin's rotation relative to the thigh and the shin's
     absolute rotation (deg, CSS sense: + clockwise). */
  function ik(kx, hipY, ax, ay) {
    var L1 = Math.sqrt((kx - HIP_X) * (kx - HIP_X) + (KNEE_Y - HIP_Y) * (KNEE_Y - HIP_Y));
    var L2 = ANKLE_Y - KNEE_Y;
    var dx = ax - HIP_X, dy = ay - hipY, d = Math.sqrt(dx * dx + dy * dy);
    var dc = clamp(d, Math.abs(L1 - L2) + 0.01, L1 + L2 - 0.001);
    var a0 = Math.atan2(dy, dx);
    var g = Math.acos(clamp((L1 * L1 + dc * dc - L2 * L2) / (2 * L1 * dc), -1, 1));
    var ta = a0 - g;                                   // thigh direction (knee forward)
    var kxp = HIP_X + L1 * Math.cos(ta), kyp = hipY + L1 * Math.sin(ta);
    var ex = HIP_X + dx * dc / d, ey = hipY + dy * dc / d;   // reachable ankle
    var hip = (ta - Math.atan2(KNEE_Y - HIP_Y, kx - HIP_X)) * DEG;
    var shinAbs = (Math.atan2(ey - kyp, ex - kxp) - Math.PI / 2) * DEG;
    return { hip: hip, knee: shinAbs - hip, shinAbs: shinAbs };
  }

  function parsePlace(el) {
    var tf = el.getAttribute("transform") || "";
    var m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)\s*scale\(\s*([-\d.]+)/.exec(tf);
    return m ? { X: +m[1], Y: +m[2], sign: +m[3] < 0 ? -1 : 1, scale: Math.abs(+m[3]) }
             : { X: 0, Y: 0, sign: 1, scale: 1 };
  }

  /* Place a figure: move its feet by (dx,dy), mirror by sx about the feet.
     CSS individual transforms compose as translate . rotate . scale .
     [attribute], origin 0 0, so the translate is compensated for where the
     scale sends the feet. (No whole-figure rotation: the lean is in .w-upper.) */
  function place(el, P, dx, dy, sx) {
    el.style.translate = (P.X + dx - sx * P.X).toFixed(3) + "px " + dy.toFixed(3) + "px";
    el.style.scale = sx.toFixed(4) + " 1";
  }

  function rot(el, deg) { if (el) el.style.rotate = deg.toFixed(2) + "deg"; }

  function num(el, name, dflt) {
    var v = el && el.getAttribute(name);
    return v === null || v === undefined || v === "" ? dflt : parseFloat(v);
  }

  var walkers = [];
  document.querySelectorAll(".walker").forEach(function (el) {
    var idx = parseInt(el.getAttribute("data-walker"), 10);
    if (!PLANS[idx] || !GAITS[idx]) return;
    var G = GAITS[idx], P = parsePlace(el);
    var armNear = el.querySelector(".w-arm-near"), armFar = el.querySelector(".w-arm-far");
    var lanterns = [];
    el.querySelectorAll(".w-lantern").forEach(function (ln) {
      var arm = ln.closest(".w-arm");
      lanterns.push({ el: ln, near: arm === armNear, far: arm === armFar });
    });
    var k = 1 / P.scale;                           // figure units per scene unit
    walkers.push({
      el: el, place: P, plan: buildSegments(PLANS[idx], RAMP),
      S: G.stride, k: k, reach: 0.5 * DUTY * G.stride * k,
      arm: G.arm, lean: G.lean, skirt: G.skirt,
      legNear: el.querySelector(".w-leg-near"), legFar: el.querySelector(".w-leg-far"),
      shinNear: el.querySelector(".w-shin-near"), shinFar: el.querySelector(".w-shin-far"),
      footNear: el.querySelector(".w-foot-near"), footFar: el.querySelector(".w-foot-far"),
      armNear: armNear, armFar: armFar,
      foreNear: el.querySelector(".w-fore-near"), foreFar: el.querySelector(".w-fore-far"),
      swingNear: num(armNear, "data-swing", 1), swingFar: num(armFar, "data-swing", 1),
      elbowNear: num(armNear, "data-elbow", 1), elbowFar: num(armFar, "data-elbow", 1),
      stick: num(armNear, "data-stick", 0),
      uppers: el.querySelectorAll(".w-upper"),
      skirts: el.querySelectorAll(".w-skirt"),
      lanterns: lanterns,
      held: el.querySelector(".w-held"),
      spin: el.querySelector(".w-spin"),
      scarfTail: el.querySelector(".w-scarf-tail")
    });
  });

  var catSitTail = document.querySelector(".cat-sit .w-cat-tail");
  var catWalk = document.querySelector(".cat-walk");
  var cat = catWalk ? {
    el: catWalk, place: parsePlace(catWalk), plan: buildSegments(CAT_PLAN, 0),
    legsA: catWalk.querySelectorAll(".w-cat-leg-a"),
    legsB: catWalk.querySelectorAll(".w-cat-leg-b"),
    tail: catWalk.querySelector(".w-cat-tail")
  } : null;

  /* City details (lived-in-*): all periods divide 90 s. */
  var dogBreath = document.querySelector(".lived-in-dog-breath");
  var yataiLantern = document.querySelector(".lived-in-yatai-lantern");
  var steam = document.querySelectorAll(".lived-in-steam");
  var laundry = document.querySelectorAll(".lived-in-laundry-item");

  function person(w, t) {
    var st = stateAt(w.plan, t), env = st.env, s = st.s, p = s / w.S, i;
    /* feet (standing pose blended in as the walk starts and stops) */
    var fn = foot(w, s, 0), ff = foot(w, s, 0.5);
    fn.x *= env; ff.x *= env; fn.th *= env; ff.th *= env;
    fn.y = ANKLE_Y + (fn.y - ANKLE_Y) * env; ff.y = ANKLE_Y + (ff.y - ANKLE_Y) * env;
    var axn = 26 + fn.x, axf = 24 + ff.x;
    /* hip height: as high as the weight-bearing leg(s) allow */
    var reachL = STRAIGHT * (Math.sqrt(1 + 24 * 24) + ANKLE_Y - KNEE_Y);
    function need(ax, ay, wt) {
      var dx = ax - HIP_X, h = ay - Math.sqrt(Math.max(0, reachL * reachL - dx * dx));
      return 60 + (h - 60) * wt;
    }
    var stand = ANKLE_Y - Math.sqrt(reachL * reachL - 1);
    var hipY = HIP_Y + Math.max(need(axn, fn.y, fn.w), need(axf, ff.y, ff.w)) - stand;
    /* body: along the street with the step surge; up/down with the legs */
    var g = st.g, along = g.kind === "walk" ? hipPath(w, s) - g.s0 : 0;
    place(w.el, w.place, g.x0 + g.dir * along, (hipY - HIP_Y) / w.k, st.f * w.place.sign);
    /* legs: positions relative to the drawn hip (the figure moved by hipY-72) */
    var ln = ik(26, HIP_Y, axn, fn.y - (hipY - HIP_Y));
    var lf = ik(24, HIP_Y, axf, ff.y - (hipY - HIP_Y));
    rot(w.legNear, ln.hip); rot(w.shinNear, ln.knee); rot(w.footNear, -fn.th - ln.shinAbs);
    rot(w.legFar, lf.hip); rot(w.shinFar, lf.knee); rot(w.footFar, -ff.th - lf.shinAbs);
    /* upper body: small lean about the hip, a touch of pitch with each step */
    var lean = env * (w.lean + 0.4 * Math.sin(4 * Math.PI * (p - 0.1)));
    for (i = 0; i < w.uppers.length; i++) rot(w.uppers[i], lean);
    /* coat skirts follow the near leg (lagging) and flick with each step */
    var sk = env * (w.skirt * Math.cos(2 * Math.PI * (p - 0.1)) + 0.25 * w.skirt * Math.cos(4 * Math.PI * (p - 0.15)));
    for (i = 0; i < w.skirts.length; i++) w.skirts[i].style.transform = "skewX(" + sk.toFixed(2) + "deg)";
    /* arms: opposite the same-side leg (near arm back at near heel strike),
       forward more than back; the elbow bends as the arm comes forward */
    var c = Math.cos(2 * Math.PI * (p - 0.04));
    var fwdN = env * w.arm * (-c + 0.15), fwdF = env * w.arm * (c + 0.15);
    var an = -fwdN * w.swingNear, af = -fwdF * w.swingFar;
    var en = -(ELBOW_BASE + ELBOW_VAR * Math.max(0, fwdN)) * w.elbowNear;
    var ef = -(ELBOW_BASE + ELBOW_VAR * Math.max(0, fwdF)) * w.elbowFar;
    if (w.stick) {
      /* the stick tip is planted with the far foot: rigid arm about the shoulder */
      an = -Math.asin(clamp((ff.x + 1) / w.stick, -0.5, 0.5)) * DEG;
      en = 0;
    }
    rot(w.armNear, an); rot(w.armFar, af); rot(w.foreNear, en); rot(w.foreFar, ef);
    for (i = 0; i < w.lanterns.length; i++) {
      var L = w.lanterns[i], up = -lean;
      if (L.near) up -= an + en;
      else if (L.far) up -= af + ef;
      rot(L.el, up + LANTERN_SWING * env * Math.sin(4 * Math.PI * p - 1.0));
    }
    if (w.held) rot(w.held, -(lean + an + en));     // umbrella / pinwheel held upright
    if (w.spin) rot(w.spin, (720 * p) % 360);       // two turns per stride walked
    if (w.scarfTail) rot(w.scarfTail, 9 * Math.sin((t / 3) * Math.PI * 2 - 0.8) - 8 * env);
  }

  function frame(t) {
    var i, st, env, p, c2;
    for (i = 0; i < walkers.length; i++) person(walkers[i], t);
    /* Sitting cat: only the tail tip flicks, now and then (9 s and 15 s). */
    if (catSitTail) rot(catSitTail,
      -28 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * t / 9)), 8) +
      18 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * t / 15 + 1.3)), 10));
    /* Strolling cat: diagonal pairs, gait from its own path length. */
    if (cat) {
      st = stateAt(cat.plan, t);
      env = st.env;
      p = st.s / CAT_STRIDE;
      c2 = Math.cos(2 * Math.PI * p);
      var g = st.g, x = g.kind === "walk" ? g.x0 + g.dir * (st.s - g.s0) : g.x0;
      place(cat.el, cat.place, x, -CAT_BOB * env * Math.pow(Math.sin(2 * Math.PI * p), 2),
            st.f * cat.place.sign);
      for (i = 0; i < cat.legsA.length; i++) rot(cat.legsA[i], CAT_LEG * env * c2);
      for (i = 0; i < cat.legsB.length; i++) rot(cat.legsB[i], -CAT_LEG * env * c2);
      if (cat.tail) rot(cat.tail, 6 * env * Math.sin(2 * Math.PI * p - 0.9) + 4 * Math.sin(2 * Math.PI * t / 5));
    }
    /* The temple dog breathes (4.5 s); the yatai lantern swings (5 s); steam
       rises (3 s, three staggered wisps); laundry sways (6 s). */
    if (dogBreath) dogBreath.style.scale = "1 " + (1 + 0.06 * Math.sin(2 * Math.PI * t / 4.5)).toFixed(4);
    if (yataiLantern) rot(yataiLantern, 5 * Math.sin(2 * Math.PI * t / 5));
    for (i = 0; i < steam.length; i++) {
      var u = frac(t / 3 + i / steam.length);
      steam[i].style.translate = (0.8 * Math.sin(2 * Math.PI * u)).toFixed(2) + "px " + (-9 * u).toFixed(2) + "px";
      steam[i].style.opacity = (0.65 * Math.sin(Math.PI * u)).toFixed(3);
    }
    for (i = 0; i < laundry.length; i++)
      rot(laundry[i], 4 * Math.sin(2 * Math.PI * t / 6 + i * 0.9));
  }

  var wt = parseFloat(new URLSearchParams(window.location.search).get("wt"));
  if (!isNaN(wt)) { frame(((wt % LOOP) + LOOP) % LOOP); return; }

  var start = performance.now();
  function tick(now) {
    frame(((now - start) / 1000) % LOOP);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
