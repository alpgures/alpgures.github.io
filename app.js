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

      // (Round 19, Alp 2026-11-12: fade carousel — no forced scrolling.
      // One featured project (large, scene left + text right) and the next
      // two in smaller cards on the side. It fades through all five every
      // 5s; clicking a side card jumps it to featured. Only the featured
      // scene animates — the side scenes are frozen in CSS. Auto-advance
      // pauses on hover and when the tab is hidden; reduced motion gets no
      // auto-advance and no fade.)
      (function setupWorkCarousel(projects) {
        var body = document.getElementById("work-carousel-body");
        var feat = document.getElementById("work-featured");
        var side = document.getElementById("work-side");
        var backBtn = document.getElementById("work-back");
        var nextBtn = document.getElementById("work-next");
        if (!body || !feat || !side || !projects.length) return;
        var n = projects.length;
        var idx = 0;
        var timer = null;
        var fadeTimer = null;
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var FADE_MS = 450;
        var AUTO_MS = 5000;
        function cardHtml(p, featured, pi) {
          var scene = sceneFor(p.slug, p.image, p.title);
          if (featured) {
            return '<div class="card card-wide"><div class="card-scene">' + scene + "</div>" +
              '<div class="card-body"><h3>' + esc(p.title) + "</h3>" +
              "<p>" + esc(p.blurb) + "</p>" +
              '<a class="card-cta" href="projects/project.html?p=' + esc(p.slug) + '">Learn more &rarr;</a></div></div>';
          }
          return '<button type="button" class="card work-side-card" data-idx="' + pi + '">' +
            '<div class="card-scene">' + scene + "</div>" +
            "<h3>" + esc(p.title) + "</h3></button>";
        }
        function render() {
          feat.innerHTML = cardHtml(projects[idx % n], true, idx % n);
          side.innerHTML =
            cardHtml(projects[(idx + 1) % n], false, (idx + 1) % n) +
            cardHtml(projects[(idx + 2) % n], false, (idx + 2) % n);
        }
        function show(i, instant) {
          idx = ((i % n) + n) % n;
          if (instant || reduced) { render(); return; }
          if (fadeTimer) clearTimeout(fadeTimer);
          body.classList.add("work-fading");
          fadeTimer = setTimeout(function () {
            render();
            body.classList.remove("work-fading");
            fadeTimer = null;
          }, FADE_MS);
        }
        function restart() {
          if (timer) { clearInterval(timer); timer = null; }
          if (reduced || n < 2) return;
          timer = setInterval(function () { show(idx + 1); }, AUTO_MS);
        }
        function stop() {
          if (timer) { clearInterval(timer); timer = null; }
        }
        if (backBtn) backBtn.addEventListener("click", function () { show(idx - 1); restart(); });
        if (nextBtn) nextBtn.addEventListener("click", function () { show(idx + 1); restart(); });
        side.addEventListener("click", function (e) {
          var b = e.target && e.target.closest ? e.target.closest(".work-side-card") : null;
          if (!b) return;
          var pi = parseInt(b.getAttribute("data-idx"), 10);
          if (isNaN(pi)) return;
          show(pi);
          restart();
        });
        body.addEventListener("mouseenter", stop);
        body.addEventListener("mouseleave", restart);
        document.addEventListener("visibilitychange", function () {
          if (document.hidden) stop(); else restart();
        });
        render();
        restart();
      })(data.projects || []);

      // (Round 17, Alp 2026-11-12: the one-fact subtitle above the CTA
      // is gone — he didn't like it. The facts still live in
      // data/projects/*.json; they just aren't shown on the cards.)


      // Hero: floating language chips (JS-driven rAF).
      // (2026-11-06, Alp: the bubbles are pure ambience now. They drift
      // sideways only — all at exactly the same rate, no interactivity:
      // no dragging, no wheel scrub, no fling, no bobbing. They sit on
      // straight, evenly spaced horizontal rows with no randomness and
      // no dead space, and every row drifts the opposite way from its
      // neighbours. (2026-11-06, round 5: bigger pills, 28px, and more
      // rows, so the sky fills in. (2026-11-06, round 5.2, per Alp:
      // "let's just have the hero text have a halo" — the pill
      // dimming from rounds 5/5.1 is removed; pills stay full
      // opacity and only the dark halo in CSS sits behind the text.)
      // The headline still renders above the pills (hero-inner
      // z-index 3). Rows are the separation: same row + same
      // direction + same speed means the spacing is kept forever,
      // no collision steering needed.)
      var chipsBox = document.querySelector(".hero .chips");
      /* Round 8 (2026-11-11, per Alp): hello bubbles hidden — the
         whole chip build + rAF loop + legibility mask are parked
         behind this false, not deleted; a replacement animation
         gets overlaid later. */
      if (false && chipsBox) {
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
        // (2026-11-07, round 6, per Alp: "lose that gap in between word
        // bubbles on the same row, it's okay if two ends of the row end
        // up with duplicate words.") Pills in a row sit a fixed small
        // gap apart (CHIP_GAP) instead of being spread with even gaps
        // across the screen width. A row's dealt words are tiled
        // (repeated) until the run covers the screen width, so the same
        // word may appear twice on a row, at both ends. The run's
        // period is the tiled length L, not the screen width: each
        // chip's fx/tx span L, and its ghost rides exactly one period
        // over, so the wrap stays seamless. Tile clones (extra copies
        // of a word for tiling) live in tileClones and are rebuilt on
        // every layoutRows() run. Lanes, the ridge ceiling and the
        // z-order are untouched: bubbles stay in the sky, behind the
        // mountain peaks.
        var CHIP_GAP = 8;
        var tileClones = [];
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
        // (greedy balance), so every row needs a similar amount of
        // tiling; each row is then tiled with a fixed small gap (see
        // CHIP_GAP) instead of even gaps. Re-run on resize (rows and
        // lanes adapt to the new width/ridge) and when the webfont lands
        // (pill widths change).
        // Tile clone: an extra copy of a base chip, for when a row's
        // dealt words have to repeat to cover the screen width. Same
        // text and opacity as the base, own ghost mirror, animated by
        // the frame loop like any other chip.
        function makeTileClone(base) {
          var outer = document.createElement("span");
          var inner = base.el.firstChild.cloneNode(true);
          outer.appendChild(inner);
          chipsBox.appendChild(outer);
          var c = { el: outer, sp: CHIP_SP, t: 0, lane: 0.1, ltr: true, fx: 0, tx: 1, row: 0, _idx: base._idx, _tile: true };
          outer.className = "chip-x";
          outer._chip = c;
          var gInner = inner.cloneNode(true);
          var gOuter = document.createElement("span");
          gOuter.appendChild(gInner);
          gOuter.className = "chip-x";
          chipsBox.appendChild(gOuter);
          c.ghost = gOuter;
          return c;
        }
        function layoutRows() {
          if (!chips.length) return;
          // Drop the previous layout's tile clones (fresh tiling each
          // run, so clones never get re-dealt as words).
          for (var ci = 0; ci < tileClones.length; ci++) {
            var tc = tileClones[ci];
            if (tc.el && tc.el.parentNode) tc.el.parentNode.removeChild(tc.el);
            if (tc.ghost && tc.ghost.parentNode) tc.ghost.parentNode.removeChild(tc.ghost);
            var ix = chips.indexOf(tc);
            if (ix !== -1) chips.splice(ix, 1);
          }
          tileClones = [];
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
            var ltr = (r % 2 === 0);
            // Tile the row's words (repeat the sequence) until the run
            // covers the screen width. The period L is the tiled
            // length, gap included, so the gap is uniform everywhere,
            // including across the wrap seam — and the same word may
            // appear twice on the row, at both ends, which Alp is fine
            // with (2026-11-07, round 6).
            var seq = [];
            var L = 0;
            var k = 0;
            while (L < w) {
              var it = list[k % m];
              seq.push(it);
              L += it.w + CHIP_GAP;
              k++;
            }
            var x = 0;
            var used = {};
            for (var j = 0; j < seq.length; j++) {
              var base = seq[j].c;
              var cc;
              var occ = used[base._idx] || 0;
              used[base._idx] = occ + 1;
              if (occ === 0) {
                cc = base;
              } else {
                cc = makeTileClone(base);
                tileClones.push(cc);
                chips.push(cc);
              }
              cc._w = seq[j].w;
              cc.row = r;
              cc.lane = ROW_Y[r];
              cc.ltr = ltr;
              cc.fx = 0; cc.tx = ltr ? L / w : -L / w;
              var v = x / L;
              cc.t = ltr ? v : 1 - v;
              x += seq[j].w + CHIP_GAP;
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
          // the run spans the tiled length L (left-to-right as 0 to L/w,
          // or right-to-left as 0 to -L/w), and a mirror copy rides
          // exactly one period over, so the slice of a chip that exits
          // one side enters the other side at the same time.
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
        /* Round 7.1 (2026-11-07, per Alp: "only behind the text
           lines"): the round-7 ellipse cleared a giant oval and
           emptied the middle of the hero. Now the mask fades the
           bubbles only in thin strips directly behind the five hero
           text lines (greeting, headline, subtitle, location,
           buttons), so the bubbles stay visible between the lines and
           at the sides. The mask is an SVG built from the lines'
           measured boxes: white everywhere (visible) with blurred
           black strips (hidden) behind each line, so the transition
           is a soft gradient, not a hard edge. The SVG is white on
           transparent, so it reads the same under alpha and luminance
           mask modes. Positions come from offsetTop/offsetLeft
           (layout positions, unaffected by scrolling or the
           hero-inner transform) minus the hero-inner's 28px rest
           translateY. Block boxes are used, so word rotation (which
           only changes the inner boxes' widths) never moves the
           strips. Regenerated on load, font load and resize. */
        /* Round 7.2 (2026-11-07): the subtitle and location lines were
           still hard to read — their strips only hid ~50-65% of the
           bubbles behind them. A blurred rect hides fully only across
           its height minus ~2x the blur, and those two lines are the
           thinnest, so the blur ate their whole strip. Now the mask
           has two groups: the greeting, headline and buttons keep the
           soft wide blur (they were already legible), while the
           subtitle and location lines get taller rects (expanded 8px
           top and bottom, so the fully-hidden core covers the whole
           line) with a tighter blur, so the bubbles behind those two
           thin lines disappear completely while the edge stays a soft
           gradient. The two lines are 8px apart, so their strips
           merge into one band behind the subtitle block — intended. */
        function updateLegibilityMask() {
          try {
            var hero = document.querySelector(".hero");
            var box = document.querySelector(".chips");
            var inner = document.querySelector(".hero-inner");
            if (!hero || !box || !inner) return;
            var W = hero.offsetWidth, H = hero.offsetHeight;
            if (!W || !H) return;
            var lines = inner.querySelectorAll(".hero-greeting, .hero-love, .hero-sub, .hero-meta, .hero-actions");
            var rectsA = "", rectsB = "";
            for (var i = 0; i < lines.length; i++) {
              var el = lines[i];
              var x = inner.offsetLeft + el.offsetLeft;
              var y = inner.offsetTop - 28 + el.offsetTop;
              var w = el.offsetWidth, h = el.offsetHeight;
              if (!w || !h) continue;
              if (el.classList.contains("hero-sub") || el.classList.contains("hero-meta")) {
                /* Thin lines: expand so the fully-hidden core (rect
                   height minus ~2x blur) covers the whole line. */
                rectsB += '<rect x="' + (x + 4) + '" y="' + (y - 8) + '" width="' + (w - 8) + '" height="' + (h + 16) + '" rx="22"/>';
              } else {
                /* Inset a few px so the blur feather, not the rect
                   edge, defines the transition; rx rounds the ends. */
                rectsA += '<rect x="' + (x + 4) + '" y="' + (y + 5) + '" width="' + (w - 8) + '" height="' + (h - 10) + '" rx="22"/>';
              }
            }
            if (!rectsA && !rectsB) return;
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">'
              + '<defs><filter id="f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="11"/></filter>'
              + '<filter id="g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>'
              + '<mask id="m"><rect width="' + W + '" height="' + H + '" fill="white"/>'
              + '<g filter="url(#f)" fill="black">' + rectsA + '</g>'
              + '<g filter="url(#g)" fill="black">' + rectsB + '</g></mask></defs>'
              + '<rect width="' + W + '" height="' + H + '" fill="white" mask="url(#m)"/></svg>';
            var url = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
            box.style.webkitMaskImage = url;
            box.style.maskImage = url;
            box.style.maskMode = "alpha";
          } catch (e) { /* mask is polish; never break the page */ }
        }
        buildRidge();
        // buildRidge already laid the rows out (via replanChips); run it
        // once more directly so the rows exist even if the ridge sampling
        // failed, and re-run when the webfont lands (pill widths change).
        layoutRows();
        updateLegibilityMask();
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(function () { layoutRows(); chips.forEach(place); updateLegibilityMask(); });
        }
        chips.forEach(place);
        var rT = null;
        window.addEventListener("resize", function () {
          if (rT) clearTimeout(rT);
          rT = setTimeout(function () { frameMountains(); buildRidge(); updateLegibilityMask(); }, 200);
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
          // Round 5.2 (2026-11-06, per Alp: "let's just have the hero
          // text have a halo"): the pill dimming from rounds 5/5.1 is
          // REMOVED — Alp said the gradient version was wrong. Pills
          // stay full opacity everywhere. Round 7 (2026-11-07): the
          // halo itself is gone too (it shadowed the wrong part).
          // Round 7.1: legibility now comes from the per-line mask in
          // updateLegibilityMask() above — thin strips behind the
          // five hero text lines only, bubbles visible between them.
          // Round 7.2: the subtitle/location strips are strengthened
          // (taller rects, tighter blur) — the wide blur had left
          // those two thin lines half-visible behind the bubbles.
          // No per-frame rect reads here anymore.
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

      // Apple-style scroll: the hero settles as you leave it and the nav
      // frosts in. (Round 8: the reading-progress hairline is gone.)
      // (2026-11-07, round 7: the mountain parallax is gone — it moved
      // the mountains down in abrupt steps while scrolling in Alp
      // Browser instead of gliding, so the mountains now stay fixed in
      // the hero and scroll with the page, exactly where they ought to be.)
      // rAF-throttled; transforms skipped entirely for reduced motion.
      try {
        var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var heroEl = document.querySelector(".hero");
        var heroInner = document.querySelector(".hero-inner");
        var navEl = document.querySelector(".nav");
        var scrollTicking = false;
        /* Anchor jumps are instant now (round 18) — see the click handler
           below. The old smooth-scroll freeze is retired; anchorJumping
           stays false and the carousel re-syncs in the jump's frame. */
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
          /* Reading-progress hairline (restored round 18): fills with page
             scroll; the bar only shows past the hero (.nav.scrolled::after). */
          document.documentElement.style.setProperty("--scroll-progress", String(max > 0 ? Math.min(y / max, 1) : 0));
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
            var ws = document.getElementById("work");
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

        }
        function onScroll() {
          if (scrollTicking) return;
          scrollTicking = true;
          requestAnimationFrame(onScrollFrame);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        onScroll();
        /* Anchor jumps are INSTANT (round 18, Alp 2026-11-12): clicking a
           nav/hero anchor (Portfolio, About, Contact, "See my work",
           the scroll cue) used to smooth-scroll, and the sweep across
           the tall work track stalled and snapped the carousel on
           landing. Now the jump is instant — the page's smooth
           scroll-behavior is overridden for this one jump, the target
           is reached in the same frame, and the carousel + nav are
           re-synced immediately. No sweep, no stall, no snap. */
        Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
          a.addEventListener("click", function (ev) {
            var href = a.getAttribute("href") || "";
            var target = href.length > 1 ? document.querySelector(href) : null;
            if (!target) return;
            ev.preventDefault();
            var root = document.documentElement;
            var prev = root.style.scrollBehavior;
            root.style.scrollBehavior = "auto";
            target.scrollIntoView();
            root.style.scrollBehavior = prev;
            anchorJumping = false;
            if (anchorJumpTimer) { clearTimeout(anchorJumpTimer); anchorJumpTimer = null; }
            window.removeEventListener("scrollend", endAnchorJump);
            onScrollFrame();
          });
        });
      } catch (e) { /* scroll polish is optional; never break the page */ }
    })
    .catch(function (err) {
      console.error("Could not load site content:", err);
    });
})();

