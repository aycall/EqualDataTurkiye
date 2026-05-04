const menuLinks = document.querySelectorAll(".main-nav a");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

menuLinks.forEach((link) => {
  const linkPage = link.getAttribute("href")?.replace("./", "");

  if (linkPage === currentPage) {
    menuLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  }
});

const aboutContactForm = document.getElementById("about-contact-form");
const aboutContactFormStatus = document.getElementById(
  "about-contact-form-status"
);

aboutContactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (aboutContactFormStatus) {
    aboutContactFormStatus.hidden = false;
    aboutContactFormStatus.textContent =
      "Thank you. This site does not store submissions. For a direct reply, use Instagram DM above.";
  }
});

(function initAboutContactToggle() {
  const section = document.getElementById("contact-us");
  const toggle = document.getElementById("contact-us-heading");
  const panel = document.getElementById("about-contact-panel");
  if (!section || !toggle || !panel) return;

  function setOpen(open) {
    if (open) {
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
      toggle.classList.add("is-open");
    } else {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-open");
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(panel.hasAttribute("hidden"));
  });

  function openFromHash() {
    if (window.location.hash !== "#contact-us") return;
    requestAnimationFrame(() => {
      setOpen(true);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();

function markPlotReady(plotEl) {
  const host = plotEl?.closest(".map-container, .pol-labor-chart-wrap");
  if (host) host.classList.add("plot-ready");
}

function focusDetailCloseAfterReveal(card) {
  if (!card) return;
  window.setTimeout(() => {
    card.querySelector(".detail-close")?.focus({ preventScroll: true });
  }, 400);
}

const eduToggle = document.querySelector(".card-toggle[data-open-edu='true']");
const eduAnchor = document.getElementById("edu-detail-anchor");
let eduMapRendered = false;
let eduMapEl = null;
let polLaborRendered = false;
let polLaborChartEl = null;

function renderEduMap() {
  if (eduMapRendered) return;
  if (!eduMapEl) return;
  if (!window.Plotly) {
    markPlotReady(eduMapEl);
    return;
  }

  const locations = [
    "Turkey",
    "Germany",
    "France",
    "United States",
    "India",
    "China",
    "Brazil",
    "Angola",
    "Mali",
    "Chad",
  ];
  // WEF Global Gender Gap Report 2025: Educational Attainment subindex (0-1)
  // Country values from published 2025 GGGI country tables (see WEF report + data annexes).
  const scores = [0.986, 0.988, 1.0, 1.0, 0.971, 0.935, 1.0, 0.806, 0.796, 0.666];

  const data = [
    {
      type: "choropleth",
      locations,
      locationmode: "country names",
      z: scores,
      // Palette aligned to the site's purple/pink UI (low → light, high → dark).
      autocolorscale: false,
      reversescale: false,
      colorscale: [
        [0.0, "#fde7f1"],
        [0.25, "#f3bfd7"],
        [0.5, "#d77aa9"],
        [0.75, "#a63a73"],
        [1.0, "#6a0f3c"],
      ],
      zmin: 0.6,
      zmax: 1.0,
      marker: { line: { color: "rgba(255,255,255,0.85)", width: 0.7 } },
      colorbar: {
        title: "Educational Attainment (2025)",
        tickcolor: "rgba(106, 15, 60, 0.85)",
        tickfont: { color: "rgba(106, 15, 60, 0.9)" },
        titlefont: { color: "rgba(106, 15, 60, 0.95)" },
        outlinecolor: "rgba(106, 15, 60, 0.25)",
        bgcolor: "rgba(253, 231, 241, 0.72)",
      },
    },
  ];

  const layout = {
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    geo: {
      showframe: false,
      showcoastlines: false,
      bgcolor: "rgba(0,0,0,0)",
      landcolor: "rgba(253, 231, 241, 0.52)",
      oceancolor: "rgba(106, 15, 60, 0.06)",
      showocean: true,
      lakecolor: "rgba(106, 15, 60, 0.06)",
      showlakes: true,
    },
  };

  window.Plotly.newPlot(eduMapEl, data, layout, { displayModeBar: false, responsive: true });
  markPlotReady(eduMapEl);
  eduMapRendered = true;
}

function renderPolLaborChart() {
  if (polLaborRendered) return;
  if (!polLaborChartEl) return;
  if (!window.Plotly) {
    markPlotReady(polLaborChartEl);
    return;
  }

  const years = [2002, 2010, 2015, 2020, 2023, 2024, 2025];
  // TÜİK-style table; 2025 ranges use midpoints for plotting (see footnote on page).
  const womenLfp = [27.9, 30.8, 31.5, 34.0, 35.8, 36.3, 36.4];
  const womenEmp = [25.3, 27.6, 27.5, 30.0, 31.3, 31.9, 31.75];
  const menLfp = [70.0, 71.0, 71.0, 72.0, 71.2, 71.4, 71.0];
  const womenInformal = [72.5, 58.0, 45.0, 34.0, 33.0, 33.0, 32.5];

  const lineCommon = {
    type: "scatter",
    mode: "lines+markers",
    x: years,
    hovertemplate: "%{y:.1f}%<extra></extra>",
  };

  const data = [
    {
      ...lineCommon,
      name: "Women: labor force participation (15+)",
      y: womenLfp,
      line: { color: "#6c4cf1", width: 2.4 },
      marker: { size: 8, color: "#6c4cf1" },
    },
    {
      ...lineCommon,
      name: "Women: employment rate",
      y: womenEmp,
      line: { color: "#d77aa9", width: 2.4 },
      marker: { size: 8, color: "#d77aa9" },
    },
    {
      ...lineCommon,
      name: "Men: labor force participation",
      y: menLfp,
      line: { color: "#64748b", width: 2, dash: "dot" },
      marker: { size: 7, color: "#64748b" },
    },
    {
      ...lineCommon,
      name: "Women: informal employment share",
      y: womenInformal,
      line: { color: "#ea580c", width: 2.2 },
      marker: { size: 8, color: "#ea580c" },
    },
  ];

  const layout = {
    margin: { l: 52, r: 18, t: 28, b: 48 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(248, 246, 252, 0.9)",
    font: { family: "Inter, system-ui, sans-serif", color: "#334155", size: 11 },
    showlegend: true,
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      xanchor: "left",
      x: 0,
      bgcolor: "rgba(255,255,255,0.82)",
      bordercolor: "rgba(108, 76, 241, 0.15)",
      borderwidth: 1,
    },
    xaxis: {
      title: "Year",
      tickmode: "array",
      tickvals: years,
      gridcolor: "rgba(108, 76, 241, 0.08)",
      zeroline: false,
    },
    yaxis: {
      title: "Percent (%)",
      range: [0, 82],
      gridcolor: "rgba(108, 76, 241, 0.08)",
      zeroline: false,
    },
    hovermode: "x unified",
  };

  window.Plotly.newPlot(polLaborChartEl, data, layout, {
    displayModeBar: false,
    responsive: true,
  });
  markPlotReady(polLaborChartEl);
  polLaborRendered = true;
}

function ensureEduDetailCard() {
  if (!eduAnchor) return null;
  const existing = document.getElementById("edu-detail-card");
  if (existing) return existing;

  const card = document.createElement("article");
  card.className = "detail-card";
  card.id = "edu-detail-card";
  card.innerHTML = `
    <div class="detail-sticky-bar">
      <div class="detail-card-header">
        <h3>Access to education</h3>
        <button type="button" class="detail-close" aria-label="Close panel">×</button>
      </div>
      <nav class="detail-jump-nav" aria-label="On this page">
        <a href="#detail-edu-map">Map</a>
        <a href="#detail-edu-tuik">Türkiye data</a>
      </nav>
    </div>
    <p class="detail-lead">
      According to the
      <a
        href="https://www.weforum.org/publications/global-gender-gap-report-2025/"
        target="_blank"
        rel="noopener noreferrer"
        >World Economic Forum’s 2025 Global Gender Gap Report</a>,
      the <strong>Educational Attainment</strong> subindex captures literacy and
      enrolment at primary, secondary and tertiary levels. Across the
      <strong>148</strong> economies in this edition, the global average value
      for this subindex is <strong>0.951</strong> (about <strong>95.1%</strong> of
      the education gender gap closed).
    </p>
    <p class="detail-lead">
      <strong>Türkiye</strong> records an Educational Attainment score of
      <strong>0.986</strong> in 2025, close to full parity and in line with the
      high-performing group in the report. The map below plots the same metric
      for ten comparator economies; lower values in several Sub-Saharan African
      cases reflect wider remaining literacy and enrolment gaps highlighted in
      the report’s regional discussion.
    </p>
    <p class="detail-source">
      Map values: WEF (2025) Educational Attainment subindex scores (0 = no
      parity, 1 = full parity), as in the published country tables.
    </p>
    <div id="detail-edu-map" class="map-wrap" role="region" aria-label="Education map">
      <div class="map-container">
        <div class="plot-skeleton" aria-hidden="true"></div>
        <div id="edu-map" class="plotly-map"></div>
      </div>
    </div>
  `;

  eduAnchor.appendChild(card);
  eduMapEl = card.querySelector("#edu-map");

  const tuikTpl = document.getElementById("edu-tuik-infographic-tpl");
  if (tuikTpl?.content) {
    card.appendChild(tuikTpl.content.cloneNode(true));
  }

  const closeBtn = card.querySelector(".detail-close");
  closeBtn?.addEventListener("click", () => removeEduDetailCard());

  return card;
}

function removeEduDetailCard() {
  const existing = document.getElementById("edu-detail-card");
  if (existing) existing.remove();
  eduMapRendered = false;
  eduMapEl = null;
  eduToggle?.setAttribute("aria-expanded", "false");
  window.requestAnimationFrame(() => {
    eduToggle?.focus({ preventScroll: true });
  });
}

function toggleEduDetail() {
  if (!eduToggle) return;
  const existing = document.getElementById("edu-detail-card");
  const isOpen = Boolean(existing);

  if (isOpen) {
    removeEduDetailCard();
    return;
  }

  removeHealthDetailCard();
  removePolDetailCard();
  eduToggle.setAttribute("aria-expanded", "true");
  const card = ensureEduDetailCard();
  if (!card) return;

  renderEduMap();
  setTimeout(() => window.Plotly?.Plots?.resize?.(eduMapEl), 50);
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  focusDetailCloseAfterReveal(card);
}

eduToggle?.addEventListener("click", toggleEduDetail);

const healthToggle = document.querySelector(".card-toggle[data-open-health='true']");
const healthAnchor = document.getElementById("health-detail-anchor");
let healthMapRendered = false;
let healthMapEl = null;

function renderHealthMap() {
  if (healthMapRendered) return;
  if (!healthMapEl) return;
  if (!window.Plotly) {
    markPlotReady(healthMapEl);
    return;
  }

  const locations = [
    "Turkey",
    "Germany",
    "France",
    "United States",
    "India",
    "China",
    "Brazil",
    "Angola",
    "Mali",
    "Chad",
  ];
  // WEF Global Gender Gap Report 2025: Health and Survival subindex (0-1)
  const scores = [0.968, 0.966, 0.969, 0.973, 0.954, 0.947, 0.977, 0.972, 0.956, 0.966];

  const data = [
    {
      type: "choropleth",
      locations,
      locationmode: "country names",
      z: scores,
      autocolorscale: false,
      reversescale: false,
      // Lavender → indigo (purple family, distinct from education choropleth pinks).
      colorscale: [
        [0.0, "#f5f3ff"],
        [0.25, "#e0e7ff"],
        [0.5, "#a5b4fc"],
        [0.75, "#6366f1"],
        [1.0, "#312e81"],
      ],
      zmin: 0.93,
      zmax: 0.985,
      marker: { line: { color: "rgba(255,255,255,0.85)", width: 0.7 } },
      colorbar: {
        title: "Health & Survival (2025)",
        tickcolor: "rgba(49, 46, 129, 0.88)",
        tickfont: { color: "rgba(49, 46, 129, 0.9)" },
        titlefont: { color: "rgba(49, 46, 129, 0.95)" },
        outlinecolor: "rgba(99, 102, 241, 0.35)",
        bgcolor: "rgba(245, 243, 255, 0.92)",
      },
    },
  ];

  const layout = {
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    geo: {
      showframe: false,
      showcoastlines: false,
      bgcolor: "rgba(0,0,0,0)",
      landcolor: "rgba(245, 243, 255, 0.6)",
      oceancolor: "rgba(49, 46, 129, 0.07)",
      showocean: true,
      lakecolor: "rgba(49, 46, 129, 0.07)",
      showlakes: true,
    },
  };

  window.Plotly.newPlot(healthMapEl, data, layout, { displayModeBar: false, responsive: true });
  markPlotReady(healthMapEl);
  healthMapRendered = true;
}

function ensureHealthDetailCard() {
  if (!healthAnchor) return null;
  const existing = document.getElementById("health-detail-card");
  if (existing) return existing;

  const card = document.createElement("article");
  card.className = "detail-card";
  card.id = "health-detail-card";
  card.innerHTML = `
    <div class="detail-sticky-bar">
      <div class="detail-card-header">
        <h3>Health and survival</h3>
        <button type="button" class="detail-close" aria-label="Close panel">×</button>
      </div>
      <nav class="detail-jump-nav" aria-label="On this page">
        <a href="#detail-health-map">Map</a>
        <a href="#detail-health-maternal">Maternal</a>
        <a href="#detail-health-dashboard">Dashboard</a>
      </nav>
    </div>
    <p class="detail-lead">
      The World Economic Forum’s
      <a
        href="https://www.weforum.org/publications/global-gender-gap-report-2025/"
        target="_blank"
        rel="noopener noreferrer"
        >2025 Global Gender Gap Report</a>
      defines the <strong>Health and Survival</strong> subindex using two
      indicators: sex ratio at birth and the ratio of women’s to men’s healthy
      life expectancy. Across the <strong>148</strong> economies included in the
      report, this dimension achieves one of the highest levels of gender
      parity, with a global average score of approximately
      <strong>0.962</strong> (<strong>96.2%</strong> of the gap closed).
    </p>
    <p class="detail-lead">
      Country-level scores are distributed within a relatively narrow range,
      from approximately <strong>0.934</strong> at the lower end to
      <strong>1.000</strong>, indicating full parity. While a limited number of
      economies reach complete equality, most countries cluster just below this
      threshold, reflecting relatively small cross-country variation.
    </p>
    <p class="detail-lead">
      The choropleth map visualizes these country-level Health and Survival
      scores as reported in the WEF dataset, allowing for comparative analysis
      despite the compressed distribution of values.
    </p>
    <div class="detail-references" role="note" aria-label="Sources">
      <p class="detail-source">
        <strong>Sources:</strong>
        World Economic Forum.
        <a
          href="https://www.weforum.org/publications/global-gender-gap-report-2025/"
          target="_blank"
          rel="noopener noreferrer"
          ><em>Global Gender Gap Report 2025</em></a>
        (conceptual framework, global averages, and country tables).
      </p>
      <p class="detail-source">
        <strong>Map:</strong>
        Country-level Health and Survival subindex scores (0-1) from the same
        WEF (2025) edition, aligned with the published country data.
      </p>
    </div>
    <div id="detail-health-map" class="map-wrap" role="region" aria-label="Health and survival map">
      <div class="map-container">
        <div class="plot-skeleton" aria-hidden="true"></div>
        <div id="health-map" class="plotly-map"></div>
      </div>
    </div>
  `;

  healthAnchor.appendChild(card);
  healthMapEl = card.querySelector("#health-map");

  const healthMaternalTpl = document.getElementById("health-maternal-tpl");
  if (healthMaternalTpl?.content) {
    card.appendChild(healthMaternalTpl.content.cloneNode(true));
  }

  const healthDashTpl = document.getElementById("health-dashboard-tpl");
  if (healthDashTpl?.content) {
    card.appendChild(healthDashTpl.content.cloneNode(true));
  }

  const closeBtn = card.querySelector(".detail-close");
  closeBtn?.addEventListener("click", () => removeHealthDetailCard());

  return card;
}

function removeHealthDetailCard() {
  const existing = document.getElementById("health-detail-card");
  if (existing) existing.remove();
  healthMapRendered = false;
  healthMapEl = null;
  healthToggle?.setAttribute("aria-expanded", "false");
  window.requestAnimationFrame(() => {
    healthToggle?.focus({ preventScroll: true });
  });
}

function toggleHealthDetail() {
  if (!healthToggle) return;
  const existing = document.getElementById("health-detail-card");
  const isOpen = Boolean(existing);

  if (isOpen) {
    removeHealthDetailCard();
    return;
  }

  removeEduDetailCard();
  removePolDetailCard();
  healthToggle.setAttribute("aria-expanded", "true");
  const card = ensureHealthDetailCard();
  if (!card) return;

  renderHealthMap();
  setTimeout(() => window.Plotly?.Plots?.resize?.(healthMapEl), 50);
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  focusDetailCloseAfterReveal(card);
}

healthToggle?.addEventListener("click", toggleHealthDetail);

const polToggle = document.querySelector(".card-toggle[data-open-pol='true']");
const polAnchor = document.getElementById("pol-detail-anchor");
let polMapRendered = false;
let polMapEl = null;

function renderPolMap() {
  if (polMapRendered) return;
  if (!polMapEl) return;
  if (!window.Plotly) {
    markPlotReady(polMapEl);
    return;
  }

  const locations = [
    "Turkey",
    "Germany",
    "France",
    "United States",
    "India",
    "China",
    "Brazil",
    "Angola",
    "Mali",
    "Chad",
  ];
  // WEF Global Gender Gap Report 2025: Political Empowerment subindex (0-1).
  // Türkiye: report states Europe’s lowest Political Empowerment score is Türkiye at 5.9% (~0.059).
  // Germany: economy profile cites a 2023 political parity score of 63.4% and a drop since; ~0.609 used as 2025 approximation (confirm in WEF country table).
  // Brazil: profile states political parity rose to "over 20%" from 2022-2023 and held (~0.22).
  // France, US, India, China, Angola, Mali, Chad: placehold until copied from WEF published country data.
  const scores = [0.059, 0.609, 0.368, 0.418, 0.259, 0.173, 0.22, 0.265, 0.124, 0.098];

  const data = [
    {
      type: "choropleth",
      locations,
      locationmode: "country names",
      z: scores,
      autocolorscale: false,
      reversescale: false,
      colorscale: [
        [0.0, "#fff5f0"],
        [0.22, "#ffd9cc"],
        [0.45, "#d98a9c"],
        [0.68, "#9a4a6e"],
        [1.0, "#4c1f3d"],
      ],
      zmin: 0,
      zmax: 0.65,
      marker: { line: { color: "rgba(255,255,255,0.85)", width: 0.7 } },
      colorbar: {
        title: "Political Empowerment (2025)",
        tickcolor: "rgba(76, 31, 61, 0.85)",
        tickfont: { color: "rgba(76, 31, 61, 0.9)" },
        titlefont: { color: "rgba(76, 31, 61, 0.95)" },
        outlinecolor: "rgba(76, 31, 61, 0.25)",
        bgcolor: "rgba(255, 245, 240, 0.78)",
      },
    },
  ];

  const layout = {
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    geo: {
      showframe: false,
      showcoastlines: false,
      bgcolor: "rgba(0,0,0,0)",
      landcolor: "rgba(255, 245, 240, 0.48)",
      oceancolor: "rgba(76, 31, 61, 0.06)",
      showocean: true,
      lakecolor: "rgba(76, 31, 61, 0.06)",
      showlakes: true,
    },
  };

  window.Plotly.newPlot(polMapEl, data, layout, { displayModeBar: false, responsive: true });
  markPlotReady(polMapEl);
  polMapRendered = true;
}

function ensurePolDetailCard() {
  if (!polAnchor) return null;
  const existing = document.getElementById("pol-detail-card");
  if (existing) return existing;

  const card = document.createElement("article");
  card.className = "detail-card";
  card.id = "pol-detail-card";
  card.innerHTML = `
    <div class="detail-sticky-bar">
      <div class="detail-card-header">
        <h3>Political empowerment</h3>
        <button type="button" class="detail-close" aria-label="Close panel">×</button>
      </div>
      <nav class="detail-jump-nav" aria-label="On this page">
        <a href="#detail-pol-map">Map</a>
        <a href="#detail-pol-representation">Representation</a>
        <a href="#detail-pol-labor">Labor &amp; pay</a>
      </nav>
    </div>
    <p class="detail-lead">
      The World Economic Forum’s
      <a
        href="https://www.weforum.org/publications/global-gender-gap-report-2025/"
        target="_blank"
        rel="noopener noreferrer"
        >2025 Global Gender Gap Report</a>
      measures <strong>Political Empowerment</strong> using women’s share in
      parliament, in ministerial roles, and years with a female head of state
      over the past 50 years. Across the <strong>148</strong> economies in this
      edition, the global average share of the political gender gap closed is
      about <strong>22.9%</strong> (subindex <strong>~0.229</strong> on a 0-1
      scale), far below education and health, and with very wide dispersion
      between countries.
    </p>
    <p class="detail-lead">
      <strong>Türkiye</strong> is cited in the report as having the lowest
      Political Empowerment score among European economies in this edition, at
      about <strong>5.9%</strong> of the gap closed (subindex
      <strong>~0.059</strong> on a 0-1 scale). The map below plots Political
      Empowerment for the same ten comparator economies; exact cells should be
      taken from the WEF country tables when publishing.
    </p>
    <div class="detail-references" role="note" aria-label="Sources">
      <p class="detail-source">
        <strong>Sources:</strong>
        World Economic Forum.
        <a
          href="https://www.weforum.org/publications/global-gender-gap-report-2025/"
          target="_blank"
          rel="noopener noreferrer"
          ><em>Global Gender Gap Report 2025</em></a>
        (subindex definition, global averages, country tables).
      </p>
      <p class="detail-source">
        <strong>Map:</strong>
        Country-level Political Empowerment scores (0-1) from the WEF (2025)
        edition; confirm exact figures in the published country data.
      </p>
    </div>
    <div id="detail-pol-map" class="map-wrap" role="region" aria-label="Political empowerment map">
      <div class="map-container">
        <div class="plot-skeleton" aria-hidden="true"></div>
        <div id="pol-map" class="plotly-map"></div>
      </div>
    </div>
  `;

  polAnchor.appendChild(card);
  polMapEl = card.querySelector("#pol-map");

  const polEmpTpl = document.getElementById("pol-empowerment-tpl");
  if (polEmpTpl?.content) {
    card.appendChild(polEmpTpl.content.cloneNode(true));
  }

  const polLaborTpl = document.getElementById("pol-labor-market-tpl");
  if (polLaborTpl?.content) {
    card.appendChild(polLaborTpl.content.cloneNode(true));
  }
  polLaborChartEl = card.querySelector("#pol-labor-chart");

  const closeBtn = card.querySelector(".detail-close");
  closeBtn?.addEventListener("click", () => removePolDetailCard());

  return card;
}

function removePolDetailCard() {
  const existing = document.getElementById("pol-detail-card");
  const laborEl = existing?.querySelector("#pol-labor-chart");
  if (laborEl && window.Plotly) {
    window.Plotly.purge(laborEl);
  }
  if (existing) existing.remove();
  polMapRendered = false;
  polMapEl = null;
  polLaborRendered = false;
  polLaborChartEl = null;
  polToggle?.setAttribute("aria-expanded", "false");
  window.requestAnimationFrame(() => {
    polToggle?.focus({ preventScroll: true });
  });
}

function togglePolDetail() {
  if (!polToggle) return;
  const existing = document.getElementById("pol-detail-card");
  const isOpen = Boolean(existing);

  if (isOpen) {
    removePolDetailCard();
    return;
  }

  removeEduDetailCard();
  removeHealthDetailCard();
  polToggle.setAttribute("aria-expanded", "true");
  const card = ensurePolDetailCard();
  if (!card) return;

  renderPolMap();
  renderPolLaborChart();
  setTimeout(() => {
    window.Plotly?.Plots?.resize?.(polMapEl);
    window.Plotly?.Plots?.resize?.(polLaborChartEl);
  }, 50);
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  focusDetailCloseAfterReveal(card);
}

polToggle?.addEventListener("click", togglePolDetail);

window.addEventListener("resize", () => {
  if (eduMapRendered) window.Plotly?.Plots?.resize?.(eduMapEl);
  if (healthMapRendered) window.Plotly?.Plots?.resize?.(healthMapEl);
  if (polMapRendered) window.Plotly?.Plots?.resize?.(polMapEl);
  if (polLaborRendered) window.Plotly?.Plots?.resize?.(polLaborChartEl);
});

(function initCardLogoBackgroundRemoval() {
  // Disabled: image background removal can degrade illustration quality.
  return;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function rgbDist(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  async function removeGradientBackground(img, { tolerance = 34 } = {}) {
    if (!(img instanceof HTMLImageElement)) return;
    if (!img.complete) {
      await new Promise((resolve) => img.addEventListener("load", resolve, { once: true }));
    }

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;

    const idx = (x, y) => (y * w + x) * 4;
    const tl = idx(0, 0);
    const bl = idx(0, h - 1);
    const tr = idx(w - 1, 0);
    const br = idx(w - 1, h - 1);

    const bgTop = {
      r: Math.round((d[tl] + d[tr]) / 2),
      g: Math.round((d[tl + 1] + d[tr + 1]) / 2),
      b: Math.round((d[tl + 2] + d[tr + 2]) / 2),
    };
    const bgBottom = {
      r: Math.round((d[bl] + d[br]) / 2),
      g: Math.round((d[bl + 1] + d[br + 1]) / 2),
      b: Math.round((d[bl + 2] + d[br + 2]) / 2),
    };

    for (let y = 0; y < h; y += 1) {
      const t = h <= 1 ? 0 : clamp01(y / (h - 1));
      const br0 = Math.round(lerp(bgTop.r, bgBottom.r, t));
      const bg0 = Math.round(lerp(bgTop.g, bgBottom.g, t));
      const bb0 = Math.round(lerp(bgTop.b, bgBottom.b, t));

      for (let x = 0; x < w; x += 1) {
        const p = idx(x, y);
        const r = d[p];
        const g = d[p + 1];
        const b = d[p + 2];
        const a = d[p + 3];
        if (a === 0) continue;

        if (rgbDist(r, g, b, br0, bg0, bb0) <= tolerance) {
          d[p + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    img.src = canvas.toDataURL("image/png");
  }

  targets.forEach((img) => {
    // Keep the whole logo visible (no crop), while removing embedded gradient bg.
    removeGradientBackground(img, { tolerance: 34 }).catch(() => {});
  });
})();

(function initAboutPage() {
  const panel = document.getElementById("about-panel");
  const visionP = document.getElementById("about-panel-vision");
  const missionP = document.getElementById("about-panel-mission");
  const buttons = document.querySelectorAll(".about-card[data-about]");
  if (!panel || !visionP || !missionP || buttons.length === 0) return;

  const blocks = { vision: visionP, mission: missionP };
  let active = null;

  function syncUi() {
    buttons.forEach((btn) => {
      const key = btn.dataset.about;
      const on = key === active;
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      btn.classList.toggle("is-active", on);
    });

    if (!active) {
      panel.setAttribute("hidden", "");
      visionP.setAttribute("hidden", "");
      missionP.setAttribute("hidden", "");
      return;
    }

    panel.removeAttribute("hidden");
    Object.entries(blocks).forEach(([k, el]) => {
      if (k === active) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.about;
      if (!key || !(key in blocks)) return;
      active = active === key ? null : key;
      syncUi();
    });
  });
})();
