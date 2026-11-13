/* Hero walkers v3 — more people, cats, quicker (Nov 12, Alp: 'still not as
   intricate', 'walking a little quicker', 'others in the city', 'a cat or
   two'). The 3 main walkers gained accessories (scarf, satchel, hat, finer
   seams, pocket); 3 new walkers joined in other parts of the city (temples,
   mid-walkway, village); two cats moved in (one sits and swishes its tail,
   one strolls the village). Everything still loops in 90s.

   The gait (rAF, 90s loop, per figure):
   - Legs alternate at the hip (cos phase, so walks start/end in a planted
     stride stance — knees straight, body at rest height — and hold that pose
     through pauses). Each leg has a KNEE that bends only during the swing
     phase; each arm has an ELBOW. Arms swing contralateral. Body bobs HIGH
     when a foot is in the air, LOW when both feet are planted.
   - The gait phase is tied to DISTANCE walked, not time, so the legs speed
     up and slow down with the body: accelerate out of stops, decelerate in,
     stand still in pauses.
   - Quicker (v3): the main walkers now average 7.5 scene units/s (was 5) —
     the same distances in 8/6/4s instead of 12/9/6s.
   - Scarves flutter in the breeze (a slow sine, loops in 90s).
   - The sitting cat swishes its tail (6s period, loops). The strolling cat
     walks a slow diagonal gait tied to its own distance, and its tail
     swishes too.

   Figures' position/scale live in a transform ATTRIBUTE; this only ever
   sets the CSS `translate` and `rotate` properties, which compose with it.

   Reduced motion: nothing moves. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var LOOP = 90;        // seconds — the master loop
  var STRIDE = 15;      // scene units per full gait cycle (2 steps)
  var LEG_SWING = 15;   // degrees, each leg at the hip
  var KNEE_MAX = 35;    // degrees the shin bends back during the swing
  var ARM_SWING = 12;   // degrees, each arm at the shoulder
  var ELBOW_BASE = 8;   // degrees, the forearm's resting bend
  var ELBOW_VAR = 10;   // extra elbow bend as the arm swings forward
  var BOB = 1.5;        // scene units the body rises mid-step
  var LANTERN_SWING = 7;// degrees, pendulum lagging the arm
  var CAT_STRIDE = 6;   // scene units per full gait cycle for the strolling cat
  var CAT_LEG = 9;      // degrees, the cat's leg swing
  var CAT_BOB = 0.6;    // scene units the cat's body bobs

  /* Walk plans: [kind, seconds, distanceInSceneUnits] (+ = right, - = left).
     Distances are multiples of STRIDE (15) so each walk is whole strides;
     net distance per plan is 0 — every figure returns home at 90s. */
  var PLANS = {
    0: [["walk", 8, 60], ["pause", 14, 0], ["walk", 8, -60], ["pause", 16, 0],
        ["walk", 6, 45], ["pause", 12, 0], ["walk", 6, -45], ["pause", 20, 0]],
    1: [["pause", 8, 0], ["walk", 6, -45], ["pause", 14, 0], ["walk", 6, 45],
        ["pause", 12, 0], ["walk", 4, 30], ["pause", 12, 0], ["walk", 4, -30],
        ["pause", 24, 0]],
    2: [["walk", 6, -45], ["pause", 16, 0], ["walk", 6, 45], ["pause", 14, 0],
        ["walk", 4, -30], ["pause", 14, 0], ["walk", 4, 30], ["pause", 26, 0]],
    3: [["walk", 4, 30], ["pause", 16, 0], ["walk", 4, -30], ["pause", 16, 0],
        ["walk", 4, 30], ["pause", 16, 0], ["walk", 4, -30], ["pause", 26, 0]],
    4: [["walk", 4, -30], ["pause", 14, 0], ["walk", 4, 30], ["pause", 16, 0],
        ["walk", 4, -30], ["pause", 14, 0], ["walk", 4, 30], ["pause", 30, 0]],
    5: [["walk", 4, -30], ["pause", 18, 0], ["walk", 4, 30], ["pause", 16, 0],
        ["walk", 4, -30], ["pause", 18, 0], ["walk", 4, 30], ["pause", 22, 0]]
  };
  /* The strolling cat (cat 1): slow, 2 scene units/s. Distances MUST be
     multiples of CAT_STRIDE (6) so its gait ends at a neutral stride stance
     instead of freezing mid-stride through the pause — the first version
     used +-20 (not a multiple of 6) and the cat sat paused with its body
     raised and legs half-swung. */
  var CAT_PLAN = [["walk", 9, 18], ["pause", 12, 0], ["walk", 9, -18],
                  ["pause", 13, 0], ["walk", 9, 18], ["pause", 12, 0],
                  ["walk", 9, -18], ["pause", 17, 0]];

  function smoothstep(u) { return u * u * (3 - 2 * u); }

  function buildSegments(plan) {
    var segs = [], t = 0, x = 0;
    plan.forEach(function (s) {
      segs.push({ t0: t, t1: t + s[1], x0: x, x1: x + s[2], kind: s[0] });
      t += s[1]; x += s[2];
    });
    return segs;
  }

  /* Cumulative eased distance from the loop start at time t (seconds). */
  function distanceAt(segs, t) {
    var d = 0;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (t >= s.t1) { d += (s.x1 - s.x0); continue; }
      if (t <= s.t0) break;
      var u = (t - s.t0) / (s.t1 - s.t0);
      if (s.kind === "walk") d += (s.x1 - s.x0) * smoothstep(u);
      break;
    }
    return d;
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
      lantern: el.querySelector(".w-lantern"),
      scarfTail: el.querySelector(".w-scarf-tail")
    });
  });

  var catSit = document.querySelector('.cat-sit .w-cat-tail');
  var catWalk = document.querySelector('.cat-walk');
  var catWalkSegs = catWalk ? buildSegments(CAT_PLAN) : null;
  var catLegA = catWalk ? catWalk.querySelector(".w-cat-leg-a") : null;
  var catLegB = catWalk ? catWalk.querySelector(".w-cat-leg-b") : null;
  var catTail = catWalk ? catWalk.querySelector(".w-cat-tail") : null;

  var start = performance.now();
  function frame(now) {
    var t = ((now - start) / 1000) % LOOP;
    var i, w, dist, theta, s, c, bob;
    for (i = 0; i < walkers.length; i++) {
      w = walkers[i];
      dist = distanceAt(w.segs, t);
      theta = (dist / STRIDE) * Math.PI * 2; // gait phase, from distance
      s = Math.sin(theta);
      c = Math.cos(theta);
      bob = -BOB * s * s; // HIGH when a foot is in the air, LOW when planted
      w.el.style.translate = dist.toFixed(2) + "px " + bob.toFixed(2) + "px";
      if (w.legNear) w.legNear.style.rotate = (LEG_SWING * c).toFixed(2) + "deg";
      if (w.legFar) w.legFar.style.rotate = (-LEG_SWING * c).toFixed(2) + "deg";
      if (w.shinNear) w.shinNear.style.rotate = (-KNEE_MAX * Math.max(0, -s) * Math.max(0, -s)).toFixed(2) + "deg";
      if (w.shinFar) w.shinFar.style.rotate = (-KNEE_MAX * Math.max(0, s) * Math.max(0, s)).toFixed(2) + "deg";
      if (w.armNear) w.armNear.style.rotate = (-ARM_SWING * c).toFixed(2) + "deg";
      if (w.armFar) w.armFar.style.rotate = (ARM_SWING * c).toFixed(2) + "deg";
      if (w.foreNear) w.foreNear.style.rotate = (ELBOW_BASE + ELBOW_VAR * Math.max(0, -c)).toFixed(2) + "deg";
      if (w.foreFar) w.foreFar.style.rotate = (ELBOW_BASE + ELBOW_VAR * Math.max(0, c)).toFixed(2) + "deg";
      if (w.lantern) w.lantern.style.rotate = (LANTERN_SWING * Math.cos(theta - 1.0)).toFixed(2) + "deg";
      if (w.scarfTail) w.scarfTail.style.rotate = (10 * Math.sin((t / 3) * Math.PI * 2 - 0.8)).toFixed(2) + "deg";
    }
    /* Sitting cat: a slow lazy tail swish (6s period, divides 90). */
    if (catSit) catSit.style.rotate = (14 * Math.sin((t / 6) * Math.PI * 2)).toFixed(2) + "deg";
    /* Strolling cat: slow diagonal gait tied to its own distance. */
    if (catWalk) {
      var cdist = distanceAt(catWalkSegs, t);
      var ctheta = (cdist / CAT_STRIDE) * Math.PI * 2;
      var cs = Math.sin(ctheta);
      var cc = Math.cos(ctheta);
      var cbob = -CAT_BOB * cs * cs;
      catWalk.style.translate = cdist.toFixed(2) + "px " + cbob.toFixed(2) + "px";
      if (catLegA) catLegA.style.rotate = (CAT_LEG * cc).toFixed(2) + "deg";
      if (catLegB) catLegB.style.rotate = (-CAT_LEG * cc).toFixed(2) + "deg";
      if (catTail) catTail.style.rotate = (10 * Math.sin(ctheta - 0.9)).toFixed(2) + "deg";
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
