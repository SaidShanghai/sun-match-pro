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

function fmtNum(n: number): string {
  return n.toLocaleString("fr-FR").replace(/\s/g, " ");
}

function getRecommendation(req: QuoteData, packages: PackageInfo[]) {
  const warnings: string[] = [];
  const reasoning: string[] = [];

  const consoMatch = req.annual_consumption?.match(/(\d[\d\s]*)/);
  const consoKwh = consoMatch ? parseInt(consoMatch[1].replace(/\s/g, "")) : 0;

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
  reasoning.push(`Consommation annuelle : ${consoKwh > 0 ? fmtNum(consoKwh) + " kWh" : "N/R"}`);
  reasoning.push(`Puissance PV nécessaire : ~${neededKwc} kWc`);

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

  return { recommended, reasoning, warnings };
}

/* ── Colours ─────────────────────────────────────── */
const ORANGE: [number, number, number] = [249, 115, 22];
const BLACK: [number, number, number] = [20, 20, 20];
const DARK: [number, number, number] = [40, 40, 40];
const GREY: [number, number, number] = [120, 120, 120];
const LIGHT_LINE: [number, number, number] = [220, 220, 220];
const SUBTLE_BG: [number, number, number] = [248, 248, 248];

/* ── Draw helpers ────────────────────────────────── */

function drawLogo(doc: jsPDF, x: number, y: number) {
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLACK);
  doc.text("NOOR", x, y);
  const noorW = doc.getTextWidth("NOOR");
  doc.setTextColor(...ORANGE);
  doc.text("IA", x + noorW, y);
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

  // ─── HEADER ────────────────────────────────────
  // Thin orange accent line at top
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageW, 2.5, "F");

  let y = 14;
  drawLogo(doc, margin, y);

  // Right side: ref + date
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Réf. #${ref}  |  ${dateStr}`, pageW - margin, y - 2, { align: "right" });

  // Subtitle
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  doc.text("Analyse technique & recommandation solaire", margin, y + 5);

  // Separator
  y = 24;
  doc.setDrawColor(...LIGHT_LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 5;

  // ─── CLIENT INFO (compact two-column) ──────────
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
      // Truncate long values
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

  // ─── SOLAR POTENTIAL (inline KPIs) ─────────────
  if (solar && (solar.yearlyIrradiationKwhM2 || solar.yearlyProductionKwh)) {
    y = drawSectionTitle(doc, "Potentiel solaire du site", y, margin);

    const kpis: { label: string; value: string; unit: string }[] = [];
    if (solar.yearlyIrradiationKwhM2) kpis.push({ label: "Irradiation", value: fmtNum(solar.yearlyIrradiationKwhM2), unit: "kWh/m²/an" });
    if (solar.yearlyProductionKwh) kpis.push({ label: "Production", value: fmtNum(solar.yearlyProductionKwh), unit: "kWh/an" });
    if (solar.optimalInclination != null) kpis.push({ label: "Inclinaison", value: `${solar.optimalInclination}°`, unit: "" });
    if (solar.co2SavedKg) kpis.push({ label: "CO₂ évité", value: fmtNum(solar.co2SavedKg), unit: "kg/an" });
    if (solar.savingsMad) kpis.push({ label: "Économies", value: fmtNum(solar.savingsMad), unit: "MAD/an" });

    const kpiCount = Math.min(kpis.length, 5);
    const kpiW = contentW / kpiCount;

    // Subtle background
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

    // Package header: name + price in a thin dark bar
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
            // Redraw text on top
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

  // ─── FOOTER ────────────────────────────────────
  // Thin orange line at bottom
  doc.setFillColor(...ORANGE);
  doc.rect(0, pageH - 2.5, pageW, 2.5, "F");

  // Footer text
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
  doc.text("NOORIA — sungpt.ma — contact@sungpt.ma", margin, pageH - 7);

  doc.save(`NOORIA-Devis-${ref}.pdf`);
}
