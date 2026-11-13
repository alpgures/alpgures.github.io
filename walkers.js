/* Hero walkers — rebuilt from scratch (Nov 12, Alp: sliding a static figure
   is not walking). The 3 walkway figures are articulated puppets (separate
   leg groups pivoting at the hip, separate arm groups pivoting at the
   shoulder, a lantern). This drives a real gait:

   - Legs alternate (one forward, one back), arms swing opposite, body bobs
     twice per gait cycle (once per step), lantern pendulums behind the arm.
   - The gait phase is tied to DISTANCE walked, not time, so the legs
     naturally speed up and slow down with the body — proper human pacing:
     accelerate out of a stop, decelerate into the next one, stand still in
     the pauses. No moonwalking, no sliding.
   - Loop: 90s. Every walk segment's distance is a whole number of strides,
     so each figure is back at its start (legs neutral) at 90s — a perfect
     loop, no snap at the seam.

   The figure's position/scale live in a transform ATTRIBUTE; this script
   only ever sets the CSS `translate` (forward motion + bob) and `rotate`
   (limbs) properties, which compose with the attribute instead of
   overriding it. (A CSS `transform` would fling the figure to the origin.)

   Reduced motion: the walkers stand still. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var LOOP = 90;        // seconds — the master loop
  var STRIDE = 15;      // scene units per full gait cycle (2 steps)
  var LEG_SWING = 20;   // degrees, each leg
  var ARM_SWING = 12;   // degrees, each arm
  var BOB = 1.5;        // scene units the body rises mid-step
  var LANTERN_SWING = 7;// degrees, pendulum lagging the arm

  /* Walk plans: [kind, seconds, distanceInSceneUnits] (+ = right, - = left).
     Walk durations are multiples of 3s (the gait period at the cruising
     speed below is 3s) so a walk always ends with the legs at neutral.
     Distances are multiples of STRIDE (15) so each walk is whole strides.
     Net distance per plan is 0 — every figure returns home at 90s. */
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
      armNear: el.querySelector(".w-arm-near"),
      armFar: el.querySelector(".w-arm-far"),
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
      var bob = -BOB * s * s;                    // 0 at foot plant, up mid-step
      w.el.style.translate = dist.toFixed(2) + "px " + bob.toFixed(2) + "px";
      if (w.legNear) w.legNear.style.rotate = (LEG_SWING * s).toFixed(2) + "deg";
      if (w.legFar) w.legFar.style.rotate = (-LEG_SWING * s).toFixed(2) + "deg";
      if (w.armNear) w.armNear.style.rotate = (ARM_SWING * s).toFixed(2) + "deg";
      if (w.armFar) w.armFar.style.rotate = (-ARM_SWING * s).toFixed(2) + "deg";
      if (w.lantern) w.lantern.style.rotate = (LANTERN_SWING * Math.sin(theta - 1.0)).toFixed(2) + "deg";
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
