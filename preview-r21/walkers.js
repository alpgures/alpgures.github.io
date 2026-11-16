/* Hero walkers v9 — six distinct people, two cats, a lived-in city
   (Round 21; rebuild of the Opus Nov 13 pass). Alp: 'more intricate',
   'more diverse instead of the same characters duplicated', 'they walk
   weirdly', 'why are they stopping weirdly?'.

   The gait (rAF, 90s loop, per figure):
   - Gait phase is tied to the PATH LENGTH walked (not time, not signed
     position), so the legs speed up and slow down with the body (smoothstep
     easing on each walk) and run forwards whichever way the figure goes.
   - Planted feet do not slide: during stance the foot's offset from the hip
     moves LINEARLY with distance (+FOOT_REACH to -FOOT_REACH over half a
     stride, exactly the distance the body covers), and the hip angle is
     asin(offset/LEG). The swing foot travels back to the front on a Hermite
     (smoothstep) arc, with the KNEE bending only while it is in the air.
   - Joints bend the right way: knees fold the shin BACK (positive rotate in
     the figure's frame, which faces +x), elbows fold the forearm FORWARD
     (negative rotate). Arms swing contralateral to the legs.
   - The body bobs HIGH at mid-stance, LOW at foot contact; leans forward
     LEAN degrees at full pace.
   - Gait-amplitude ENVELOPE from the instantaneous speed: legs, knees and
     arms ease to the neutral standing pose (feet together) as the body
     decelerates and build back up as it accelerates — no freezing mid-stride.
   - No moonwalking: a figure walking the other way first TURNS ROUND in the
     pause before the walk (a TURN-second flip, eased).
   - Lanterns and baskets hang from the hand (counter-rotated against the arm,
     plus a lagging pendulum). The stick and the umbrella are held rigid: the
     stick rides the forearm (that limb carries data-swing / data-elbow scales
     so it barely moves); the umbrella (.w-held) is kept upright, no pendulum.

   Every plan: 90s total, net distance 0, whole strides, pauses 3-5s, so the
   loop seam is continuous (checked by _build/check_plans.js).

   Placement: each figure's position/scale live in its transform ATTRIBUTE;
   this only sets the CSS translate/rotate/scale properties, which compose
   outside it (transform-origin 0 0), with the translate compensated so the
   flip and lean pivot on the figure's feet.

   ?wt=12.5 freezes the loop at that time (for frame captures).
   Reduced motion: nothing moves. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var LOOP = 90;          // seconds — the master loop
  var STRIDE = 15;        // scene units per full gait cycle (2 steps)
  var LEG = 48;           // hip (y72) to sole (y120), figure units
  var FOOT_REACH = STRIDE / (4 * 0.5); // 7.5 figure units (~9deg at the hip)
  var KNEE_MAX = 30;      // degrees the shin folds back mid-swing
  var ARM_SWING = 18;     // degrees at the shoulder
  var ELBOW_BASE = 5;     // degrees, the forearm's resting bend
  var ELBOW_VAR = 14;     // extra elbow bend as the arm swings forward
  var BOB = 1.5;          // scene units the body rises at mid-stance
  var LEAN = 3.5;         // degrees forward lean at full pace
  var LANTERN_SWING = 6;  // degrees, pendulum lagging the step
  var ENVELOPE_SPEED = 4; // scene units/s at which the gait reaches full amplitude
  var TURN = 0.35;        // seconds to turn round (was 0.8: a slow squash
                          // left the figure a thin line for too long)
  var TURN_LEAD = 0.25;   // the turn ends this long before the walk starts
  var CAT_STRIDE = 4;     // scene units per full gait cycle for the strolling cat
  var CAT_LEG = 13;       // degrees, the cat's leg swing
  var CAT_BOB = 0.4;      // scene units
  var DEG = 180 / Math.PI;

  /* Walk plans: [kind, seconds, distance] (+ = right, - = left, scene units).
     Pace 7.5 u/s (walks of 4/6/8 s = 2/3/4 strides); the elder (3) walks
     5 u/s. Each figure walks ~48-54 s of the 90 s with 3-5 s pauses, starts
     staggered: ~3.4 of the 6 are moving at any moment. */
  var PLANS = {
    0: [["walk", 8, -60],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 4, -30],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 8, -60],
        ["pause", 5, 0],
        ["walk", 4, 30],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 4, 30],
        ["pause", 4, 0],
        ["walk", 6, -45],
        ["pause", 5, 0]],
    1: [["pause", 5, 0],
        ["walk", 6, 45],
        ["pause", 5, 0],
        ["walk", 4, -30],
        ["pause", 5, 0],
        ["walk", 6, 45],
        ["pause", 5, 0],
        ["walk", 8, -60],
        ["pause", 4, 0],
        ["walk", 4, 30],
        ["pause", 5, 0],
        ["walk", 6, -45],
        ["pause", 4, 0],
        ["walk", 4, 30],
        ["pause", 5, 0],
        ["walk", 4, 30],
        ["pause", 4, 0],
        ["walk", 6, -45]],
    2: [["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 6, -45],
        ["pause", 4, 0],
        ["walk", 4, 30],
        ["pause", 4, 0],
        ["walk", 8, -60],
        ["pause", 5, 0],
        ["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 4, 30],
        ["pause", 4, 0],
        ["walk", 6, -45],
        ["pause", 4, 0],
        ["walk", 6, -45],
        ["pause", 5, 0],
        ["walk", 6, 45],
        ["pause", 4, 0]],
    3: [["walk", 6, 30],
        ["pause", 5, 0],
        ["walk", 9, -45],
        ["pause", 4, 0],
        ["walk", 6, 30],
        ["pause", 5, 0],
        ["walk", 6, -30],
        ["pause", 4, 0],
        ["walk", 9, 45],
        ["pause", 5, 0],
        ["walk", 6, -30],
        ["pause", 4, 0],
        ["walk", 6, 30],
        ["pause", 5, 0],
        ["walk", 6, -30],
        ["pause", 4, 0]],
    4: [["pause", 4, 0],
        ["walk", 4, -30],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 5, 0],
        ["walk", 6, -45],
        ["pause", 4, 0],
        ["walk", 4, -30],
        ["pause", 4, 0],
        ["walk", 8, 60],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 4, -30],
        ["pause", 5, 0],
        ["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 8, -60]],
    5: [["walk", 6, -45],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 5, 0],
        ["walk", 4, -30],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 4, 0],
        ["walk", 6, -45],
        ["pause", 4, 0],
        ["walk", 4, -30],
        ["pause", 4, 0],
        ["walk", 6, 45],
        ["pause", 5, 0],
        ["walk", 6, -45],
        ["pause", 4, 0],
        ["walk", 8, 60],
        ["pause", 4, 0]]
  };
  /* The strolling cat: 2 u/s, whole cat strides (multiples of 4), turns
     round in its pauses. */
  var CAT_PLAN = [["walk", 8, 16], ["pause", 14, 0], ["walk", 8, -16],
                  ["pause", 15, 0], ["walk", 8, 16], ["pause", 14, 0],
                  ["walk", 8, -16], ["pause", 15, 0]];

  function smoothstep(u) { return u * u * (3 - 2 * u); }
  function frac(x) { return x - Math.floor(x); }

  function buildSegments(plan) {
    var segs = [], t = 0, x = 0, s = 0;
    plan.forEach(function (p) {
      segs.push({ t0: t, t1: t + p[1], x0: x, d: p[2], s0: s, kind: p[0],
                  dir: p[2] > 0 ? 1 : p[2] < 0 ? -1 : 0 });
      t += p[1]; x += p[2]; s += Math.abs(p[2]);
    });
    /* Facing through each pause: the previous walk's direction, turning to
       the next walk's direction at the end of the pause (cyclic). */
    var walks = segs.filter(function (g) { return g.kind === "walk"; });
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
    return { segs: segs, path: s, walks: walks.length };
  }

  /* State at time t: position x, path length s, speed v, facing f (-1..1). */
  function stateAt(plan, t) {
    var segs = plan.segs;
    for (var i = 0; i < segs.length; i++) {
      var g = segs[i];
      if (t >= g.t1 && i < segs.length - 1) continue;
      var T = g.t1 - g.t0, u = Math.min(1, Math.max(0, (t - g.t0) / T));
      if (g.kind === "walk") {
        var e = smoothstep(u);
        return { x: g.x0 + g.d * e, s: g.s0 + Math.abs(g.d) * e,
                 v: Math.abs(g.d) / T * 6 * u * (1 - u), f: g.dir };
      }
      var f = g.from;
      if (g.to !== g.from) {
        /* Turn without vanishing: the facing is a 2D flip, so a cosine
           through 0 would squash the figure to zero width (invisible
           mid-turn). Instead the figure squashes to ~45% and the facing
           flips at the bottom of the squash — it reads as a pivot and the
           figure never disappears. */
        var k = (t - (g.t1 - TURN_LEAD - TURN)) / TURN;
        if (k > 0) {
          if (k >= 1) f = g.to;
          else {
            var mag = 1 - 0.4 * Math.sin(Math.PI * smoothstep(k));
            f = (k < 0.5 ? g.from : g.to) * mag;
          }
        }
      }
      return { x: g.x0, s: g.s0, v: 0, f: f };
    }
  }

  function parsePlace(el) {
    var tf = el.getAttribute("transform") || "";
    var m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)\s*scale\(\s*([-\d.]+)/.exec(tf);
    return m ? { X: +m[1], Y: +m[2], sign: +m[3] < 0 ? -1 : 1 } : { X: 0, Y: 0, sign: 1 };
  }

  /* Place a figure: move its feet by (dx,dy), mirror by sx about the feet,
     then lean by deg (scene frame) about the feet. CSS individual transforms
     compose as translate . rotate . scale . [attribute], origin 0 0, so the
     translate is compensated for where rotate.scale sends the feet. */
  function place(el, P, dx, dy, sx, deg) {
    var a = deg / DEG, c = Math.cos(a), s = Math.sin(a);
    var fx = c * sx * P.X - s * P.Y, fy = s * sx * P.X + c * P.Y;
    el.style.translate = (P.X + dx - fx).toFixed(3) + "px " + (P.Y + dy - fy).toFixed(3) + "px";
    el.style.rotate = deg.toFixed(3) + "deg";
    el.style.scale = sx.toFixed(4) + " 1";
  }

  function rot(el, deg) { if (el) el.style.rotate = deg.toFixed(2) + "deg"; }

  /* One leg at gait phase ph (0..1 cycles; 0 = heel strike, foot forward). */
  function legAngles(ph, env) {
    var x, knee = 0, hip;
    if (ph < 0.5) {
      x = FOOT_REACH * (1 - 4 * ph);                  // stance: linear, planted
    } else {
      var u = (ph - 0.5) * 2;
      x = -FOOT_REACH + 2 * FOOT_REACH * smoothstep(u); // swing: Hermite arc
      knee = KNEE_MAX * Math.sin(Math.PI * u);
    }
    /* The knee folds the shin back, so the thigh must rotate forward by
       half the knee bend to carry the foot forward — the old minus sign
       dragged both thighs backward and the walk read as a zombie shuffle. */
    hip = -Math.asin(Math.max(-1, Math.min(1, x * env / LEG))) * DEG + 0.5 * knee * env;
    return { hip: hip, knee: knee * env };
  }

  function num(el, name, dflt) {
    var v = el && el.getAttribute(name);
    return v === null || v === undefined || v === "" ? dflt : parseFloat(v);
  }

  var walkers = [];
  document.querySelectorAll(".walker").forEach(function (el) {
    var idx = parseInt(el.getAttribute("data-walker"), 10);
    if (!PLANS[idx]) return;
    var armNear = el.querySelector(".w-arm-near"), armFar = el.querySelector(".w-arm-far");
    var lanterns = [];
    el.querySelectorAll(".w-lantern").forEach(function (ln) {
      var arm = ln.closest(".w-arm");
      lanterns.push({ el: ln, near: arm === armNear, far: arm === armFar, inArm: !!arm });
    });
    walkers.push({
      el: el, place: parsePlace(el), plan: buildSegments(PLANS[idx]),
      legNear: el.querySelector(".w-leg-near"), legFar: el.querySelector(".w-leg-far"),
      shinNear: el.querySelector(".w-shin-near"), shinFar: el.querySelector(".w-shin-far"),
      armNear: armNear, armFar: armFar,
      foreNear: el.querySelector(".w-fore-near"), foreFar: el.querySelector(".w-fore-far"),
      swingNear: num(armNear, "data-swing", 1), swingFar: num(armFar, "data-swing", 1),
      elbowNear: num(armNear, "data-elbow", 1), elbowFar: num(armFar, "data-elbow", 1),
      lanterns: lanterns,
      held: el.querySelector(".w-held"),
      scarfTail: el.querySelector(".w-scarf-tail")
    });
  });

  var catSitTail = document.querySelector(".cat-sit .w-cat-tail");
  var catWalk = document.querySelector(".cat-walk");
  var cat = catWalk ? {
    el: catWalk, place: parsePlace(catWalk), plan: buildSegments(CAT_PLAN),
    legsA: catWalk.querySelectorAll(".w-cat-leg-a"),
    legsB: catWalk.querySelectorAll(".w-cat-leg-b"),
    tail: catWalk.querySelector(".w-cat-tail")
  } : null;

  /* City details (lived-in-*): all periods divide 90 s. */
  var dogBreath = document.querySelector(".lived-in-dog-breath");
  var yataiLantern = document.querySelector(".lived-in-yatai-lantern");
  var steam = document.querySelectorAll(".lived-in-steam");
  var laundry = document.querySelectorAll(".lived-in-laundry-item");

  function frame(t) {
    var i, w, st, env, p, ln, lr, rn, rf, an, af, fn, ff, c2, dir, lean, bob;
    for (i = 0; i < walkers.length; i++) {
      w = walkers[i];
      st = stateAt(w.plan, t);
      env = Math.min(1, st.v / ENVELOPE_SPEED);
      p = st.s / STRIDE;                       // gait phase in cycles
      ln = legAngles(frac(p), env);            // near leg
      lr = legAngles(frac(p + 0.5), env);      // far leg
      bob = -BOB * env * Math.pow(Math.sin(2 * Math.PI * p), 2);
      dir = st.f;                              // scene direction (-1..1)
      lean = LEAN * env;                       // forward, in the figure's frame
      place(w.el, w.place, st.x, bob, dir * w.place.sign, lean * (dir >= 0 ? 1 : -1));
      rot(w.legNear, ln.hip); rot(w.shinNear, ln.knee);
      rot(w.legFar, lr.hip); rot(w.shinFar, lr.knee);
      c2 = Math.cos(2 * Math.PI * p);          // +1 when the near foot is forward
      an = ARM_SWING * env * c2 * w.swingNear; // near arm back while near foot forward
      af = -ARM_SWING * env * c2 * w.swingFar;
      fn = -(ELBOW_BASE + ELBOW_VAR * env * Math.max(0, -c2)) * w.elbowNear;
      ff = -(ELBOW_BASE + ELBOW_VAR * env * Math.max(0, c2)) * w.elbowFar;
      rot(w.armNear, an); rot(w.armFar, af); rot(w.foreNear, fn); rot(w.foreFar, ff);
      for (var j = 0; j < w.lanterns.length; j++) {
        var L = w.lanterns[j], up = -lean;
        if (L.near) up -= an + fn;
        else if (L.far) up -= af + ff;
        rot(L.el, up + LANTERN_SWING * env * Math.sin(4 * Math.PI * p - 1.0));
      }
      if (w.held) rot(w.held, -(lean + an + fn));   // umbrella held steady, upright
      if (w.scarfTail) rot(w.scarfTail, 9 * Math.sin((t / 3) * Math.PI * 2 - 0.8) - 8 * env);
    }
    /* Sitting cat: only the tail tip flicks, now and then (9 s and 15 s). */
    if (catSitTail) rot(catSitTail,
      -28 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * t / 9)), 8) +
      18 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * t / 15 + 1.3)), 10));
    /* Strolling cat: diagonal pairs, gait from its own path length. */
    if (cat) {
      st = stateAt(cat.plan, t);
      env = Math.min(1, st.v / 1.5);
      p = st.s / CAT_STRIDE;
      c2 = Math.cos(2 * Math.PI * p);
      place(cat.el, cat.place, st.x, -CAT_BOB * env * Math.pow(Math.sin(2 * Math.PI * p), 2),
            st.f * cat.place.sign, 0);
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
