import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

/** Safe number formatter that avoids weird "/" separators in jsPDF */
function fmtNum(n: number): string {
  return n.toLocaleString("fr-FR").replace(/\s/g, " ");
}

function getRecommendation(req: QuoteData, packages: PackageInfo[]) {
  const warnings: string[] = [];
  const reasoning: string[] = [];

  const consoMatch = req.annual_consumption?.match(/(\d[\d\s]*)/);
  const consoKwh = consoMatch ? parseInt(consoMatch[1].replace(/\s/g, "")) : 0;
  const surfMatch = req.roof_surface?.match(/(\d+)/);
  const surfM2 = surfMatch ? parseInt(surfMatch[1]) : 0;

  const isTriphase = req.type_abonnement?.toLowerCase().includes("triphasé");
  const wantAutonomy = req.objectif?.toLowerCase().includes("autonomie");
  const wantReduceFact = req.objectif?.toLowerCase().includes("rédu");

  const solarBoxes = packages
    .filter(p => p.name.toLowerCase().includes("solarbox"))
    .sort((a, b) => a.power_kwc - b.power_kwc);

  if (solarBoxes.length === 0) {
    return { recommended: null, reasoning: ["Aucun package SolarBox disponible."], warnings: [] };
  }

  const neededKwc = consoKwh > 0 ? Math.ceil(consoKwh / 1700) : 3;
  reasoning.push(`Consommation annuelle estimée : ${consoKwh > 0 ? fmtNum(consoKwh) + " kWh" : "non renseignée"}`);
  reasoning.push(`Puissance PV nécessaire estimée : ~${neededKwc} kWc`);

  let recommended: PackageInfo | null = null;

  if (isTriphase) {
    const tri = solarBoxes.filter(p => p.name.includes("380V"));
    if (tri.length > 0) {
      recommended = tri.find(p => p.power_kwc >= neededKwc) || tri[tri.length - 1];
      reasoning.push("Abonnement triphasé détecté — systèmes 380V privilégiés.");
    } else {
      recommended = solarBoxes.find(p => p.power_kwc >= neededKwc) || solarBoxes[solarBoxes.length - 1];
      warnings.push("Abonnement triphasé détecté mais aucun système 380V disponible. Compatibilité à vérifier.");
    }
  } else {
    const mono = solarBoxes.filter(p => p.name.includes("220V"));
    if (mono.length > 0) {
      recommended = mono.find(p => p.power_kwc >= neededKwc) || mono[mono.length - 1];
    } else {
      recommended = solarBoxes.find(p => p.power_kwc >= neededKwc) || solarBoxes[solarBoxes.length - 1];
    }
  }

  if (wantAutonomy) reasoning.push("Objectif autonomie énergétique — système hybride avec stockage recommandé.");
  if (wantReduceFact) reasoning.push("Objectif réduction de facture — panneaux + onduleur suffisants, stockage optionnel.");

  if (req.roof_orientation && !req.roof_orientation.toLowerCase().includes("sud")) {
    const loss = req.roof_orientation.toLowerCase().includes("ouest") || req.roof_orientation.toLowerCase().includes("est") ? "15-20 %" : "25-30 %";
    warnings.push(`Orientation ${req.roof_orientation} : perte estimée de ${loss} vs Sud. Production reste viable.`);
  }

  if (recommended) {
    const specs = recommended.specs || {};
    const battKwh = specs.capacite_batterie_kwh || specs.capacite_utilisable_kwh;
    const nbPanneaux = specs.nb_panneaux_recommandes || specs.nb_panneaux_max;
    reasoning.push(`Solution recommandée : ${recommended.name}`);
    if (battKwh) reasoning.push(`Stockage : ${battKwh} kWh (batteries LFP, ${specs.cycles_de_vie || 6000} cycles)`);
    if (nbPanneaux) reasoning.push(`Configuration : ${nbPanneaux} panneaux PVS 585W`);
    reasoning.push(`Prix TTC : ${fmtNum(recommended.price_ttc)} DH`);
  }

  return { recommended, reasoning, warnings };
}

/* ── Colours ─────────────────────────────────────── */
const ORANGE: [number, number, number] = [249, 115, 22];
const DARK: [number, number, number] = [30, 30, 30];
const GREY: [number, number, number] = [100, 100, 100];
const LIGHT_BG: [number, number, number] = [255, 248, 240];
const WHITE: [number, number, number] = [255, 255, 255];

/* ── Draw helpers ────────────────────────────────── */

function drawSectionTitle(doc: jsPDF, title: string, y: number, margin: number): number {
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ORANGE);
  doc.text(title.toUpperCase(), margin, y);
  y += 2;
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + doc.getTextWidth(title.toUpperCase()) + 4, y);
  return y + 6;
}

function drawKeyValue(doc: jsPDF, label: string, value: string, x: number, y: number, labelW = 55): number {
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.text(label, x, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(value, x + labelW, y);
  return y + 5.5;
}

function ensurePage(doc: jsPDF, y: number, needed = 30): number {
  if (y + needed > 275) {
    doc.addPage();
    return 25;
  }
  return y;
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
  const margin = 18;
  const contentW = pageW - 2 * margin;

  // ─── PAGE HEADER ───────────────────────────────
  // Orange gradient header bar
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageW, 38, "F");
  // Lighter overlay strip
  doc.setFillColor(255, 140, 60);
  doc.rect(0, 32, pageW, 6, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("NOORIA", margin, 17);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Votre partenaire solaire au Maroc", margin, 24);

  // Reference & date right-aligned
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Devis #${ref}`, pageW - margin, 15, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.text(dateStr, pageW - margin, 21, { align: "right" });

  let y = 48;

  // ─── SECTION: CLIENT ───────────────────────────
  y = drawSectionTitle(doc, "Profil du prospect", y, margin);

  // Two-column layout for client info
  const clientFields: [string, string | null][] = [
    ["Nom", req.client_name],
    ["Email", req.client_email],
    ["Téléphone", req.client_phone],
    ["Type de projet", req.project_type],
    ["Type de logement", req.housing_type],
    ["Objectif", req.objectif],
    ["Consommation", req.annual_consumption],
    ["Budget / Facture", req.budget],
    ["Abonnement", req.type_abonnement],
    ["Puissance souscrite", req.puissance_souscrite],
    ["Toiture", req.roof_type],
    ["Orientation", req.roof_orientation],
    ["Surface", req.roof_surface],
    ["Ville", req.ville_projet || req.city],
    ["Adresse", req.adresse_projet],
  ].filter(([_, v]) => v != null) as [string, string][];

  // Split into two columns
  const midIdx = Math.ceil(clientFields.length / 2);
  const col1 = clientFields.slice(0, midIdx);
  const col2 = clientFields.slice(midIdx);
  const colX1 = margin;
  const colX2 = margin + contentW / 2 + 2;

  // Light background card
  const cardH = Math.max(col1.length, col2.length) * 5.5 + 6;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(margin - 2, y - 4, contentW + 4, cardH, 3, 3, "F");

  let yCol1 = y;
  let yCol2 = y;
  for (const [label, val] of col1) {
    yCol1 = drawKeyValue(doc, label, val, colX1, yCol1, 42);
  }
  for (const [label, val] of col2) {
    yCol2 = drawKeyValue(doc, label, val, colX2, yCol2, 42);
  }
  y = Math.max(yCol1, yCol2) + 6;

  // ─── SECTION: SOLAR POTENTIAL ──────────────────
  if (solar && (solar.yearlyIrradiationKwhM2 || solar.yearlyProductionKwh)) {
    y = ensurePage(doc, y, 60);
    y = drawSectionTitle(doc, "Potentiel solaire du site", y, margin);

    // KPI cards in a row
    const kpis: { label: string; value: string; unit: string }[] = [];
    if (solar.yearlyIrradiationKwhM2) kpis.push({ label: "Irradiation", value: fmtNum(solar.yearlyIrradiationKwhM2), unit: "kWh/m²/an" });
    if (solar.yearlyProductionKwh) kpis.push({ label: "Production (1 kWc)", value: fmtNum(solar.yearlyProductionKwh), unit: "kWh/an" });
    if (solar.optimalInclination != null) kpis.push({ label: "Inclinaison optimale", value: `${solar.optimalInclination}`, unit: "°" });
    if (solar.co2SavedKg) kpis.push({ label: "CO₂ évité", value: fmtNum(solar.co2SavedKg), unit: "kg/an" });
    if (solar.savingsMad) kpis.push({ label: "Économies", value: fmtNum(solar.savingsMad), unit: "MAD/an" });

    const kpiW = contentW / Math.min(kpis.length, 4);
    const kpiH = 22;
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(margin - 2, y - 2, contentW + 4, kpiH + 4, 3, 3, "F");

    kpis.slice(0, 4).forEach((kpi, i) => {
      const kx = margin + i * kpiW;
      // Value
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...ORANGE);
      doc.text(kpi.value, kx + kpiW / 2, y + 8, { align: "center" });
      // Unit
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GREY);
      doc.text(kpi.unit, kx + kpiW / 2, y + 13, { align: "center" });
      // Label
      doc.setFontSize(7.5);
      doc.setTextColor(...DARK);
      doc.text(kpi.label, kx + kpiW / 2, y + 19, { align: "center" });
    });

    y += kpiH + 10;

    // If more than 4 KPIs, show the rest below
    if (kpis.length > 4) {
      for (let i = 4; i < kpis.length; i++) {
        y = drawKeyValue(doc, kpis[i].label, `${kpis[i].value} ${kpis[i].unit}`, margin, y);
      }
      y += 4;
    }
  }

  // ─── SECTION: RECOMMENDATION ───────────────────
  y = ensurePage(doc, y, 60);
  const { recommended, reasoning, warnings } = getRecommendation(req, packages);

  y = drawSectionTitle(doc, "Analyse & Recommandation", y, margin);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);

  for (const line of reasoning) {
    y = ensurePage(doc, y, 8);
    // Bullet point with orange dot
    doc.setFillColor(...ORANGE);
    doc.circle(margin + 1.5, y - 1.2, 1, "F");
    doc.text(line, margin + 5, y);
    y += 6;
  }

  if (warnings.length > 0) {
    y += 3;
    y = ensurePage(doc, y, 10 + warnings.length * 6);
    // Warning box
    doc.setFillColor(255, 243, 224);
    doc.setDrawColor(255, 180, 100);
    doc.setLineWidth(0.3);
    const warnH = warnings.length * 6 + 10;
    doc.roundedRect(margin, y - 4, contentW, warnH, 2, 2, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 100, 0);
    doc.text("POINTS D'ATTENTION", margin + 4, y + 2);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    for (const w of warnings) {
      doc.text(`• ${w}`, margin + 4, y);
      y += 6;
    }
    y += 4;
  }

  // ─── SECTION: PACKAGE SPECS ────────────────────
  if (recommended && recommended.specs) {
    y = ensurePage(doc, y, 50);
    y += 4;

    // Package name highlight bar
    doc.setFillColor(...ORANGE);
    doc.roundedRect(margin, y - 5, contentW, 10, 2, 2, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...WHITE);
    doc.text(recommended.name, margin + 4, y + 1);
    doc.setFontSize(9);
    doc.text(`${fmtNum(recommended.price_ttc)} DH TTC`, pageW - margin - 4, y + 1, { align: "right" });
    y += 12;

    const specs = recommended.specs;
    const specLabels: Record<string, string> = {
      puissance_onduleur_kw: "Puissance onduleur",
      capacite_batterie_kwh: "Capacité batterie",
      capacite_utilisable_kwh: "Capacité utilisable",
      tension_batterie_v: "Tension batterie",
      cycles_de_vie: "Cycles de vie",
      nb_mppt: "Nombre de MPPT",
      nb_panneaux_recommandes: "Panneaux recommandés",
      nb_panneaux_max: "Panneaux max",
      garantie_ans: "Garantie",
      type_batterie: "Type batterie",
      type_onduleur: "Type onduleur",
      efficacite_max_pct: "Efficacité max",
      dod_pct: "Profondeur de décharge",
      poids_kg: "Poids",
    };
    const specUnits: Record<string, string> = {
      puissance_onduleur_kw: "kW",
      capacite_batterie_kwh: "kWh",
      capacite_utilisable_kwh: "kWh",
      tension_batterie_v: "V",
      garantie_ans: "ans",
      efficacite_max_pct: "%",
      dod_pct: "%",
      poids_kg: "kg",
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
        head: [["Caractéristique", "Valeur"]],
        body: specRows,
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8.5,
          cellPadding: 3,
          lineColor: [230, 230, 230],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: ORANGE,
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [253, 249, 245],
        },
        columnStyles: {
          0: { cellWidth: 55, fontStyle: "bold", textColor: GREY },
          1: { textColor: DARK },
        },
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  // ─── FOOTER ────────────────────────────────────
  // Draw footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const pH = doc.internal.pageSize.getHeight();

    // Footer line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, pH - 22, pageW - margin, pH - 22);

    // Disclaimer
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Ce document est une analyse préliminaire à titre indicatif. Les valeurs définitives seront confirmées après visite technique.",
      margin,
      pH - 17,
      { maxWidth: contentW }
    );

    // Company info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    doc.text("NOORIA — sungpt.ma — contact@sungpt.ma", margin, pH - 10);

    // Page number
    doc.text(`${p} / ${totalPages}`, pageW - margin, pH - 10, { align: "right" });
  }

  doc.save(`NOORIA-Devis-${ref}.pdf`);
}
