/* Shared SVG scene builders — one motion language everywhere.
   Refined playful: soft flowy easing, gentle floats, slate + bone on dark.
   Device mockups (phone, browser, e-ink) keep their own light screens;
   only the floating chrome on the dark card takes the site accent.
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
    '<g transform="translate(105,85)"><g class="scn-jet"><path d="M6.6 0.1 L7.4 0.2 L8.0 0.2 L8.4 0.2 L8.8 0.3 L9.3 0.5 L9.7 0.6 L10.1 0.6 L10.7 0.9 L11.4 1.2 L11.8 1.3 L12.1 1.4 L12.5 1.6 L13.0 1.9 L13.4 2.1 L13.6 2.1 L14.1 2.4 L14.6 2.9 L15.0 3.0 L15.3 3.1 L15.8 3.5 L16.4 4.1 L16.8 4.3 L17.0 4.4 L17.4 4.6 L18.1 5.1 L19.1 6.0 L20.1 6.9 L20.7 7.3 L20.9 7.4 L21.2 7.7 L21.7 8.1 L21.9 8.2 L22.1 8.3 L22.6 8.8 L23.2 9.4 L23.6 9.6 L23.8 9.7 L24.1 10.0 L24.5 10.5 L24.8 10.7 L25.0 10.8 L25.4 11.1 L25.8 11.5 L26.1 11.7 L26.3 11.7 L26.9 12.2 L27.5 12.9 L27.9 13.1 L28.1 13.2 L28.6 13.6 L29.2 14.2 L29.5 14.4 L29.8 14.6 L30.9 15.4 L32.2 16.7 L32.9 17.2 L33.1 17.2 L33.5 17.6 L34.1 18.1 L34.4 18.3 L34.5 18.4 L34.9 18.9 L35.5 19.6 L36.1 20.1 L36.5 20.4 L36.9 20.9 L37.2 21.3 L37.5 21.6 L37.8 21.8 L38.2 22.4 L38.6 23.1 L38.9 23.5 L39.2 23.7 L39.5 24.3 L39.9 25.2 L40.2 26.0 L40.4 26.6 L40.5 26.9 L40.7 27.1 L40.9 27.6 L41.1 28.2 L41.6 28.6 L42.1 28.7 L42.1 28.7 L41.7 28.8 L41.6 28.9 L41.3 29.0 L40.3 29.1 L39.0 29.1 L38.4 29.3 L38.4 29.6 L38.5 29.8 L38.7 29.9 L38.8 30.1 L39.4 30.3 L42.1 30.5 L46.0 30.7 L48.2 30.7 L48.9 30.7 L49.6 30.8 L50.6 30.9 L53.4 30.9 L56.9 31.0 L58.3 31.1 L57.8 31.2 L56.3 31.2 L53.8 31.3 L50.5 31.3 L47.0 31.3 L45.5 31.5 L45.3 31.8 L44.9 31.9 L44.4 32.0 L44.2 32.1 L44.7 32.4 L47.6 32.5 L51.6 32.5 L53.3 32.4 L53.4 32.2 L53.8 32.1 L54.2 32.1 L54.6 32.1 L54.9 32.2 L55.4 32.2 L55.8 32.2 L56.0 32.2 L56.2 32.3 L57.2 32.3 L58.8 32.3 L60.7 32.3 L62.8 32.4 L64.1 32.4 L64.9 32.3 L66.1 32.3 L67.3 32.2 L68.0 32.1 L68.2 32.0 L68.5 31.9 L68.8 31.8 L69.0 31.7 L69.5 31.6 L72.1 31.5 L75.7 31.5 L77.3 31.6 L77.6 31.8 L78.0 31.9 L78.7 31.9 L78.9 32.0 L79.1 32.1 L79.6 32.2 L80.3 32.1 L80.7 32.1 L80.9 32.0 L81.0 32.1 L81.1 32.2 L81.3 32.3 L81.8 32.4 L83.2 32.5 L85.4 32.5 L88.2 32.6 L91.0 32.6 L92.2 32.5 L92.4 32.4 L93.1 32.3 L94.3 32.2 L96.2 32.2 L98.4 32.1 L99.6 32.1 L100.1 32.0 L100.5 32.0 L100.9 32.2 L101.1 32.4 L101.5 32.8 L103.6 32.8 L106.6 32.7 L107.9 32.8 L108.0 32.9 L108.5 32.9 L109.2 32.9 L109.6 33.0 L109.8 33.2 L110.5 33.2 L111.6 33.2 L112.1 33.2 L112.3 33.3 L112.8 33.3 L113.5 33.3 L114.1 33.3 L114.5 33.2 L114.7 33.1 L114.8 33.0 L115.3 33.0 L116.4 32.9 L118.9 32.9 L121.9 32.9 L123.5 33.0 L124.0 33.1 L124.8 33.1 L125.6 33.1 L126.1 33.1 L126.4 33.0 L126.6 32.9 L126.7 32.8 L126.9 32.8 L127.3 32.8 L127.5 32.7 L127.8 32.5 L127.8 32.3 L127.8 32.1 L127.5 31.9 L127.0 31.7 L126.5 31.6 L126.0 31.6 L126.1 31.6 L126.5 31.5 L126.6 31.3 L126.6 31.0 L126.3 30.9 L125.9 30.9 L125.7 30.8 L125.7 30.6 L125.5 30.6 L125.3 30.5 L125.3 30.1 L125.3 29.5 L125.1 29.2 L125.0 29.1 L125.9 29.1 L127.4 29.1 L128.4 29.0 L129.0 28.9 L129.7 28.9 L130.2 28.9 L130.5 28.9 L130.6 28.8 L130.7 28.8 L130.9 28.9 L131.5 29.0 L132.3 28.9 L132.6 28.8 L132.9 28.6 L133.9 28.5 L135.7 28.4 L138.2 28.4 L140.8 28.4 L142.1 28.4 L142.4 28.3 L142.5 27.9 L142.5 27.5 L142.6 27.2 L142.7 27.1 L142.8 27.0 L143.2 27.0 L143.9 27.0 L144.9 27.1 L145.4 27.5 L145.6 28.1 L145.7 28.3 L146.3 28.4 L148.2 28.4 L151.2 28.4 L153.8 28.4 L155.9 28.5 L156.9 28.5 L157.1 28.4 L157.2 28.3 L157.3 28.2 L157.9 28.1 L158.7 28.1 L159.5 28.3 L160.2 28.5 L160.9 28.5 L161.6 28.5 L162.1 28.5 L162.4 28.4 L162.7 28.4 L162.9 28.5 L163.4 28.5 L164.0 28.6 L164.3 28.6 L164.4 28.7 L164.5 28.8 L164.7 28.7 L164.8 28.7 L165.1 28.6 L166.1 28.5 L167.6 28.6 L168.5 28.7 L168.9 29.0 L169.1 29.2 L169.1 29.3 L169.2 29.4 L169.3 29.4 L169.6 29.7 L169.8 30.0 L169.9 30.1 L169.8 30.2 L169.4 30.2 L168.8 30.3 L168.5 30.6 L168.6 31.0 L168.7 31.2 L168.9 31.3 L169.1 31.3 L169.4 31.3 L169.5 31.2 L169.6 31.1 L170.0 31.1 L170.5 31.1 L170.8 31.3 L171.0 31.6 L171.2 31.7 L171.6 31.9 L171.9 31.9 L172.1 32.0 L172.3 32.1 L172.5 32.4 L172.9 32.4 L173.4 32.4 L173.6 32.5 L173.7 32.7 L173.9 32.8 L174.1 32.9 L174.2 33.0 L174.3 33.2 L174.6 33.3 L175.0 33.2 L175.2 33.3 L175.3 33.5 L175.4 33.7 L175.6 33.8 L175.9 33.9 L176.2 34.0 L176.6 34.0 L177.0 34.0 L177.1 34.1 L177.2 34.2 L177.3 34.3 L177.5 34.3 L177.7 34.5 L177.9 34.8 L178.2 35.0 L178.6 35.1 L178.7 35.3 L178.9 35.4 L179.2 35.8 L179.7 36.2 L180.0 36.5 L180.0 36.9 L180.0 37.1 L179.2 37.2 L175.6 37.4 L170.1 37.5 L165.5 37.5 L162.0 37.4 L160.1 37.4 L159.5 37.6 L159.3 37.8 L159.3 38.2 L159.2 38.4 L158.9 38.5 L158.1 38.5 L157.1 38.6 L156.7 38.6 L156.6 38.7 L156.6 38.7 L156.5 38.6 L156.1 38.5 L155.7 38.6 L155.5 38.7 L155.3 38.8 L154.5 39.0 L153.2 39.1 L151.9 39.1 L150.8 39.0 L150.0 39.0 L149.7 39.0 L149.5 39.0 L149.4 39.1 L149.2 39.2 L148.9 39.2 L148.7 39.1 L148.6 39.0 L148.3 39.0 L148.0 39.0 L147.8 39.0 L147.7 39.1 L147.2 39.1 L146.5 39.1 L146.1 39.2 L146.0 39.3 L145.8 39.4 L145.5 39.4 L145.3 39.3 L145.1 39.2 L144.6 39.2 L143.9 39.2 L143.6 39.3 L143.5 39.3 L143.2 39.4 L142.9 39.4 L142.7 39.3 L142.6 39.2 L142.0 39.1 L141.3 39.1 L140.8 39.1 L140.5 39.1 L140.4 39.1 L140.3 39.2 L140.0 39.2 L139.6 39.2 L139.3 39.3 L139.1 39.3 L138.3 39.4 L137.1 39.4 L136.4 39.3 L135.9 39.1 L135.0 39.0 L133.9 39.0 L133.4 38.9 L133.2 38.8 L132.4 38.7 L131.3 38.6 L130.5 38.5 L130.2 38.5 L130.3 38.5 L130.6 38.4 L130.8 38.2 L130.6 38.0 L129.9 37.9 L128.7 37.9 L128.0 37.9 L127.5 38.0 L127.3 38.2 L127.1 38.4 L126.3 38.5 L125.3 38.6 L124.8 38.6 L124.7 38.7 L124.7 38.5 L124.7 38.3 L124.6 38.1 L124.4 38.0 L123.8 37.9 L123.2 37.9 L122.9 38.1 L122.9 38.3 L123.0 38.4 L123.1 38.5 L123.2 38.6 L123.3 38.7 L123.6 38.9 L124.1 39.0 L124.3 39.1 L124.5 39.3 L125.0 39.5 L125.7 39.9 L126.4 40.2 L127.0 40.6 L127.6 40.7 L128.2 40.7 L128.6 40.8 L129.3 40.9 L131.3 41.1 L134.1 41.2 L136.3 41.3 L137.9 41.3 L138.6 41.2 L138.7 41.0 L138.9 40.9 L139.2 40.9 L139.6 41.0 L140.3 41.2 L141.7 41.3 L143.4 41.3 L144.5 41.2 L144.9 41.1 L145.2 41.2 L145.3 41.3 L146.1 41.3 L147.1 41.3 L147.6 41.2 L147.7 41.1 L147.8 41.2 L147.9 41.3 L148.2 41.4 L148.5 41.4 L148.7 41.3 L149.0 41.2 L150.3 41.2 L152.2 41.2 L153.1 41.1 L153.3 41.0 L153.4 41.0 L153.6 41.0 L153.8 41.1 L154.1 41.1 L154.2 41.0 L154.3 40.9 L154.4 41.0 L154.6 41.0 L154.9 41.1 L155.3 41.1 L155.8 40.9 L156.3 40.7 L157.0 40.7 L157.7 40.7 L158.3 40.7 L158.7 40.7 L158.9 40.6 L159.0 40.5 L159.7 40.5 L160.7 40.4 L161.1 40.3 L161.3 40.2 L161.7 40.2 L162.2 40.2 L162.6 40.2 L162.9 40.1 L163.6 40.0 L164.5 40.0 L165.1 39.9 L165.5 39.9 L166.5 39.8 L167.8 39.8 L168.9 39.6 L169.8 39.4 L170.7 39.3 L171.6 39.3 L172.0 39.2 L172.2 39.1 L172.5 39.1 L173.0 39.1 L173.5 39.1 L173.9 39.1 L174.2 39.0 L174.4 38.9 L175.2 38.8 L176.3 38.7 L176.9 38.5 L177.2 38.4 L177.3 38.2 L177.3 38.0 L177.4 38.1 L177.5 38.2 L177.8 38.3 L178.2 38.3 L178.7 38.2 L179.2 38.0 L179.2 38.2 L178.8 38.7 L178.1 39.1 L177.2 39.6 L176.8 39.9 L176.7 40.1 L176.4 40.2 L176.0 40.3 L175.3 40.5 L174.5 40.9 L174.1 41.1 L173.9 41.2 L173.6 41.3 L173.1 41.4 L172.9 41.5 L172.9 41.6 L172.7 41.8 L172.5 41.9 L172.2 42.0 L171.8 42.1 L171.7 42.3 L171.6 42.6 L171.5 42.9 L171.3 43.1 L170.8 43.3 L170.2 43.7 L169.9 44.0 L169.8 44.3 L169.3 44.5 L168.6 44.8 L168.2 45.0 L168.1 45.3 L167.7 45.4 L167.0 45.5 L166.7 45.6 L166.6 45.7 L166.5 45.9 L166.3 46.0 L165.6 46.2 L164.5 46.4 L164.0 46.5 L163.8 46.7 L163.3 46.8 L162.6 46.8 L162.3 46.9 L162.1 47.1 L161.6 47.2 L160.9 47.3 L160.6 47.4 L160.4 47.5 L159.9 47.6 L159.2 47.6 L158.9 47.7 L158.6 47.8 L157.3 48.0 L155.5 48.1 L154.6 48.2 L154.5 48.4 L154.0 48.4 L153.3 48.4 L152.9 48.4 L152.6 48.6 L151.0 48.6 L148.8 48.6 L147.8 48.7 L147.7 48.8 L147.2 48.8 L146.5 48.8 L146.1 48.9 L145.9 49.0 L145.2 49.0 L144.1 48.9 L143.6 48.9 L143.3 49.0 L142.3 49.0 L140.8 49.0 L140.2 49.0 L140.1 49.1 L139.6 49.1 L138.9 49.0 L138.3 49.0 L137.9 49.0 L137.6 49.0 L137.4 49.1 L136.7 49.1 L135.6 49.0 L134.9 49.0 L134.5 49.0 L134.2 49.0 L134.1 49.1 L133.3 49.1 L132.2 49.0 L131.2 49.0 L130.4 49.0 L130.0 49.0 L129.7 49.1 L128.4 49.2 L126.5 49.2 L125.7 49.3 L125.3 49.5 L123.2 49.8 L120.2 50.2 L118.9 50.5 L118.8 50.6 L118.6 50.7 L118.3 50.7 L118.0 50.7 L117.7 50.9 L116.4 51.1 L114.3 51.5 L112.3 51.8 L110.3 52.0 L108.4 52.0 L106.9 52.0 L106.2 52.1 L105.8 52.2 L103.9 52.1 L100.6 51.9 L95.9 51.4 L90.1 50.8 L84.5 50.5 L79.6 50.5 L76.9 50.5 L76.0 50.4 L75.5 50.2 L75.2 50.1 L74.5 49.9 L73.1 49.8 L70.3 49.6 L67.0 49.5 L65.2 49.3 L64.7 49.3 L64.4 49.2 L63.9 49.0 L61.8 48.8 L59.0 48.7 L57.7 48.5 L57.4 48.4 L55.8 48.2 L53.6 48.0 L52.6 47.9 L52.3 47.7 L51.0 47.5 L49.2 47.3 L48.3 47.1 L48.1 47.0 L47.2 46.9 L46.0 46.8 L45.3 46.7 L45.1 46.6 L45.0 46.5 L44.8 46.3 L44.0 46.2 L43.0 46.1 L42.4 45.9 L42.1 45.7 L41.1 45.5 L39.7 45.4 L39.1 45.2 L38.9 45.0 L38.5 44.9 L37.9 44.8 L37.6 44.8 L37.4 44.7 L37.3 44.6 L37.1 44.4 L36.4 44.3 L35.3 44.1 L34.8 43.9 L34.7 43.7 L34.5 43.6 L34.2 43.5 L33.5 43.5 L32.7 43.4 L32.3 43.3 L32.1 43.1 L31.6 43.0 L30.8 43.0 L30.5 42.9 L30.3 42.8 L29.6 42.8 L28.5 42.9 L28.0 42.9 L27.9 42.8 L27.7 42.8 L27.3 42.8 L27.0 42.9 L26.7 43.0 L26.2 43.0 L25.6 42.9 L25.2 43.0 L24.9 43.1 L24.3 43.1 L23.7 43.0 L23.0 43.1 L22.1 43.2 L20.8 43.1 L19.3 43.0 L18.6 42.9 L18.5 42.8 L17.9 42.7 L17.2 42.7 L16.9 42.6 L16.8 42.5 L16.4 42.5 L15.9 42.5 L15.6 42.4 L15.3 42.4 L15.2 42.3 L15.1 42.2 L14.5 42.1 L13.8 42.0 L13.5 41.9 L13.3 41.8 L12.8 41.7 L12.1 41.6 L11.8 41.5 L11.7 41.4 L11.3 41.3 L10.7 41.2 L10.3 41.0 L9.9 40.8 L9.3 40.7 L8.7 40.6 L8.4 40.4 L8.3 40.3 L7.8 40.1 L7.2 40.0 L6.8 39.8 L6.6 39.5 L5.8 39.1 L4.7 38.7 L4.2 38.4 L4.0 38.1 L3.5 37.7 L2.8 37.1 L2.4 36.8 L2.4 36.5 L1.9 35.9 L1.2 35.0 L0.6 33.8 L0.3 32.4 L0.1 31.2 L0.1 29.9 L0.4 27.8 L0.9 25.3 L1.2 23.6 L1.1 22.6 L1.0 21.7 L0.8 21.1 L0.7 20.6 L0.7 20.2 L0.5 19.6 L0.1 18.0 L0.0 12.4 L0.0 4.8 L0.2 1.5 L0.5 1.4 L0.7 1.2 L0.8 1.0 L1.0 0.8 L1.5 0.7 L2.3 0.6 L3.3 0.4 L3.8 0.3 L4.0 0.3 L4.1 0.2 L4.3 0.1 L4.8 0.0 L5.7 0.0 Z" fill="#1b1815"/></g></g>' +
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
