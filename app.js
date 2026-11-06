/* Renders alpgures.me from data/site.json (the file Decap CMS edits). */

(function () {
  /* Liquid-glass support check: only browsers that accept an SVG filter
     reference in backdrop-filter get the refracting chips (html.glass-ok).
     Safari drops url() there, which left the light glass tint nearly
     invisible — those browsers keep the frosted pill instead. The check
     runs synchronously here, before the chips are built. */
  try {
    var _g = document.createElement("div");
    _g.style.backdropFilter = "url(#lg)";
    if (_g.style.backdropFilter) document.documentElement.classList.add("glass-ok");
  } catch (e) {}

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

      // Hero: floating language chips (JS-driven rAF).
      // (2026-11-06, Alp: the bubbles are pure ambience now. They drift
      // sideways only — all at exactly the same rate, no interactivity:
      // no dragging, no wheel scrub, no fling, no bobbing. They sit on
      // straight, evenly spaced horizontal rows with no randomness and
      // no dead space, and every row drifts the opposite way from its
      // neighbours. (2026-11-06, round 5: bigger pills, 28px, and more
      // rows, so the sky fills in; a pill now fades selectively while
      // it passes behind the hero text (see the frame loop), and a dark
      // halo sits behind the text in CSS, both per Alp. The headline
      // still renders above the pills (hero-inner z-index 3). Rows are
      // the separation: same row + same direction + same speed means the
      // spacing is kept forever, no collision steering needed.)
      var chipsBox = document.querySelector(".hero .chips");
      if (chipsBox) {
        var words = (data.hero && data.hero.floating_words) || [
          "hello", "xin ch\u00e0o", "merhaba",
        ];
        chipsBox.innerHTML = "";
        var chips = [];
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var CW = function () { return chipsBox.clientWidth; };
        var CH = function () { return chipsBox.clientHeight; };
        // One shared drift rate for every bubble: a full crossing takes
        // 200 seconds, slow and calm.
        var CHIP_SP = 1 / 200;
        // Rows: the bubbles sit on straight, evenly spaced horizontal
        // rows (no random scatter, no dead space). The row count adapts
        // to how much bubble width has to fit across the screen.
        var ROW_Y = [];
        var PILL_H = 54; // measured pill height, set by layoutRows()
        function computeMaxLane() {
          var minR = 0.40;
          if (RIDGE) {
            minR = Infinity;
            for (var i = 0; i < RIDGE_N; i++) minR = Math.min(minR, RIDGE[i]);
          }
          return Math.max(0.08, minR - 0.03);
        }
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
        // Lay the bubbles out on their rows: evenly spaced rows across
        // the sky, each row drifting the opposite way from its neighbours.
        // The widest pills are dealt first to the currently lightest row
        // (greedy balance), so no row ends up a solid chain of touching
        // pills and none is half empty; each row is then laid out with
        // even gaps, including the wrap gap. Re-run on resize (rows and
        // lanes adapt to the new width/ridge) and when the webfont lands
        // (pill widths change).
        function layoutRows() {
          if (!chips.length) return;
          var w = CW() || 1;
          var items = [];
          for (var mi = 0; mi < chips.length; mi++) {
            var mel = chips[mi].el.firstChild;
            items.push({ c: chips[mi], w: mel ? mel.offsetWidth : 100 });
          }
          var totalW = 0;
          for (var ti = 0; ti < items.length; ti++) totalW += items[ti].w;
          var maxLane = computeMaxLane();
          var rows = Math.max(5, Math.min(8, Math.ceil(totalW / (w * 0.8))));
          // Height cap (2026-11-06, round 5): bigger pills need taller
          // rows, never stack rows closer than pill height + 10px, so
          // pills from neighbouring rows can't overlap on short screens.
          var pillH = 54;
          var firstMel = chips.length ? chips[0].el.firstChild : null;
          if (firstMel && firstMel.offsetHeight) pillH = firstMel.offsetHeight;
          PILL_H = pillH;
          var vSpan = (maxLane - 0.04) * CH();
          var maxRowsH = Math.max(5, Math.floor(vSpan / (pillH + 10)) + 1);
          if (rows > maxRowsH) rows = maxRowsH;
          ROW_Y = [];
          for (var rj = 0; rj < rows; rj++) {
            ROW_Y.push(0.04 + (rows > 1 ? (rj / (rows - 1)) * (maxLane - 0.04) : 0));
          }
          var rowItems = [];
          var rowW = [];
          for (var rk = 0; rk < rows; rk++) { rowItems.push([]); rowW.push(0); }
          var sorted = items.slice().sort(function (a, b) { return b.w - a.w; });
          for (var si = 0; si < sorted.length; si++) {
            var lightest = 0;
            for (var li = 1; li < rows; li++) if (rowW[li] < rowW[lightest]) lightest = li;
            rowItems[lightest].push(sorted[si]);
            rowW[lightest] += sorted[si].w;
          }
          for (var r = 0; r < rows; r++) {
            var list = rowItems[r];
            // Keep the row's reading order stable (by original index).
            list.sort(function (a, b) { return a.c._idx - b.c._idx; });
            var m = list.length;
            if (!m) continue;
            var gap = (w - rowW[r]) / m;
            if (gap < 0) gap = 0;
            var x = 0;
            for (var j = 0; j < m; j++) {
              var cc = list[j].c;
              cc._w = list[j].w;
              cc.row = r;
              cc.lane = ROW_Y[r];
              cc.ltr = (r % 2 === 0);
              cc.fx = 0; cc.tx = cc.ltr ? 1 : -1;
              var v = x / w;
              cc.t = cc.ltr ? v : 1 - v;
              x += list[j].w + gap;
            }
          }
        }
        function replanChips() { layoutRows(); }

        // Position a chip and its wrap mirror together. _x/_y track the
        // primary (on-screen) copy; _gx/_gy track the other copy so edge
        // crossings stay seamless.
        function syncPair(c, mx, my) {
          c.el.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
          var gx = mx;
          if (c.ghost) {
            gx = mx - (c.tx - c.fx) * CW();
            c.ghost.style.transform = "translate(" + gx.toFixed(1) + "px," + my.toFixed(1) + "px)";
          }
          if (c.ghost && c.tx < c.fx) { c._x = gx; c._gx = mx; }
          else { c._x = mx; c._gx = gx; }
          c._y = my; c._gy = my;
        }

        function place(c) {
          var w = CW(), h = CH();
          var p = ((c.t % 1) + 1) % 1;
          var sx = (c.fx + (c.tx - c.fx) * p) * w;
          var sy = c.lane * h;
          syncPair(c, sx, sy);
        }

        words.forEach(function (w, i) {
          var outer = document.createElement("span");
          var inner = document.createElement("span");
          inner.className = "chip";
          inner.textContent = w;
          inner.style.opacity = (0.85 + Math.random() * 0.15).toFixed(2);
          outer.appendChild(inner);
          chipsBox.appendChild(outer);

          // Row, lane, direction and spacing are set by layoutRows()
          // (called from buildRidge below): straight even rows, each
          // drifting the opposite way from its neighbours. Seamless wrap:
          // the run spans exactly one screen width (left-to-right, or
          // right-to-left as 0 to -1), and a mirror copy rides exactly
          // one width over, so the slice of a chip that exits one side
          // enters the other side at the same time.
          var c = { el: outer, sp: CHIP_SP, t: 0, lane: 0.1, ltr: true, fx: 0, tx: 1, row: 0, _idx: i };
          outer.className = "chip-x";
          outer._chip = c;
          chips.push(c);

          // Seamless-wrap mirror: every chip renders a second copy
          // exactly one screen width over, so the slice exiting one side
          // enters the other side at once. The mirror is a clone (same
          // text, inserted in the same frame).
          var gInner = inner.cloneNode(true);
          var gOuter = document.createElement("span");
          gOuter.appendChild(gInner);
          gOuter.className = "chip-x";
          chipsBox.appendChild(gOuter);
          c.ghost = gOuter;
        });

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
        // buildRidge already laid the rows out (via replanChips); run it
        // once more directly so the rows exist even if the ridge sampling
        // failed, and re-run when the webfont lands (pill widths change).
        layoutRows();
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(function () { layoutRows(); chips.forEach(place); });
        }
        chips.forEach(place);
        var rT = null;
        window.addEventListener("resize", function () {
          if (rT) clearTimeout(rT);
          rT = setTimeout(function () { frameMountains(); buildRidge(); }, 200);
        });
        var last = performance.now();
        var heroInnerEl = document.querySelector(".hero-inner");
        (function frame(now) {
          var dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;
          if (!reduced) {
            for (var k = 0; k < chips.length; k++) {
              var c = chips[k];
              c.t += c.sp * dt;
              place(c);
            }
          }
          // Selective dimming (2026-11-06, round 5, per Alp): a pill
          // fades to 0.14 while any part of it (primary or ghost copy)
          // sits behind the hero text block, and returns to full
          // opacity once it drifts past. The halo in CSS darkens the
          // same zone. Chip positions are analytic (from place()), so
          // this costs two rect reads per frame, not one per chip.
          if (heroInnerEl) {
            var boxR = chipsBox.getBoundingClientRect();
            var hr = heroInnerEl.getBoundingClientRect();
            var zx0 = hr.left - boxR.left - 16, zx1 = hr.right - boxR.left + 16;
            var zy0 = hr.top - boxR.top - 16, zy1 = hr.bottom - boxR.top + 16;
            var dh = PILL_H || 54;
            for (var di = 0; di < chips.length; di++) {
              var dc = chips[di];
              var dw = dc._w || 200;
              var dim = (dc._x + dw > zx0 && dc._x < zx1 && dc._y + dh > zy0 && dc._y < zy1) ||
                        (dc._gx + dw > zx0 && dc._gx < zx1 && dc._gy + dh > zy0 && dc._gy < zy1);
              var target = dim ? "0.14" : "1";
              if (dc.el.style.opacity !== target) dc.el.style.opacity = target;
              if (dc.ghost && dc.ghost.style.opacity !== target) dc.ghost.style.opacity = target;
            }
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

      /* Nav alignment: the nav row spans the hero text — its left edge is
         the hero text's left edge and its right edge is the right edge of
         the hero-sub line (the line ending in "real world."). The sub
         line rarely fills its column exactly, so the row is sized from
         the line's ACTUAL rendered width (Range, like the chip fade
         zones), corrected for the heroInner scroll scale. Until the
         measurement runs, the CSS fallback is the 740px hero column. */
      function alignNavToHeroText() {
        try {
          var sub = document.querySelector(".hero-sub");
          var navRow = document.querySelector(".nav-row");
          var heroInner = document.querySelector(".hero-inner");
          var navEl = document.querySelector(".nav");
          if (!sub || !navRow || !heroInner || !navEl) return;
          if (!sub.textContent.trim()) return;
          var range = document.createRange();
          range.selectNodeContents(sub);
          var rects = range.getClientRects();
          if (!rects.length) return;
          // Correct for the heroInner scroll scale (transform-origin
          // 50% 50%): layout x = centre + (screen x - centre) / scale.
          var hr = heroInner.getBoundingClientRect();
          var scale = heroInner.offsetWidth ? hr.width / heroInner.offsetWidth : 1;
          if (!scale) scale = 1;
          var cx = hr.left + hr.width / 2;
          var left = Infinity, right = -Infinity;
          for (var i = 0; i < rects.length; i++) {
            if (!rects[i].width) continue;
            left = Math.min(left, cx + (rects[i].left - cx) / scale);
            right = Math.max(right, cx + (rects[i].right - cx) / scale);
          }
          if (!isFinite(left) || !isFinite(right) || right <= left) return;
          var cs = getComputedStyle(navRow);
          var padL = parseFloat(cs.paddingLeft) || 0;
          var padR = parseFloat(cs.paddingRight) || 0;
          var navPadL = parseFloat(getComputedStyle(navEl).paddingLeft) || 0;
          navRow.style.width = (right - left + padL + padR) + "px";
          navRow.style.marginLeft = (left - navPadL - padL) + "px";
          navRow.style.marginRight = "auto";
          navRow.style.maxWidth = "none";
        } catch (e) { /* nav alignment is polish; never break the page */ }
      }
      alignNavToHeroText();
      if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(alignNavToHeroText);
      window.addEventListener("resize", alignNavToHeroText);

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
        /* Anchor jumps (nav Work / About / Contact, hero "See my work"):
           a smooth scroll to a section below the work carousel sweeps
           the whole 200vh track in under a second, so the card row
           whips left extremely fast. While an anchor jump is running,
           the carousel transform is frozen — the page still scrolls
           smoothly and vertically, the cards just don't swipe. The
           flag clears on scrollend (or a 1.2s safety timeout) and the
           transform is re-synced to the landing scroll position. */
        var anchorJumping = false;
        var anchorJumpTimer = null;
        function endAnchorJump() {
          if (!anchorJumping && !anchorJumpTimer) return;
          anchorJumping = false;
          if (anchorJumpTimer) { clearTimeout(anchorJumpTimer); anchorJumpTimer = null; }
          window.removeEventListener("scrollend", endAnchorJump);
          onScrollFrame();
        }
        function onScrollFrame() {
          scrollTicking = false;
          var y = window.scrollY || 0;
          var max = document.documentElement.scrollHeight - window.innerHeight;
          document.documentElement.style.setProperty("--scroll-progress", (max > 0 ? (y / max) * 100 : 0) + "%");
          if (navEl) {
            /* The hero nav scrolls away with the hero; it only comes back
               (frosted, fading in) once the work section reaches the top
               of the viewport — i.e. you've navigated away from the hero.
               (2026-11-06: the switch back used to happen the moment the
               work section dropped below 100px, so on a fast scroll up
               the nav snapped from fixed (viewport top) to absolute
               (hero top, hundreds of px above the viewport) and vanished
               mid-fling — the hero/nav glitch. Now the frosted bar stays
               pinned until you're essentially at the very top (y <= 8),
               where fixed and absolute coincide, so the swap is seamless.
               In between, the state is held, never toggled.) */
            var ws = document.querySelector(".work-scroll");
            if (ws) {
              var wsTop = ws.getBoundingClientRect().top;
              var showNav;
              if (wsTop <= 100) showNav = true;
              else if (y <= 8) showNav = false;
              else showNav = navEl.classList.contains("scrolled");
              navEl.classList.toggle("scrolled", showNav);
            } else {
              navEl.classList.toggle("scrolled", y > 40);
            }
          }
          if (reducedMotion) return;
          var h = heroEl ? heroEl.offsetHeight : 1;
          var p = Math.min(y / h, 1);
          if (heroInner) {
            heroInner.style.opacity = String(1 - p * 0.9);
            heroInner.style.transform = "translateY(" + (-28 - p * 40) + "px) scale(" + (1 - p * 0.04) + ")";
          }
          /* Scroll cue fades out with the hero (gone once you've scrolled
             past it); pointer-events off once invisible so it never
             intercepts clicks over the work section. */
          var cueEl = document.querySelector(".scroll-cue");
          if (cueEl) {
            cueEl.style.opacity = String(1 - p);
            cueEl.style.pointerEvents = p > 0.85 ? "none" : "";
          }
          if (taurusEl) taurusEl.style.transform = "translateY(" + Math.min(y * 0.18, 90) + "px)";

          // Horizontal work carousel: vertical scroll through the tall
          // .work-scroll track drives the card row left. Skipped while
          // an anchor jump is running (see anchorJumping above).
          // (2026-11-06: the row now travels far enough for the LAST card
          // to reach the middle — maxX is the last card's centre, not the
          // row's right edge. The motion is eased (easeOutCubic) so it
          // slides fast then settles: snappier, Apple-like. And the card
          // nearest the middle of the screen grows + brightens while the
          // rest dim, so the eye always knows which project is in focus.)
          if (!anchorJumping) {
            var workSection = document.querySelector(".work-scroll");
            var workRow = document.getElementById("project-cards");
            if (workSection && workRow && !reducedMotion && window.innerWidth > 700) {
              var rect = workSection.getBoundingClientRect();
              var span = workSection.offsetHeight - window.innerHeight;
              var prog = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
              // Ease the scrub: fast at first, settling gently onto the
              // last card — the snappy-then-still feel.
              var eased = 1 - Math.pow(1 - prog, 3);
              // Travel until the LAST card's centre sits at the middle of
              // the screen (the old right-edge stop left it stranded at
              // the right).
              var rowKids = workRow.children;
              var lastCard = rowKids.length ? rowKids[rowKids.length - 1] : null;
              var maxX = 0;
              if (lastCard) {
                maxX = Math.max(lastCard.offsetLeft + lastCard.offsetWidth / 2 - window.innerWidth / 2, 0);
              }
              var tx = -eased * maxX;
              workRow.style.transform = "translateX(" + tx + "px)";
              // Centre focus: each card's distance from the middle of the
              // screen drives its scale, lift, brightness and glow. The
              // card in the middle pops; the rest recede.
              var viewCx = window.innerWidth / 2;
              var falloff = window.innerWidth * 0.75;
              for (var fci = 0; fci < rowKids.length; fci++) {
                var focusCard = rowKids[fci];
                var cardCx = focusCard.offsetLeft + focusCard.offsetWidth / 2 + tx;
                var focus = Math.max(0, Math.min(1, 1 - Math.abs(cardCx - viewCx) / falloff));
                var focusScale = 0.97 + 0.05 * focus;
                focusCard.style.transform = "translateY(" + (-6 * focus).toFixed(1) + "px) scale(" + focusScale.toFixed(3) + ")";
                focusCard.style.opacity = (0.55 + 0.45 * focus).toFixed(3);
                focusCard.style.boxShadow = "0 " + (8 + 10 * focus).toFixed(0) + "px " + (24 + 20 * focus).toFixed(0) + "px rgba(0, 0, 0, " + (0.35 + 0.25 * focus).toFixed(2) + ")";
              }
            } else if (workRow) {
              workRow.style.transform = "";
              var rowKids2 = workRow.children;
              for (var fcj = 0; fcj < rowKids2.length; fcj++) {
                rowKids2[fcj].style.transform = "";
                rowKids2[fcj].style.opacity = "";
                rowKids2[fcj].style.boxShadow = "";
              }
            }
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
        /* Anchor-jump freeze: clicking a nav/hero anchor (Work, About,
           Contact, "See my work", the scroll cue) starts a smooth
           scroll; freeze the carousel until it lands so the card row
           doesn't whip across while the page glides past it. */
        Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
          a.addEventListener("click", function () {
            anchorJumping = true;
            if (anchorJumpTimer) clearTimeout(anchorJumpTimer);
            anchorJumpTimer = setTimeout(endAnchorJump, 1200);
            window.addEventListener("scrollend", endAnchorJump);
          });
        });
      } catch (e) { /* scroll polish is optional; never break the page */ }
    })
    .catch(function (err) {
      console.error("Could not load site content:", err);
    });
})();

