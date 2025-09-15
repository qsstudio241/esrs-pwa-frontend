// Dataset ESRS estratto da Checklist.js per modularizzazione
// TODO: Successivamente estendere/normalizzare struttura con ID univoci e metadati KPI

const esrsDetails = {
  Generale: [
    {
      item: "Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Caratteristiche qualitative delle informazioni",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Doppia rilevanza come base per l'informativa sulla sostenibilità",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Dovere di diligenza",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Catena del valore",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Orizzonti temporali",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Redazione e presentazione delle informazioni sulla sostenibilità",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Struttura della dichiarazione di sostenibilità",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Collegamenti con altre parti della rendicontazione societaria e informazioni collegate",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Disposizioni transitorie",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
  ],
  S4: [
    {
      item: "Consumatori e utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Politiche per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per l'impegno con i consumatori e gli utilizzatori finali riguardo agli impatti materiali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per rimediare agli impatti negativi materiali e canali per i consumatori e gli utilizzatori finali per esprimere preoccupazioni",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per i consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
  ],
  G1: [
    {
      item: "Condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per la condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Cultura aziendale",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Gestione dei rapporti con i fornitori",
      applicability: ["Grande"],
      mandatory: true,
    },
    {
      item: "Formazione e sensibilizzazione su anti-corruzione e anti-bribery",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Incidenti di corruzione o bribery",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Attività di lobbying",
      applicability: ["Grande"],
      mandatory: true,
    },
    {
      item: "Pratiche di pagamento",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
  ],
};

export default esrsDetails;
