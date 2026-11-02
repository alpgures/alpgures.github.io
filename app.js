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
        var delay = i === 1 ? " rv-d1" : i === 2 ? " rv-d2" : "";
        return (
          '<a class="card rv' + delay + '" href="projects/project.html?p=' + esc(p.slug) + '">' +
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
        if (val == null) return;
        var attr = el.getAttribute("data-attr");
        var label = el.getAttribute("data-label");
        if (attr) {
          var prefix = el.getAttribute("data-prefix") || "";
          el.setAttribute(attr, prefix + val);
        }
        el.textContent = label ? get(data, label) : val;
      });

      document.querySelectorAll("[data-list]").forEach(function (el) {
        var items = get(data, el.getAttribute("data-list")) || [];
        var tag = el.getAttribute("data-tag") || "p";
        el.innerHTML = items
          .map(function (t) { return "<" + tag + ">" + esc(t) + "</" + tag + ">"; })
          .join("");
      });

      var cards = document.getElementById("project-cards");
      if (cards) cards.innerHTML = renderProjectCards(data.projects || []);

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
        // wanderer pockets: open airspace, never over mountains or text
        var pockets = [
          [0.02, 0.20, 0.08, 0.30],
          [0.80, 0.96, 0.08, 0.30],
          [0.03, 0.18, 0.38, 0.50],
          [0.80, 0.97, 0.38, 0.55]
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
          c.el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
          c._x = x; c._y = y;
        }

        words.forEach(function (w, i) {
          var outer = document.createElement("span");
          var inner = document.createElement("span");
          inner.className = "chip";
          inner.textContent = w;
          inner.style.opacity = (0.45 + Math.random() * 0.3).toFixed(2);
          inner.style.animationDuration = (8 + Math.random() * 6).toFixed(1) + "s";
          inner.style.animationDelay = (-Math.random() * 10).toFixed(1) + "s";
          outer.appendChild(inner);
          chipsBox.appendChild(outer);

          var c = {
            el: outer, dragging: false,
            free: 0, px: 0, py: 0, vx: 0, vy: 0,
            baseOp: parseFloat(inner.style.opacity) || 0.6, op: 1, _lastOp: 1
          };
          if (i % 4 === 3) {
            var pk = pockets[Math.floor(i / 4) % pockets.length];
            c.mode = "wander";
            c.bx = pk[0] + Math.random() * (pk[1] - pk[0]);
            c.by = pk[2] + Math.random() * (pk[3] - pk[2]);
            c.ay = 0.015 + Math.random() * 0.012;
            c.by = Math.max(0.03, Math.min(c.by, maxWanderY(c.bx, c.ay)));
            c.t = Math.random() * 100; c.sp = 0.10 + Math.random() * 0.12;
            c.ph1 = Math.random() * 6.28; c.ph2 = Math.random() * 6.28;
            c.ax = 0.018 + Math.random() * 0.012;
          } else {
            var ltr = Math.random() < 0.5;
            c.mode = "traverse";
            c.fx = ltr ? -0.22 : 1.12; c.tx = ltr ? 1.12 : -0.22;
            c.lane = 0.08 + ((i + Math.random()) / n) * 0.30;
            c.dy = Math.random() * 0.07 - 0.035;
            c.t = Math.random(); c.sp = 1 / (100 + Math.random() * 40);
          }
          outer.className = c.mode === "wander" ? "chip-w" : "chip-x";
          outer._chip = c;
          chips.push(c);

          inner.addEventListener("pointerdown", function (ev) {
            ev.preventDefault();
            var cc = outer._chip;
            cc.dragging = true; cc.free = 0;
            cc.vx = 0; cc.vy = 0; cc._mx = undefined;
            try { inner.setPointerCapture(ev.pointerId); } catch (e) {}
            var r = chipsBox.getBoundingClientRect();
            cc.grabDX = ev.clientX - r.left - cc._x;
            cc.grabDY = ev.clientY - r.top - cc._y;
            inner.style.cursor = "grabbing";
          });
          inner.addEventListener("pointermove", function (ev) {
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
            cc.el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
            cc._x = x; cc._y = y;
          });
          function drop() {
            var cc = outer._chip;
            if (!cc.dragging) return;
            cc.dragging = false;
            inner.style.cursor = "";
            var sp = Math.sqrt(cc.vx * cc.vx + cc.vy * cc.vy);
            if (sp > 1400) { cc.vx *= 1400 / sp; cc.vy *= 1400 / sp; }
            // permanently rebase the trajectory through the drop point,
            // so the chip keeps its new path instead of snapping back
            var rr = chipsBox.getBoundingClientRect();
            var ww = rr.width || 1, hh = rr.height || 1;
            var dx = cc._x / ww, dy = cc._y / hh;
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
            cc.px = cc._x; cc.py = cc._y; // fling from the drop point
            cc.free = 1;
          }
          inner.addEventListener("pointerup", drop);
          inner.addEventListener("pointercancel", drop);
          inner.addEventListener("wheel", function (ev) {
            ev.preventDefault();
            var cc = outer._chip;
            if (cc.mode === "traverse") cc.t += ev.deltaY * 0.0004;
            else cc.t += ev.deltaY * 0.03;
            if (!cc.dragging) place(cc);
          }, { passive: false });
        });

        chips.forEach(place);
        buildRidge();
        var rT = null;
        window.addEventListener("resize", function () {
          if (rT) clearTimeout(rT);
          rT = setTimeout(buildRidge, 200);
        });
        var last = performance.now();
        var frameNo = 0;
        function nudge(c, ddx, ddy, w, h) {
          if (c.free > 0.3) { c.px += ddx * 0.6; c.py += ddy * 0.6; }
          else if (c.mode === "traverse") {
            c.lane = Math.max(0.08, Math.min(0.38, c.lane + (ddy / h) * 0.6));
            c.t += (ddx / w) / (c.tx - c.fx) * 0.6;
          } else {
            c.bx = Math.max(0.01, Math.min(0.95, c.bx + (ddx / w) * 0.6));
            c.by = Math.max(0.03, Math.min(maxWanderY(c.bx, c.ay), c.by + (ddy / h) * 0.6));
          }
        }
        function collide() {
          var w = CW(), h = CH();
          for (var a = 0; a < chips.length; a++) {
            var A = chips[a];
            if (A.dragging) continue;
            for (var b = a + 1; b < chips.length; b++) {
              var B = chips[b];
              if (B.dragging) continue;
              var dx = B._x - A._x, dy = B._y - A._y;
              var rr = A._r + B._r;
              var d2 = dx * dx + dy * dy;
              if (d2 < rr * rr && d2 > 1) {
                var d = Math.sqrt(d2);
                var nx = dx / d, ny = dy / d;
                var push = (rr - d) / 2;
                nudge(A, -nx * push, -ny * push, w, h);
                nudge(B, nx * push, ny * push, w, h);
              }
            }
          }
        }
        function measure() {
          for (var k = 0; k < chips.length; k++) {
            var el = chips[k].el.firstChild;
            chips[k]._r = el ? el.offsetWidth / 2 + 3 : 30;
          }
        }
        measure();
        var heroEl = document.querySelector(".hero .hero-inner");
        var heroBox = null;
        function measureHero() {
          if (!heroEl) return;
          var r = chipsBox.getBoundingClientRect();
          var h = heroEl.getBoundingClientRect();
          var padX = 46, padY = 26;
          heroBox = {
            x0: h.left - r.left - padX, x1: h.right - r.left + padX,
            y0: h.top - r.top - padY, y1: h.bottom - r.top + padY
          };
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
              if (heroBox) {
                var behind = c._x > heroBox.x0 && c._x < heroBox.x1 &&
                             c._y > heroBox.y0 && c._y < heroBox.y1;
                var tgt = behind ? 0.14 : 1;
                c.op += (tgt - c.op) * Math.min(1, dt * 5);
                if (Math.abs(c.op - c._lastOp) > 0.02) {
                  c.el.firstChild.style.opacity = (c.baseOp * c.op).toFixed(3);
                  c._lastOp = c.op;
                }
              }
            }
            if (++frameNo % 3 === 0) collide();
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
    })
    .catch(function (err) {
      console.error("Could not load site content:", err);
    });
})();
