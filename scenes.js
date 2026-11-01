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
    '<g transform="translate(107,68)"><g class="scn-jet"><g transform="scale(0.88)">' +
    '<path d="M18 16 L32 -12 L46 -12 L54 16 Z" fill="#1b1815"/>' +
    '<path d="M32 -12 L46 -12 L44 -6 L34 -6 Z" fill="#c8412b"/>' +
    '<path d="M12 46 L36 46 L28 56 L18 56 Z" fill="#1b1815"/>' +
    '<path d="M10 46 L128 46 Q166 46 182 38 Q196 32 194 24 Q192 16 180 16 L156 16 Q150 16 148 9 L116 9 Q104 9 100 16 L26 16 Q10 16 10 30 Z" fill="#1b1815"/>' +
    '<path d="M168 19 L190 19 L186 25 L166 25 Z" fill="#f4f1e8"/>' +
    '<rect x="34" y="26" width="106" height="2.6" rx="1.3" fill="#f4f1e8" opacity="0.85"/>' +
    '<rect x="34" y="30.6" width="106" height="1.6" fill="#c8412b" opacity="0.9"/>' +
    '<rect x="118" y="12.6" width="26" height="2.2" rx="1.1" fill="#f4f1e8" opacity="0.85"/>' +
    '<path d="M105 46 L150 46 L85 84 L60 80 Z" fill="#1b1815"/>' +
    '<ellipse cx="118" cy="58" rx="14" ry="5.5" fill="#1b1815" transform="rotate(-21 118 58)"/>' +
    '<ellipse cx="96" cy="66" rx="14" ry="5.5" fill="#1b1815" transform="rotate(-21 96 66)"/>' +
    "</g></g></g>" +
    '<text x="94" y="148" font-size="12" font-weight="600" font-family="Inter, sans-serif" fill="#1b1815">Güreş Airways</text>' +
    '<text x="208" y="148" font-size="10" font-family="Inter, sans-serif" fill="#6f6a62">AG2027</text>' +
    '<text x="94" y="159" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">Boeing 747-1000</text>' +
    '<text x="156" y="173" text-anchor="middle" font-size="15" font-weight="700" letter-spacing="1" font-family="Inter, sans-serif" fill="#1b1815">NRN</text>' +
    '<text x="200" y="172" text-anchor="middle" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">to</text>' +
    '<text x="244" y="173" text-anchor="middle" font-size="15" font-weight="700" letter-spacing="1" font-family="Inter, sans-serif" fill="#1b1815">GTH</text>' +
    '<text x="156" y="183" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#6f6a62">Narnia</text>' +
    '<text x="244" y="183" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#6f6a62">Gotham</text>' +
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

/* İğde: cotton picker spindle + DCT Asistan app overview (Bugün/post tab). */
function sceneDct() {
  var teeth = "";
  for (var i = 0; i < 12; i++) {
    var a = (i / 12) * Math.PI * 2;
    var tx = 35 + Math.cos(a) * 24, ty = 168 + Math.sin(a) * 24;
    teeth += '<rect x="' + (tx - 3).toFixed(1) + '" y="' + (ty - 3).toFixed(1) + '" width="6" height="6" rx="1.5" fill="#7d838a" transform="rotate(' + (a * 180 / Math.PI).toFixed(1) + " " + tx.toFixed(1) + " " + ty.toFixed(1) + ')"/>';
  }
  var barbs = "";
  for (var b = 0; b < 6; b++) {
    var y = 138 - b * 20;
    var xl = 23 + 8 * ((150 - y) / 136);
    var xr = 47 - 8 * ((150 - y) / 136);
    barbs += '<path d="M' + xl.toFixed(1) + " " + y + ' l -7 5" stroke="#8f959b" stroke-width="2" stroke-linecap="round"/>';
    barbs += '<path d="M' + xr.toFixed(1) + " " + y + ' l 7 5" stroke="#8f959b" stroke-width="2" stroke-linecap="round"/>';
  }
  return (
    '<svg class="scn sc-dct" viewBox="0 0 400 250" aria-hidden="true">' +
    '<circle class="scn-dot" cx="120" cy="216" r="6" fill="#c8412b" opacity="0.22"/>' +
    '<circle class="scn-dot d2" cx="382" cy="40" r="8" fill="#c8412b" opacity="0.16"/>' +
    /* spindle */
    '<g transform="translate(28,14)">' +
    '<rect x="15" y="190" width="40" height="16" rx="8" fill="#116530"/>' +
    '<g class="scn-gear">' + teeth +
    '<circle cx="35" cy="168" r="20" fill="#9aa0a6"/>' +
    '<circle cx="35" cy="168" r="11" fill="#767c83"/>' +
    "</g>" +
    '<path d="M23 152 L47 152 L39 14 Q35 4 31 14 Z" fill="#c3c9cf"/>' +
    '<path d="M27 146 L32 22" stroke="#eef1f3" stroke-width="3" stroke-linecap="round"/>' +
    barbs +
    '<circle class="scn-eye" cx="31" cy="98" r="1.8" fill="#1b1815"/>' +
    '<circle class="scn-eye" cx="39" cy="98" r="1.8" fill="#1b1815"/>' +
    '<path d="M30 104 Q35 108 40 104" fill="none" stroke="#1b1815" stroke-width="1.4" stroke-linecap="round"/>' +
    "</g>" +
    /* app mockup: Bugün tab */
    '<g class="scn-phone">' +
    '<rect x="140" y="12" width="150" height="226" rx="24" fill="#fffdf8" stroke="#1b1815" stroke-width="2.5"/>' +
    '<rect x="198" y="22" width="34" height="9" rx="4.5" fill="#1b1815"/>' +
    '<text x="154" y="46" font-size="12" font-weight="700" font-family="Inter, sans-serif" fill="#1b1815">Bugünün Gönderisi</text>' +
    '<rect x="154" y="54" width="86" height="15" rx="7.5" fill="#f7ecc9"/>' +
    '<text x="197" y="65" text-anchor="middle" font-size="8" font-weight="600" font-family="Inter, sans-serif" fill="#8a6d1f">Onay Bekliyor</text>' +
    '<rect x="152" y="76" width="126" height="58" rx="8" fill="#d9e6d2"/>' +
    '<circle cx="252" cy="92" r="9" fill="#f2e9c9"/>' +
    '<path d="M152 134 L196 106 L224 126 L252 110 L278 134 Z" fill="#b9cfb0"/>' +
    '<rect x="152" y="142" width="104" height="6" rx="3" fill="#e6e0d6"/>' +
    '<rect x="152" y="151" width="114" height="6" rx="3" fill="#e6e0d6"/>' +
    '<rect x="152" y="160" width="72" height="6" rx="3" fill="#e6e0d6"/>' +
    '<g class="scn-okbtn"><rect x="152" y="170" width="126" height="28" rx="14" fill="#116530"/>' +
    '<text x="215" y="188" text-anchor="middle" font-size="10" font-weight="600" font-family="Inter, sans-serif" fill="#fffdf8">Onayla ve Yayınla</text></g>' +
    '<line x1="140" y1="208" x2="290" y2="208" stroke="#e6e0d6" stroke-width="1.5"/>' +
    '<circle cx="172" cy="216" r="3.5" fill="#116530"/>' +
    '<text x="172" y="230" text-anchor="middle" font-size="8" font-weight="600" font-family="Inter, sans-serif" fill="#116530">Bugün</text>' +
    '<circle cx="215" cy="216" r="3.5" fill="#cfc8b8"/>' +
    '<text x="215" y="230" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#a09a8c">Geçmiş</text>' +
    '<circle cx="258" cy="216" r="3.5" fill="#cfc8b8"/>' +
    '<text x="258" y="230" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#a09a8c">Asistan</text>' +
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
