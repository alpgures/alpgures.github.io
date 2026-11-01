/* Shared SVG scene builders — one motion language everywhere.
   Refined playful: soft flowy easing, gentle floats, vermilion + ink + paper.
   All scenes loop; all respect prefers-reduced-motion (see motion.css). */

function scenePlane() {
  return (
    '<svg class="scn sc-plane" viewBox="0 0 400 250" aria-hidden="true">' +
    '<path class="scn-trail" d="M24 208 C 110 200, 150 150, 210 120 S 320 70, 352 82" fill="none" stroke="#c8412b" stroke-width="2.5" stroke-dasharray="1 9" stroke-linecap="round"/>' +
    '<g class="scn-plane"><path d="M0 0 L30 10 L0 20 L9 10 Z" fill="#c8412b"/></g>' +
    '<g class="scn-display">' +
    '<rect x="262" y="28" width="122" height="100" rx="12" fill="#fffdf8" stroke="#1b1815" stroke-width="2.5"/>' +
    '<circle cx="282" cy="52" r="7" fill="#c8412b"/>' +
    '<rect class="scn-dline" x="296" y="46" width="66" height="9" rx="4.5" fill="#1b1815" opacity="0.85"/>' +
    '<rect class="scn-dline" x="276" y="68" width="92" height="7" rx="3.5" fill="#1b1815" opacity="0.35"/>' +
    '<rect class="scn-dline" x="276" y="84" width="70" height="7" rx="3.5" fill="#1b1815" opacity="0.35"/>' +
    '<rect class="scn-dline" x="276" y="100" width="80" height="7" rx="3.5" fill="#1b1815" opacity="0.35"/>' +
    "</g></svg>"
  );
}

function sceneKotoban() {
  function card(x, y, big, small, cls) {
    return (
      '<g class="scn-kcard ' + cls + '" transform="translate(' + x + "," + y + ')">' +
      '<g class="scn-bob">' +
      '<g class="scn-flip"><g class="scn-face scn-front">' +
      '<rect x="-62" y="-72" width="124" height="144" rx="18" fill="#fffdf8" stroke="#e6e0d6" stroke-width="2"/>' +
      '<text x="0" y="6" text-anchor="middle" font-size="38" font-family="Newsreader, Georgia, serif" fill="#1b1815">' + big + "</text>" +
      '<text x="0" y="38" text-anchor="middle" font-size="13" font-family="Inter, sans-serif" fill="#6f6a62">' + small + "</text>" +
      "</g>" +
      '<g class="scn-face scn-back">' +
      '<rect x="-62" y="-72" width="124" height="144" rx="18" fill="#c8412b"/>' +
      '<text x="0" y="10" text-anchor="middle" font-size="30" font-family="Newsreader, Georgia, serif" fill="#fffdf8">✓</text>' +
      "</g></g></g></g>"
    );
  }
  return (
    '<svg class="scn sc-koto" viewBox="0 0 400 250" aria-hidden="true">' +
    '<circle class="scn-dot" cx="60" cy="52" r="6" fill="#c8412b" opacity="0.25"/>' +
    '<circle class="scn-dot d2" cx="348" cy="196" r="8" fill="#c8412b" opacity="0.18"/>' +
    '<circle class="scn-dot d3" cx="330" cy="48" r="5" fill="#1b1815" opacity="0.14"/>' +
    card(105, 128, "言葉", "kotoba · word", "kc1") +
    card(295, 122, "bạn", "vietnamese · friend", "kc2") +
    "</svg>"
  );
}

function sceneFor(slug, image, title) {
  if (slug === "kotoban") return sceneKotoban();
  if (slug === "planeframe") return scenePlane();
  return sceneRecipe(image, title);
}

function sceneRecipe(imgSrc, title) {
  return (
    '<div class="scn-recipe">' +
    '<img src="' + imgSrc + '" alt="' + title + '" loading="lazy">' +
    '<svg class="scn-steam" viewBox="0 0 200 120" aria-hidden="true">' +
    '<path class="scn-wisp w1" d="M70 112 C 62 88, 78 72, 70 48 C 64 30, 74 18, 70 6" fill="none" stroke="#fffdf8" stroke-width="7" stroke-linecap="round"/>' +
    '<path class="scn-wisp w2" d="M100 112 C 92 88, 108 72, 100 48 C 94 30, 104 18, 100 6" fill="none" stroke="#fffdf8" stroke-width="7" stroke-linecap="round"/>' +
    '<path class="scn-wisp w3" d="M130 112 C 122 88, 138 72, 130 48 C 124 30, 134 18, 130 6" fill="none" stroke="#fffdf8" stroke-width="7" stroke-linecap="round"/>' +
    "</svg></div>"
  );
}
