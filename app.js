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
      // Drag any bubble to reposition it; mouse-wheel over a bubble scrubs
      // its progression along its path. Stratified random lanes keep vertical
      // coverage even; everything else is genuinely random each visit.
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

        function place(c) {
          var w = CW(), h = CH(), x, y;
          if (c.mode === "traverse") {
            var p = ((c.t % 1) + 1) % 1;
            x = (c.fx + (c.tx - c.fx) * p) * w;
            y = (c.lane + c.dy * p) * h;
          } else {
            x = (c.bx + c.ax * Math.sin(c.t * c.sp * 3 + c.ph1) +
                 c.ax * 0.6 * Math.sin(c.t * c.sp * 7 + c.ph2)) * w;
            y = (c.by + c.ay * Math.cos(c.t * c.sp * 2.4 + c.ph2) +
                 c.ay * 0.6 * Math.cos(c.t * c.sp * 5.2 + c.ph1)) * h;
          }
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

          var c;
          if (i % 4 === 3) {
            var leftSide = (i % 8) === 3; // wanderers: open corner pockets
            c = {
              el: outer, mode: "wander",
              bx: leftSide ? 0.02 + Math.random() * 0.18 : 0.80 + Math.random() * 0.16,
              by: 0.08 + Math.random() * 0.22,
              t: Math.random() * 100, sp: 0.10 + Math.random() * 0.12,
              ph1: Math.random() * 6.28, ph2: Math.random() * 6.28,
              ax: 0.018 + Math.random() * 0.012, ay: 0.015 + Math.random() * 0.012,
              dragging: false
            };
          } else {
            var ltr = Math.random() < 0.5; // traversers: full width, diagonal drift
            c = {
              el: outer, mode: "traverse",
              fx: ltr ? -0.22 : 1.12, tx: ltr ? 1.12 : -0.22,
              lane: 0.04 + ((i + Math.random()) / n) * 0.34,
              dy: Math.random() * 0.08 - 0.04,
              t: Math.random(), sp: 1 / (100 + Math.random() * 40),
              dragging: false
            };
          }
          outer.className = c.mode === "wander" ? "chip-w" : "chip-x";
          outer._chip = c;
          chips.push(c);

          inner.addEventListener("pointerdown", function (ev) {
            ev.preventDefault();
            var cc = outer._chip;
            cc.dragging = true;
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
            cc.el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
            cc._x = x; cc._y = y;
          });
          function drop(ev) {
            var cc = outer._chip;
            if (!cc.dragging) return;
            cc.dragging = false;
            inner.style.cursor = "";
            var w = CW(), h = CH();
            if (cc.mode === "traverse") {
              var p = (cc._x / w - cc.fx) / (cc.tx - cc.fx);
              p = Math.max(0, Math.min(0.999, p));
              cc.t = p;
              cc.lane = cc._y / h - cc.dy * p;
            } else {
              cc.bx = cc._x / w; cc.by = cc._y / h;
            }
            place(cc);
          }
          inner.addEventListener("pointerup", drop);
          inner.addEventListener("pointercancel", drop);
          inner.addEventListener("wheel", function (ev) {
            ev.preventDefault(); // scrub this bubble's progression
            var cc = outer._chip;
            if (cc.mode === "traverse") cc.t += ev.deltaY * 0.0004;
            else cc.t += ev.deltaY * 0.03;
            place(cc);
          }, { passive: false });
        });

        chips.forEach(place);
        var last = performance.now();
        var frameNo = 0;
        // Gentle collision: when two bubbles overlap, nudge their
        // trajectories apart a touch so they stop sitting on each other.
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
        function nudge(c, ddx, ddy, w, h) {
          if (c.mode === "traverse") {
            c.lane = Math.max(0.02, Math.min(0.42, c.lane + (ddy / h) * 0.6));
            c.t += (ddx / w) / (c.tx - c.fx) * 0.6;
          } else {
            c.bx = Math.max(0.01, Math.min(0.95, c.bx + (ddx / w) * 0.6));
            c.by = Math.max(0.03, Math.min(0.55, c.by + (ddy / h) * 0.6));
          }
          place(c);
        }
        function measure() {
          for (var k = 0; k < chips.length; k++) {
            var el = chips[k].el.firstChild;
            chips[k]._r = el ? el.offsetWidth / 2 + 3 : 30;
          }
        }
        measure();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
        (function frame(now) {
          var dt = Math.min(0.1, (now - last) / 1000); last = now;
          if (!reduced) {
            for (var k = 0; k < chips.length; k++) {
              var c = chips[k];
              if (c.dragging) continue;
              c.t += (c.mode === "traverse" ? c.sp : 1) * dt;
              place(c);
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
