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

  function renderExperience(items) {
    return items
      .map(function (e) {
        var bullets = (e.bullets || [])
          .map(function (b) { return "<li>" + esc(b) + "</li>"; })
          .join("");
        return (
          '<article class="entry">' +
          '<div class="entry-head"><h3>' + esc(e.title) + "</h3>" +
          '<span class="entry-date">' + esc(e.date) + "</span></div>" +
          '<p class="entry-org">' + esc(e.org) + "</p>" +
          "<ul>" + bullets + "</ul></article>"
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

      // Hero: floating language chips. Stratified random lanes (even vertical
      // coverage, no empty bands) with genuine randomness everywhere else.
      // Most traverse the full width with a slight diagonal drift; the rest
      // wander freely inside the open middle airspace (never over the mountains).
      var chipsBox = document.querySelector(".hero .chips");
      if (chipsBox) {
        var words = (data.hero && data.hero.floating_words) || [
          "你好", "xin ch\u00e0o", "merhaba", "\u3053\u3093\u306b\u3061\u306f", "hello",
        ];
        chipsBox.innerHTML = "";
        var n = words.length;
        words.forEach(function (w, i) {
          var outer = document.createElement("span");
          var inner = document.createElement("span");
          inner.className = "chip";
          inner.textContent = w;
          inner.style.opacity = (0.45 + Math.random() * 0.3).toFixed(2);
          inner.style.animationDuration = (8 + Math.random() * 6).toFixed(1) + "s";
          inner.style.animationDelay = (-Math.random() * 10).toFixed(1) + "s";
          if (i % 4 === 3) {
            // wanderer: open corner pockets above the peaks and clear of the
            // text — left (x 2-20%) or right (x 80-96%), y 8-30%
            var leftSide = (i % 8) === 3;
            outer.className = "chip-w";
            outer.style.left = (leftSide ? 2 + Math.random() * 18 : 80 + Math.random() * 16).toFixed(1) + "%";
            outer.style.top = (8 + Math.random() * 22).toFixed(1) + "%";
            var wdur = 26 + Math.random() * 20;
            outer.style.animationDuration = wdur.toFixed(1) + "s";
            outer.style.animationDelay = (-Math.random() * wdur).toFixed(1) + "s";
          } else {
            // traverser: stratified lane, random direction + diagonal drift
            var ltr = Math.random() < 0.5;
            var dur = 100 + Math.random() * 40;
            outer.className = "chip-x";
            outer.style.top = (4 + ((i + Math.random()) / n) * 34).toFixed(1) + "%";
            outer.style.setProperty("--fx", (ltr ? -22 : 112).toFixed(1) + "vw");
            outer.style.setProperty("--tx", (ltr ? 112 : -22).toFixed(1) + "vw");
            outer.style.setProperty("--fy", "0vh");
            outer.style.setProperty("--ty", (Math.random() * 8 - 4).toFixed(1) + "vh");
            outer.style.animationDuration = dur.toFixed(1) + "s";
            outer.style.animationDelay = (-Math.random() * dur).toFixed(1) + "s";
          }
          outer.appendChild(inner);
          chipsBox.appendChild(outer);
        });
      }

      var exp = document.getElementById("experience-list");
      if (exp) exp.innerHTML = renderExperience(data.experience || []);

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
