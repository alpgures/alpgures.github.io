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
            c.t = Math.random() * 100; c.sp = 0.10 + Math.random() * 0.12;
            c.ph1 = Math.random() * 6.28; c.ph2 = Math.random() * 6.28;
            c.ax = 0.018 + Math.random() * 0.012; c.ay = 0.015 + Math.random() * 0.012;
          } else {
            var ltr = Math.random() < 0.5;
            c.mode = "traverse";
            c.fx = ltr ? -0.22 : 1.12; c.tx = ltr ? 1.12 : -0.22;
            c.lane = 0.04 + ((i + Math.random()) / n) * 0.34;
            c.dy = Math.random() * 0.08 - 0.04;
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
        var last = performance.now();
        var frameNo = 0;
        function nudge(c, ddx, ddy, w, h) {
          if (c.free > 0.3) { c.px += ddx * 0.6; c.py += ddy * 0.6; }
          else if (c.mode === "traverse") {
            c.lane = Math.max(0.02, Math.min(0.42, c.lane + (ddy / h) * 0.6));
            c.t += (ddx / w) / (c.tx - c.fx) * 0.6;
          } else {
            c.bx = Math.max(0.01, Math.min(0.95, c.bx + (ddx / w) * 0.6));
            c.by = Math.max(0.03, Math.min(0.55, c.by + (ddy / h) * 0.6));
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
