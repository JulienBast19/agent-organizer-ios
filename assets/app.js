/* Ecuador Rural Land Explorer — application logic */
(function () {
  "use strict";

  var DATA = (window.PROPERTIES || []).map(function (p) {
    var c = Object.assign({}, p);
    c.m2 = Math.round(c.areaHa * 10000);
    c.pricePerHa = (c.price != null && c.areaHa) ? c.price / c.areaHa : null;
    c.hasWaterFeature = !!(c.waterFeature && !/^unknown/i.test(c.waterFeature));
    return c;
  });

  var DEFAULT_WEIGHTS = { nature: 30, value: 25, safety: 20, accessibility: 15, utilities: 10 };
  var WEIGHT_LABELS = {
    nature: "Nature & privacy", value: "Price / value", safety: "Safety",
    accessibility: "Accessibility", utilities: "Utilities / infrastructure"
  };
  var NEUTRAL = 5; // stand-in for an unrated dimension, always flagged in the UI

  // How direct the source link is. Half these properties were found on portal
  // search pages whose contents rotate, so the link type is stated up front
  // rather than letting a link quietly fail to show the property.
  var SOURCE_KIND = {
    listing: {
      label: "Listing", shortLabel: "Listing",
      tip: "Direct link to this property's own listing page."
    },
    index: {
      label: "Agency index", shortLabel: "Agency page",
      tip: "Goes to the agency's list of properties, not a page for this one. " +
           "The property is one entry on it."
    },
    search: {
      label: "Portal search", shortLabel: "Search page",
      tip: "Goes to a portal's search results, not a page for this property. " +
           "Portal results change over time, so it may have moved or gone."
    }
  };

  var state = {
    weights: Object.assign({}, DEFAULT_WEIGHTS),
    filters: {
      priceMin: 0, priceMax: 600000,
      areaMin: 0.5, areaMax: 10,
      pphaMax: 250000,
      minOverall: 0, minNature: 0, minSafety: 0, minAccess: 0,
      house: "any", electricity: "any", water: "any", waterFeature: "any",
      provinces: [], includeUnpriced: true, includeNear: true
    },
    selected: null,
    basemap: "satellite"
  };

  /* ------------------------------------------------------------- scoring */

  function scoreOf(p, key) {
    var v = p.scores[key];
    return (v == null) ? NEUTRAL : v;
  }

  function overall(p) {
    var w = state.weights, total = 0, sum = 0;
    Object.keys(w).forEach(function (k) {
      total += w[k];
      sum += w[k] * scoreOf(p, k);
    });
    return total > 0 ? sum / total : 0;
  }

  function unratedDims(p) {
    return Object.keys(DEFAULT_WEIGHTS).filter(function (k) { return p.scores[k] == null; });
  }

  function scoreColor(s) {
    if (s >= 7.5) return "#3fbf87";
    if (s >= 6.5) return "#7cc35f";
    if (s >= 5.5) return "#d9c14f";
    if (s >= 4.5) return "#e0a24c";
    return "#e07a5f";
  }

  /* ------------------------------------------------------------ formatting */

  function money(n) {
    if (n == null) return "Unknown";
    return "$" + Math.round(n).toLocaleString("en-US");
  }
  function moneyShort(n) {
    if (n == null) return "—";
    if (n >= 1000000) return "$" + (n / 1000000).toFixed(2).replace(/\.?0+$/, "") + "M";
    if (n >= 1000) return "$" + Math.round(n / 1000) + "k";
    return "$" + Math.round(n);
  }
  function ha(n) { return (Math.round(n * 100) / 100) + " ha"; }
  function median(arr) {
    if (!arr.length) return null;
    var a = arr.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function ynuLabel(v) {
    return v === "yes" ? "Yes" : v === "no" ? "No" : "Unknown";
  }

  /* -------------------------------------------------------------- filtering */

  function passes(p) {
    var f = state.filters;
    if (p.category === "near" && !f.includeNear) return false;

    if (p.price == null) {
      if (!f.includeUnpriced) return false;
    } else {
      if (p.price < f.priceMin || p.price > f.priceMax) return false;
      if (p.pricePerHa != null && p.pricePerHa > f.pphaMax) return false;
    }

    if (p.areaHa < f.areaMin || p.areaHa > f.areaMax) return false;
    if (overall(p) < f.minOverall) return false;
    if (scoreOf(p, "nature") < f.minNature) return false;
    if (scoreOf(p, "safety") < f.minSafety) return false;
    if (scoreOf(p, "accessibility") < f.minAccess) return false;

    if (f.house !== "any" && p.house !== f.house) return false;
    if (f.electricity !== "any" && p.electricity !== f.electricity) return false;
    if (f.water !== "any" && p.water !== f.water) return false;
    if (f.waterFeature === "yes" && !p.hasWaterFeature) return false;
    if (f.provinces.length && f.provinces.indexOf(p.province) === -1) return false;

    return true;
  }

  function ranked() {
    return DATA.filter(passes)
      .map(function (p) { return { p: p, s: overall(p) }; })
      .sort(function (a, b) {
        if (b.s !== a.s) return b.s - a.s;
        var ap = a.p.pricePerHa == null ? Infinity : a.p.pricePerHa;
        var bp = b.p.pricePerHa == null ? Infinity : b.p.pricePerHa;
        return ap - bp;
      });
  }

  /* ------------------------------------------------------------------ map */

  var map, markerLayer, markers = {};

  var baseLayers = {
    satellite: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 18, attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics" }
    ),
    terrain: L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { maxZoom: 17, attribution: "&copy; OpenTopoMap, &copy; OpenStreetMap contributors" }
    ),
    street: L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors, &copy; CARTO" }
    )
  };

  var labelLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18, opacity: 0.85 }
  );

  function initMap() {
    map = L.map("map", {
      center: [-1.6, -78.8], zoom: 6, minZoom: 5, zoomControl: true,
      attributionControl: true, worldCopyJump: false
    });
    baseLayers.satellite.addTo(map);
    labelLayer.addTo(map);
    markerLayer = L.layerGroup().addTo(map);
  }

  function setBasemap(name) {
    Object.keys(baseLayers).forEach(function (k) {
      if (map.hasLayer(baseLayers[k])) map.removeLayer(baseLayers[k]);
    });
    baseLayers[name].addTo(map);
    if (name === "satellite") { labelLayer.addTo(map); labelLayer.bringToFront(); }
    else if (map.hasLayer(labelLayer)) map.removeLayer(labelLayer);
    state.basemap = name;
    Array.prototype.forEach.call(document.querySelectorAll(".layerbox button"), function (b) {
      b.classList.toggle("on", b.dataset.base === name);
    });
    drawMarkers(); // keep markers above the newly added tile layer
  }

  function popupHTML(p, s) {
    var utils = [];
    if (p.house === "yes") utils.push("house");
    if (p.electricity === "yes") utils.push("power");
    if (p.water === "yes") utils.push("water");
    if (p.hasWaterFeature) utils.push("river/spring");
    var utilTxt = utils.length ? utils.join(", ") : "none confirmed";

    return '<div class="pop">' +
      '<h4>' + esc(p.name) + '</h4>' +
      '<div class="ploc">' + esc(p.nearestTown) + ' &middot; ' + esc(p.province) +
        (p.category === "near" ? ' &middot; near match' : '') + '</div>' +
      '<div class="pscore" style="color:' + scoreColor(s) + '">&#11088; ' + s.toFixed(1) + ' / 10 overall</div>' +
      '<div class="pline">&#128176;<b>' + esc(money(p.price)) + '</b></div>' +
      '<div class="pline">&#128208;<b>' + esc(ha(p.areaHa)) + '</b> (' + p.m2.toLocaleString("en-US") + ' m&sup2;)</div>' +
      '<div class="pline">&#128181;<b>' + (p.pricePerHa == null ? "Unknown" : money(p.pricePerHa) + " / ha") + '</b></div>' +
      '<div class="pline">&#127807;Nature <b>' + (p.scores.nature == null ? "—" : p.scores.nature) + '</b>' +
        ' &nbsp;&#128737;Safety <b>' + (p.scores.safety == null ? "—" : p.scores.safety) + '</b>' +
        ' &nbsp;&#128663;Access <b>' + (p.scores.accessibility == null ? "—" : p.scores.accessibility) + '</b></div>' +
      '<div class="pline">&#127968;<b>' + esc(utilTxt) + '</b></div>' +
      '<div class="pline">&#128205;' + esc(p.nearestTown) + '</div>' +
      '<div class="pact">' +
        '<button data-detail="' + esc(p.id) + '">Full detail</button>' +
        '<a href="' + esc(p.source) + '" target="_blank" rel="noopener" title="' +
          esc(SOURCE_KIND[p.sourceKind].tip) + '">&#128279; ' +
          esc(SOURCE_KIND[p.sourceKind].shortLabel) + '</a>' +
      '</div></div>';
  }

  function drawMarkers() {
    markerLayer.clearLayers();
    markers = {};
    ranked().forEach(function (r, i) {
      var p = r.p, s = r.s, col = scoreColor(s);
      var m = L.circleMarker([p.lat, p.lng], {
        radius: 7 + (s / 10) * 8,
        fillColor: col,
        color: p.category === "near" ? "rgba(255,255,255,.45)" : "#ffffff",
        weight: p.category === "near" ? 1 : 1.6,
        dashArray: p.category === "near" ? "2,2" : null,
        opacity: 0.9,
        fillOpacity: state.selected === p.id ? 0.98 : 0.78
      });
      m.bindPopup(popupHTML(p, s), { maxWidth: 300, autoPanPadding: [30, 30] });
      m.on("click", function () { select(p.id, false); });
      m.bindTooltip("#" + (i + 1) + " " + p.name, { direction: "top", offset: [0, -8], opacity: 0.92 });
      m.addTo(markerLayer);
      markers[p.id] = m;
    });
  }

  /* ------------------------------------------------------------ dashboard */

  function renderDashboard(list) {
    var priced = list.filter(function (r) { return r.p.price != null; });
    var prices = priced.map(function (r) { return r.p.price; });
    var pphas = priced.map(function (r) { return r.p.pricePerHa; });

    var bestValue = priced.slice().sort(function (a, b) { return a.p.pricePerHa - b.p.pricePerHa; })[0];
    var bestNature = list.slice().sort(function (a, b) {
      return scoreOf(b.p, "nature") - scoreOf(a.p, "nature");
    })[0];

    function set(id, v, sub) {
      document.querySelector("#" + id + " .v").textContent = v;
      var se = document.querySelector("#" + id + " .s");
      if (se) se.textContent = sub || "";
      if (se) se.title = sub || "";
    }

    var unpriced = list.length - priced.length;
    set("st-count", String(list.length),
        unpriced ? unpriced + " without a published price" : "all with published prices");
    set("st-price", prices.length ? moneyShort(median(prices)) : "—",
        prices.length ? "across " + prices.length + " priced listings" : "no priced listings in view");
    set("st-ppha", pphas.length ? moneyShort(median(pphas)) + "/ha" : "—",
        pphas.length ? "median asking rate" : "no priced listings in view");
    set("st-value", bestValue ? moneyShort(bestValue.p.pricePerHa) + "/ha" : "—",
        bestValue ? bestValue.p.name : "—");
    set("st-nature", bestNature ? (bestNature.p.scores.nature == null ? "—" : bestNature.p.scores.nature + " / 10") : "—",
        bestNature ? bestNature.p.name : "—");
  }

  /* -------------------------------------------------------- ranking panel */

  function cardHTML(p, s, rank) {
    var col = scoreColor(s);
    var unrated = unratedDims(p);
    var metrics = [
      '<span class="m">&#128176; <b>' + esc(money(p.price)) + '</b></span>',
      '<span class="m">&#128208; <b>' + esc(ha(p.areaHa)) + '</b></span>',
      '<span class="m' + (p.pricePerHa == null ? " dim" : "") + '">&#128181; <b>' +
        (p.pricePerHa == null ? "n/a" : moneyShort(p.pricePerHa) + "/ha") + '</b></span>'
    ];
    if (p.house === "yes") metrics.push('<span class="m">&#127968; house</span>');
    if (p.electricity === "yes") metrics.push('<span class="m">&#9889; power</span>');
    if (p.hasWaterFeature) metrics.push('<span class="m">&#127754; water</span>');
    if (unrated.length) metrics.push('<span class="m dim">&#9888; ' + unrated.length + ' unrated</span>');

    function ss(t, k) {
      var v = p.scores[k];
      return '<div class="ss"><div class="t">' + t + '</div><div class="v" style="color:' +
        (v == null ? "#6f8279" : scoreColor(v)) + '">' + (v == null ? "—" : v) + '</div></div>';
    }

    return '<article class="pcard' + (p.category === "near" ? " near" : "") +
      (state.selected === p.id ? " sel" : "") + '" data-id="' + esc(p.id) +
      '" style="--rank-color:' + col + '" tabindex="0">' +
      '<div class="top">' +
        '<div class="rk">#' + rank + '</div>' +
        '<div class="nm"><h3>' + esc(p.name) + '</h3>' +
          '<div class="loc">&#128205; ' + esc(p.nearestTown) + ' &middot; ' + esc(p.province) + '</div></div>' +
        '<div class="ov"><div class="n">' + s.toFixed(1) + '</div><div class="l">score</div></div>' +
      '</div>' +
      '<div class="metrics">' + metrics.join("") + '</div>' +
      '<div class="subscores">' +
        ss("Nature", "nature") + ss("Value", "value") + ss("Safety", "safety") +
        ss("Access", "accessibility") + ss("Utils", "utilities") +
      '</div></article>';
  }

  function renderRanking(list) {
    var wrap = document.getElementById("ranklist");
    document.getElementById("rankcount").textContent =
      list.length + (list.length === 1 ? " property" : " properties");

    if (!list.length) {
      wrap.innerHTML = '<div class="empty">No properties match these filters.<br>' +
        'Loosen a slider or re-enable near matches.</div>';
      return;
    }

    var core = list.filter(function (r) { return r.p.category === "match"; });
    var near = list.filter(function (r) { return r.p.category === "near"; });
    var html = "";
    var n = 0;

    if (core.length) {
      html += '<div class="grouphead">Ranked matches &middot; 2–5 ha</div>';
      core.forEach(function (r) { n++; html += cardHTML(r.p, r.s, n); });
    }
    if (near.length) {
      html += '<div class="grouphead">Near matches &middot; outside 2–5 ha</div>';
      near.forEach(function (r) { n++; html += cardHTML(r.p, r.s, n); });
    }
    wrap.innerHTML = html;
  }

  /* -------------------------------------------------------- detail drawer */

  function flagFor(text) {
    if (/^unknown/i.test(text || "")) return '<span class="flag u">unknown</span>';
    if (/ASSUMED/.test(text || "")) return '<span class="flag a">assumed</span>';
    if (/verified/i.test(text || "")) return '<span class="flag v">verified</span>';
    return "";
  }

  function bar(label, key, p) {
    var v = p.scores[key];
    var shown = v == null ? NEUTRAL : v;
    var note = p.scoreNotes && p.scoreNotes[key] ? p.scoreNotes[key] : "";
    return '<div class="bar"><div class="bn">' + label + '</div>' +
      '<div class="bt"><div class="bf" style="width:' + (shown * 10) + '%;background:' +
      (v == null ? "#3a4a44" : scoreColor(v)) + '"></div></div>' +
      '<div class="bv">' + (v == null ? "n/r" : v) + '</div></div>' +
      (note ? '<div class="barnote">' + esc(note) + '</div>' : "");
  }

  function renderDetail(p) {
    var s = overall(p);
    var unrated = unratedDims(p);
    var el = document.getElementById("detail");

    var riskHTML = "";
    if (p.scores.safety != null && p.scores.safety <= 5) {
      riskHTML += '<div class="callout risk"><b>Elevated area risk.</b> ' +
        esc(p.scoreNotes.safety) + '</div>';
    }
    if (/CAVEAT/.test(p.surroundings || "")) {
      riskHTML += '<div class="callout risk"><b>Local caveat.</b> ' +
        esc(p.surroundings.split(/IMPORTANT CAVEAT[^:]*:\s*/)[1] || p.surroundings) + '</div>';
    }

    el.innerHTML =
      '<div class="dhead"><div class="row1">' +
        '<div style="flex:1"><h2>' + esc(p.name) + '</h2>' +
        '<div class="loc">&#128205; ' + esc(p.nearestTown) + ' &middot; ' + esc(p.province) +
        ' &middot; <span style="color:' + scoreColor(s) + '">&#11088; ' + s.toFixed(1) + ' / 10</span>' +
        (p.category === "near" ? ' &middot; near match' : '') + '</div></div>' +
        '<button class="xbtn" id="detclose" aria-label="Close">&times;</button>' +
      '</div></div>' +

      '<div class="dbody">' +

      (unrated.length
        ? '<div class="callout"><b>' + unrated.length + ' dimension' + (unrated.length > 1 ? "s" : "") +
          ' unrated:</b> ' + unrated.map(function (k) { return WEIGHT_LABELS[k].toLowerCase(); }).join(", ") +
          '. The listing did not publish enough to score ' + (unrated.length > 1 ? "these" : "this") +
          ', so a neutral 5 stands in for the overall figure rather than a guess.</div>'
        : "") +

      riskHTML +

      '<div class="dsec"><h3>Listing</h3><p>' + esc(p.description) + '</p>' +
        '<a class="srcbtn" href="' + esc(p.source) + '" target="_blank" rel="noopener">&#128279; ' +
        esc(SOURCE_KIND[p.sourceKind].label) + ': ' + esc(p.sourceName) + '</a>' +
        '<div class="srcnote">' +
          esc(p.sourceNote || SOURCE_KIND[p.sourceKind].tip) + '</div></div>' +

      '<div class="dsec"><h3>Key figures</h3><dl class="dl">' +
        '<dt>Asking price</dt><dd' + (p.price == null ? ' class="unk"' : "") + '>' + esc(money(p.price)) + '</dd>' +
        '<dt>Area</dt><dd>' + esc(ha(p.areaHa)) + ' &middot; ' + p.m2.toLocaleString("en-US") + ' m&sup2;</dd>' +
        '<dt>Price per ha</dt><dd' + (p.pricePerHa == null ? ' class="unk"' : "") + '>' +
          (p.pricePerHa == null ? "Unknown" : money(p.pricePerHa)) + '</dd>' +
        '<dt>Province</dt><dd>' + esc(p.province) + '</dd>' +
        '<dt>Nearest town</dt><dd>' + esc(p.nearestTown) + '</dd>' +
        '<dt>Coordinates</dt><dd>' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4) +
          '<span class="flag a">approximate</span><br><span style="color:var(--text-3);font-size:11.5px">' +
          esc(p.coordPrecision) + '</span></dd>' +
      '</dl></div>' +

      '<div class="dsec"><h3>Access &amp; utilities</h3><dl class="dl">' +
        '<dt>Road / access</dt><dd>' + esc(p.access) + '</dd>' +
        '<dt>4&times;4 needed</dt><dd>' + esc(p.fourByFour) + '</dd>' +
        '<dt>Electricity</dt><dd>' + ynuLabel(p.electricity) + '<br>' +
          '<span style="color:var(--text-3);font-size:11.5px">' + esc(p.electricityNote) + '</span></dd>' +
        '<dt>Water</dt><dd>' + ynuLabel(p.water) + '<br>' +
          '<span style="color:var(--text-3);font-size:11.5px">' + esc(p.waterNote) + '</span></dd>' +
        '<dt>Buildings</dt><dd>' + ynuLabel(p.house) + '<br>' +
          '<span style="color:var(--text-3);font-size:11.5px">' + esc(p.houseNote) + '</span></dd>' +
      '</dl></div>' +

      '<div class="dsec"><h3>Land &amp; water</h3><dl class="dl">' +
        '<dt>Plantings</dt><dd>' + esc(p.plantings) + ' ' + flagFor(p.plantings) + '</dd>' +
        '<dt>Forest</dt><dd>' + esc(p.forest) + ' ' + flagFor(p.forest) + '</dd>' +
        '<dt>Water feature</dt><dd>' + esc(p.waterFeature) + ' ' + flagFor(p.waterFeature) + '</dd>' +
      '</dl></div>' +

      '<div class="dsec"><h3>Distances</h3><dl class="dl">' +
        '<dt>Nearest town</dt><dd>' + esc(p.distTown) + '</dd>' +
        '<dt>City / airport</dt><dd>' + esc(p.distCity) + '</dd>' +
      '</dl></div>' +

      '<div class="dsec"><h3>Surroundings assessment</h3><p>' + esc(p.surroundings) + '</p>' +
        '<div style="font-size:11px;color:var(--text-3)">' +
        '<span class="flag v">verified</span> stated by the listing or a cited source. ' +
        '<span class="flag a">assumed</span> inferred from the region, not confirmed for this parcel.' +
        '</div></div>' +

      '<div class="dsec"><h3>Score breakdown</h3>' +
        bar("Nature &amp; privacy", "nature", p) +
        bar("Price / value", "value", p) +
        bar("Safety", "safety", p) +
        bar("Accessibility", "accessibility", p) +
        bar("Utilities", "utilities", p) +
        '<div style="margin-top:10px;font-size:11.5px;color:var(--text-3)">Overall <b style="color:' +
        scoreColor(s) + '">' + s.toFixed(2) + '</b> at your current weights (' +
        Object.keys(state.weights).map(function (k) {
          return WEIGHT_LABELS[k].toLowerCase() + " " + normWeight(k) + "%";
        }).join(", ") + ').</div>' +
      '</div>' +

      '</div>';

    document.getElementById("detclose").onclick = closeDetail;
    el.classList.add("open");
    el.scrollTop = 0;
  }

  function closeDetail() {
    document.getElementById("detail").classList.remove("open");
  }

  function normWeight(k) {
    var total = Object.keys(state.weights).reduce(function (a, x) { return a + state.weights[x]; }, 0);
    return total ? Math.round((state.weights[k] / total) * 100) : 0;
  }

  /* --------------------------------------------------------------- select */

  function select(id, fly) {
    state.selected = id;
    var p = DATA.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    renderRanking(ranked());
    drawMarkers();
    renderDetail(p);
    if (markers[id]) {
      if (fly) map.flyTo([p.lat, p.lng], 14, { duration: 0.85 });
      markers[id].openPopup();
    }
    var card = document.querySelector('.pcard[data-id="' + id + '"]');
    if (card && fly !== "nocard") card.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  /* --------------------------------------------------------------- render */

  function render() {
    var list = ranked();
    renderDashboard(list);
    renderRanking(list);
    drawMarkers();
  }

  /* ---------------------------------------------------------------- build */

  function buildWeights() {
    var wrap = document.getElementById("weights");
    wrap.innerHTML = Object.keys(DEFAULT_WEIGHTS).map(function (k) {
      return '<div class="weightrow"><div class="lab"><span>' + WEIGHT_LABELS[k] +
        '</span><b id="wv-' + k + '">' + state.weights[k] + '%</b></div>' +
        '<input type="range" min="0" max="60" step="1" value="' + state.weights[k] +
        '" data-weight="' + k + '"></div>';
    }).join("") + '<div class="wsum" id="wsum"></div>';

    wrap.addEventListener("input", function (e) {
      var k = e.target.dataset.weight;
      if (!k) return;
      state.weights[k] = +e.target.value;
      syncWeights();
      render();
      if (state.selected) {
        var p = DATA.filter(function (x) { return x.id === state.selected; })[0];
        if (p && document.getElementById("detail").classList.contains("open")) renderDetail(p);
      }
    });
    syncWeights();
  }

  function syncWeights() {
    var total = 0;
    Object.keys(state.weights).forEach(function (k) { total += state.weights[k]; });
    Object.keys(state.weights).forEach(function (k) {
      document.getElementById("wv-" + k).textContent = normWeight(k) + "%";
    });
    var el = document.getElementById("wsum");
    el.className = "wsum" + (total === 100 ? "" : " warn");
    el.textContent = total === 100
      ? "Weights total 100%."
      : "Raw weights total " + total + "%. Percentages shown are normalised, so the ranking stays valid.";
  }

  function bindRange(id, key, fmt) {
    var el = document.getElementById(id);
    var out = document.getElementById(id + "-v");
    function upd() {
      state.filters[key] = +el.value;
      out.textContent = fmt(+el.value);
      render();
    }
    el.addEventListener("input", upd);
    out.textContent = fmt(+el.value);
  }

  function bindSeg(id, key) {
    var box = document.getElementById(id);
    box.addEventListener("click", function (e) {
      if (e.target.tagName !== "BUTTON") return;
      state.filters[key] = e.target.dataset.v;
      Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) {
        b.classList.toggle("on", b.dataset.v === e.target.dataset.v);
      });
      render();
    });
  }

  function buildProvinces() {
    var provs = [];
    DATA.forEach(function (p) { if (provs.indexOf(p.province) === -1) provs.push(p.province); });
    provs.sort();
    var box = document.getElementById("provinces");
    box.innerHTML = provs.map(function (pv) {
      return '<button class="chip" data-prov="' + esc(pv) + '">' + esc(pv) + '</button>';
    }).join("");
    box.addEventListener("click", function (e) {
      var pv = e.target.dataset.prov;
      if (!pv) return;
      var i = state.filters.provinces.indexOf(pv);
      if (i === -1) state.filters.provinces.push(pv); else state.filters.provinces.splice(i, 1);
      e.target.classList.toggle("on");
      render();
    });
  }

  function resetFilters() {
    state.filters = {
      priceMin: 0, priceMax: 600000, areaMin: 0.5, areaMax: 10, pphaMax: 250000,
      minOverall: 0, minNature: 0, minSafety: 0, minAccess: 0,
      house: "any", electricity: "any", water: "any", waterFeature: "any",
      provinces: [], includeUnpriced: true, includeNear: true
    };
    [["f-priceMin", 0], ["f-priceMax", 600000], ["f-areaMin", 0.5], ["f-areaMax", 10],
     ["f-pphaMax", 250000], ["f-minOverall", 0], ["f-minNature", 0], ["f-minSafety", 0],
     ["f-minAccess", 0]].forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      el.value = pair[1];
      el.dispatchEvent(new Event("input"));
    });
    ["s-house", "s-elec", "s-water", "s-wf"].forEach(function (id) {
      var box = document.getElementById(id);
      Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) {
        b.classList.toggle("on", b.dataset.v === "any");
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#provinces .chip"), function (c) {
      c.classList.remove("on");
    });
    document.getElementById("c-unpriced").checked = true;
    document.getElementById("c-near").checked = true;
    render();
  }

  /* ----------------------------------------------------------------- boot */

  function boot() {
    initMap();
    buildWeights();
    buildProvinces();

    bindRange("f-priceMin", "priceMin", function (v) { return moneyShort(v); });
    bindRange("f-priceMax", "priceMax", function (v) { return v >= 600000 ? "$600k+" : moneyShort(v); });
    bindRange("f-areaMin", "areaMin", function (v) { return v + " ha"; });
    bindRange("f-areaMax", "areaMax", function (v) { return v >= 10 ? "10 ha+" : v + " ha"; });
    bindRange("f-pphaMax", "pphaMax", function (v) { return v >= 250000 ? "no cap" : moneyShort(v) + "/ha"; });
    bindRange("f-minOverall", "minOverall", function (v) { return v + " +"; });
    bindRange("f-minNature", "minNature", function (v) { return v + " +"; });
    bindRange("f-minSafety", "minSafety", function (v) { return v + " +"; });
    bindRange("f-minAccess", "minAccess", function (v) { return v + " +"; });

    bindSeg("s-house", "house");
    bindSeg("s-elec", "electricity");
    bindSeg("s-water", "water");
    bindSeg("s-wf", "waterFeature");

    document.getElementById("c-unpriced").addEventListener("change", function (e) {
      state.filters.includeUnpriced = e.target.checked; render();
    });
    document.getElementById("c-near").addEventListener("change", function (e) {
      state.filters.includeNear = e.target.checked; render();
    });
    document.getElementById("resetFilters").addEventListener("click", resetFilters);
    document.getElementById("resetWeights").addEventListener("click", function () {
      state.weights = Object.assign({}, DEFAULT_WEIGHTS);
      Object.keys(state.weights).forEach(function (k) {
        document.querySelector('[data-weight="' + k + '"]').value = state.weights[k];
      });
      syncWeights(); render();
    });

    document.getElementById("ranklist").addEventListener("click", function (e) {
      var card = e.target.closest(".pcard");
      if (card) select(card.dataset.id, true);
    });
    document.getElementById("ranklist").addEventListener("keydown", function (e) {
      var card = e.target.closest(".pcard");
      if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(card.dataset.id, true); }
    });

    document.addEventListener("click", function (e) {
      var id = e.target.dataset && e.target.dataset.detail;
      if (id) select(id, false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDetail();
    });

    Array.prototype.forEach.call(document.querySelectorAll(".layerbox button"), function (b) {
      b.addEventListener("click", function () { setBasemap(b.dataset.base); });
    });

    render();
    var fit = ranked().map(function (r) { return [r.p.lat, r.p.lng]; });
    if (fit.length) map.fitBounds(L.latLngBounds(fit).pad(0.18));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
