/* @ds-bundle: {"format":4,"namespace":"Specimen","components":[{"name":"Plate"}]} */
/* Specimen plates: seeded generative data imagery (beaded strands, ray fans,
   cell networks, ring fields, particle fields) for slides and web pages.
   Classic script, no dependencies. window.Specimen.plate(target, options)
   draws to a canvas; window.Specimen.svg(options) returns an SVG string. */
(function () {
  var C = {
    paper: '#F9F8EF', bone: '#ECEBE2', oat: '#E5E5D5', stone: '#D4D3C8',
    ink: '#1A1332', umber: '#2F2922', moss: '#1B1E12',
    violet: '#6F4DCA', lilac: '#D1B0FB', mint: '#A8FDBA', forest: '#165744', salmon: '#E89D9B'
  };

  // One palette per ground colour. bead = strand dots, dust = fine particles,
  // marker = square markers, tag = value label style, grain = speckle (dark grounds only).
  var PALETTES = {
    ink:    { ground: C.ink,    bead: C.mint,   bead2: C.lilac,  dust: C.violet, marker: C.mint,   box: C.lilac,  tag: { mode: 'outline', fg: C.paper, line: C.paper }, grain: C.lilac },
    moss:   { ground: C.moss,   bead: C.mint,   bead2: C.mint,   dust: C.lilac,  marker: C.lilac,  box: C.lilac,  tag: { mode: 'outline', fg: C.paper, line: C.paper }, grain: C.lilac },
    umber:  { ground: C.umber,  bead: C.lilac,  bead2: C.mint,   dust: C.violet, marker: C.mint,   box: C.violet, tag: { mode: 'outline', fg: C.paper, line: C.paper }, grain: C.oat },
    forest: { ground: C.forest, bead: C.mint,   bead2: C.salmon, dust: C.mint,   marker: C.violet, box: C.lilac,  tag: { mode: 'outline', fg: C.mint,  line: C.mint },  grain: C.mint },
    violet: { ground: C.violet, bead: C.lilac,  bead2: C.mint,   dust: C.lilac,  marker: C.salmon, box: C.lilac,  tag: { mode: 'outline', fg: C.paper, line: C.paper }, grain: C.lilac },
    bone:   { ground: C.bone,   bead: C.forest, bead2: C.forest, dust: C.violet, marker: C.violet, box: C.lilac,  tag: { mode: 'fill', bg: C.lilac, fg: C.ink } },
    paper:  { ground: C.paper,  bead: C.violet, bead2: C.violet, dust: C.violet, marker: C.forest, box: C.lilac,  tag: { mode: 'fill', bg: C.forest, fg: C.paper } },
    mint:   { ground: C.mint,   bead: C.forest, bead2: C.forest, dust: C.forest, marker: C.lilac,  box: C.lilac,  tag: { mode: 'fill', bg: C.violet, fg: C.paper } },
    lilac:  { ground: C.lilac,  bead: C.violet, bead2: C.violet, dust: C.violet, marker: C.mint,   box: C.violet, tag: { mode: 'fill', bg: C.paper, fg: C.ink } },
    salmon: { ground: C.salmon, bead: C.violet, bead2: C.violet, dust: C.bone,   marker: C.mint,   box: C.lilac,  tag: { mode: 'fill', bg: C.paper, fg: C.ink } }
  };

  function rng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function val(r) { var v = r(); return (v > 0.97 ? '1.00' : v.toFixed(2)); }
  function f1(n) { return Math.round(n * 10) / 10; }

  // ---- drawing back ends -------------------------------------------------
  function SvgPen(W, H, opts) {
    var groups = {}, order = [], top = [];
    function g(key) { if (!groups[key]) { groups[key] = []; order.push(key); } return groups[key]; }
    return {
      W: W, H: H,
      dot: function (x, y, r, fill, a) {
        g('c|' + fill + '|' + (a || 1)).push('<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/>');
      },
      square: function (x, y, s, fill, a) {
        g('r|' + fill + '|' + (a || 1)).push('<rect x="' + f1(x - s / 2) + '" y="' + f1(y - s / 2) + '" width="' + f1(s) + '" height="' + f1(s) + '"/>');
      },
      ring: function (x, y, r, stroke, w, a) {
        g('o|' + stroke + '|' + w + '|' + (a || 1)).push('<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/>');
      },
      box: function (x, y, w, h, fill, fa, stroke) {
        top.push('<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" fill="' + fill + '" fill-opacity="' + fa + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="1.5"' : '') + '/>');
      },
      line: function (pts, stroke, w, a) {
        var d = 'M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L');
        top.push('<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + w + '" stroke-opacity="' + (a || 1) + '"/>');
      },
      tag: function (x, y, text, st, fs) {
        var w = text.length * fs * 0.62 + fs * 0.7, h = fs * 1.45, G = opts && opts.glyphs;
        var rect = '<rect x="' + f1(x) + '" y="' + f1(y - h / 2) + '" width="' + f1(w) + '" height="' + f1(h) + '"' +
          (st.mode === 'fill' ? ' fill="' + st.bg + '"' : ' fill="none" stroke="' + st.line + '" stroke-width="1.2"') + '/>';
        var by = y + fs * 0.36, bx = x + fs * 0.35, ink = '';
        if (G) { // outlined glyphs: identical in every viewer, no font needed
          var sc = fs / G.upm;
          for (var i = 0; i < text.length; i++) {
            var d = G.paths[text[i]];
            if (d) ink += '<path transform="translate(' + f1(bx + i * G.adv * sc) + ' ' + f1(by) + ') scale(' + sc.toFixed(4) + ' -' + sc.toFixed(4) + ')" d="' + d + '"/>';
          }
          ink = '<g fill="' + st.fg + '">' + ink + '</g>';
        } else {
          ink = '<text x="' + f1(bx) + '" y="' + f1(by) + '" font-size="' + f1(fs) + '" font-family="Geist Mono, ui-monospace, Menlo, Consolas, monospace" fill="' + st.fg + '">' + text + '</text>';
        }
        top.push(rect + ink);
      },
      out: function (ground, grain, opts) {
        var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
        if (grain) {
          var c = hexRgb(grain);
          s += '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="' + (opts.seed || 1) + '" stitchTiles="stitch"/>' +
            '<feColorMatrix type="matrix" values="0 0 0 0 ' + (c[0] / 255).toFixed(3) + ' 0 0 0 0 ' + (c[1] / 255).toFixed(3) + ' 0 0 0 0 ' + (c[2] / 255).toFixed(3) + ' 6 0 0 0 -3.9"/></filter>';
        }
        s += '<rect width="100%" height="100%" fill="' + ground + '"/>';
        if (grain) s += '<rect width="100%" height="100%" filter="url(#grain)" opacity="0.32"/>';
        order.forEach(function (key) {
          var p = key.split('|'), a = p[p.length - 1];
          if (p[0] === 'o') s += '<g fill="none" stroke="' + p[1] + '" stroke-width="' + p[2] + '"' + (a !== '1' ? ' stroke-opacity="' + a + '"' : '') + '>';
          else s += '<g fill="' + p[1] + '"' + (a !== '1' ? ' fill-opacity="' + a + '"' : '') + '>';
          s += groups[key].join('') + '</g>';
        });
        s += top.join('') + '</svg>';
        return s;
      }
    };
  }

  function CanvasPen(ctx, W, H) {
    var later = [];
    return {
      W: W, H: H,
      dot: function (x, y, r, fill, a) { ctx.globalAlpha = a || 1; ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); },
      square: function (x, y, s, fill, a) { ctx.globalAlpha = a || 1; ctx.fillStyle = fill; ctx.fillRect(x - s / 2, y - s / 2, s, s); },
      ring: function (x, y, r, stroke, w, a) { ctx.globalAlpha = a || 1; ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.stroke(); },
      box: function (x, y, w, h, fill, fa, stroke) { later.push(function () { ctx.globalAlpha = fa; ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); if (stroke) { ctx.globalAlpha = 1; ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h); } }); },
      line: function (pts, stroke, w, a) { later.push(function () { ctx.globalAlpha = a || 1; ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); }); },
      tag: function (x, y, text, st, fs) {
        later.push(function () {
          ctx.globalAlpha = 1;
          ctx.font = '400 ' + fs + 'px "Geist Mono", ui-monospace, Menlo, monospace';
          var w = text.length * fs * 0.62 + fs * 0.7, h = fs * 1.45;
          if (st.mode === 'fill') { ctx.fillStyle = st.bg; ctx.fillRect(x, y - h / 2, w, h); }
          else { ctx.strokeStyle = st.line; ctx.lineWidth = 1.2; ctx.strokeRect(x, y - h / 2, w, h); }
          ctx.fillStyle = st.fg; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, x + fs * 0.35, y + fs * 0.36);
        });
      },
      flushTop: function () { later.forEach(function (f) { f(); }); later = []; ctx.globalAlpha = 1; }
    };
  }

  function hexRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }

  // ---- shared helpers ------------------------------------------------------
  function markersAndTags(pen, r, P, pts, opt) {
    var u = opt.u, fs = Math.max(10, 15 * u), want = opt.tags, placed = [];
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (r() < opt.markerRate) {
        var s = (r() < 0.7 ? 11 : 15) * u;
        pen.square(p[0], p[1], s, P.marker);
        if (r() < 0.35) pen.square(p[0] + s, p[1], s, P.marker);
        if (r() < 0.2) pen.square(p[0], p[1] + s, s, P.marker);
        if (want > 0 && r() < opt.tagRate) {
          var tx = p[0] + s * 0.9, ty = p[1] - s * 0.9;
          var ok = tx > 4 && tx < pen.W - 70 * u && ty > 14 * u && ty < pen.H - 14 * u;
          for (var k = 0; ok && k < placed.length; k++) if (Math.abs(placed[k][0] - tx) < 74 * u && Math.abs(placed[k][1] - ty) < 26 * u) ok = false;
          if (ok) { pen.tag(tx, ty, val(r), P.tag, fs); placed.push([tx, ty]); want--; }
        }
      }
    }
  }
  function dust(pen, r, P, n, u, cx, cy, spread) {
    for (var i = 0; i < n; i++) {
      var a = r() * 6.2832, d = Math.pow(r(), 0.6) * spread;
      pen.dot(cx + Math.cos(a) * d * 1.6, cy + Math.sin(a) * d, (0.8 + r() * 1.6) * u, P.dust, 0.75);
    }
  }

  // ---- kinds ---------------------------------------------------------------
  var KINDS = {
    strands: function (pen, r, P, o) {
      var W = pen.W, H = pen.H, u = o.u, pts = [];
      for (var c = 0; c < 5 * o.density; c++) dust(pen, r, P, Math.round(380 * o.density), u, r() * W, r() * H, 200 * u);
      var n = Math.round((9 + r() * 3) * o.density);
      for (var s = 0; s < n; s++) {
        var edge = r(), x, y, hd;
        if (edge < 0.5) { x = r() * W; y = -10; hd = 1.57 + (r() - 0.5) * 1.2; }
        else { x = -10; y = r() * H; hd = (r() - 0.5) * 1.2; }
        var turn = 0, gap = (8 + r() * 6) * u, big = r() < 0.5, col = r() < 0.75 ? P.bead : P.bead2;
        for (var step = 0; step < 400; step++) {
          turn += (r() - 0.5) * 0.09; turn *= 0.94; hd += turn;
          x += Math.cos(hd) * gap; y += Math.sin(hd) * gap;
          if (x < -40 || y < -40 || x > W + 40 || y > H + 40) break;
          var rad = (big ? 2.6 + Math.sin(step * 0.21) * 1.6 : 1.8 + r() * 1.2) * u;
          pen.dot(x, y, Math.max(1, rad), col);
          if (step % 3 === 0) pts.push([x, y]);
          if (r() < 0.012) { // branch: a thin side strand
            var bx = x, by = y, bh = hd + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.6);
            for (var b = 0; b < 30 + r() * 50; b++) { bh += (r() - 0.5) * 0.1; bx += Math.cos(bh) * gap * 0.9; by += Math.sin(bh) * gap * 0.9; pen.dot(bx, by, 1.6 * u, col); }
          }
        }
      }
      markersAndTags(pen, r, P, pts, { u: u, markerRate: 0.12, tagRate: 0.32, tags: o.tags });
    },
    fan: function (pen, r, P, o) {
      var W = pen.W, H = pen.H, u = o.u, pts = [];
      var ox = W * (0.45 + r() * 0.2), oy = H * (0.92 + r() * 0.1);
      var n = Math.round(22 * o.density);
      for (var i = 0; i < n; i++) {
        var ang = Math.PI + (i + 0.5 + (r() - 0.5) * 0.6) / n * Math.PI, bend = (r() - 0.5) * 0.004, x = ox, y = oy, hd = ang;
        var gap = 7 * u, len = (0.6 + r() * 0.6) * Math.max(W, H);
        for (var d = 0; d < len; d += gap) {
          hd += bend; x += Math.cos(hd) * gap; y += Math.sin(hd) * gap;
          if (x < -20 || x > W + 20 || y < -20) break;
          var rad = (1.5 + (d / len) * 2.2 + r() * 0.8) * u;
          pen.dot(x, y, rad, P.bead);
          if (d > len * 0.15 && r() < 0.18) pts.push([x, y]);
          gap = (6 + d / len * 6) * u;
        }
      }
      for (var k = 0; k < 160 * o.density; k++) pen.dot(r() * W, r() * H, (0.8 + r()) * u, P.dust, 0.5);
      markersAndTags(pen, r, P, pts, { u: u, markerRate: 0.22, tagRate: 0.5, tags: o.tags });
    },
    cells: function (pen, r, P, o) {
      var W = pen.W, H = pen.H, u = o.u, sites = [], pts = [];
      var sp = 190 * u / Math.sqrt(o.density);
      for (var gy = -sp / 2; gy < H + sp; gy += sp * 0.86)
        for (var gx = -sp / 2; gx < W + sp; gx += sp)
          sites.push([gx + (r() - 0.5) * sp * 0.8 + ((gy / sp | 0) % 2) * sp / 2, gy + (r() - 0.5) * sp * 0.6]);
      var st = 3 * u;
      for (var y = 0; y < H; y += st) for (var x = 0; x < W; x += st) {
        var d1 = 1e9, d2 = 1e9;
        for (var i = 0; i < sites.length; i++) {
          var dx = sites[i][0] - x, dy = sites[i][1] - y;
          if (Math.abs(dx) > sp * 1.6 || Math.abs(dy) > sp * 1.6) continue;
          var d = dx * dx + dy * dy;
          if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
        }
        var gap = Math.sqrt(d2) - Math.sqrt(d1);
        if (gap < st * 2.4 && r() < 0.42) {
          var jx = x + (r() - 0.5) * 6 * u, jy = y + (r() - 0.5) * 6 * u;
          pen.dot(jx, jy, (1 + r() * 1.5) * u, P.bead);
          if (r() < 0.05) pts.push([jx, jy]);
        }
      }
      // small markers along the walls, then the larger tagged ones
      for (var m = 0; m < pts.length; m++) if (r() < 0.35) pen.square(pts[m][0], pts[m][1], 6 * u, P.marker, 0.9);
      markersAndTags(pen, r, P, pts, { u: u, markerRate: 0.06, tagRate: 0.6, tags: o.tags });
    },
    rings: function (pen, r, P, o) {
      var W = pen.W, H = pen.H, u = o.u, rings = [], pts = [];
      var cx = W * (0.2 + r() * 0.2), cy = H * 0.5, R = Math.max(W, H) * 0.62;
      // boundary of the region: a dotted arc
      for (var a = -1.4; a < 1.4; a += 0.004) {
        var bx = cx + Math.cos(a) * R * (1 + Math.sin(a * 5) * 0.02), by = cy + Math.sin(a) * R * 0.85;
        if (bx < W && by > 0 && by < H) pen.dot(bx + (r() - 0.5) * 4 * u, by, 1.6 * u, P.bead, 0.85);
      }
      for (var t = 0; t < 4000 && rings.length < 520 * o.density; t++) {
        var x = r() * W, y = r() * H, rr = (13 + r() * 9) * u;
        var dx = (x - cx), dy = (y - cy) / 0.85;
        if (Math.sqrt(dx * dx + dy * dy) > R - rr * 1.5) continue;
        var ok = true;
        for (var i = 0; i < rings.length; i++) { var q = rings[i]; if ((q[0] - x) * (q[0] - x) + (q[1] - y) * (q[1] - y) < (q[2] + rr + 3 * u) * (q[2] + rr + 3 * u)) { ok = false; break; } }
        if (!ok) continue;
        rings.push([x, y, rr]);
        pen.ring(x, y, rr, P.bead, 1.6 * u);
        if (r() < 0.08) { pen.ring(x + rr * 0.4, y - rr * 0.3, rr * 0.7, P.bead, 1.6 * u); pen.ring(x - rr * 0.3, y + rr * 0.4, rr * 0.55, P.bead, 1.4 * u); }
        if (r() < 0.25) pts.push([x + rr, y]);
      }
      for (var k = 0; k < 500 * o.density; k++) pen.dot(r() * W, r() * H, (0.7 + r() * 0.8) * u, P.dust, 0.6);
      markersAndTags(pen, r, P, pts, { u: u, markerRate: 0.5, tagRate: 0.12, tags: o.tags });
    },
    field: function (pen, r, P, o) {
      var W = pen.W, H = pen.H, u = o.u, pts = [], cl = [];
      for (var q = 0; q < 7; q++) cl.push([r() * W, r() * H, (120 + r() * 220) * u]);
      for (var i = 0; i < 1500 * o.density; i++) {
        var x, y;
        if (r() < 0.7) { var c = cl[(r() * cl.length) | 0], a = r() * 6.2832, d = Math.pow(r(), 0.8) * c[2]; x = c[0] + Math.cos(a) * d; y = c[1] + Math.sin(a) * d * 0.7; }
        else { x = r() * W; y = r() * H; }
        pen.dot(x, y, (1 + r() * 2.6) * u, P.bead, 0.55 + r() * 0.45);
        if (r() < 0.05) pts.push([x, y]);
      }
      // comet streaks: a dotted line ending in a larger head
      for (var s2 = 0; s2 < 12 * o.density; s2++) {
        var sx = r() * W, sy = r() * H, ang = r() * 6.2832, len = (50 + r() * 80) * u;
        for (var dd = 0; dd < len; dd += 6 * u) pen.dot(sx + Math.cos(ang) * dd, sy + Math.sin(ang) * dd, 2 * u, P.bead);
        pen.dot(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len, 5.5 * u, P.bead);
      }
      // detection boxes
      var nb = Math.round(5 * o.density);
      for (var b = 0; b < nb; b++) {
        var bw = (100 + r() * 180) * u, bh = (80 + r() * 120) * u, bx = r() * (W - bw), by = 20 * u + r() * (H - bh - 20 * u);
        pen.box(bx, by, bw, bh, P.box, 0.6, P.bead);
        if (o.tags > 0) { pen.tag(bx + bw - 66 * u, by + bh + 14 * u, val(r), P.tag, Math.max(10, 15 * u)); o.tags--; }
      }
      markersAndTags(pen, r, P, pts, { u: u, markerRate: 0.45, tagRate: 0.3, tags: o.tags });
    }
  };

  function normalise(opts) {
    opts = opts || {};
    var P = PALETTES[opts.palette] || PALETTES.ink;
    return {
      kind: KINDS[opts.kind] ? opts.kind : 'strands', P: P,
      seed: opts.seed == null ? 7 : opts.seed,
      density: opts.density || 1,
      tags: opts.tags == null ? 10 : opts.tags,
      grain: opts.grain == null ? !!P.grain : opts.grain
    };
  }

  function svg(opts) {
    var o = normalise(opts), W = (opts && opts.width) || 1600, H = (opts && opts.height) || 1000;
    var pen = SvgPen(W, H, { glyphs: opts && opts.glyphs }), r = rng(o.seed);
    KINDS[o.kind](pen, r, o.P, { u: Math.max(W, H) / 1600, density: o.density, tags: o.tags });
    return pen.out(o.P.ground, o.grain ? o.P.grain : null, { seed: o.seed });
  }

  function plate(target, opts) {
    var o = normalise(opts), canvas = target;
    if (!target.getContext) {
      canvas = document.createElement('canvas');
      canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block';
      target.innerHTML = ''; target.appendChild(canvas);
    }
    var rect = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.max(1, Math.round(rect.width)), H = Math.max(1, Math.round(rect.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = o.P.ground; ctx.fillRect(0, 0, W, H);
    var r = rng(o.seed);
    if (o.grain) {
      var gr = rng(o.seed + 99);
      ctx.fillStyle = o.P.grain;
      for (var i = 0; i < W * H / 90; i++) { ctx.globalAlpha = 0.12 + gr() * 0.25; ctx.fillRect(gr() * W, gr() * H, 1, 1); }
      ctx.globalAlpha = 1;
    }
    var pen = CanvasPen(ctx, W, H);
    KINDS[o.kind](pen, r, o.P, { u: Math.max(W, H) / 1600, density: o.density, tags: o.tags });
    pen.flushTop();
    return canvas;
  }

  // Draw every element carrying data-plate="kind palette [seed]" (e.g. data-plate="strands ink 12").
  function mountAll(root) {
    var els = (root || document).querySelectorAll('[data-plate]');
    Array.prototype.forEach.call(els, function (el) {
      var p = el.getAttribute('data-plate').split(/\s+/);
      plate(el, { kind: p[0], palette: p[1], seed: p[2] ? +p[2] : undefined, tags: el.hasAttribute('data-tags') ? +el.getAttribute('data-tags') : undefined });
    });
  }

  var api = { plate: plate, svg: svg, mountAll: mountAll, palettes: Object.keys(PALETTES), kinds: Object.keys(KINDS), colors: C };
  if (typeof window !== 'undefined') { window.Specimen = window.Specimen || {}; for (var k in api) window.Specimen[k] = api[k]; }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
