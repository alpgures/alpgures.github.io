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
