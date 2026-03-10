import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { scaleSolar, parseConsoKwh, neededKwc as calcNeededKwc } from "@/lib/solarScaling";

interface QuoteData {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  city: string | null;
  housing_type: string | null;
  objectif: string | null;
  roof_type: string | null;
  roof_orientation: string | null;
  roof_surface: string | null;
  annual_consumption: string | null;
  budget: string | null;
  project_type: string | null;
  type_abonnement: string | null;
  puissance_souscrite: string | null;
  adresse_projet: string | null;
  ville_projet: string | null;
  selected_usages: string[] | null;
  created_at: string;
}

interface SolarData {
  yearlyProductionKwh?: number;
  yearlyIrradiationKwhM2?: number;
  optimalInclination?: number;
  co2SavedKg?: number;
  savingsMad?: number;
}

interface PackageInfo {
  name: string;
  power_kwc: number;
  price_ttc: number;
  specs: Record<string, any> | null;
}

/* ── Helpers ─────────────────────────────────────── */

function fmtNum(n: number): string {
  return n.toLocaleString("fr-FR").replace(/\s/g, " ");
}

/** Monthly solar irradiation distribution factors for Morocco (sum ≈ 1.0) */
const SOLAR_MONTHLY_FACTORS = [
  0.065, 0.072, 0.088, 0.092, 0.100, 0.105,
  0.108, 0.104, 0.093, 0.082, 0.050, 0.041,
];

/** Get monthly consumption profile based on usages */
function getMonthlyConsumption(annualKwh: number, usages: string[]): number[] {
  // Base flat distribution
  const base = Array(12).fill(1 / 12);

  const hasClim = usages.some(u => u.includes("Climatisation"));
  const hasChauffage = usages.some(u => u.includes("Chauffage"));
  const hasPiscine = usages.some(u => u.includes("Piscine"));
  const hasChambreFroide = usages.some(u => u.includes("Chambre froide"));

  // Summer peaks (Jun-Sep) for AC & pool
  if (hasClim) {
    [5, 6, 7, 8].forEach(i => base[i] += 0.025);
    [0, 1, 11].forEach(i => base[i] -= 0.015);
  }
  // Winter peaks (Nov-Feb) for heating
  if (hasChauffage) {
    [0, 1, 10, 11].forEach(i => base[i] += 0.02);
    [5, 6, 7].forEach(i => base[i] -= 0.015);
  }
  // Pool in summer
  if (hasPiscine) {
    [4, 5, 6, 7, 8].forEach(i => base[i] += 0.012);
    [0, 1, 10, 11].forEach(i => base[i] -= 0.01);
  }
  // Cold storage peaks in summer
  if (hasChambreFroide) {
    [5, 6, 7, 8].forEach(i => base[i] += 0.015);
    [0, 1, 11].forEach(i => base[i] -= 0.01);
  }

  // Normalize
  const sum = base.reduce((a, b) => a + b, 0);
  return base.map(f => Math.round((f / sum) * annualKwh));
}

const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

interface BomLine {
  label: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

function getRecommendation(req: QuoteData, packages: PackageInfo[]) {
  const warnings: string[] = [];
  const reasoning: string[] = [];
  const bom: BomLine[] = [];

  const consoKwh = parseConsoKwh(req.annual_consumption);

  const abonnement = (req.type_abonnement || "").toLowerCase();
  const isTriphase = abonnement.includes("triphasé") || abonnement.includes("haute tension");
  const isHauteTension = abonnement.includes("haute tension");
  const wantAutonomy = req.objectif?.toLowerCase().includes("autonomie");
  const wantReduceFact = req.objectif?.toLowerCase().includes("rédu");

  const neededKwc = calcNeededKwc(consoKwh, 3);
  reasoning.push(`Consommation annuelle : ${consoKwh > 0 ? fmtNum(consoKwh) + " kWh" : "N/R"}`);
  reasoning.push(`Puissance PV nécessaire : ~${neededKwc} kWc`);
  if (isHauteTension) reasoning.push("Abonnement Haute Tension — profil Commercial & Industriel.");
  if (isTriphase) reasoning.push("Configuration triphasée détectée.");

  const isCI = neededKwc > 100 || isHauteTension;

  if (isCI) {
    const aioBoxes = packages
      .filter(p => p.name.toLowerCase().includes("aio box"))
      .sort((a, b) => (a.specs?.capacite_batterie_kwh || 0) - (b.specs?.capacite_batterie_kwh || 0));
    const bctOnduleur = packages.find(p => p.name.toLowerCase().includes("bct-110"));
    const panneau = packages.find(p => p.category === "panneaux");

    let recommended: PackageInfo | null = null;

    if (aioBoxes.length > 0 && bctOnduleur) {
      const largestAio = aioBoxes[aioBoxes.length - 1];
      recommended = largestAio;

      const aioCapKwh = largestAio.specs?.capacite_batterie_kwh || 350;
      const nbAio = Math.ceil(neededKwc > 200 ? neededKwc / (largestAio.power_kwc || 430) : 1);

      // Onduleurs per AIO from combo spec (e.g. "2x BCT-110kW-PRO")
      const comboStr = String(largestAio.specs?.onduleur_combo || "1x");
      const ondPerAio = parseInt(comboStr) || 1;
      const nbOnduleurs = nbAio * ondPerAio;

      // Total inverter power → DC/AC 1.2 → panels
      const totalInvKw = nbOnduleurs * (bctOnduleur.power_kwc || 110);
      const pvKwc = Math.round(totalInvKw * 1.2);
      const panelWc = panneau?.specs?.puissance_crete_wc || 585;
      const nbPanneaux = Math.ceil((pvKwc * 1000) / panelWc);
      const panelUnitPrice = panneau?.price_ttc || 1000;

      bom.push({ label: largestAio.name, qty: nbAio, unitPrice: largestAio.price_ttc, totalPrice: nbAio * largestAio.price_ttc });
      bom.push({ label: bctOnduleur.name, qty: nbOnduleurs, unitPrice: bctOnduleur.price_ttc, totalPrice: nbOnduleurs * bctOnduleur.price_ttc });
      bom.push({ label: `Panneau PVS ${panelWc}W`, qty: nbPanneaux, unitPrice: panelUnitPrice, totalPrice: nbPanneaux * panelUnitPrice });

      const totalBom = bom.reduce((s, l) => s + l.totalPrice, 0);

      reasoning.push(`Stockage : ${nbAio}× ${largestAio.name} (${aioCapKwh} kWh)`);
      reasoning.push(`Onduleurs : ${nbOnduleurs}× ${bctOnduleur.name} (${bctOnduleur.power_kwc} kW)`);
      reasoning.push(`Panneaux : ${nbPanneaux}× PVS ${panelWc}W (~${pvKwc} kWc, ratio DC/AC 1.2)`);
      reasoning.push(`Total système C&I : ${fmtNum(totalBom)} DH TTC`);

      if (nbAio > 1) warnings.push(`Dimensionnement important : ${nbAio} unités AIO BOX. Étude sur mesure recommandée.`);

      const battSpecs = largestAio.specs || {};
      if (battSpecs.cycles_de_vie) reasoning.push(`Batterie LFP : ${battSpecs.cycles_de_vie} cycles (${battSpecs.dod_pct || 95}% DoD)`);
    } else {
      const tri380 = packages
        .filter(p => p.name.toLowerCase().includes("solarbox") && p.name.includes("380V"))
        .sort((a, b) => a.power_kwc - b.power_kwc);
      recommended = tri380.length > 0 ? tri380[tri380.length - 1] : null;

      if (recommended) {
        const nbUnits = Math.ceil(neededKwc / (recommended.power_kwc || 1));
        reasoning.push(`Pas d'AIO BOX dispo — fallback ${nbUnits}× ${recommended.name}`);
        warnings.push("Solution sous-dimensionnée pour ce profil C&I. Étude sur mesure requise.");
      } else {
        warnings.push("Aucun système C&I disponible dans le catalogue. Étude sur mesure requise.");
        return { recommended: null, reasoning, warnings, bom };
      }
    }

    if (wantAutonomy) reasoning.push("Objectif autonomie — stockage dimensionné en conséquence.");
    if (wantReduceFact) reasoning.push("Objectif réduction facture — injection réseau prioritaire.");

    return { recommended, reasoning, warnings, bom };
  }

  // ── Residential / Small Commercial path (SolarBox) ──
  const solarBoxes = packages
    .filter(p => p.name.toLowerCase().includes("solarbox"))
    .sort((a, b) => a.power_kwc - b.power_kwc);

  if (solarBoxes.length === 0) {
    return { recommended: null, reasoning: ["Aucun package SolarBox disponible."], warnings: [], bom };
  }

  let recommended: PackageInfo | null = null;

  if (isTriphase) {
    const tri = solarBoxes.filter(p => p.name.includes("380V"));
    if (tri.length > 0) {
      recommended = tri.find(p => p.power_kwc >= neededKwc) || tri[tri.length - 1];
      reasoning.push("Triphasé — systèmes 380V privilégiés.");
    } else {
      recommended = solarBoxes.find(p => p.power_kwc >= neededKwc) || solarBoxes[solarBoxes.length - 1];
      warnings.push("Triphasé détecté, aucun 380V dispo. Compatibilité à vérifier.");
    }
  } else {
    const mono = solarBoxes.filter(p => p.name.includes("220V"));
    recommended = (mono.length > 0
      ? mono.find(p => p.power_kwc >= neededKwc) || mono[mono.length - 1]
      : solarBoxes.find(p => p.power_kwc >= neededKwc) || solarBoxes[solarBoxes.length - 1]);
  }

  if (wantAutonomy) reasoning.push("Objectif autonomie — hybride + stockage recommandé.");
  if (wantReduceFact) reasoning.push("Objectif réduction facture — stockage optionnel.");

  if (req.roof_orientation && !req.roof_orientation.toLowerCase().includes("sud")) {
    const loss = req.roof_orientation.toLowerCase().includes("ouest") || req.roof_orientation.toLowerCase().includes("est") ? "15-20%" : "25-30%";
    warnings.push(`Orientation ${req.roof_orientation} : perte ~${loss} vs Sud.`);
  }

  if (recommended) {
    const specs = recommended.specs || {};
    const battKwh = specs.capacite_batterie_kwh || specs.capacite_utilisable_kwh;
    const nbPanneaux = specs.nb_panneaux_recommandes || specs.nb_panneaux_max;
    if (battKwh) reasoning.push(`Stockage : ${battKwh} kWh LFP (${specs.cycles_de_vie || 6000} cycles)`);
    if (nbPanneaux) reasoning.push(`Config. : ${nbPanneaux} panneaux PVS 585W`);
  }

  return { recommended, reasoning, warnings, bom };
}

/* ── Colours ─────────────────────────────────────── */
const ORANGE: [number, number, number] = [249, 115, 22];
const BLACK: [number, number, number] = [20, 20, 20];
const DARK: [number, number, number] = [40, 40, 40];
const GREY: [number, number, number] = [120, 120, 120];
const LIGHT_LINE: [number, number, number] = [220, 220, 220];
const SUBTLE_BG: [number, number, number] = [248, 248, 248];
const BLUE: [number, number, number] = [59, 130, 246];
const ORANGE_LIGHT: [number, number, number] = [253, 186, 116];

/* ── Draw helpers ────────────────────────────────── */

function drawLogo(doc: jsPDF, x: number, y: number) {
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLACK);
  doc.text("SOLAR", x, y);
  const noorW = doc.getTextWidth("SOLAR");
  doc.setTextColor(...ORANGE);
  doc.text("BOX", x + noorW, y);
}

function drawSectionTitle(doc: jsPDF, title: string, y: number, margin: number): number {
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLACK);
  doc.text(title.toUpperCase(), margin, y);
  y += 1.5;
  doc.setDrawColor(...LIGHT_LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 55, y);
  return y + 4;
}

/** Draw a combined chart: bars for consumption, line for production */
function drawChart(
  doc: jsPDF,
  production: number[],
  consumption: number[],
  x: number,
  y: number,
  chartW: number,
  chartH: number,
  margin: number
) {
  const allValues = [...production, ...consumption];
  const maxVal = Math.max(...allValues) * 1.15;
  const barGroupW = chartW / 12;
  const barW = barGroupW * 0.5;

  // Y-axis scale
  const gridLines = 4;
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");

  for (let i = 0; i <= gridLines; i++) {
    const gy = y + chartH - (i / gridLines) * chartH;
    const val = Math.round((i / gridLines) * maxVal);
    // Grid line
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.15);
    doc.line(x, gy, x + chartW, gy);
    // Label
    doc.setTextColor(...GREY);
    doc.text(fmtNum(val), x - 2, gy + 1.5, { align: "right" });
  }

  // Draw bars (consumption) with rounded tops
  for (let i = 0; i < 12; i++) {
    const bx = x + i * barGroupW + (barGroupW - barW) / 2;
    const bh = (consumption[i] / maxVal) * chartH;
    const by = y + chartH - bh;

    // Bar with subtle gradient effect: darker at top
    doc.setFillColor(...ORANGE_LIGHT);
    doc.roundedRect(bx, by, barW, bh, 1, 1, "F");
    // Darker top portion
    doc.setFillColor(...ORANGE);
    doc.roundedRect(bx, by, barW, Math.min(bh, 3), 1, 1, "F");

    // Month label
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text(MONTH_LABELS[i], bx + barW / 2, y + chartH + 4, { align: "center" });
  }

  // Draw line (production) with dots
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.6);
  const points: { px: number; py: number }[] = [];

  for (let i = 0; i < 12; i++) {
    const px = x + i * barGroupW + barGroupW / 2;
    const py = y + chartH - (production[i] / maxVal) * chartH;
    points.push({ px, py });
  }

  // Draw smooth line segments
  for (let i = 0; i < points.length - 1; i++) {
    doc.line(points[i].px, points[i].py, points[i + 1].px, points[i + 1].py);
  }

  // Draw dots
  for (const { px, py } of points) {
    doc.setFillColor(255, 255, 255);
    doc.circle(px, py, 1.3, "F");
    doc.setFillColor(...BLUE);
    doc.circle(px, py, 0.9, "F");
  }

  // Baseline
  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.3);
  doc.line(x, y + chartH, x + chartW, y + chartH);

  // Y-axis label
  doc.setFontSize(5);
  doc.setTextColor(...GREY);
  doc.text("kWh", x - 2, y - 2);

  // Legend
  const legendY = y + chartH + 10;
  // Production legend (line)
  doc.setFillColor(...BLUE);
  doc.circle(x + 2, legendY - 0.5, 1, "F");
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.5);
  doc.line(x - 2, legendY - 0.5, x + 6, legendY - 0.5);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  doc.text("Production solaire (kWh)", x + 9, legendY);

  // Consumption legend (bar)
  const leg2X = x + chartW / 2;
  doc.setFillColor(...ORANGE);
  doc.roundedRect(leg2X - 3, legendY - 2.5, 5, 4, 0.5, 0.5, "F");
  doc.text("Consommation estimée (kWh)", leg2X + 5, legendY);
}

/* ── Main generator ──────────────────────────────── */

export function generateQuotePdf(
  req: QuoteData,
  solar: SolarData | null,
  packages: PackageInfo[]
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const ref = req.id.slice(0, 8).toUpperCase();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - 2 * margin;
  const colW = contentW / 2 - 2;

  // ─── PAGE 1 HEADER ─────────────────────────────
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageW, 2.5, "F");

  let y = 14;
  drawLogo(doc, margin, y);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Réf. #${ref}  |  ${dateStr}`, pageW - margin, y - 2, { align: "right" });

  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  doc.text("Analyse technique & recommandation solaire", margin, y + 5);

  y = 24;
  doc.setDrawColor(...LIGHT_LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 5;

  // ─── CLIENT INFO ───────────────────────────────
  y = drawSectionTitle(doc, "Profil du prospect", y, margin);

  const clientFields: [string, string][] = ([
    ["Nom", req.client_name],
    ["Email", req.client_email],
    ["Tél.", req.client_phone],
    ["Projet", req.project_type],
    ["Logement", req.housing_type],
    ["Objectif", req.objectif],
    ["Conso.", req.annual_consumption],
    ["Budget", req.budget],
    ["Abonnement", req.type_abonnement],
    ["Puissance", req.puissance_souscrite],
    ["Toiture", req.roof_type],
    ["Orientation", req.roof_orientation],
    ["Surface", req.roof_surface],
    ["Ville", req.ville_projet || req.city],
    ["Adresse", req.adresse_projet],
  ] as [string, string | null][]).filter(([_, v]) => v != null) as [string, string][];

  const midIdx = Math.ceil(clientFields.length / 2);
  const col1 = clientFields.slice(0, midIdx);
  const col2 = clientFields.slice(midIdx);

  const lineH = 4.2;
  const drawCol = (fields: [string, string][], startX: number, startY: number) => {
    let cy = startY;
    for (const [label, val] of fields) {
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GREY);
      doc.text(label, startX, cy);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      const maxW = colW - 28;
      let displayVal = val;
      while (doc.getTextWidth(displayVal) > maxW && displayVal.length > 3) {
        displayVal = displayVal.slice(0, -1);
      }
      if (displayVal !== val) displayVal += "…";
      doc.text(displayVal, startX + 26, cy);
      cy += lineH;
    }
    return cy;
  };

  const yCol1 = drawCol(col1, margin, y);
  const yCol2 = drawCol(col2, margin + colW + 4, y);
  y = Math.max(yCol1, yCol2) + 3;

  // ─── SOLAR KPIs (scaled via shared utility) ─────────────────
  if (solar && (solar.yearlyIrradiationKwhM2 || solar.yearlyProductionKwh)) {
    y = drawSectionTitle(doc, "Potentiel solaire du site", y, margin);

    const scaled = scaleSolar(solar, parseConsoKwh(req.annual_consumption));

    const kpis: { label: string; value: string; unit: string }[] = [];
    if (solar.yearlyIrradiationKwhM2) kpis.push({ label: "Irradiation", value: fmtNum(solar.yearlyIrradiationKwhM2), unit: "kWh/m²/an" });
    if (scaled && scaled.production > 0) kpis.push({ label: `Production (${scaled.systemKwc} kWc)`, value: fmtNum(scaled.production), unit: "kWh/an" });
    if (solar.optimalInclination != null) kpis.push({ label: "Inclinaison", value: `${solar.optimalInclination}°`, unit: "" });
    if (scaled && scaled.co2Saved > 0) kpis.push({ label: "CO₂ évité", value: fmtNum(scaled.co2Saved), unit: "kg/an" });
    if (scaled && scaled.coveragePct > 0) {
      kpis.push({ label: "Couverture", value: `${scaled.coveragePct}%`, unit: "de la conso." });
    }

    const kpiCount = Math.min(kpis.length, 5);
    const kpiW = contentW / kpiCount;

    doc.setFillColor(...SUBTLE_BG);
    doc.roundedRect(margin - 1, y - 3, contentW + 2, 16, 2, 2, "F");

    kpis.slice(0, 5).forEach((kpi, i) => {
      const kx = margin + i * kpiW + kpiW / 2;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...BLACK);
      doc.text(kpi.value, kx, y + 3, { align: "center" });
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GREY);
      const sub = kpi.unit ? `${kpi.label} (${kpi.unit})` : kpi.label;
      doc.text(sub, kx, y + 8, { align: "center" });
    });

    y += 19;
  }

  // ─── RECOMMENDATION ───────────────────────────
  const { recommended, reasoning, warnings } = getRecommendation(req, packages);

  y = drawSectionTitle(doc, "Analyse & Recommandation", y, margin);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);

  for (const line of reasoning) {
    doc.setFillColor(...ORANGE);
    doc.circle(margin + 1, y - 0.8, 0.7, "F");
    doc.text(line, margin + 4, y);
    y += 4;
  }

  if (warnings.length > 0) {
    y += 2;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 100, 20);
    doc.text("POINTS D'ATTENTION", margin, y);
    y += 3.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    for (const w of warnings) {
      doc.text(`▸ ${w}`, margin + 2, y);
      y += 3.5;
    }
    y += 2;
  }

  // ─── PACKAGE SPECS ─────────────────────────────
  if (recommended && recommended.specs) {
    y += 2;

    doc.setFillColor(...BLACK);
    doc.roundedRect(margin, y - 4, contentW, 8, 1.5, 1.5, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(recommended.name, margin + 3, y);
    doc.setFontSize(8);
    doc.text(`${fmtNum(recommended.price_ttc)} DH TTC`, pageW - margin - 3, y, { align: "right" });
    y += 8;

    const specs = recommended.specs;
    const specLabels: Record<string, string> = {
      puissance_onduleur_kw: "Onduleur",
      capacite_batterie_kwh: "Batterie",
      capacite_utilisable_kwh: "Utilisable",
      tension_batterie_v: "Tension",
      cycles_de_vie: "Cycles",
      nb_mppt: "MPPT",
      nb_panneaux_recommandes: "Panneaux rec.",
      nb_panneaux_max: "Panneaux max",
      garantie_ans: "Garantie",
      type_batterie: "Type batt.",
      type_onduleur: "Type ond.",
      efficacite_max_pct: "Efficacité",
      dod_pct: "DoD",
      poids_kg: "Poids",
    };
    const specUnits: Record<string, string> = {
      puissance_onduleur_kw: "kW", capacite_batterie_kwh: "kWh", capacite_utilisable_kwh: "kWh",
      tension_batterie_v: "V", garantie_ans: "ans", efficacite_max_pct: "%", dod_pct: "%", poids_kg: "kg",
    };

    const specRows: string[][] = [];
    for (const [key, label] of Object.entries(specLabels)) {
      if (specs[key] != null) {
        const raw = Array.isArray(specs[key]) ? specs[key].join(", ") : String(specs[key]);
        const unit = specUnits[key] || "";
        specRows.push([label, unit ? `${raw} ${unit}` : raw]);
      }
    }

    if (specRows.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [],
        body: specRows,
        theme: "plain",
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 7.5,
          cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 },
          lineColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 35, fontStyle: "bold", textColor: GREY },
          1: { textColor: DARK },
        },
        didDrawCell: (data: any) => {
          if (data.row.index % 2 === 0) {
            doc.setFillColor(...SUBTLE_BG);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
            const style = data.column.index === 0 ? "bold" : "normal";
            const color = data.column.index === 0 ? GREY : DARK;
            doc.setFont("helvetica", style);
            doc.setFontSize(7.5);
            doc.setTextColor(...color);
            doc.text(data.cell.text[0] || "", data.cell.x + 2, data.cell.y + data.cell.height / 2 + 1);
          }
        },
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }
  }

  // ─── PAGE 2: CHARTS ────────────────────────────
  const consoMatch = req.annual_consumption?.match(/(\d[\d\s]*)/);
  const annualKwh = consoMatch ? parseInt(consoMatch[1].replace(/\s/g, "")) : 0;
  const yearlyProd = solar?.yearlyProductionKwh || 0;
  const recPower = recommended?.power_kwc || 3;

  if (annualKwh > 0 || yearlyProd > 0) {
    doc.addPage();

    // Page 2 header
    doc.setFillColor(...ORANGE);
    doc.rect(0, 0, pageW, 2.5, "F");

    let cy = 14;
    drawLogo(doc, margin, cy);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text(`Réf. #${ref}  |  Projections énergétiques`, pageW - margin, cy - 2, { align: "right" });

    cy = 24;
    doc.setDrawColor(...LIGHT_LINE);
    doc.setLineWidth(0.3);
    doc.line(margin, cy, pageW - margin, cy);
    cy += 6;

    // Chart title
    cy = drawSectionTitle(doc, "Production vs Consommation — Projection mensuelle", cy, margin);
    cy += 2;

    // Compute monthly data
    const usages = req.selected_usages || [];
    const monthlyConsumption = annualKwh > 0
      ? getMonthlyConsumption(annualKwh, usages)
      : Array(12).fill(0);

    // Production = yearly production per kWc × recommended kWc × monthly solar factors
    const totalProd = yearlyProd > 0 ? yearlyProd * recPower : 0;
    const monthlyProduction = SOLAR_MONTHLY_FACTORS.map(f => Math.round(f * totalProd));

    // Draw chart
    const chartX = margin + 14;
    const chartW = contentW - 18;
    const chartH = 65;
    drawChart(doc, monthlyProduction, monthlyConsumption, chartX, cy, chartW, chartH, margin);

    cy += chartH + 20;

    // ─── Summary stats below chart ───────────────
    cy = drawSectionTitle(doc, "Bilan annuel", cy, margin);

    const totalProdYear = monthlyProduction.reduce((a, b) => a + b, 0);
    const totalConsoYear = monthlyConsumption.reduce((a, b) => a + b, 0);
    const coverageRate = totalConsoYear > 0 ? Math.min(100, Math.round((totalProdYear / totalConsoYear) * 100)) : 0;
    const surplus = Math.max(0, totalProdYear - totalConsoYear);
    const deficit = Math.max(0, totalConsoYear - totalProdYear);

    // KPI boxes
    const kpiData = [
      { label: "Production annuelle", value: fmtNum(totalProdYear), unit: "kWh", color: BLUE },
      { label: "Consommation annuelle", value: fmtNum(totalConsoYear), unit: "kWh", color: ORANGE },
      { label: "Taux de couverture", value: `${coverageRate}`, unit: "%", color: coverageRate >= 80 ? [34, 197, 94] as [number, number, number] : ORANGE },
      { label: surplus > 0 ? "Surplus injectable" : "Déficit réseau", value: fmtNum(surplus > 0 ? surplus : deficit), unit: "kWh", color: surplus > 0 ? [34, 197, 94] as [number, number, number] : [239, 68, 68] as [number, number, number] },
    ];

    const kpiBoxW = contentW / 4 - 2;
    doc.setFillColor(...SUBTLE_BG);
    doc.roundedRect(margin - 1, cy - 3, contentW + 2, 22, 2, 2, "F");

    kpiData.forEach((kpi, i) => {
      const kx = margin + i * (kpiBoxW + 2.6) + kpiBoxW / 2;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...kpi.color);
      doc.text(kpi.value, kx, cy + 5, { align: "center" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GREY);
      doc.text(kpi.unit, kx, cy + 10, { align: "center" });
      doc.setFontSize(6);
      doc.setTextColor(...DARK);
      doc.text(kpi.label, kx, cy + 15, { align: "center" });
    });

    cy += 30;

    // ─── Monthly detail table ────────────────────
    cy = drawSectionTitle(doc, "Détail mensuel (kWh)", cy, margin);

    const monthRows = MONTH_LABELS.map((m, i) => [
      m,
      fmtNum(monthlyProduction[i]),
      fmtNum(monthlyConsumption[i]),
      monthlyProduction[i] >= monthlyConsumption[i] ? `+${fmtNum(monthlyProduction[i] - monthlyConsumption[i])}` : `-${fmtNum(monthlyConsumption[i] - monthlyProduction[i])}`,
    ]);

    autoTable(doc, {
      startY: cy,
      head: [["Mois", "Production", "Consommation", "Solde"]],
      body: monthRows,
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 7,
        cellPadding: 1.8,
        lineColor: [240, 240, 240],
        lineWidth: 0.15,
      },
      headStyles: {
        fillColor: BLACK,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 7,
      },
      alternateRowStyles: { fillColor: [252, 250, 248] },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: "bold" },
        1: { halign: "right", textColor: BLUE },
        2: { halign: "right", textColor: ORANGE },
        3: { halign: "right" },
      },
      didParseCell: (data: any) => {
        if (data.section === "body" && data.column.index === 3) {
          const text = data.cell.raw as string;
          data.cell.styles.textColor = text.startsWith("+") ? [34, 197, 94] : [239, 68, 68];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
  }

  // ─── FOOTER on all pages ───────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...ORANGE);
    doc.rect(0, pageH - 2.5, pageW, 2.5, "F");

    doc.setDrawColor(...LIGHT_LINE);
    doc.setLineWidth(0.2);
    doc.line(margin, pageH - 16, pageW - margin, pageH - 16);

    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "italic");
    doc.text("Analyse préliminaire à titre indicatif. Valeurs définitives après visite technique.", margin, pageH - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...GREY);
    doc.text("SOLARBOX — sungpt.ma — contact@sungpt.ma", margin, pageH - 7);
    doc.text(`${p} / ${totalPages}`, pageW - margin, pageH - 7, { align: "right" });
  }

  doc.save(`SOLARBOX-Devis-${ref}.pdf`);
}
