// G1008 - Pagamenti responsabili e fiscalità
const G1008 = {
  kpiCode: "G1008",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Pagamenti responsabili e fiscalità",
  fields: [
    {
      key: "strategia_fiscale_trasparente",
      label: "Strategia fiscale trasparente e responsabile",
      type: "bool",
      required: false,
    },
    {
      key: "aliquota_fiscale_effettiva",
      label: "Aliquota fiscale effettiva (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "paesi_giurisdizioni_operative",
      label: "Numero paesi/giurisdizioni operative",
      type: "number",
      required: false,
      min: 1,
    },
    {
      key: "presenze_paradisi_fiscali",
      label: "Presenza in paradisi fiscali (EU blacklist/greylist)",
      type: "bool",
      required: false,
    },
    {
      key: "country_by_country_reporting",
      label: "Country-by-Country Reporting (CbCR) implementato",
      type: "bool",
      required: false,
    },
    {
      key: "controversie_fiscali",
      label: "Controversie fiscali significative (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "pagamenti_tempestivi_fornitori",
      label: "Percentuale pagamenti fornitori entro termini (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
  ],
  checks: [
    {
      code: "TAX_TRANSPARENCY_RECOMMENDED",
      severity: "warning",
      message: "Trasparenza fiscale raccomandata per accountability",
      test: (inputs) => !!inputs.strategia_fiscale_trasparente,
      actionPlan:
        "Adottare tax transparency: disclosure aliquota effettiva, imposte pagate per paese, riconciliazione con aliquota statutaria. Comunicare strategia fiscale: no aggressive tax planning, sostanza economica, compliance. GRI 207 Tax. Risponde a pressioni stakeholder/regolatori.",
    },
    {
      code: "EFFECTIVE_TAX_RATE_THRESHOLD",
      severity: "warning",
      message: "Aliquota fiscale effettiva molto bassa richiede spiegazioni",
      test: (inputs) => {
        if (!inputs.aliquota_fiscale_effettiva) return true;
        // Se aliquota <15% (OECD Global Minimum Tax), richiede disclosure
        return inputs.aliquota_fiscale_effettiva >= 15;
      },
      actionPlan:
        "Se aliquota effettiva <15%: disclosure ragioni (incentivi fiscali legittimi, losses carry-forward, mix geografico). OECD Global Minimum Tax (Pillar 2): minimum 15% multinazionali >€750M fatturato. Evitare pratiche BEPS (Base Erosion Profit Shifting). Reputation risk.",
    },
    {
      code: "TAX_HAVENS_PROHIBITION",
      severity: "warning",
      message: "Presenza paradisi fiscali richiede giustificazione sostanziale",
      test: (inputs) => inputs.presenze_paradisi_fiscali !== true,
      actionPlan:
        "Evitare paradisi fiscali (EU blacklist/greylist, OECD). Se presenze: dimostrare sostanza economica (operazioni reali, dipendenti, asset). No mera domiciliazione. Reputational risk elevato. Investitori ESG penalizzano. BEPS Actions 5-6. Reshoring considerare.",
    },
    {
      code: "CBCR_COMPLIANCE",
      severity: "info",
      message: "Country-by-Country Reporting raccomandato per trasparenza",
      test: (inputs) => {
        if (
          !inputs.paesi_giurisdizioni_operative ||
          inputs.paesi_giurisdizioni_operative <= 1
        )
          return true;
        return inputs.country_by_country_reporting === true;
      },
      actionPlan:
        "Per multinazionali: implementare CbCR (OECD BEPS Action 13). Disclosure per paese: fatturato, utili, imposte pagate, dipendenti, asset. Obbligatorio >€750M fatturato (scambio con autorità fiscali). Public CbCR crescente (EU Directive in arrivo). Tax fairness transparency.",
    },
    {
      code: "TAX_DISPUTES_MINIMIZATION",
      severity: "warning",
      message: "Controversie fiscali indicano rischi compliance",
      test: (inputs) =>
        !inputs.controversie_fiscali || inputs.controversie_fiscali === 0,
      actionPlan:
        "Minimizzare controversie fiscali: 1) Tax compliance robusto, 2) Advance Pricing Agreements (APA) per transfer pricing, 3) Tax rulings per operazioni complesse, 4) Cooperative compliance (rapporto collaborativo con autorità). Contenziosi: costosi, lunghi, rischio reputazionale. Provisioning adeguato.",
    },
    {
      code: "TIMELY_PAYMENTS_SUPPLIERS",
      severity: "info",
      message:
        "Pagamenti tempestivi fornitori raccomandati (Late Payment Directive)",
      test: (inputs) => {
        if (!inputs.pagamenti_tempestivi_fornitori) return true;
        return inputs.pagamenti_tempestivi_fornitori >= 90;
      },
      actionPlan:
        "Rispettare termini pagamento fornitori (≥90% on-time): D.Lgs 231/2002 (Late Payment Directive), max 30-60gg. Evitare abuso posizione dominante con dilazioni eccessive. Supporto PMI liquidità. Monitoraggio DSO (Days Sales Outstanding). Rating pagamenti pubblico (se B2G).",
    },
  ],
  requiredEvidences: [
    "Tax strategy pubblicata",
    "Report imposte pagate per paese",
    "Country-by-Country Report (se applicabile)",
    "Documentazione controversie fiscali (se applicabile)",
    "Report tempi pagamento fornitori",
  ],
};

export default G1008;
