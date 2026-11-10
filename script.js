/* =====================================================================
   DEZIGNIST – scroll-driven construction intro
   The DEZIGNIST beach-resort intro video (plan -> foundation -> pillars ->
   floors -> roof -> facade -> pool & landscape -> lights on -> aerial) is
   played as an image sequence on a <canvas> (frames/f000.webp … f475.webp).
   Scrolling picks the frame, so there is no video seeking and no lag.
   The phase captions and the end card are part of the video itself.
   ===================================================================== */
(function () {
  const stage = document.getElementById('build-stage'), track = document.getElementById('build-track');
  if (!stage || !track) return;
  const cv = document.getElementById('bc'),
    cap = document.getElementById('build-cap'), bar = document.querySelector('#build-bar i'),
    hint = document.getElementById('build-hint');
  const ctx = cv.getContext('2d');

  /* ---- frame sequence (made from DEZIGNIST-resort-intro.mp4: 10 fps, starting at 1.0 s, 1600px).
     w/h below is just the drawing coordinate space (16:9), any frame size works. ---- */
  const FR = { count: 476, fps: 10, start: 1.0, w: 1920, h: 1080,
    src: i => 'frames/f' + String(i).padStart(3, '0') + '.webp' };
  const N = FR.count;

  /* ---- site caption: only the welcome line at the very top.
     After that the video shows its own phase captions (01–10) and the DEZIGNIST end card. ---- */
  const STAGES = [
    [0, .02, 'Welcome to the DEZIGNIST Architectural World', 'Scroll to begin']
  ];

  /* ---- scroll progress -> video time (seconds): a short hold on the title, then an even pace,
     and a hold on the end card ---- */
  const TL = [[0, 1.0], [.04, 3.2], [.94, 46.8], [1, 48.5]];

  /* ---- camera: the resort film already has its own camera moves, so no extra zoom or drift.
     Every shot keeps the building, captions and end card inside the centre of the frame,
     so phones (portrait) show that centre part at full width. keyframes: [progress, zoom, focusX, focusY] ---- */
  const CAM_WIDE = [[0, 1, .5, .5], [1, 1, .5, .5]];  // laptop / desktop: the full frame
  const CAM_TALL = [[0, 1, .5, .5], [1, 1, .5, .5]];  // phones: centre safe area
  const SHOW = .5; // on portrait screens show the centre half of the video width (the safe area)

  /* ---- per-frame colours of the video's top and bottom edges (rrggbb top + rrggbb bottom).
     On phones the space above/below the video is filled with these, so the sky and ground
     simply continue instead of showing a blurred smear ---- */
  const EDGES = '0000000000000000000000000000000000000000000000000101010000000202020000000303030000000303030000000202020000000101010000000101010000000101010000000101010000000101010000000101010000000101010000000101010000000101010000000101010000000101010000000101010101010202020101010202020101010202020101010202020101010202020101010202020101010202020101010202030101010303030101010303040101010404050202021313160303030c0c0d0203030b0b0b0404041d1d1d0202020a0a0a0303030a0a0b0303030909090202020606060101010303030d0d0d0909090303030505050404040606060303030303030303030707070101010606060101010909090303040606060606061213134b4b4b1212120202030606060302030505052420190404050101010909080101010808080706050708080303030101010f0f0f020203010102070707020303010102242627050505000000131315020202696b6d191b1d8082840101015f61620101016d6e6f0101010b0c0c0101010505050101010808080101010202020101010000000101010000000101010000000101010000000101010000000101010000000101010000000101010000000101013a3b3c0c0c0e0505050202020b0b0b1d1d1d090909090a0a0808090405060404040202020303030a0b0b0303040808070303030202020000000303030000000b0a0a000000080808000000070707000000060707000000040404000000060606000000030303000000020202000000020202000000030303000000040404000000080808000000060606000000060606000000080809000000070707000000070708000000070707000000070708000000070707000000070707000000080808000000080808000000070707000000070707000000060607000000060606000000080808000000080808000000070707000000060606000000070707000000050606000000060606000000060606000000060606000000060606000000060606000000060606000000060606000000060606000000060607000000060707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000060606000000060606000000060606000000060607000000060606000000070707000000060606000000060606000000060606000000060606000000060606000000060606000000060606000000060606000000070707000000070808000000070707000000070707000000070707000000070707000000060707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000070707000000070708000000080808000000070707000000070707000000070707000000050606000000050506000000060606000000050505000000050505000000040404000000040404000000040404000000040404000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000030303000000030303000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000020202000000030303000000030303000000030303000000030303000000030303000000050505000000040404000000050505000000050505000000050505000000040404000000040404000000040404000000040404000000040404000000040404000000040404000000040404000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000030303000000040404000000050505000000040405000000050505000000060606000000050505000000050505000000040404000000040404000000040404000000050505000000050505000000040404000000040404000000040404000000040404000000050505000000040405000000040405000000040405000000040404000000040404000000040404000000030304000000030303000000050505000000040404000000030303000000040404000000040404000000040404000000030303000000030404000000030303010101030303010101020202030303040504040404030303060707504735090a0a5349390d0d0e554b3b101112594d3f15161857503f1b1b1d5a53412020245e544327272b5c52402e2d325b513e35353a564e3d3d3b42504b3c45434a48483b4d4b533f453c55525b38433b5d5a6331403c64616b2b3e3b6a6873233b3b716e7b1c393c76748214383e7a78861137407d7b8b0b36417e7e8f0734417e7f910533407e7f9204323f7c7e9305323f7b7e9405323f7a7e94063240787d9506313f777d9506313f767d9606313f767c9606313f747c9606313e737b9607313f727b9708313f707a9608313f6f7a9607303e6d789608303f6a779509313f68749509313f64729309303f6170920a31405e6d900b31415b6a8e0c314157668c0d314153638a0e31424f5f870e31424c5c850d30424858820c304144547f0e304340507c0f31433c4c7a1132453848761031443444741131453141701131452d3d6d1331462a3a6b143247263667143247233364163248202f611733481e2d5f1632481c2a5c19334a1927591a344a1625571d354b1524561d354b1422531b334b121f511a3249111d501a334a111d501a334a101c4f19334a101c4f19334b0f1b4e19334b0f1b4e1a334b0f1b4e1c344b101b4d1a334b101b4d18324a101b4d1631490f1b4d183249101b4d1e354c101b4d22384e101b4d21374d101b4d22384e101b4d1d364d101b4d1a344b101b4d18334b101b4d1a344b101b4d1b354c0f1b4d1c364c0f1b4e1a344b0f1b4e1b344c101c4f1e374d101c4f1e374e101c4f1f384e101c4f1d374e101c4f1c374e101c4f19354c111d5019354c111d5019354d111d5018354c121d5017344c121d5019354d131d501b364e131d501a364d151d501b374e161e5018364d161e5013334c181f5010324a1a1f5111324b1b205112334b1d215113334c1f215113344b21225113344c23225113344c25235113334c27245111334b2a245110324b2c25510d314a2f26500d314a3227510c314a3528500c314a3828500c314a3b29500c314a3d2a500c314a402b500c314a422b500b304a452c500a304a482c500930494a2d4f09304a4c2e500830494d2e4f082f49502f4f072f49512f4e082f4954304d062f4857304c072f495a314c062e485d324b062e485f3249052d475f3246052c455e3043052a435c2f3f0529405a2d3c04263c572b380425395429340422355028300420334e262e041e2f4d252b041d2e4d252a041c2d4e2529041c2d522628041c2d542627041c2d572727041c2d592826041c2d5c2826041c2c5d2925041c2c5f2924041c2c602924041b2c612a23041b2c622a23041b2c632a22031b2c642a22031b2c652b22031b2c672b21031b2c682c20031b2c692c1f031b2c6b2c1f031b2c6c2c1e031b2c6d2d1e031b2c6f2c1d031b2c702d1c031a2b712d1c031b2b722e1c031a2b732e1c031b2c742e1c031a2b752e1c031b2c762e1c031b2c';
  const DARK = [5, 6, 7];
  const hexRgb = (h, k) => [0, 2, 4].map(o => parseInt(h.substr(k + o, 2), 16));
  const mix = (a, b, t) => 'rgb(' + a.map((v, j) => Math.round(v + (b[j] - v) * t)).join(',') + ')';

  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
  const segOf = (K, x) => { let i = 0; while (i < K.length - 2 && x >= K[i + 1][0]) i++; return [i, cl((x - K[i][0]) / (K[i + 1][0] - K[i][0]))]; };
  const linear = (K, x) => { const [i, s] = segOf(K, x); return lerp(K[i][1], K[i + 1][1], s); };
  /* monotone cubic (Fritsch-Carlson): smooth like a spline but never overshoots, so no wobble */
  function tangents(K, c) {
    const n = K.length, d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((K[i + 1][c] - K[i][c]) / (K[i + 1][0] - K[i][0]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
      if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    return m;
  }
  [CAM_WIDE, CAM_TALL].forEach(K => { K.m = [1, 2, 3].map(c => tangents(K, c)); });
  const smooth = (K, x, c) => {
    const [i, s] = segOf(K, x), h = K[i + 1][0] - K[i][0], m = K.m[c - 1], s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * K[i][c] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * K[i + 1][c] + (s3 - s2) * h * m[i + 1];
  };

  /* ---- loading: coarse frames first (every 32nd, 16th, 8th…) so the whole intro works early ---- */
  /* On a web server frames are fetched as compressed files and only the ones near the current
     scroll position are unpacked (off the main thread), so even the 1920px frames scroll smoothly.
     Opened straight from disk (file://) it falls back to plain <img> loading. */
  const useFetch = /^https?:$/.test(location.protocol) && 'createImageBitmap' in window && 'fetch' in window;
  const imgs = new Array(N), blobs = new Array(N), bmps = new Array(N), live = new Set(), pend = new Set();
  const has = i => i >= 0 && i < N && (useFetch ? !!blobs[i] : !!imgs[i]);
  const order = [], seen = new Uint8Array(N);
  let READY_AT = 0; // intro counts as "ready" once every 8th frame has arrived
  [32, 16, 8, 4, 2, 1].forEach(st => {
    for (let i = 0; i < N; i += st) if (!seen[i]) { seen[i] = 1; order.push(i); }
    if (st === 32 && !seen[N - 1]) { seen[N - 1] = 1; order.push(N - 1); }
    if (st === 8) READY_AT = order.length;
  });
  let qi = 0, loaded = 0;
  function loadNext() {
    if (qi >= order.length) return;
    const i = order[qi++], fail = () => { loaded++; loadNext(); };
    if (useFetch) {
      fetch(FR.src(i)).then(r => { if (!r.ok) throw 0; return r.blob(); })
        .then(b => { blobs[i] = b; loaded++; loadNext(); }, fail);
    } else {
      const im = new Image(), ok = () => { imgs[i] = im; loaded++; loadNext(); };
      im.decoding = 'async'; im.src = FR.src(i);
      if (im.decode) im.decode().then(ok, fail); else { im.onload = ok; im.onerror = fail; }
    }
  }
  for (let k = 0; k < 6; k++) loadNext();

  function nearestLoaded(fi) { // the wanted frame, or the closest one that has arrived
    for (let d = 0; d < N; d++) { if (has(fi - d)) return fi - d; if (has(fi + d)) return fi + d; }
    return -1;
  }
  let cur = 0, anchor = -1, shown = -1, decoding = 0, KEEP = 12;
  const keep = i => Math.abs(i - cur) <= KEEP + 4 || i === anchor || i === shown;
  function manageDecoded() {
    if (!useFetch) return;
    const want = [anchor];
    for (let d = 0; d <= KEEP; d++) want.push(cur + d, cur - d);
    for (const i of want) {
      if (decoding >= 2) break;
      if (i < 0 || i >= N || !blobs[i] || bmps[i] || pend.has(i)) continue;
      decoding++; pend.add(i);
      createImageBitmap(blobs[i]).then(b => { if (keep(i)) { bmps[i] = b; live.add(i); } else b.close(); }, () => {})
        .then(() => { decoding--; pend.delete(i); });
    }
    live.forEach(i => { if (!keep(i)) { bmps[i].close(); bmps[i] = null; live.delete(i); } });
  }
  function pick(fi) { // best frame that is ready to draw right now
    if (!useFetch) return anchor;
    for (let d = 0; d <= KEEP + 4; d++) { if (bmps[fi - d]) return fi - d; if (bmps[fi + d]) return fi + d; }
    return anchor >= 0 && bmps[anchor] ? anchor : shown; // otherwise keep the last picture until the next is ready
  }

  /* ---- layout ---- */
  let W = 0, H = 0, dpr = 1, base = 1, tall = false, dirty = true;
  function resize() {
    const r = stage.getBoundingClientRect(), nd = Math.min(window.devicePixelRatio || 1, 2);
    if (Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 1 && nd === dpr) return;
    W = r.width; H = r.height; dpr = nd;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const cover = Math.max(W / FR.w, H / FR.h), fitPart = W / (FR.w * SHOW);
    base = Math.min(cover, fitPart);
    tall = base < cover - 1e-6; // the video can't fill the screen without heavy cropping -> portrait layout
    stage.classList.toggle('tall', tall);
    KEEP = tall ? 8 : 12; // phones keep fewer unpacked frames in memory
    dirty = true;
  }

  function draw(i) {
    const img = useFetch ? bmps[i] : imgs[i];
    const K = tall ? CAM_TALL : CAM_WIDE;
    let z = smooth(K, p, 1); if (!tall) z = Math.max(z, 1);
    const fx = smooth(K, p, 2), fy = smooth(K, p, 3), s = base * z, dw = FR.w * s, dh = FR.h * s, ay = tall ? H * .44 : H * .5;
    let dx = W / 2 - fx * dw, dy = ay - fy * dh;
    dx = dw >= W ? cl(dx, W - dw, 0) : (W - dw) / 2;
    dy = dh >= H ? cl(dy, H - dh, 0) : cl(ay - dh / 2, 0, H - dh);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    if (dh < H - 1) {
      /* phones: paint the sky colour above the video and the ground colour below it, draw the frame,
         then fade its top/bottom edge into those colours so the picture blends in cleanly */
      const top = hexRgb(EDGES, i * 12), bot = hexRgb(EDGES, i * 12 + 6), f = dh * .07;
      const fill = ctx.createLinearGradient(0, 0, 0, H);
      fill.addColorStop(0, mix(top, DARK, .35)); fill.addColorStop(cl(dy / H), mix(top, DARK, 0));
      fill.addColorStop(cl((dy + dh) / H), mix(bot, DARK, 0)); fill.addColorStop(1, mix(bot, DARK, .85));
      ctx.fillStyle = fill; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, dx, dy, dw, dh);
      const t = 'rgba(' + top.join(',') + ',', b = 'rgba(' + bot.join(',') + ',';
      let g = ctx.createLinearGradient(0, dy, 0, dy + f); g.addColorStop(0, t + '1)'); g.addColorStop(1, t + '0)');
      ctx.fillStyle = g; ctx.fillRect(0, dy - 1, W, f + 1);
      g = ctx.createLinearGradient(0, dy + dh - f, 0, dy + dh); g.addColorStop(0, b + '0)'); g.addColorStop(1, b + '1)');
      ctx.fillStyle = g; ctx.fillRect(0, dy + dh - f, W, f + 1);
    } else {
      ctx.drawImage(img, dx, dy, dw, dh);
    }
  }

  /* ---- captions ---- */
  let curStage = -1;
  function caption() {
    const i = STAGES.findIndex(s => p >= s[0] && p < s[1]);
    if (i === curStage) return; curStage = i; cap.classList.add('out');
    if (i < 0) return; // past the welcome line: the video's own captions take over
    setTimeout(() => {
      if (curStage !== i) return;
      cap.querySelector('h2').textContent = STAGES[i][2]; cap.querySelector('p').textContent = STAGES[i][3];
      cap.classList.toggle('hero', i === 0 || i === STAGES.length - 1); cap.classList.remove('out');
    }, 260);
  }

  /* ---- scroll + render loop ---- */
  let target = 0, p = 0, lastKey = '';
  function readScroll() { const r = track.getBoundingClientRect(); target = cl(-r.top / (r.height - H)); }
  function loop() {
    p += (target - p) * .1; if (Math.abs(target - p) < .0002) p = target;
    const fi = cl(Math.round((linear(TL, p) - FR.start) * FR.fps), 0, N - 1);
    cur = fi; anchor = nearestLoaded(fi); manageDecoded();
    const show = pick(fi), key = show + '|' + p.toFixed(5);
    if (show >= 0 && (dirty || key !== lastKey)) { draw(show); shown = show; lastKey = key; dirty = false; }
    bar.style.height = p * 100 + '%';
    const ready = loaded >= READY_AT;
    const label = ready ? 'SCROLL' : 'LOADING ' + Math.min(99, Math.round(loaded / READY_AT * 100)) + '%';
    if (hint.textContent !== label) hint.textContent = label;
    hint.style.opacity = (p < .03 || !ready) ? 1 : 0;
    caption();
    requestAnimationFrame(loop);
  }
  addEventListener('resize', () => { resize(); readScroll(); });
  addEventListener('scroll', readScroll, { passive: true });
  resize(); readScroll(); p = target; requestAnimationFrame(loop);
})();


// --- Helpers (safe if an element is missing) ---
const $ = (id) => document.getElementById(id);
const on = (id, evt, fn) => { const el = $(id); if (el) el.addEventListener(evt, fn); };

// --- Data State ---
const projects = []; // projects are now static in index.html
const services = [
  { title: 'RESIDENTIAL', icon: 'home_work', description: 'Bespoke private estates and minimalist sanctuaries designed for permanence and utmost discretion.' },
  { title: 'COMMERCIAL', icon: 'domain', description: 'Authoritative headquarters and institutional structures that project stability and forward-thinking vision.' },
  { title: 'URBAN PLANNING', icon: 'location_city', description: 'Large-scale infrastructural interventions that redefine cityscapes with rigorous modernist principles.' }
];
const offices = ['CHENNAI'];

// --- DOM Rendering ---
function renderProjects() {
  const container = $('projects-grid');
  if (!container || !projects.length) return;
  container.innerHTML = projects.map(p => `
    <div onclick="openCard(${p.id})" class="group block relative aspect-[3/4] overflow-hidden border-t border-outline-variant/30 pt-4 cursor-pointer ${p.offset ? 'md:mt-16' : ''}">
      <div class="absolute top-6 left-4 z-20 bg-surface/80 backdrop-blur-md px-3 py-1 border border-outline-variant/40">
        <span class="font-label-caps text-[10px] tracking-widest text-secondary uppercase">${p.category}</span>
      </div>
      <div class="absolute inset-x-0 top-4 bottom-0 z-0 overflow-hidden">
        <img src="${p.image}" alt="${p.alt}" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        <div class="absolute inset-0 bg-surface-dim/30 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>
      <div class="relative z-10 p-4 md:p-6 flex flex-col justify-end h-full">
        <div class="bg-surface/90 backdrop-blur-sm p-4 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <span class="block font-label-caps text-xs text-secondary mb-1">${p.date}</span>
          <h3 class="font-headline-md text-lg md:text-headline-md text-on-surface">${p.title}</h3>
        </div>
      </div>
    </div>
  `).join('');
}

function renderServices() {
  const container = $('services-grid');
  if (!container) return;
  container.innerHTML = services.map(s => `
    <div class="pt-8 md:pt-0 md:px-8 flex flex-col items-center text-center group">
      <span class="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-secondary transition-colors duration-300 mb-4">${s.icon}</span>
      <h3 class="font-headline-md text-xl md:text-headline-md text-on-surface mb-2 md:mb-4">${s.title}</h3>
      <p class="font-body-md text-sm md:text-body-md text-on-surface-variant">${s.description}</p>
    </div>
  `).join('');
}

function renderOffices() {
  const container = $('offices-container');
  if (!container) return;
  container.innerHTML = offices.map(o => `
    <a href="#location" class="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors">${o}</a>
  `).join('');
}

// --- Project Modal ---
function openCard(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;
  $('modal-category-date').textContent = `${project.category} — ${project.date}`;
  $('modal-title').textContent = project.title;
  $('modal-image').src = project.image;
  $('modal-image').alt = project.alt;
  $('modal-description').textContent = project.description;
  $('modal-location').textContent = `LOCATION: ${project.location}`;
  $('project-modal').classList.remove('hidden');
}
function closeCard() { $('project-modal')?.classList.add('hidden'); }

on('close-project-modal', 'click', closeCard);
on('close-modal-btn', 'click', closeCard);
on('project-modal', 'click', (e) => { if (e.target.id === 'project-modal') closeCard(); });

// --- Inquiry Modal ---
function openEnquiry() { $('enquiry-modal')?.classList.remove('hidden'); }
function closeEnquiry() {
  $('enquiry-modal')?.classList.add('hidden');
  $('enquiry-form-view')?.classList.remove('hidden');
  $('enquiry-success-view')?.classList.add('hidden');
  $('enquiry-form')?.reset();
}

on('open-inquiry-btn', 'click', openEnquiry);
on('mobile-inquiry-btn', 'click', openEnquiry);
on('cta-inquiry-btn', 'click', openEnquiry);
on('close-enquiry-modal', 'click', closeEnquiry);
on('return-site-btn', 'click', closeEnquiry);
on('enquiry-modal', 'click', (e) => { if (e.target.id === 'enquiry-modal') closeEnquiry(); });

on('enquiry-form', 'submit', (e) => {
  e.preventDefault();
  const name = $('form-name').value;
  const location = $('form-location').value;
  $('enquiry-success-text').textContent =
    `Thank you, ${name}. Our design partners will review your site parameters for ${location} and contact you shortly.`;
  $('enquiry-form-view').classList.add('hidden');
  $('enquiry-success-view').classList.remove('hidden');
});

// --- Reveal map when scrolled into view ---
const mapWrapper = $('map-wrapper');
if (mapWrapper) {
  const reveal = () => mapWrapper.classList.remove('opacity-0', 'translate-y-6');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { reveal(); obs.unobserve(mapWrapper); }
      });
    }, { threshold: 0.2 }).observe(mapWrapper);
  } else {
    reveal(); // old browsers: just show it
  }
}


// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderServices();
  renderOffices();
});
