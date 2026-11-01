/* Shared SVG scene builders — one motion language everywhere.
   Refined playful: soft flowy easing, gentle floats, slate + bone on dark.
   Device mockups (phone, browser, e-ink) keep their own light screens;
   only the floating chrome on the dark card takes the site accent.
   All scenes loop; all respect prefers-reduced-motion (see motion.css). */

function scenePlane() {
  return (
    '<svg class="scn sc-plane" viewBox="0 0 400 250" aria-hidden="true"><g class="scn-eink"><rect x="60" y="14" width="280" height="200" rx="12" fill="#1b1815"/><rect x="72" y="26" width="256" height="176" rx="4" fill="#f4f1e8"/><text x="200" y="42" text-anchor="middle" font-size="10" letter-spacing="2.5" font-family="Inter, sans-serif" fill="#1b1815">right above you!</text><g transform="translate(100,50) scale(0.83)"><g class="scn-jet"><g fill="#1b1815"><path d="M 232 40 C 214 33, 188 31, 158 31 C 118 31, 78 33, 54 37 C 40 39, 28 42, 20 46 C 18 48, 18 50, 20 51 C 36 55, 72 58, 112 58 C 152 58, 190 54, 214 48 C 223 45, 229 43, 232 40 Z"/><path d="M 70 35 C 64 25, 58 13, 50 3 L 40 3 C 44 14, 48 25, 52 37 Z"/><path d="M 140 55 C 122 64, 104 71, 88 76 L 79 72 C 95 65, 111 57, 127 50 Z"/><path d="M 40 50 C 34 54, 28 57, 22 59 L 19 56 C 25 52, 31 49, 36 46 Z"/></g><path d="M 198 35 L 216 33 L 214 37 L 196 38 Z" fill="#f4f1e8"/></g></g><text x="86" y="128" font-size="11" font-weight="600" font-family="Inter, sans-serif" fill="#1b1815">Güreş Airways</text><text x="314" y="128" text-anchor="end" font-size="10" font-family="Inter, sans-serif" fill="#6f6a62">AG2027</text><text x="86" y="140" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">AlpJet G47-Z</text><text x="156" y="154" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="1" font-family="Inter, sans-serif" fill="#1b1815">NRN</text><text x="200" y="153" text-anchor="middle" font-size="9" font-family="Inter, sans-serif" fill="#6f6a62">to</text><text x="244" y="154" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="1" font-family="Inter, sans-serif" fill="#1b1815">GTH</text><text x="156" y="164" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#6f6a62">Narnia</text><text x="244" y="164" text-anchor="middle" font-size="8" font-family="Inter, sans-serif" fill="#6f6a62">Gotham</text><text x="200" y="176" text-anchor="middle" font-size="8.5" font-family="Inter, sans-serif" fill="#1b1815">Altitude: 35,000 ft · Speed: 520 kt</text><text x="200" y="188" text-anchor="middle" font-size="8.5" font-family="Inter, sans-serif" fill="#1b1815">Departed: 08:45 | ETA: 11:20</text><text x="200" y="198" text-anchor="middle" font-size="7.5" font-family="Inter, sans-serif" fill="#6f6a62">last updated: today, 09:12</text><rect x="186" y="220" width="28" height="10" fill="#1b1815"/><rect x="150" y="230" width="100" height="9" rx="4.5" fill="#1b1815"/></g></svg>'
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
    '<circle class="scn-dot" cx="66" cy="172" r="6" fill="#93a0b4" opacity="0.25"/>' +
    '<circle class="scn-dot d2" cx="338" cy="66" r="8" fill="#93a0b4" opacity="0.18"/>' +
    '<g class="scn-phone">' +
    '<rect x="140" y="12" width="120" height="226" rx="26" fill="#fffdf8" stroke="#1b1815" stroke-width="2.5"/>' +
    '<rect x="178" y="22" width="44" height="10" rx="5" fill="#1b1815"/>' +
    '<text x="200" y="60" text-anchor="middle" font-size="17" font-family="Newsreader, Georgia, serif" font-weight="600" fill="#1b1815">Kotoban</text>' +
    '<circle cx="200" cy="98" r="26" fill="none" stroke="#f1ece2" stroke-width="7"/>' +
    '<g class="scn-ringspin"><circle cx="200" cy="98" r="26" fill="none" stroke="#5b6b84" stroke-width="7" stroke-linecap="round" stroke-dasharray="114 164" transform="rotate(-90 200 98)"/></g>' +
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
    '<circle class="scn-dot" cx="62" cy="222" r="6" fill="#93a0b4" opacity="0.25"/>' +
    '<circle class="scn-dot d2" cx="196" cy="18" r="7" fill="#93a0b4" opacity="0.18"/>' +
    /* spindle */
    '<g transform="translate(12,16)">' +
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
    /* app mockup: Bugün tab (scaled to share the scene with the chat) */
    '<g transform="translate(-39.2, 2.64) scale(0.78)"><g class="scn-phone">' +
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
    "</g></g>" +
    /* Asistan chat window */
    '<g class="scn-chat">' +
    '<rect x="200" y="28" width="185" height="175" rx="16" fill="#fffdf8" stroke="#1b1815" stroke-width="2"/>' +
    '<circle cx="222" cy="48" r="9" fill="#116530"/>' +
    '<text x="238" y="51" font-size="11" font-weight="700" font-family="Inter, sans-serif" fill="#1b1815">Asistan</text>' +
    '<text x="238" y="63" font-size="7.5" font-family="Inter, sans-serif" fill="#6f6a62">çevrimiçi</text>' +
    '<line x1="200" y1="74" x2="385" y2="74" stroke="#e6e0d6" stroke-width="1.5"/>' +
    '<rect x="212" y="84" width="118" height="32" rx="10" fill="#d9e6d2"/>' +
    '<text x="220" y="97" font-size="8" font-family="Inter, sans-serif" fill="#1b1815">Günaydın! Bugünün</text>' +
    '<text x="220" y="107" font-size="8" font-family="Inter, sans-serif" fill="#1b1815">gönderisi hazır.</text>' +
    '<rect x="257" y="124" width="116" height="22" rx="10" fill="#e4e7ec"/>' +
    '<text x="365" y="138" text-anchor="end" font-size="8" font-family="Inter, sans-serif" fill="#1b1815">Harika, bakıyorum.</text>' +
    '<rect x="212" y="154" width="128" height="22" rx="10" fill="#d9e6d2"/>' +
    '<text x="220" y="168" font-size="8" font-family="Inter, sans-serif" fill="#1b1815">Onaylandı, yayınlandı.</text>' +
    '<rect x="212" y="184" width="161" height="15" rx="7.5" fill="#f1ece2"/>' +
    '<text x="220" y="195" font-size="7.5" font-family="Inter, sans-serif" fill="#a09a8c">Mesaj yaz…</text>' +
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
        '<g class="scn-playbtn"><circle cx="' + (x + 49) + '" cy="154" r="13" fill="#5b6b84"/>' +
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
