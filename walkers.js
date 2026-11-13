/* Hero walkers v2 — rebuilt from scratch, twice (Nov 12, Alp: v1 'aren't as
   intricate as the previous, AND they walk weirdly').
   v1 swung straight legs like pendulums (no knee) and its bob was inverted
   (body high when both feet were planted). v2 fixes both, and the figures
   themselves are rebuilt with the originals' richness (shaped coat, belt,
   collar, buttons, hair, distinct shoes, warm lantern).

   The gait (all driven here, rAF, 90s loop):
   - Legs alternate at the hip; each leg has a KNEE — the shin bends only
     during the swing phase (foot lifting through the air) and straightens
     to plant. A straight-leg pendulum is a toy soldier; a knee is a person.
   - Arms swing contralateral (same-side arm back, opposite-side arm
     forward) and each arm has an ELBOW with a slight base bend that deepens
     as the arm swings forward.
   - Body bobs twice per cycle, HIGH when a foot is in the air (passing)
     and LOW when both feet are planted — the v1 bob had this backwards.
   - Leg swing reduced to 15 deg (v1's 20 deg marched). Lantern pendulums.
   - The gait phase is tied to DISTANCE walked, not time, so the legs speed
     up and slow down with the body: accelerate out of stops, decelerate in,
     stand still in pauses. No moonwalking, no sliding.
   - Loop: 90s. Every walk is whole strides, net distance 0 — each figure
     is back at its start, legs neutral, at 90s. No snap at the seam.

   The figure's position/scale live in a transform ATTRIBUTE; this only ever
   sets the CSS `translate` (forward motion + bob) and `rotate` (limbs),
   which compose with the attribute instead of overriding it.

   Reduced motion: the walkers stand still. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var LOOP = 90;        // seconds — the master loop
  var STRIDE = 15;      // scene units per full gait cycle (2 steps)
  var LEG_SWING = 15;   // degrees, each leg at the hip (v1's 20 marched)
  var KNEE_MAX = 35;    // degrees the shin bends back during the swing
  var ARM_SWING = 12;   // degrees, each arm at the shoulder
  var ELBOW_BASE = 8;   // degrees, the forearm's resting bend
  var ELBOW_VAR = 10;   // extra elbow bend as the arm swings forward
  var BOB = 1.5;        // scene units the body rises mid-step
  var LANTERN_SWING = 7;// degrees, pendulum lagging the arm

  /* Walk plans: [kind, seconds, distanceInSceneUnits] (+ = right, - = left).
     Walk durations are multiples of 3s (the gait period) so a walk always
     ends with the legs at neutral. Distances are multiples of STRIDE (15)
     so each walk is whole strides. Net distance per plan is 0. */
  var PLANS = {
    0: [["walk", 12, 60], ["pause", 10, 0], ["walk", 12, -60], ["pause", 14, 0],
        ["walk", 9, 45], ["pause", 9, 0], ["walk", 9, -45], ["pause", 15, 0]],
    1: [["pause", 8, 0], ["walk", 9, -45], ["pause", 12, 0], ["walk", 9, 45],
        ["pause", 10, 0], ["walk", 6, 30], ["pause", 9, 0], ["walk", 6, -30],
        ["pause", 21, 0]],
    2: [["walk", 9, -45], ["pause", 14, 0], ["walk", 9, 45], ["pause", 12, 0],
        ["walk", 6, -30], ["pause", 11, 0], ["walk", 6, 30], ["pause", 23, 0]]
  };

  function smoothstep(u) { return u * u * (3 - 2 * u); }

  function buildSegments(plan) {
    var segs = [], t = 0, x = 0;
    plan.forEach(function (s) {
      segs.push({ t0: t, t1: t + s[1], x0: x, x1: x + s[2], kind: s[0] });
      t += s[1]; x += s[2];
    });
    return segs;
  }

  var walkers = [];
  document.querySelectorAll(".walker").forEach(function (el) {
    var idx = parseInt(el.getAttribute("data-walker"), 10);
    var plan = PLANS[idx];
    if (!plan) return;
    walkers.push({
      el: el,
      segs: buildSegments(plan),
      legNear: el.querySelector(".w-leg-near"),
      legFar: el.querySelector(".w-leg-far"),
      shinNear: el.querySelector(".w-shin-near"),
      shinFar: el.querySelector(".w-shin-far"),
      armNear: el.querySelector(".w-arm-near"),
      armFar: el.querySelector(".w-arm-far"),
      foreNear: el.querySelector(".w-fore-near"),
      foreFar: el.querySelector(".w-fore-far"),
      lantern: el.querySelector(".w-lantern")
    });
  });
  if (!walkers.length) return;

  /* Cumulative eased distance from the loop start at time t (seconds).
     Walk segments ease in/out (smoothstep) so the body accelerates out of
     a stop and decelerates into the next one; pauses hold still. */
  function distanceAt(w, t) {
    var d = 0;
    for (var i = 0; i < w.segs.length; i++) {
      var s = w.segs[i];
      if (t >= s.t1) { d += (s.x1 - s.x0); continue; }
      if (t <= s.t0) break;
      var u = (t - s.t0) / (s.t1 - s.t0);
      if (s.kind === "walk") d += (s.x1 - s.x0) * smoothstep(u);
      break;
    }
    return d;
  }

  var start = performance.now();
  function frame(now) {
    var t = ((now - start) / 1000) % LOOP;
    for (var i = 0; i < walkers.length; i++) {
      var w = walkers[i];
      var dist = distanceAt(w, t);
      var theta = (dist / STRIDE) * Math.PI * 2; // gait phase, from distance
      var s = Math.sin(theta);
      var c = Math.cos(theta);
      /* Hips use COS (not sin): at theta = 0 the near leg is planted
         forward and the far leg is back — a natural stride stance. That
         matters because walks start/end at theta = multiples of 2pi: with
         sin-based hips the figure froze mid-stride at a walk's end (knee
         bent, body raised) and stayed that way through the pause. With cos
         hips it ends in a planted stride, knees straight, body at rest
         height, and holds that pose through the pause. (v2 bug, fixed.) */
      /* Bob: HIGH when a foot is in the air (passing, theta pi/2, 3pi/2)
         and LOW when both feet are planted (theta 0, pi). */
      var bob = -BOB * s * s;
      w.el.style.translate = dist.toFixed(2) + "px " + bob.toFixed(2) + "px";
      /* Hips: legs alternate. */
      if (w.legNear) w.legNear.style.rotate = (LEG_SWING * c).toFixed(2) + "deg";
      if (w.legFar) w.legFar.style.rotate = (-LEG_SWING * c).toFixed(2) + "deg";
      /* Knees: the shin bends BACK (negative) only while its leg is swinging
         through the air, peaking mid-swing, and is straight when the foot is
         planted or pushing off. Near leg swings at theta ~3pi/2, far ~pi/2. */
      var kneeNear = -KNEE_MAX * Math.max(0, -s) * Math.max(0, -s);
      var kneeFar = -KNEE_MAX * Math.max(0, s) * Math.max(0, s);
      if (w.shinNear) w.shinNear.style.rotate = kneeNear.toFixed(2) + "deg";
      if (w.shinFar) w.shinFar.style.rotate = kneeFar.toFixed(2) + "deg";
      /* Arms: contralateral (same-side arm back, opposite-side arm forward). */
      if (w.armNear) w.armNear.style.rotate = (-ARM_SWING * c).toFixed(2) + "deg";
      if (w.armFar) w.armFar.style.rotate = (ARM_SWING * c).toFixed(2) + "deg";
      /* Elbows: a resting bend that deepens as the arm swings forward. */
      if (w.foreNear) w.foreNear.style.rotate = (ELBOW_BASE + ELBOW_VAR * Math.max(0, -c)).toFixed(2) + "deg";
      if (w.foreFar) w.foreFar.style.rotate = (ELBOW_BASE + ELBOW_VAR * Math.max(0, c)).toFixed(2) + "deg";
      if (w.lantern) w.lantern.style.rotate = (LANTERN_SWING * Math.cos(theta - 1.0)).toFixed(2) + "deg";
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
