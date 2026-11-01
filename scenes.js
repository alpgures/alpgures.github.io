/* Shared SVG scene builders — one motion language everywhere.
   Refined playful: soft flowy easing, gentle floats, vermilion + ink + paper.
   All scenes loop; all respect prefers-reduced-motion (see motion.css). */

function scenePlane() {
  return (
    '<svg class="scn sc-plane" viewBox="0 0 400 250" aria-hidden="true">' +
    '<g class="scn-eink">' +
    '<rect x="70" y="26" width="260" height="172" rx="12" fill="#1b1815"/>' +
    '<rect x="82" y="38" width="236" height="148" rx="4" fill="#f4f1e8"/>' +
    '<text x="200" y="54" text-anchor="middle" font-size="11" letter-spacing="2.5" font-family="Inter, sans-serif" fill="#1b1815">right above you!</text>' +
    '<g class="scn-breeze" fill="none" stroke="#e0d9cb" stroke-width="2.5" stroke-linecap="round">' +
    '<path d="M90 72 Q170 66 250 72"/>' +
    '<path d="M90 98 Q170 104 250 98"/>' +
    '<path d="M90 124 Q170 118 250 124"/>' +
    "</g>" +
    '<g class="scn-jet"><image href="/images/jet-747.png" x="90" y="60" width="220" height="53.5"/></g>' +
    '<text x="94" y="142" font-size="12" font-weight="600" font-family="Inter, sans-serif" fill="#1b1815">Güreş Airways</text>' +
    '<text x="208" y="142" font-size="10" font-family="Inter, sans-serif" fill="#6f6a62">AG2027</text>' +
    '<text x="94" y="154" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">Boeing 747-1000</text>' +
    '<text x="156" y="170" text-anchor="middle" font-size="15" font-weight="700" letter-spacing="1" font-family="Inter, sans-serif" fill="#1b1815">NRN</text>' +
    '<text x="200" y="169" text-anchor="middle" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">to</text>' +
    '<text x="244" y="170" text-anchor="middle" font-size="15" font-weight="700" letter-spacing="1" font-family="Inter, sans-serif" fill="#1b1815">GTH</text>' +
    '<text x="156" y="180" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#6f6a62">Narnia</text>' +
    '<text x="244" y="180" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#6f6a62">Gotham</text>' +
    '<rect x="186" y="198" width="28" height="16" fill="#1b1815"/>' +
    '<rect x="150" y="212" width="100" height="9" rx="4.5" fill="#1b1815"/>' +
    "</g></svg>"
  );
}

function sceneKotoban() {
  function row(y, jp, en, cls) {
    return (
      '<g class="scn-wrow ' + cls + '">' +
      '<rect x="156" y="' + y + '" width="88" height="26" rx="9" fill="#f6f1e8"/>' +
      '<text x="166" y="' + (y + 17) + '" font-size="12" font-family="Newsreader, Georgia, serif" fill="#1b1815">' + jp + "</text>" +
      '<text x="234" y="' + (y + 17) + '" text-anchor="end" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">' + en + "</text>" +
      "</g>"
    );
  }
  return (
    '<svg class="scn sc-koto" viewBox="0 0 400 250" aria-hidden="true">' +
    '<g class="scn-chip c1"><rect x="48" y="66" width="74" height="36" rx="18" fill="#fffdf8" stroke="#e6e0d6" stroke-width="1.5"/>' +
    '<text x="85" y="90" text-anchor="middle" font-size="17" font-family="Newsreader, Georgia, serif" fill="#1b1815">言葉</text></g>' +
    '<g class="scn-chip c2"><rect x="278" y="150" width="66" height="36" rx="18" fill="#fffdf8" stroke="#e6e0d6" stroke-width="1.5"/>' +
    '<text x="311" y="174" text-anchor="middle" font-size="17" font-family="Newsreader, Georgia, serif" fill="#1b1815">bạn</text></g>' +
    '<circle class="scn-dot" cx="66" cy="172" r="6" fill="#c8412b" opacity="0.25"/>' +
    '<circle class="scn-dot d2" cx="338" cy="66" r="8" fill="#c8412b" opacity="0.18"/>' +
    '<g class="scn-phone">' +
    '<rect x="140" y="12" width="120" height="226" rx="26" fill="#fffdf8" stroke="#1b1815" stroke-width="2.5"/>' +
    '<rect x="178" y="22" width="44" height="10" rx="5" fill="#1b1815"/>' +
    '<text x="200" y="60" text-anchor="middle" font-size="17" font-family="Newsreader, Georgia, serif" font-weight="600" fill="#1b1815">Kotoban</text>' +
    '<circle cx="200" cy="98" r="26" fill="none" stroke="#f1ece2" stroke-width="7"/>' +
    '<g class="scn-ringspin"><circle cx="200" cy="98" r="26" fill="none" stroke="#c8412b" stroke-width="7" stroke-linecap="round" stroke-dasharray="114 164" transform="rotate(-90 200 98)"/></g>' +
    '<text x="200" y="103" text-anchor="middle" font-size="13" font-weight="600" font-family="Inter, sans-serif" fill="#1b1815">70%</text>' +
    row(134, "言葉", "word", "wr1") +
    row(166, "bạn", "friend", "wr2") +
    row(198, "本", "book", "wr3") +
    "</g></svg>"
  );
}

function sceneFor(slug, image, title) {
  if (slug === "kotoban") return sceneKotoban();
  if (slug === "planeframe") return scenePlane();
  if (slug === "dct-asistan") return sceneDct();
  return sceneRecipeUI();
}

/* İğde: WhatsApp business assistant mockup, same simplified language. */
function sceneDct() {
  return (
    '<svg class="scn sc-dct" viewBox="0 0 400 250" aria-hidden="true">' +
    '<circle class="scn-dot" cx="64" cy="182" r="6" fill="#c8412b" opacity="0.25"/>' +
    '<circle class="scn-dot d2" cx="340" cy="58" r="8" fill="#c8412b" opacity="0.18"/>' +
    '<g class="scn-phone">' +
    '<rect x="140" y="12" width="120" height="226" rx="26" fill="#fffdf8" stroke="#1b1815" stroke-width="2.5"/>' +
    '<rect x="178" y="22" width="44" height="10" rx="5" fill="#1b1815"/>' +
    '<circle cx="163" cy="52" r="13" fill="#c8412b"/>' +
    '<circle class="scn-eye" cx="158" cy="50" r="1.8" fill="#fffdf8"/>' +
    '<circle class="scn-eye" cx="168" cy="50" r="1.8" fill="#fffdf8"/>' +
    '<path d="M157 56 Q163 60 169 56" fill="none" stroke="#fffdf8" stroke-width="1.6" stroke-linecap="round"/>' +
    '<rect x="157" y="64" width="12" height="5" rx="2.5" fill="#1b1815"/>' +
    '<text x="184" y="50" font-size="13" font-weight="600" font-family="Inter, sans-serif" fill="#1b1815">İğde</text>' +
    '<circle cx="186" cy="60" r="3" fill="#7fb069"/>' +
    '<text x="193" y="63" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">çevrimiçi</text>' +
    '<line x1="140" y1="76" x2="260" y2="76" stroke="#e6e0d6" stroke-width="1.5"/>' +
    '<g class="scn-msg m1">' +
    '<rect x="182" y="90" width="66" height="28" rx="10" fill="#e9f3e4"/>' +
    '<text x="215" y="108" text-anchor="middle" font-size="10" font-family="Inter, sans-serif" fill="#1b1815">Onaylar?</text>' +
    "</g>" +
    '<g class="scn-typing">' +
    '<circle class="td1" cx="164" cy="148" r="3" fill="#6f6a62"/>' +
    '<circle class="td2" cx="172" cy="148" r="3" fill="#6f6a62"/>' +
    '<circle class="td3" cx="180" cy="148" r="3" fill="#6f6a62"/>' +
    "</g>" +
    '<g class="scn-msg m2">' +
    '<rect x="152" y="128" width="96" height="44" rx="10" fill="#fffdf8" stroke="#e6e0d6" stroke-width="1.5"/>' +
    '<text x="162" y="146" font-size="10" font-family="Inter, sans-serif" fill="#1b1815">Not aldım,</text>' +
    '<text x="162" y="160" font-size="10" font-family="Inter, sans-serif" fill="#1b1815">Deniz’e ilettim ✓</text>' +
    "</g>" +
    "</g></svg>"
  );
}

/* Annemin Tarifleri: extra-simplified mockup of the recipe site UI. */
function sceneRecipeUI() {
  var langs = ["TR", "EN", "DE", "JA", "VI"];
  var pills = langs
    .map(function (l, i) {
      var x = 48 + i * 42;
      return (
        '<g class="scn-pill p' + i + '">' +
        '<rect x="' + x + '" y="102" width="34" height="20" rx="10" fill="#f1ece2"/>' +
        '<text x="' + (x + 17) + '" y="116" text-anchor="middle" font-size="11" font-weight="600" font-family="Inter, sans-serif" fill="#6f6a62">' + l + "</text></g>"
      );
    })
    .join("");

  function rcard(x, play) {
    var s =
      '<defs><clipPath id="rui-c' + x + '"><rect x="' + x + '" y="134" width="98" height="78" rx="10"/></clipPath></defs>' +
      '<g clip-path="url(#rui-c' + x + ')"><rect x="' + x + '" y="134" width="98" height="40" fill="#f3ddd6"/>' +
      '<circle cx="' + (x + 49) + '" cy="154" r="12" fill="#e8b4a6" opacity="0.7"/></g>' +
      '<rect x="' + x + '" y="134" width="98" height="78" rx="10" fill="none" stroke="#e6e0d6" stroke-width="1.5"/>' +
      '<rect x="' + (x + 10) + '" y="182" width="58" height="7" rx="3.5" fill="#d8d0c2"/>' +
      '<rect x="' + (x + 10) + '" y="194" width="40" height="7" rx="3.5" fill="#e6e0d6"/>';
    if (play) {
      s +=
        '<g class="scn-playbtn"><circle cx="' + (x + 49) + '" cy="154" r="13" fill="#c8412b"/>' +
        '<path d="M' + (x + 45) + " 147 L" + (x + 55) + " 154 L" + (x + 45) + ' 161 Z" fill="#fffdf8"/></g>';
    }
    return s;
  }

  return (
    '<svg class="scn sc-rui" viewBox="0 0 400 250" aria-hidden="true">' +
    '<g class="scn-browser">' +
    '<rect x="30" y="18" width="340" height="214" rx="14" fill="#fffdf8" stroke="#e6e0d6" stroke-width="2"/>' +
    '<circle cx="50" cy="36" r="5" fill="#e06c5b"/><circle cx="65" cy="36" r="5" fill="#e8b64c"/><circle cx="80" cy="36" r="5" fill="#7fb069"/>' +
    '<rect x="98" y="28.5" width="152" height="15" rx="7.5" fill="#f1ece2"/>' +
    '<text x="174" y="40" text-anchor="middle" font-size="10" font-family="Inter, sans-serif" fill="#6f6a62">annemintarifleri.org</text>' +
    '<line x1="30" y1="52" x2="370" y2="52" stroke="#e6e0d6" stroke-width="1.5"/>' +
    '<text x="48" y="82" font-size="21" font-family="Newsreader, Georgia, serif" font-weight="600" fill="#1b1815">Annemin Tarifleri</text>' +
    '<rect x="48" y="91" width="168" height="8" rx="4" fill="#e6e0d6"/>' +
    pills +
    rcard(48, false) +
    rcard(151, true) +
    rcard(254, false) +
    "</g></svg>"
  );
}
