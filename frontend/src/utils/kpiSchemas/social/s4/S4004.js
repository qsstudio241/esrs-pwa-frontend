// S4004 - Marketing responsabile e informazione consumatori
const S4004 = {
  kpiCode: "S4004",
  categoryDescription: "S4 - Consumatori e utenti finali",
  title: "Marketing responsabile e informazione consumatori",
  fields: [
    {
      key: "claim_ambientali_verificabili",
      label: "Claim ambientali prodotti verificabili e documentati",
      type: "bool",
      required: false,
    },
    {
      key: "certificazioni_prodotto_comunicate",
      label: "Certificazioni prodotto comunicate in modo chiaro",
      type: "bool",
      required: false,
    },
    {
      key: "pratiche_greenwashing_assenti",
      label: "Assenza pratiche greenwashing/social washing",
      type: "bool",
      required: true,
    },
    {
      key: "informazioni_impatti_esg_disponibili",
      label: "Informazioni impatti ESG prodotti disponibili ai consumatori",
      type: "bool",
      required: false,
    },
    {
      key: "marketing_inclusivo",
      label: "Marketing inclusivo e non stereotipato",
      type: "bool",
      required: false,
    },
    {
      key: "tutela_minori_marketing",
      label: "Misure tutela minori in marketing",
      type: "bool",
      required: false,
    },
    {
      key: "sanzioni_pratiche_commerciali_scorrette",
      label: "Sanzioni ricevute per pratiche commerciali scorrette (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "contenziosi_pubblicitari",
      label: "Contenziosi pubblicitari con autorità o associazioni consumatori",
      type: "number",
      required: false,
      min: 0,
    },
  ],
  checks: [
    {
      code: "NO_GREENWASHING",
      severity: "error",
      message:
        "Greenwashing vietato: claim ambientali devono essere verificabili",
      test: (inputs) => !!inputs.pratiche_greenwashing_assenti,
      actionPlan:
        "Evitare greenwashing: 1) Claim specifici vs generici ('100% plastica riciclata' vs 'eco-friendly'), 2) Evidenze scientifiche (LCA, certificazioni), 3) No omissioni rilevanti (trade-off nascosti), 4) Linguaggio chiaro. Conformità: ISO 14021, Green Claims Directive UE proposta 2023.",
    },
    {
      code: "ENVIRONMENTAL_CLAIMS_SUBSTANTIATION",
      severity: "warning",
      message: "Claim ambientali richiedono documentazione robusta",
      test: (inputs) => {
        if (!inputs.claim_ambientali_verificabili) return true;
        // Se ci sono claim, devono essere verificabili
        return inputs.claim_ambientali_verificabili === true;
      },
      actionPlan:
        "Documentare claim ambientali: 1) LCA o studi scientifici, 2) Certificazioni terze parti (Ecolabel EU, FSC, Cradle to Cradle), 3) Comparative assertions: evidenze sostanziali, 4) Self-declared claims (ISO 14021): specifici, accurati, verificabili. Archiviare evidenze per 5 anni.",
    },
    {
      code: "UNFAIR_COMMERCIAL_PRACTICES_SANCTIONS",
      severity: "error",
      message:
        "Sanzioni per pratiche commerciali scorrette richiedono azioni immediate",
      test: (inputs) =>
        !inputs.sanzioni_pratiche_commerciali_scorrette ||
        inputs.sanzioni_pratiche_commerciali_scorrette === 0,
      actionPlan:
        "Per sanzioni AGCM/Garante: 1) Compliance immediata, 2) Ritiro comunicazioni non conformi, 3) Corrective advertising se richiesto, 4) Review processi approvazione marketing, 5) Training team marketing su normative. Evitare recidive: sanzioni aumentano fino 10% fatturato.",
    },
    {
      code: "ADVERTISING_LITIGATION",
      severity: "warning",
      message: "Contenziosi pubblicitari indicano problemi di conformità",
      test: (inputs) =>
        !inputs.contenziosi_pubblicitari ||
        inputs.contenziosi_pubblicitari === 0,
      actionPlan:
        "Per contenziosi IAP/associazioni consumatori: 1) Valutare fondatezza reclami, 2) Ritiro volontario pubblicità se non conforme, 3) Migliorare processi pre-clearing, 4) Consulenza legale specializzata marketing, 5) Monitoraggio competitor best practices. Autodisciplina previene sanzioni.",
    },
    {
      code: "ESG_IMPACT_TRANSPARENCY",
      severity: "info",
      message: "Trasparenza impatti ESG prodotti raccomandata",
      test: (inputs) => !!inputs.informazioni_impatti_esg_disponibili,
      actionPlan:
        "Comunicare impatti ESG prodotti: carbon footprint, water footprint, social impact. Strumenti: QR code su packaging verso pagina web dettagli, Environmental Product Declarations (EPD), app tracciabilità. Aumenta fiducia consumatori. Differenziazione competitiva.",
    },
    {
      code: "INCLUSIVE_MARKETING",
      severity: "info",
      message: "Marketing inclusivo raccomandato per rappresentazione equa",
      test: (inputs) => !!inputs.marketing_inclusivo,
      actionPlan:
        "Adottare marketing inclusivo: rappresentazione diversità (genere, etnia, età, abilità), no stereotipi, linguaggio inclusivo. Linee guida creative. Review contenuti da prospettive DEI. Benefici: ampliamento target, brand reputation, compliance future normative.",
    },
    {
      code: "CHILDREN_PROTECTION",
      severity: "info",
      message: "Tutela minori in marketing raccomandata",
      test: (inputs) => !!inputs.tutela_minori_marketing,
      actionPlan:
        "Proteggere minori in marketing: no pubblicità ingannevole verso bambini, limiti marketing cibo non salutare (WHO guidelines), tutela online (COPPA US, GDPR-K EU). No sfruttamento ingenuità. Codice Autodisciplina IAP articoli specifici minori. Parental controls.",
    },
  ],
  requiredEvidences: [
    "Documentazione claim ambientali (LCA, certificazioni)",
    "Codice etico marketing",
    "Lineeguida comunicazione sostenibilità",
    "Report sanzioni/contenziosi (se applicabile)",
    "Policy tutela minori marketing (se applicabile)",
  ],
};

export default S4004;
