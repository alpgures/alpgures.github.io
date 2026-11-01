/* Renders a project page from data/projects/<slug>.json (?p=<slug>). */

(function () {
  var ORDER = ["kotoban", "planeframe", "annemin-tarifleri", "dct-asistan"];

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var slug = new URLSearchParams(window.location.search).get("p") || "kotoban";
  if (ORDER.indexOf(slug) === -1) slug = "kotoban";

  fetch("../data/projects/" + slug + ".json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("project json " + r.status);
      return r.json();
    })
    .then(function (d) {
      document.title = d.title + " – Alp D. Güreş";
      document.getElementById("proj-title").textContent = d.title;
      document.getElementById("proj-tagline").textContent = d.tagline || "";

      var links = document.getElementById("proj-links");
      links.innerHTML = (d.links || [])
        .map(function (l) {
          var label = l.label || l[0], url = l.url || l[1];
          return '<a class="btn btn-ghost" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + " ↗</a>";
        })
        .join("");

      var gal = document.getElementById("proj-gallery");
      gal.innerHTML = (d.gallery || [])
        .map(function (src) {
          return '<figure><img src="' + esc(src) + '" alt="' + esc(d.title) + '" loading="lazy"></figure>';
        })
        .join("");
      if (!d.gallery || !d.gallery.length) gal.style.display = "none";

      var story = document.getElementById("proj-story");
      story.innerHTML = (d.story || [])
        .map(function (p) { return "<p>" + esc(p) + "</p>"; })
        .join("");

      var facts = document.getElementById("proj-facts");
      facts.innerHTML = (d.facts || [])
        .map(function (f) {
          var label = f.label || f[0], value = f.value || f[1];
          return "<div><dt>" + esc(label) + "</dt><dd>" + esc(value) + "</dd></div>";
        })
        .join("");

      var idx = ORDER.indexOf(slug);
      var next = ORDER[(idx + 1) % ORDER.length];
      var label = { kotoban: "Kotoban", planeframe: "PlaneFrame", "annemin-tarifleri": "Annemin Tarifleri", "dct-asistan": "DCT Asistan" }[next];
      document.getElementById("proj-next").innerHTML =
        '<a href="project.html?p=' + next + '">Next: ' + esc(label) + " →</a>";

      var sceneBox = document.getElementById("proj-scene");
      var firstImg = (d.gallery && d.gallery[0]) || "";
      sceneBox.innerHTML = sceneFor(slug, firstImg, d.title);

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
      console.error("Could not load project:", err);
      document.getElementById("proj-title").textContent = "Project not found";
    });
})();
