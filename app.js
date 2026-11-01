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
      .map(function (p) {
        var img = p.image
          ? '<div class="card-img"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
          : '<div class="card-img card-img-empty"><span>' + esc(p.title.charAt(0)) + "</span></div>";
        return (
          '<a class="card" href="projects/project.html?p=' + esc(p.slug) + '">' +
          img +
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

      document.title = (data.hero && data.hero.name ? data.hero.name : "Alp D. Güreş") + " – Brown '27";
    })
    .catch(function (err) {
      console.error("Could not load site content:", err);
    });
})();
