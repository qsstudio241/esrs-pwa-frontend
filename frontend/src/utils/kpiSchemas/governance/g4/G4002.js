// G4002 - Equità retributiva e pay gap
const G4002 = {
  kpiCode: "G4002",
  categoryDescription: "G4 - Remuneration",
  title: "Equità retributiva e pay gap",
  fields: [
    {
      key: "pay_gap_genere_pct",
      label: "Pay gap di genere (%)",
      type: "number",
      unit: "%",
      required: true,
      min: 0,
      max: 100,
    },
    {
      key: "certificazione_parita_genere",
      label: "Certificazione parità di genere (UNI/PdR 125:2022)",
      type: "bool",
      required: false,
    },
    {
      key: "rapporto_ceo_mediano",
      label: "Rapporto remunerazione CEO/dipendente mediano",
      type: "number",
      required: false,
      min: 1,
    },
    {
      key: "living_wage_garantito",
      label: "Living wage garantito a tutti i dipendenti",
      type: "bool",
      required: false,
    },
    {
      key: "analisi_equita_retributiva",
      label: "Analisi equità retributiva condotta periodicamente",
      type: "bool",
      required: false,
    },
    {
      key: "trasparenza_pay_ranges",
      label: "Trasparenza pay ranges per ruolo",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "GENDER_PAY_GAP_MANDATORY",
      severity: "error",
      message: "Monitoraggio pay gap di genere obbligatorio (L. 162/2021)",
      test: (inputs) => inputs.pay_gap_genere_pct !== undefined,
      actionPlan:
        "Calcolare e ridurre gender pay gap: L. 162/2021 obbliga report biennale aziende >50 dip. Calcolo: (avg salary men - avg salary women) / avg salary men. Like-for-like: same role, seniority. Target: <5% gap. Azioni correttive: salary review, promotion equity, flexible work. Trasparenza public disclosure. Reputational risk alto se gap >10%.",
    },
    {
      code: "GENDER_PAY_GAP_TARGET",
      severity: "warning",
      message: "Pay gap di genere <5% raccomandato (best practice)",
      test: (inputs) => inputs.pay_gap_genere_pct < 5,
      actionPlan:
        "Ridurre gender pay gap sotto 5%: 1) Audit retributivo annuale, 2) Salary bands trasparenti, 3) Bias training per manager, 4) Negoziazione salariale equity, 5) Promotion pipeline women, 6) Flexible work no penalty. Benchmark settore. Investor scrutiny (ESG ratings). Employer branding.",
    },
    {
      code: "GENDER_EQUALITY_CERTIFICATION",
      severity: "warning",
      message: "Certificazione parità di genere raccomandata (UNI/PdR 125)",
      test: (inputs) => !!inputs.certificazione_parita_genere,
      actionPlan:
        "Ottenere certificazione UNI/PdR 125:2022: 6 aree (cultura, governance, HR, pay, work-life balance, tutela maternità). Audit esterno. Incentivi: sgravi contributivi INPS 1%, premialità appalti pubblici. Duration 3 anni, renewal. Competitive advantage talent attraction. SDG 5 (Gender Equality). Quota rosa CdA compliance.",
    },
    {
      code: "CEO_PAY_RATIO",
      severity: "warning",
      message: "Rapporto CEO/mediano eccessivo (best practice <100:1)",
      test: (inputs) =>
        inputs.rapporto_ceo_mediano && inputs.rapporto_ceo_mediano < 100,
      actionPlan:
        "Monitorare CEO pay ratio: Direttiva UE (2017/828) richiede disclosure rapporto CEO/avg pay. Target: <100:1 (Italia media ~50:1, USA >200:1). Eccessivo ratio = morale issue, inequality perception. Azioni: moderate CEO pay growth, increase base pay, profit sharing schemes. Shareholder engagement su excessive pay.",
    },
    {
      code: "LIVING_WAGE",
      severity: "info",
      message: "Living wage per tutti i dipendenti raccomandato",
      test: (inputs) => !!inputs.living_wage_garantito,
      actionPlan:
        "Garantire living wage: salario sufficiente per decent standard of living (vs minimum wage = legal floor). Calcolo: Global Living Wage Coalition, Anker methodology. Include: food, housing, transport, healthcare, education. Supply chain extension (fornitori). SDG 8 (Decent Work). Employee retention, productivity, reputazione.",
    },
    {
      code: "PAY_EQUITY_ANALYSIS",
      severity: "info",
      message: "Analisi equità retributiva periodica raccomandata",
      test: (inputs) => !!inputs.analisi_equita_retributiva,
      actionPlan:
        "Condurre pay equity analysis: annuale, multi-dimensional (gender, ethnicity, age, disability). Regression analysis (control role, tenure, performance). Identify unexplained gaps. Remediation budget. Prevent discrimination (D.Lgs 198/2006). Transparency report interno. Audit-ready data. Proactive compliance vs litigation risk.",
    },
    {
      code: "PAY_TRANSPARENCY",
      severity: "info",
      message:
        "Trasparenza pay ranges raccomandata (Direttiva UE Pay Transparency)",
      test: (inputs) => !!inputs.trasparenza_pay_ranges,
      actionPlan:
        "Implementare pay transparency: Direttiva UE 2023/970 (recepimento IT 2026): salary ranges in job ads, right to know pay levels, gender pay reporting. Internal transparency: publish salary bands per job family/level. Reduce negotiation bias. Trust culture. Competitive positioning clear. Benchmark market regularly. Anticipate regulation.",
    },
  ],
  requiredEvidences: [
    "Report biennale pay gap (L. 162/2021)",
    "Certificato UNI/PdR 125:2022 (se applicabile)",
    "Analisi CEO pay ratio",
    "Salary bands per ruolo",
    "Report equità retributiva",
  ],
};

export default G4002;
