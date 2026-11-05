/* Renders alpgures.me from data/site.json (the file Decap CMS edits). */

(function () {
  function get(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc == null ? acc : acc[key];
    }, obj);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderProjectCards(items) {
    return items
      .map(function (p, i) {
        var scene = sceneFor(p.slug, p.image, p.title);
        var delay = i === 1 || i === 3 ? " rv-d1" : i === 2 || i === 4 ? " rv-d2" : "";
        var wide = p.featured ? " card-wide" : "";
        return (
          '<a class="card' + wide + ' rv' + delay + '" href="projects/project.html?p=' + esc(p.slug) + '">' +
          '<div class="card-scene">' + scene + "</div>" +
          '<div class="card-body"><h3>' + esc(p.title) + "</h3>" +
          "<p>" + esc(p.blurb) + "</p>" +
          '<span class="card-cta">Read the story →</span></div></a>'
        );
      })
      .join("");
  }

  fetch("data/site.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("site.json " + r.status);
      return r.json();
    })
    .then(function (data) {
      document.querySelectorAll("[data-field]").forEach(function (el) {
        var val = get(data, el.getAttribute("data-field"));
        var attr = el.getAttribute("data-attr");
        var label = el.getAttribute("data-label");
        if (val == null || String(val).trim() === "") {
          // Empty optional fields (e.g. contact blurb): hide the element
          // instead of leaving an empty shell. Attribute-only targets
          // (email/link hrefs) are required fields, leave them alone.
          if (!attr && el.children.length === 0) el.style.display = "none";
          return;
        }
        if (attr) {
          var prefix = el.getAttribute("data-prefix") || "";
          el.setAttribute(attr, prefix + val);
        }
        if (el.children.length === 0) {
          el.textContent = label ? get(data, label) : val;
        }
      });

      document.querySelectorAll("[data-list]").forEach(function (el) {
        var items = get(data, el.getAttribute("data-list")) || [];
        var tag = el.getAttribute("data-tag") || "p";
        el.innerHTML = items
          .map(function (t) {
            // Blank lines inside one item also start a new paragraph,
            // so Decap text with line spacing renders as spaced paragraphs.
            return String(t).split(/\n\s*\n/).map(function (para) {
              return "<" + tag + ">" + esc(para) + "</" + tag + ">";
            }).join("");
          })
          .join("");
      });

      var cards = document.getElementById("project-cards");
      if (cards) cards.innerHTML = renderProjectCards(data.projects || []);

      // One sharp fact per card, pulled from each project's own data file.
      // Cards render first; facts patch in when they arrive.
      (function loadCardFacts() {
        var FACT_LABEL = {
          kotoban: "Status",
          planeframe: "Status",
          alpbrowser: "Platform",
          "annemin-tarifleri": "Videos",
          "dct-asistan": "Role"
        };
        function pickFact(d, slug) {
          if (!d || !d.facts || !d.facts.length) return null;
          var want = FACT_LABEL[slug];
          for (var i = 0; i < d.facts.length; i++) {
            if (d.facts[i].label === want) return d.facts[i];
          }
          return d.facts[0];
        }
        var links = cards.querySelectorAll("a.card");
        var slugs = [];
        links.forEach(function (a) {
          var m = /[?&]p=([^&]+)/.exec(a.getAttribute("href") || "");
          if (m) slugs.push(decodeURIComponent(m[1]));
        });
        Promise.all(slugs.map(function (s) {
          return fetch("data/projects/" + s + ".json", { cache: "no-store" })
            .then(function (r) { return r.ok ? r.json() : null; })
            .catch(function () { return null; });
        })).then(function (results) {
          results.forEach(function (d, i) {
            var fact = pickFact(d, slugs[i]);
            if (!fact || !links[i]) return;
            var body = links[i].querySelector(".card-body");
            var cta = body && body.querySelector(".card-cta");
            if (!body || !cta) return;
            var div = document.createElement("div");
            div.className = "card-fact";
            var label = document.createElement("span");
            label.className = "card-fact-label";
            label.textContent = fact.label;
            div.appendChild(label);
            div.appendChild(document.createTextNode(fact.value));
            body.insertBefore(div, cta);
          });
        });
      })();

      // Hero: floating language chips, fully interactive (JS-driven rAF).
      // Drag a bubble to fling it: on release it keeps flying in the drag
      // direction with momentum, then eases back into its drift. Mouse-wheel
      // over a bubble scrubs its progression. Stratified random lanes keep
      // coverage even; everything else is random each visit.
      var chipsBox = document.querySelector(".hero .chips");
      if (chipsBox) {
        var words = (data.hero && data.hero.floating_words) || [
          "hello", "xin ch\u00e0o", "merhaba",
        ];
        chipsBox.innerHTML = "";
        var chips = [];
        var n = words.length;
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var CW = function () { return chipsBox.clientWidth; };
        var CH = function () { return chipsBox.clientHeight; };
        // wanderer pockets: open airspace, never over mountains. The last
        // three are the halo: right of the text, right of the buttons, and
        // above the greeting, so bubbles frame the hero instead of hugging
        // the edges; the final three fill the lower sky down to the ridge.
        // Chips that land on a line of text fade out (see frame loop) to
        // stay legible; chips beside a line stay visible.
        var pockets = [
          [0.02, 0.20, 0.08, 0.30],
          [0.80, 0.96, 0.08, 0.30],
          [0.03, 0.18, 0.38, 0.50],
          [0.80, 0.97, 0.38, 0.55],
          [0.62, 0.90, 0.28, 0.50],
          [0.36, 0.62, 0.44, 0.58],
          [0.08, 0.50, 0.05, 0.16],
          [0.02, 0.22, 0.55, 0.72],
          [0.75, 0.97, 0.55, 0.72],
          [0.28, 0.50, 0.50, 0.68]
        ];
        // Mountain-aware ceiling: sample the RENDERED ridge paths (so slice
        // cropping, responsive sizes etc. are all accounted for) and forbid
        // chips below the silhouette, at any viewport.
        var RIDGE = null, RIDGE_N = 96;
        function buildRidge() {
          try {
            var svg = document.querySelector(".hero .taurus");
            if (!svg || !chipsBox) return;
            var box = chipsBox.getBoundingClientRect();
            if (!box.width || !box.height) return;
            var cols = [];
            for (var z = 0; z < RIDGE_N; z++) cols.push(Infinity);
            var paths = svg.querySelectorAll("path");
            for (var pi = 0; pi < paths.length; pi++) {
              var f = paths[pi].getAttribute("fill") || "";
              if (f !== "#2c3145" && f.indexOf("mmbase") === -1 && f.indexOf("mbase") === -1) continue;
              var ctm = paths[pi].getScreenCTM();
              if (!ctm) continue;
              var len = paths[pi].getTotalLength();
              for (var dd = 0; dd <= len; dd += 6) {
                var pt = paths[pi].getPointAtLength(dd);
                var sx = ctm.a * pt.x + ctm.c * pt.y + ctm.e;
                var sy = ctm.b * pt.x + ctm.d * pt.y + ctm.f;
                var bin = Math.floor((sx - box.left) / box.width * RIDGE_N);
                if (bin < 0 || bin >= RIDGE_N) continue;
                if (sy < cols[bin]) cols[bin] = sy;
              }
            }
            var last = Infinity, i, j;
            for (i = 0; i < RIDGE_N; i++) { if (cols[i] === Infinity) cols[i] = last; else last = cols[i]; }
            last = Infinity;
            for (j = RIDGE_N - 1; j >= 0; j--) { if (cols[j] === Infinity) cols[j] = last; else last = cols[j]; }
            RIDGE = cols.map(function (sy) { return (sy - box.top) / box.height - 0.035; });
            replanChips();
          } catch (e) { RIDGE = null; }
        }
        function skyLimit(xf) {
          if (!RIDGE) return 0.40;
          var i = Math.max(0, Math.min(RIDGE_N - 1, Math.floor(xf * RIDGE_N)));
          return RIDGE[i];
        }
        // Planned trajectories: a chip's whole motion is budgeted against the
        // ridge UP FRONT, so the per-frame clamp never has to fight anything.
        function maxWanderY(bx, ay) {
          var swing = ay * 1.6 + 0.025; // full vertical extent + margin
          var x0 = Math.max(0, bx - 0.03), x1 = Math.min(1, bx + 0.03);
          var lim = Math.min(skyLimit(x0), skyLimit(bx), skyLimit(x1));
          return lim - swing;
        }
        function replanChips() {
          for (var k = 0; k < chips.length; k++) {
            var c = chips[k];
            if (c.dragging) continue;
            if (c.mode === "wander") {
              c.by = Math.max(0.03, Math.min(c.by, maxWanderY(c.bx, c.ay)));
            } else {
              // traverser: lane + max drift must clear the highest peak
              var minR = 0.40;
              if (RIDGE) {
                minR = Infinity;
                for (var i = 0; i < RIDGE_N; i++) minR = Math.min(minR, RIDGE[i]);
              }
              var maxLane = Math.max(0.08, minR - 0.045);
              if (c.lane > maxLane) c.lane = maxLane;
            }
          }
        }

        // Position a traverser's main chip and its wrap mirror together.
        // _x/_y track the primary (on-screen) copy for fade/collision;
        // _gx/_gy track the other copy so the fade check covers edge
        // crossings, where both copies are partly visible at once.
        function syncPair(c, mx, my) {
          c.el.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
          var gx = mx;
          if (c.mode === "traverse" && c.ghost) {
            gx = mx - (c.tx - c.fx) * CW();
            c.ghost.style.transform = "translate(" + gx.toFixed(1) + "px," + my.toFixed(1) + "px)";
          }
          if (c.mode === "traverse" && c.ghost && c.tx < c.fx) { c._x = gx; c._gx = mx; }
          else { c._x = mx; c._gx = gx; }
          c._y = my; c._gy = my;
        }

        function place(c) {
          var w = CW(), h = CH(), sx, sy;
          if (c.mode === "traverse") {
            var p = ((c.t % 1) + 1) % 1;
            sx = (c.fx + (c.tx - c.fx) * p) * w;
            sy = (c.lane + c.dy * p) * h;
          } else {
            sx = (c.bx + c.ax * Math.sin(c.t * c.sp * 3 + c.ph1) +
                  c.ax * 0.6 * Math.sin(c.t * c.sp * 7 + c.ph2)) * w;
            sy = (c.by + c.ay * Math.cos(c.t * c.sp * 2.4 + c.ph2) +
                  c.ay * 0.6 * Math.cos(c.t * c.sp * 5.2 + c.ph1)) * h;
          }
          if (c.mode === "wander" && !c.dragging) {
            // soft ceiling: curve away before touching, hard guarantee at the limit
            var lim = skyLimit(sx / w) * h;
            var zone = 0.07 * h;
            if (sy > lim) { sy = lim; }
            else if (sy > lim - zone) {
              var kk = 1 - (lim - sy) / zone;
              sy = sy - kk * kk * zone * 0.45;
            }
          }
          var f = c.free * c.free;
          var x = sx * (1 - f) + c.px * f;
          var y = sy * (1 - f) + c.py * f;
          // Collision separation lives in a decaying offset, never in the
          // trajectory — rewriting bx/by/lane on every contact is what
          // made chips snap back and shake.
          x += c.ox; y += c.oy;
          c.ox *= 0.9; c.oy *= 0.9;
          syncPair(c, x, y);
        }

        words.forEach(function (w, i) {
          var outer = document.createElement("span");
          var inner = document.createElement("span");
          inner.className = "chip";
          inner.textContent = w;
          inner.style.opacity = (0.45 + Math.random() * 0.3).toFixed(2);
          inner.style.animationDuration = (16 + Math.random() * 8).toFixed(1) + "s";
          inner.style.animationDelay = (-Math.random() * 10).toFixed(1) + "s";
          outer.appendChild(inner);
          chipsBox.appendChild(outer);

          var c = {
            el: outer, dragging: false,
            free: 0, px: 0, py: 0, vx: 0, vy: 0,
            ox: 0, oy: 0,
            baseOp: parseFloat(inner.style.opacity) || 0.6, op: 1, _lastOp: 1
          };
          if (i % 3 === 2) {
            var pk = pockets[Math.floor(i / 3) % pockets.length];
            c.mode = "wander";
            c.bx = pk[0] + Math.random() * (pk[1] - pk[0]);
            c.by = pk[2] + Math.random() * (pk[3] - pk[2]);
            c.ay = 0.015 + Math.random() * 0.012;
            c.by = Math.max(0.03, Math.min(c.by, maxWanderY(c.bx, c.ay)));
            c.t = Math.random() * 100; c.sp = 0.06 + Math.random() * 0.07;
            c.ph1 = Math.random() * 6.28; c.ph2 = Math.random() * 6.28;
            c.ax = 0.018 + Math.random() * 0.012;
          } else {
            var ltr = Math.random() < 0.5;
            c.mode = "traverse";
            // Seamless wrap: the run spans exactly one screen width
            // (left-to-right, or right-to-left as 0 to -1), and a mirror
            // copy rides exactly one width over, so the slice of a chip
            // that exits one side enters the other side at the same time.
            c.fx = 0; c.tx = ltr ? 1 : -1;
            c.lane = 0.08 + ((i + Math.random()) / n) * 0.38;
            c.dy = Math.random() * 0.07 - 0.035;
            // Start on screen: pick the initial crossing point inside the
            // viewport instead of a random phase, so no drifter begins its
            // life off canvas and the hero reads full from the first frame.
            var sx0 = 0.02 + Math.random() * 0.96;
            c.t = ltr ? sx0 : 1 - sx0; c.sp = 1 / (180 + Math.random() * 60);
          }
          outer.className = c.mode === "wander" ? "chip-w" : "chip-x";
          outer._chip = c;
          chips.push(c);

          // Seamless-wrap mirror: traversers render a second copy exactly
          // one screen width over, so the slice exiting one side enters
          // the other side at once. The mirror is a clone (same text, same
          // bob phase: identical duration/delay, inserted in the same
          // frame), and it drags as one with the main chip.
          var gInner = null;
          if (c.mode === "traverse") {
            var gOuter = document.createElement("span");
            gInner = inner.cloneNode(true);
            gOuter.appendChild(gInner);
            gOuter.className = "chip-x";
            chipsBox.appendChild(gOuter);
            c.ghost = gOuter;
          }

          function bindChipDrag(elInner, isGhost) {
            elInner.addEventListener("pointerdown", function (ev) {
              ev.preventDefault();
              var cc = outer._chip;
              cc.dragging = true; cc.free = 0;
              cc.vx = 0; cc.vy = 0; cc._mx = undefined;
              try { elInner.setPointerCapture(ev.pointerId); } catch (e) {}
              var r = chipsBox.getBoundingClientRect();
              // Grab against whichever copy was actually touched.
              var gx0 = isGhost ? (cc.tx > cc.fx ? cc._gx : cc._x) : (cc.tx > cc.fx ? cc._x : cc._gx);
              cc.grabDX = ev.clientX - r.left - gx0;
              cc.grabDY = ev.clientY - r.top - cc._y;
              cc._grabGhost = isGhost;
              elInner.style.cursor = "grabbing";
            });
            elInner.addEventListener("pointermove", function (ev) {
              var cc = outer._chip;
              if (!cc.dragging) return;
              var r = chipsBox.getBoundingClientRect();
              var x = ev.clientX - r.left - cc.grabDX;
              var y = ev.clientY - r.top - cc.grabDY;
              var nowT = ev.timeStamp / 1000;
              if (cc._mx !== undefined) {
                var dtm = Math.max(0.008, nowT - cc._mt);
                cc.vx = cc.vx * 0.7 + ((x - cc._mx) / dtm) * 0.3;
                cc.vy = cc.vy * 0.7 + ((y - cc._my) / dtm) * 0.3;
              }
              cc._mx = x; cc._my = y; cc._mt = nowT;
              // A grab on the mirror moves the pair: translate the pointer
              // back to main coordinates, then sync both copies.
              var mx = cc._grabGhost ? x + (cc.tx - cc.fx) * r.width : x;
              syncPair(cc, mx, y);
            });
            elInner.addEventListener("pointerup", drop);
            elInner.addEventListener("pointercancel", drop);
            elInner.addEventListener("wheel", function (ev) {
              ev.preventDefault();
              var cc = outer._chip;
              if (cc.mode === "traverse") cc.t += ev.deltaY * 0.0004;
              else cc.t += ev.deltaY * 0.03;
              if (!cc.dragging) place(cc);
            }, { passive: false });
          }
          function drop() {
            var cc = outer._chip;
            if (!cc.dragging) return;
            cc.dragging = false;
            inner.style.cursor = "";
            if (cc.ghost) cc.ghost.firstChild.style.cursor = "";
            cc._grabGhost = false;
            var sp = Math.sqrt(cc.vx * cc.vx + cc.vy * cc.vy);
            if (sp > 1400) { cc.vx *= 1400 / sp; cc.vy *= 1400 / sp; }
            // permanently rebase the trajectory through the drop point,
            // so the chip keeps its new path instead of snapping back.
            // _x is the primary (visible) copy; convert to main coords.
            var rr = chipsBox.getBoundingClientRect();
            var ww = rr.width || 1, hh = rr.height || 1;
            var mainX = (cc.mode === "traverse" && cc.ghost) ? (cc.tx > cc.fx ? cc._x : cc._gx) : cc._x;
            var dx = mainX / ww, dy = cc._y / hh;
            dy = Math.min(dy, skyLimit(Math.max(0, Math.min(1, dx))) - 0.02);
            dy = Math.max(0.02, dy);
            if (cc.mode === "traverse") {
              var p0 = ((cc.t % 1) + 1) % 1;
              var shift = dx - (cc.fx + (cc.tx - cc.fx) * p0);
              cc.fx += shift; cc.tx += shift;
              cc.lane = Math.max(0.08, Math.min(0.38, dy - cc.dy * p0));
            } else {
              cc.bx = Math.max(0.01, Math.min(0.95, dx));
              cc.by = Math.max(0.03, Math.min(maxWanderY(cc.bx, cc.ay), dy));
            }
            cc.px = mainX; cc.py = cc._y; // fling from the drop point
            cc.free = 1;
          }
          bindChipDrag(inner, false);
          if (gInner) bindChipDrag(gInner, true);
        });

        chips.forEach(place);
        /* Mobile: frame the tall left peak so the mountains read higher. */
        function frameMountains() {
          try {
            var tsvg = document.querySelector(".hero .taurus");
            if (!tsvg) return;
            tsvg.setAttribute("preserveAspectRatio",
              window.matchMedia("(max-width: 600px)").matches ? "xMinYMax slice" : "xMidYMax slice");
          } catch (e) {}
        }
        frameMountains();
        buildRidge();
        var rT = null;
        window.addEventListener("resize", function () {
          if (rT) clearTimeout(rT);
          rT = setTimeout(function () { frameMountains(); buildRidge(); }, 200);
        });
        var last = performance.now();
        var frameNo = 0;
        // Separation steering: test the main copies plus any on-screen
        // ghost (wrap mirror) — ghosts used to overlap silently at the
        // edges, which is how chips got too close. Pushes go into the
        // decaying offset, never into the trajectory.
        function separatePair(A, B, w) {
          var ptsA = [[A._x, A._y]];
          if (A.ghost && A._gx > -A._rx && A._gx < w + A._rx) ptsA.push([A._gx, A._gy]);
          var ptsB = [[B._x, B._y]];
          if (B.ghost && B._gx > -B._rx && B._gx < w + B._rx) ptsB.push([B._gx, B._gy]);
          var rx = A._rx + B._rx, ry = A._ry + B._ry;
          for (var i = 0; i < ptsA.length; i++) {
            for (var j = 0; j < ptsB.length; j++) {
              var dx = ptsB[j][0] - ptsA[i][0], dy = ptsB[j][1] - ptsA[i][1];
              var qx = dx / rx, qy = dy / ry;
              var q2 = qx * qx + qy * qy;
              if (q2 < 1 && q2 > 0.0001) {
                var q = Math.sqrt(q2);
                var d = Math.sqrt(dx * dx + dy * dy);
                var nx = dx / d, ny = dy / d;
                var push = (1 - q) * 12;
                A.ox -= nx * push; A.oy -= ny * push;
                B.ox += nx * push; B.oy += ny * push;
              }
            }
          }
        }
        function collide() {
          var w = CW();
          for (var a = 0; a < chips.length; a++) {
            var A = chips[a];
            if (A.dragging) continue;
            for (var b = a + 1; b < chips.length; b++) {
              var B = chips[b];
              if (B.dragging) continue;
              separatePair(A, B, w);
            }
          }
        }
        function measure() {
          for (var k = 0; k < chips.length; k++) {
            var el = chips[k].el.firstChild;
            // Elliptical collision radii: a wide chip needs room sideways
            // but only a chip-height vertically. A circular radius sized
            // by width shoved chips far apart up/down and back again.
            chips[k]._rx = el ? el.offsetWidth / 2 + 12 : 30;
            chips[k]._ry = el ? el.offsetHeight / 2 + 10 : 26;
          }
        }
        measure();
        var heroEl = document.querySelector(".hero .hero-inner");
        // Fade zones are the ACTUAL text of each hero line (measured with a
        // Range, so block width never counts), not the whole hero-inner box.
        // Chips centred on the text fade to 10% of base opacity, so the
        // words stay legible; chips in the dead space beside a line stay
        // bright — only a centre actually on the text dims.
        var heroRects = [];
        function measureHero() {
          heroRects = [];
          if (!heroEl) return;
          var r = chipsBox.getBoundingClientRect();
          var padX = 14, padY = 10;
          var kids = heroEl.children;
          for (var mi = 0; mi < kids.length; mi++) {
            try {
              var rg = document.createRange();
              rg.selectNodeContents(kids[mi]);
              var b = rg.getBoundingClientRect();
              if (!b.width || !b.height) continue;
              heroRects.push({
                x0: b.left - r.left - padX, x1: b.right - r.left + padX,
                y0: b.top - r.top - padY, y1: b.bottom - r.top + padY
              });
            } catch (e) {}
          }
        }
        measureHero();
        window.addEventListener("resize", function () { measureHero(); measure(); });
        if (document.fonts && document.fonts.ready)
          document.fonts.ready.then(function () { measureHero(); measure(); });
        (function frame(now) {
          var dt = Math.min(0.1, (now - last) / 1000); last = now;
          if (!reduced) {
            for (var k = 0; k < chips.length; k++) {
              var c = chips[k];
              if (c.dragging) continue;
              if (c.mode === "traverse") c.t += c.sp * dt; else c.t += dt;
              if (c.free > 0) {
                c.px += c.vx * dt; c.py += c.vy * dt;
                // flung chips curve around the mountains too, never dip in
                var fw = CW(), fh = CH();
                var flim = skyLimit(Math.max(0, Math.min(1, c.px / fw))) * fh - 10;
                if (c.py > flim) { c.py = flim; if (c.vy > 0) c.vy = 0; }
                var damp = Math.exp(-1.4 * dt);
                c.vx *= damp; c.vy *= damp;
                c.free = Math.max(0, c.free - dt / 4.5);
              }
              place(c);
              if (heroRects.length) {
                var behind = false;
                for (var bi = 0; bi < heroRects.length; bi++) {
                  var hb = heroRects[bi];
                  // Centre only, not the whole chip box: a bubble counts
                  // as under the text only when its centre sits on the
                  // text — bubbles in the dead space beside a line stay
                  // bright even if an edge brushes the text.
                  if ((c._x > hb.x0 && c._x < hb.x1 && c._y > hb.y0 && c._y < hb.y1) ||
                      (c._gx !== undefined && c._gx > hb.x0 && c._gx < hb.x1 && c._gy > hb.y0 && c._gy < hb.y1)) { behind = true; break; }
                }
                var tgt = behind ? 0.10 : 1;
                c.op += (tgt - c.op) * Math.min(1, dt * 5);
                if (Math.abs(c.op - c._lastOp) > 0.02) {
                  c.el.firstChild.style.opacity = (c.baseOp * c.op).toFixed(3);
                  if (c.ghost) c.ghost.firstChild.style.opacity = (c.baseOp * c.op).toFixed(3);
                  c._lastOp = c.op;
                }
              }
            }
            if (++frameNo % 3 === 0) collide();
            // Rotating words change line widths; re-measure fade zones
            // regularly so the halo tracks the current word.
            if (frameNo % 30 === 0) measureHero();
          }
          requestAnimationFrame(frame);
        })(last);
      }

      // Hero: rotating greeting + "I love" word box. Both swap on ONE
      // shared interval so the page never has two competing motions.
      (function () {
        var greetBox = document.getElementById("greetBox");
        var greetEl = document.getElementById("greetWord");
        var bangEl = document.getElementById("greetBang");
        void 0;
        var loveEl = document.getElementById("loveWord");
        var loveBox = document.getElementById("loveBox");
        var dotEl = document.getElementById("loveDot");
        if (!greetEl && !loveEl) return;
        var hero = data.hero || {};
        var words = hero.floating_words || [];
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function shuffled(a) {
          a = a.slice();
          for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
          }
          return a;
        }
        // Greetings: first the big five (TR/EN/JA/VI/DE) in random order,
        // then the rest of the list, reshuffled every cycle, no repeats.
        var first5 = ["merhaba", "hello", "こんにちは", "xin chào", "hallo"].filter(function (w) { return words.indexOf(w) !== -1; });
        var gSeq = shuffled(first5), gRest = [];
        function nextGreeting() {
          if (!gSeq.length) {
            if (!gRest.length) {
              gRest = shuffled(words.filter(function (w) { return first5.indexOf(w) === -1; }));
            }
            gSeq = [gRest.pop()];
          }
          return gSeq.shift();
        }
        function greetDisplay(w) {
          // Latin-alphabet greetings get a capital in the headline box;
          // the floating bubbles keep their own casing.
          // Spanish gets its opening mark in the headline only: ¡Hola!
          if (w.toLowerCase() === "hola") return "¡Hola";
          if (/^[a-z]/.test(w)) return w.charAt(0).toUpperCase() + w.slice(1);
          return w;
        }
        var loveWords = hero.love_words || ["building things"];
        var lPool = [];
        function nextLove() {
          if (!lPool.length) lPool = shuffled(loveWords.slice());
          return lPool.pop();
        }
        // Keep "I love" on one line: shrink the headline to fit the longest word.
        function fitLove() {
          var h1c = document.querySelector(".hero-love");
          if (h1c) h1c.style.fontSize = ""; // clear stale inline size
          return; // fixed size; never exceed sub width
          var h1 = document.querySelector(".hero-love");
          if (!h1 || !loveEl) return;
          var cur = loveEl.textContent;
          var longest = loveWords.reduce(function (a, b) { return a.length >= b.length ? a : b; });
          loveEl.textContent = longest;
          h1.style.fontSize = "";
          if (h1.scrollWidth > h1.clientWidth) {
            var fs = parseFloat(getComputedStyle(h1).fontSize);
            h1.style.fontSize = (fs * h1.clientWidth / h1.scrollWidth).toFixed(1) + "px";
          }
          loveEl.textContent = cur;
        }
        function loveNaturalWidth(text) {
          if (!loveBox || !loveEl) return 0;
          var oldT = loveEl.textContent;
          loveEl.textContent = text;
          loveBox.style.width = "auto";
          var w = loveBox.offsetWidth;
          loveEl.textContent = oldT;
          return w;
        }
        function glideLoveWidth(text) {
          if (!loveBox || !loveEl || reduced) return;
          var from = loveBox.offsetWidth;
          var to = loveNaturalWidth(text);
          if (from === to) { loveBox.style.width = to + "px"; return; }
          loveBox.style.width = from + "px";
          void loveBox.offsetWidth;
          loveBox.style.width = to + "px";
        }
        function sizeLoveBox() {
          if (!loveBox || !loveEl || reduced) return;
          loveBox.style.width = loveNaturalWidth(loveEl.textContent) + "px";
        }
        function slideSwap(el, text, after) {
          if (!el) { if (after) after(); return; }
          if (reduced) { el.textContent = text; if (after) after(); return; }
          el.classList.remove("word-in");
          el.classList.add("word-out");
          var punct = (el === loveEl) ? dotEl : null;
          if (punct) { punct.classList.remove("word-in"); punct.classList.add("word-out"); }
          // Pre-size the love box during word-out so expansion leads the
          // incoming word (no clipping) and contraction glides smoothly.
          if (el === loveEl && loveBox) {
            glideLoveWidth(text);
          }
          setTimeout(function () {
            el.textContent = text;
            el.classList.remove("word-out");
            void el.offsetWidth;
            el.classList.add("word-in");
            if (punct) {
              punct.classList.remove("word-out");
              void punct.offsetWidth;
              punct.classList.add("word-in");
            }
            if (after) after();
          }, 360);
        }
        // Greeting box: fluid width. New word is set hidden, measured, then
        // the box eases to the new width while the word slides in — the
        // "! My name is Alp" tail rides the box edge instead of jumping.
        function greetNaturalWidth() {
          var oldT = greetEl.textContent;
          // measure with current text; caller sets new text first if needed
          greetBox.style.width = "auto";
          var w = greetBox.offsetWidth;
          return w;
        }
        function glideGreetWidth() {
          if (!greetBox || !greetEl || reduced) return;
          var from = greetBox.offsetWidth;
          var to = greetNaturalWidth();
          if (from === to) { greetBox.style.width = to + "px"; return; }
          greetBox.style.width = from + "px";
          void greetBox.offsetWidth;
          greetBox.style.width = to + "px";
        }
        function sizeGreetBox() {
          if (!greetBox || !greetEl || reduced) return;
          greetBox.style.width = greetNaturalWidth() + "px";
        }
        function swapGreeting() {
          var next = greetDisplay(nextGreeting());
          if (reduced || !greetBox) { slideSwap(greetEl, next); return; }
          greetEl.classList.remove("word-in");
          greetEl.classList.add("word-out");
          if (bangEl) { bangEl.classList.remove("word-in"); bangEl.classList.add("word-out"); }
          setTimeout(function () {
            greetEl.textContent = next;
            glideGreetWidth();
            void greetBox.offsetWidth;
            greetEl.classList.remove("word-out");
            void greetEl.offsetWidth;
            greetEl.classList.add("word-in");
            if (bangEl) {
              bangEl.classList.remove("word-out");
              void bangEl.offsetWidth;
              bangEl.classList.add("word-in");
            }
          }, 360);
        }
        function tick() {
          swapGreeting();
          slideSwap(loveEl, nextLove(), function () { fitLove(); sizeLoveBox(); });
        }
        if (greetEl) greetEl.textContent = greetDisplay(nextGreeting());
        if (loveEl) {
          loveEl.textContent = nextLove();
          fitLove();
          sizeLoveBox();
          if (document.fonts && document.fonts.ready)
            document.fonts.ready.then(function () { fitLove(); sizeLoveBox(); sizeGreetBox(); });
          window.addEventListener("resize", function () { fitLove(); sizeLoveBox(); sizeGreetBox(); });
        }
        sizeGreetBox();
        if (document.fonts && document.fonts.ready)
          document.fonts.ready.then(sizeGreetBox);
        var ROT = (hero.rotation_interval || 3) * 1000;
        if (!reduced) setInterval(tick, ROT);
      })();

      document.title = "Alp D. Güreş – Brown '27";

      // Scroll reveal
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

      // Apple-style scroll: the hero settles as you leave it, the mountains
      // parallax, the nav frosts in, and a hairline tracks reading progress.
      // rAF-throttled; transforms skipped entirely for reduced motion.
      try {
        var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var heroEl = document.querySelector(".hero");
        var heroInner = document.querySelector(".hero-inner");
        var taurusEl = document.querySelector(".taurus");
        var navEl = document.querySelector(".nav");
        var scrollTicking = false;
        function onScrollFrame() {
          scrollTicking = false;
          var y = window.scrollY || 0;
          var max = document.documentElement.scrollHeight - window.innerHeight;
          document.documentElement.style.setProperty("--scroll-progress", (max > 0 ? (y / max) * 100 : 0) + "%");
          if (navEl) navEl.classList.toggle("scrolled", y > 40);
          if (reducedMotion) return;
          var h = heroEl ? heroEl.offsetHeight : 1;
          var p = Math.min(y / h, 1);
          if (heroInner) {
            heroInner.style.opacity = String(1 - p * 0.9);
            heroInner.style.transform = "translateY(" + (-28 - p * 40) + "px) scale(" + (1 - p * 0.04) + ")";
          }
          if (taurusEl) taurusEl.style.transform = "translateY(" + Math.min(y * 0.18, 90) + "px)";

          // Horizontal work carousel: vertical scroll through the tall
          // .work-scroll track drives the card row left.
          var workSection = document.querySelector(".work-scroll");
          var workRow = document.getElementById("project-cards");
          if (workSection && workRow && !reducedMotion && window.innerWidth > 700) {
            var rect = workSection.getBoundingClientRect();
            var span = workSection.offsetHeight - window.innerHeight;
            var prog = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
            var maxX = Math.max(workRow.scrollWidth - window.innerWidth, 0);
            workRow.style.transform = "translateX(" + (-prog * maxX) + "px)";
          } else if (workRow) {
            workRow.style.transform = "";
          }
        }
        function onScroll() {
          if (scrollTicking) return;
          scrollTicking = true;
          requestAnimationFrame(onScrollFrame);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        onScroll();
      } catch (e) { /* scroll polish is optional; never break the page */ }
    })
    .catch(function (err) {
      console.error("Could not load site content:", err);
    });
})();
