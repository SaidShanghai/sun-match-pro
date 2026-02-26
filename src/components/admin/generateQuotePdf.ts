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

function getRecommendation(req: QuoteData, packages: PackageInfo[]): { recommended: PackageInfo | null; reasoning: string[]; warnings: string[] } {
  const warnings: string[] = [];
  const reasoning: string[] = [];

  // Parse consumption
  const consoMatch = req.annual_consumption?.match(/(\d[\d\s]*)/);
  const consoKwh = consoMatch ? parseInt(consoMatch[1].replace(/\s/g, "")) : 0;

  // Parse surface
  const surfMatch = req.roof_surface?.match(/(\d+)/);
  const surfM2 = surfMatch ? parseInt(surfMatch[1]) : 0;

  const isTriphasé = req.type_abonnement?.toLowerCase().includes("triphasé");
  const wantAutonomy = req.objectif?.toLowerCase().includes("autonomie");
  const wantReduceFact = req.objectif?.toLowerCase().includes("rédu");

  // Filter residential solarbox packages
  const solarBoxes = packages
    .filter(p => p.name.toLowerCase().includes("solarbox"))
    .sort((a, b) => a.power_kwc - b.power_kwc);

  if (solarBoxes.length === 0) {
    return { recommended: null, reasoning: ["Aucun package SolarBox disponible dans le catalogue."], warnings: [] };
  }

  // Estimate needed power (kWc) based on consumption and ~1700 kWh/kWc average Morocco
  const neededKwc = consoKwh > 0 ? Math.ceil(consoKwh / 1700) : 3;
  reasoning.push(`Consommation annuelle : ${consoKwh > 0 ? consoKwh.toLocaleString("fr-FR") + " kWh" : "non renseignée"}`);
  reasoning.push(`Puissance PV estimée nécessaire : ~${neededKwc} kWc`);

  // Find best match
  let recommended: PackageInfo | null = null;

  if (isTriphasé) {
    // Prefer 380V models
    const triphaséBoxes = solarBoxes.filter(p => p.name.includes("380V"));
    if (triphaséBoxes.length > 0) {
      recommended = triphaséBoxes.find(p => p.power_kwc >= neededKwc) || triphaséBoxes[triphaséBoxes.length - 1];
      reasoning.push(`Abonnement triphasé → systèmes 380V privilégiés.`);
    } else {
      recommended = solarBoxes.find(p => p.power_kwc >= neededKwc) || solarBoxes[solarBoxes.length - 1];
      warnings.push("Abonnement triphasé détecté mais aucun système 380V disponible. Vérifier la compatibilité.");
    }
  } else {
    // Prefer 220V models
    const monoBoxes = solarBoxes.filter(p => p.name.includes("220V"));
    if (monoBoxes.length > 0) {
      recommended = monoBoxes.find(p => p.power_kwc >= neededKwc) || monoBoxes[monoBoxes.length - 1];
    } else {
      recommended = solarBoxes.find(p => p.power_kwc >= neededKwc) || solarBoxes[solarBoxes.length - 1];
    }
  }

  if (wantAutonomy) {
    reasoning.push(`Objectif "Autonomie énergétique" → système hybride avec stockage recommandé.`);
  }
  if (wantReduceFact) {
    reasoning.push(`Objectif "Réduction facture" → panneaux + onduleur suffisants, stockage optionnel.`);
  }

  // Orientation warning
  if (req.roof_orientation && !req.roof_orientation.toLowerCase().includes("sud")) {
    const orientLoss = req.roof_orientation.toLowerCase().includes("ouest") || req.roof_orientation.toLowerCase().includes("est") ? "15-20%" : "25-30%";
    warnings.push(`Orientation ${req.roof_orientation} : perte estimée de ${orientLoss} vs Sud. Production reste viable.`);
  }

  if (recommended) {
    const specs = recommended.specs || {};
    const battKwh = specs.capacite_batterie_kwh || specs.capacite_utilisable_kwh;
    const nbPanneaux = specs.nb_panneaux_recommandes || specs.nb_panneaux_max;
    reasoning.push(`Solution recommandée : ${recommended.name}`);
    if (battKwh) reasoning.push(`Stockage : ${battKwh} kWh (batteries LFP, ${specs.cycles_de_vie || 6000} cycles)`);
    if (nbPanneaux) reasoning.push(`Configuration : ${nbPanneaux} panneaux PVS 585W`);
    reasoning.push(`Prix TTC : ${recommended.price_ttc.toLocaleString("fr-FR")} DH`);
  }

  return { recommended, reasoning, warnings };
}

export function generateQuotePdf(
  req: QuoteData,
  solar: SolarData | null,
  packages: PackageInfo[]
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const ref = req.id.slice(0, 8).toUpperCase();
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // --- Header ---
  doc.setFillColor(249, 115, 22); // orange
  doc.rect(0, 0, pageW, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NOORIA", margin, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Votre partenaire solaire au Maroc", margin, 26);
  doc.setFontSize(12);
  doc.text(`Analyse Technique – Réf. #${ref}`, margin, 35);
  doc.setFontSize(9);
  doc.text(new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), pageW - margin, 35, { align: "right" });

  y = 50;
  doc.setTextColor(50, 50, 50);

  // --- Section: Profil Client ---
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22);
  doc.text("📋 Profil du Prospect", margin, y);
  y += 3;

  const clientRows: string[][] = [
    ["Client", req.client_name],
    ["Email", req.client_email],
  ];
  if (req.client_phone) clientRows.push(["Téléphone", req.client_phone]);
  if (req.project_type) clientRows.push(["Type de projet", req.project_type]);
  if (req.housing_type) clientRows.push(["Type de logement", req.housing_type]);
  if (req.objectif) clientRows.push(["Objectif", req.objectif]);
  if (req.annual_consumption) clientRows.push(["Consommation annuelle", req.annual_consumption]);
  if (req.budget) clientRows.push(["Budget / Facture", req.budget]);
  if (req.type_abonnement) clientRows.push(["Abonnement", req.type_abonnement]);
  if (req.puissance_souscrite) clientRows.push(["Puissance souscrite", req.puissance_souscrite]);
  if (req.roof_type) clientRows.push(["Type de toiture", req.roof_type]);
  if (req.roof_orientation) clientRows.push(["Orientation", req.roof_orientation]);
  if (req.roof_surface) clientRows.push(["Surface disponible", req.roof_surface]);
  if (req.ville_projet) clientRows.push(["Ville", req.ville_projet]);
  if (req.adresse_projet) clientRows.push(["Adresse", req.adresse_projet]);

  autoTable(doc, {
    startY: y,
    head: [],
    body: clientRows,
    theme: "plain",
    margin: { left: margin, right: margin },
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 50 },
      1: { textColor: [30, 30, 30] },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- Section: Potentiel Solaire ---
  if (solar && (solar.yearlyIrradiationKwhM2 || solar.yearlyProductionKwh)) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(249, 115, 22);
    doc.text("☀️ Potentiel Solaire du Site", margin, y);
    y += 3;

    const solarRows: string[][] = [];
    if (solar.yearlyIrradiationKwhM2) solarRows.push(["Irradiation annuelle", `${solar.yearlyIrradiationKwhM2.toLocaleString("fr-FR")} kWh/m²/an`]);
    if (solar.yearlyProductionKwh) solarRows.push(["Production (1 kWc)", `${solar.yearlyProductionKwh.toLocaleString("fr-FR")} kWh/an`]);
    if (solar.optimalInclination != null) solarRows.push(["Inclinaison optimale", `${solar.optimalInclination}°`]);
    if (solar.co2SavedKg) solarRows.push(["CO₂ évité", `${solar.co2SavedKg.toLocaleString("fr-FR")} kg/an`]);
    if (solar.savingsMad) solarRows.push(["Économies estimées", `${solar.savingsMad.toLocaleString("fr-FR")} MAD/an`]);

    autoTable(doc, {
      startY: y,
      head: [],
      body: solarRows,
      theme: "plain",
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 50 },
        1: { textColor: [30, 30, 30] },
      },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // --- Section: Recommandation ---
  const { recommended, reasoning, warnings } = getRecommendation(req, packages);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22);
  doc.text("🔍 Analyse & Recommandation", margin, y);
  y += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);

  for (const line of reasoning) {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.text(`• ${line}`, margin + 2, y);
    y += 6;
  }

  if (warnings.length > 0) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 100, 0);
    doc.text("⚠️ Points d'attention :", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    for (const w of warnings) {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.text(`• ${w}`, margin + 2, y);
      y += 6;
    }
  }

  // --- Recommended package specs table ---
  if (recommended && recommended.specs) {
    y += 6;
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(249, 115, 22);
    doc.text(`📦 ${recommended.name}`, margin, y);
    y += 3;

    const specs = recommended.specs;
    const specRows: string[][] = [];
    const specLabels: Record<string, string> = {
      puissance_onduleur_kw: "Puissance onduleur (kW)",
      capacite_batterie_kwh: "Capacité batterie (kWh)",
      capacite_utilisable_kwh: "Capacité utilisable (kWh)",
      tension_batterie_v: "Tension batterie (V)",
      cycles_de_vie: "Cycles de vie",
      nb_mppt: "Nombre de MPPT",
      nb_panneaux_recommandes: "Panneaux recommandés",
      nb_panneaux_max: "Panneaux max",
      garantie_ans: "Garantie (ans)",
      type_batterie: "Type batterie",
      type_onduleur: "Type onduleur",
      efficacite_max_pct: "Efficacité max (%)",
      dod_pct: "Profondeur de décharge (%)",
      poids_kg: "Poids (kg)",
    };

    for (const [key, label] of Object.entries(specLabels)) {
      if (specs[key] != null) {
        const val = Array.isArray(specs[key]) ? specs[key].join(", ") : String(specs[key]);
        specRows.push([label, val]);
      }
    }

    if (specRows.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [["Caractéristique", "Valeur"]],
        body: specRows,
        theme: "striped",
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 2.5 },
        headStyles: { fillColor: [249, 115, 22], textColor: 255 },
        columnStyles: { 0: { cellWidth: 60 } },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  // --- Footer ---
  if (y > 250) { doc.addPage(); y = 20; }
  y += 5;
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text("Ce document est une analyse préliminaire à titre indicatif. Les valeurs définitives seront confirmées après visite technique.", margin, y, { maxWidth: pageW - 2 * margin });
  y += 10;
  doc.text("NOORIA – Votre partenaire solaire au Maroc | sungpt.ma | contact@sungpt.ma", margin, y);

  doc.save(`NOORIA-Devis-${ref}.pdf`);
}
