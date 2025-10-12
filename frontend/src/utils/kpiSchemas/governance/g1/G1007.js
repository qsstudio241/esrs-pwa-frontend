// G1007 - Protezione proprietà intellettuale
const G1007 = {
  kpiCode: "G1007",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Protezione proprietà intellettuale",
  fields: [
    {
      key: "politica_ip_adottata",
      label: "Politica protezione proprietà intellettuale (IP) adottata",
      type: "bool",
      required: false,
    },
    {
      key: "brevetti_registrati",
      label: "Numero brevetti registrati",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "marchi_registrati",
      label: "Numero marchi registrati",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "contenziosi_ip",
      label: "Contenziosi IP in corso (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "rispetto_ip_terzi",
      label: "Politica rispetto IP terzi implementata",
      type: "bool",
      required: true,
    },
    {
      key: "violazioni_ip_accertate",
      label: "Violazioni IP accertate contro l'azienda (anno)",
      type: "number",
      required: false,
      min: 0,
    },
  ],
  checks: [
    {
      code: "IP_RESPECT_POLICY_MANDATORY",
      severity: "error",
      message: "Rispetto IP terzi obbligatorio per legge",
      test: (inputs) => !!inputs.rispetto_ip_terzi,
      actionPlan:
        "Implementare policy rispetto IP terzi: no contraffazione, no utilizzo non autorizzato brevetti/marchi/copyright, verifiche pre-lancio prodotti. Clearance searches. Conformità: Codice Proprietà Industriale D.Lgs 30/2005, Legge Diritto Autore L. 633/1941.",
    },
    {
      code: "IP_PORTFOLIO_PROTECTION",
      severity: "warning",
      message: "Protezione IP portfolio raccomandata per valore aziendale",
      test: (inputs) => {
        if (!inputs.brevetti_registrati && !inputs.marchi_registrati)
          return true;
        return inputs.politica_ip_adottata === true;
      },
      actionPlan:
        "Se innovazione/brand significativi: adottare strategia IP. Protezione: brevetti (invenzioni), marchi (brand), design, copyright (opere creative), segreti commerciali. Registrazioni internazionali (PCT, Madrid Protocol). Monitoring infringements. Enforcement se violazioni.",
    },
    {
      code: "IP_LITIGATION_MANAGEMENT",
      severity: "warning",
      message: "Contenziosi IP richiedono gestione specializzata",
      test: (inputs) => !inputs.contenziosi_ip || inputs.contenziosi_ip === 0,
      actionPlan:
        "Per contenziosi IP: 1) Counsel specializzato IP law, 2) Valutazione meriti caso, 3) Settlement vs litigation, 4) Invalidation defense, 5) Damages quantification. Costi elevati. Alternative: licensing, cross-licensing. Prevenzione: FTO analysis pre-lancio.",
    },
    {
      code: "IP_INFRINGEMENT_VIOLATIONS",
      severity: "error",
      message: "Violazioni IP accertate richiedono immediate azioni correttive",
      test: (inputs) =>
        !inputs.violazioni_ip_accertate || inputs.violazioni_ip_accertate === 0,
      actionPlan:
        "Per violazioni IP accertate: 1) Cessazione immediata uso, 2) Ritiro prodotti mercato, 3) Negoziazione damages/licensing retroattivo, 4) Distruzione materiale infringing. Sanzioni: risarcimenti ingenti, inibitoria, sequestri, sanzioni penali (contraffazione). Prevenzione essenziale.",
    },
    {
      code: "INNOVATION_IP_PROTECTION",
      severity: "info",
      message: "Protezione innovazioni con IP raccomandata",
      test: (inputs) =>
        inputs.brevetti_registrati !== undefined &&
        inputs.brevetti_registrati > 0,
      actionPlan:
        "Proteggere innovazioni: brevetti per invenzioni industriali (20 anni), modelli utilità (10 anni). Requisiti: novità, attività inventiva, applicabilità industriale. Prior art search. Estensioni internazionali strategiche (mercati chiave). R&D tax credits legati a IP.",
    },
  ],
  requiredEvidences: [
    "Politica proprietà intellettuale",
    "Registrazioni brevetti/marchi",
    "Clearance searches prodotti",
    "Comunicazioni contenziosi IP (se applicabile)",
    "Licensing agreements",
  ],
};

export default G1007;
