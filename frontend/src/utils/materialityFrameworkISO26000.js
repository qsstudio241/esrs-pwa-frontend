/**
 * Sistema robusto di materialità basato su Materiality_.txt
 * Implementa la struttura: Temi fondamentali → Aspetti specifici → Descrizione → Scoring
 */

export const materialityFrameworkISO26000 = {
  "Diritti Umani": {
    code: "DU",
    priority: "CRITICAL",
    aspects: {
      DU1: {
        name: "Rischi, Complicità, Controversie",
        description:
          "Situazioni di rischio per i diritti umani nella catena di fornitura, inclusa la complicità (diretta o indiretta) in comportamenti lesivi dei diritti umani e strumenti per risolvere eventuali controversie",
        baseScore: 1,
        stakeholderQuestions: [
          "La vostra organizzazione ha identificato rischi per i diritti umani nella catena di fornitura?",
          "Esistono procedure per evitare la complicità in violazioni dei diritti umani?",
          "Come vengono gestite le controversie relative ai diritti umani?",
        ],
      },
      DU2: {
        name: "Discriminazione e gruppi vulnerabili",
        description:
          "Distinzione, esclusione o preferenza che abbia l'effetto di annullare l'uguaglianza di trattamento od opportunità, basata su pregiudizio e anziché su valido motivo. I motivi illegittimi di discriminazione includono tra gli altri: colore, genere, età, lingua, proprietà, nazionalità, religione, origine etnica, motivi economici, disabilità, gravidanza, ecc.",
        baseScore: 3,
        stakeholderQuestions: [
          "Esistono politiche anti-discriminazione chiaramente definite?",
          "Come viene garantita l'uguaglianza di opportunità per tutti i gruppi?",
          "Quali misure sono adottate per proteggere i gruppi vulnerabili?",
        ],
      },
      DU3: {
        name: "Diritti civili, politici, economici, sociali, culturali",
        description:
          "Diritti assoluti quali il diritto ad una vita dignitosa, alla sicurezza della persona, alla proprietà individuale, alla libertà di opinione. Diritto all'istruzione, condizioni di lavoro giuste e favorevoli, protezione sociale per disoccupazione, disabilità ecc. Libertà di associazione e contrattazione, eliminazione lavoro forzato o obbligatorio ed abolizione lavoro minorile",
        baseScore: 1,
        stakeholderQuestions: [
          "Come vengono tutelati i diritti fondamentali dei lavoratori?",
          "Esistono meccanismi per garantire libertà di associazione?",
          "Quali misure prevengono il lavoro forzato o minorile?",
        ],
      },
    },
  },

  "Pratiche del Lavoro": {
    code: "LA",
    priority: "HIGH",
    aspects: {
      LA1: {
        name: "Occupazione e rapporti di lavoro",
        description:
          "Definizione e tipologia dei rapporti contrattuali, mitigazione degli impatti in caso di riduzione del lavoro, protezione dei dati e della riservatezza dei lavoratori, lealtà dei rapporti e delle condizioni di lavoro",
        baseScore: 3,
        stakeholderQuestions: [
          "Come vengono strutturati i rapporti contrattuali?",
          "Esistono procedure per la gestione delle riduzioni di personale?",
          "Come viene garantita la protezione dei dati dei lavoratori?",
        ],
      },
      LA2: {
        name: "Condizioni di lavoro e protezione sociale",
        description:
          "Salari e altre forme di compenso, orario di lavoro, periodi di riposo, ferie, pratiche disciplinari e di licenziamento, protezione della maternità e questioni legate al benessere",
        baseScore: 1,
        stakeholderQuestions: [
          "I salari sono equi e competitivi rispetto al mercato?",
          "Come vengono gestiti orari di lavoro e periodi di riposo?",
          "Quali benefit sono offerti per il benessere dei dipendenti?",
        ],
      },
      LA3: {
        name: "Dialogo sociale",
        description:
          "Negoziazione, consultazione o scambio di informazioni tra o con rappresentanti di Governi, datori di lavoro e lavoratori, su argomenti di comune interesse relativi a questioni economiche e sociali",
        baseScore: 1,
        stakeholderQuestions: [
          "Esistono canali di dialogo strutturati con i rappresentanti dei lavoratori?",
          "Come vengono gestite le negoziazioni sindacali?",
          "Qual è il livello di coinvolgimento dei dipendenti nelle decisioni aziendali?",
        ],
      },
      LA4: {
        name: "Salute e sicurezza sul lavoro",
        description:
          "Promozione e mantenimento del più alto grado di benessere fisico, mentale e sociale dei lavoratori. Prevenzione dei lavoratori dai rischi alla salute e adattamento dell'ambiente occupazionale nelle necessità fisiologiche e psicologiche dei lavoratori",
        baseScore: 2,
        stakeholderQuestions: [
          "Quali sistemi di gestione della sicurezza sono implementati?",
          "Come viene monitorata la salute mentale dei dipendenti?",
          "Esistono programmi di prevenzione dei rischi occupazionali?",
        ],
      },
      LA5: {
        name: "Sviluppo delle risorse umane e formazione",
        description:
          "Processo di espansione delle capacità e delle funzioni umane, che consenta ai lavoratori di vivere a lungo e in salute, di essere ben informati e di avere una condizione di vita decente. Accesso ad opportunità politiche, economiche e sociali che permettono di essere creativi e produttivi",
        baseScore: 2,
        stakeholderQuestions: [
          "Quali programmi di formazione e sviluppo sono disponibili?",
          "Come viene supportato l'avanzamento di carriera?",
          "Esistono opportunità di riqualificazione professionale?",
        ],
      },
    },
  },

  Ambiente: {
    code: "AM",
    priority: "CRITICAL",
    aspects: {
      AM1: {
        name: "Prevenzione dell'inquinamento",
        description:
          "Riguarda la prestazione ambientale in termini di emissioni nell'aria, scarichi idrici, produzione e gestione rifiuti, uso e smaltimento di sostanze tossiche e pericolose ecc.",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali sono le principali fonti di inquinamento dell'organizzazione?",
          "Esistono sistemi di monitoraggio delle emissioni?",
          "Come vengono gestiti i rifiuti e le sostanze pericolose?",
        ],
      },
      AM2: {
        name: "Uso sostenibile delle risorse",
        description:
          "Efficienza energetica, minimizzazione uso e riutilizzo acqua, efficienza uso materiali, riduzione al minimo delle risorse necessarie per un prodotto e, più ampiamente, modelli di economia circolare",
        baseScore: 2,
        stakeholderQuestions: [
          "Quali strategie sono adottate per l'efficienza energetica?",
          "Come viene ottimizzato l'uso delle risorse idriche?",
          "Esistono iniziative di economia circolare?",
        ],
      },
      AM3: {
        name: "Mitigazione e adattamento cambiamenti climatici",
        description:
          "Mitigazione in termini di riduzione delle emissioni dirette ed indirette (es.: da consumo energetico) di CO2/gas ad effetto serra. Adattamento dell'organizzazione ai nuovi scenari climatici (attuali e previsti) per aumentarne la resilienza",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali sono gli obiettivi di riduzione delle emissioni GHG?",
          "Esistono piani di adattamento ai cambiamenti climatici?",
          "Come viene misurata e rendicontata la carbon footprint?",
        ],
      },
      AM4: {
        name: "Protezione biodiversità e habitat naturali",
        description:
          "Valorizzazione e protezione della biodiversità, rispristino ecosistemi, utilizzo del suolo e sostenibilità delle risorse naturali, avanzamento dello sviluppo urbano e rurale compatibile con l'ambiente",
        baseScore: 2,
        stakeholderQuestions: [
          "Quali impatti ha l'organizzazione sulla biodiversità locale?",
          "Esistono programmi di conservazione degli ecosistemi?",
          "Come viene gestito l'uso sostenibile del suolo?",
        ],
      },
    },
  },

  "Corrette Prassi Gestionali": {
    code: "CP",
    priority: "HIGH",
    aspects: {
      CP1: {
        name: "Lotta alla corruzione",
        description:
          "Contrastare pratiche di abuso di potere per ottenere un profitto personale quali le seguenti: corruzione, conflitto d'interessi, frode, riciclaggio di denaro, appropriazione indebita, ricettazione, intralcio alla giustizia, millantato credito ecc.",
        baseScore: 1,
        stakeholderQuestions: [
          "Esistono politiche anti-corruzione chiaramente definite?",
          "Come vengono gestiti i conflitti d'interesse?",
          "Quali sistemi di controllo prevengono frodi e abusi?",
        ],
      },
      CP2: {
        name: "Concorrenza leale",
        description:
          "Adottare un modello di concorrenza leale atto ad evitare intese sui prezzi, turbativa d'asta, politiche predatorie di prezzi, imposizione di condizioni sfavorevoli con l'intento di portare i concorrenti fuori mercato",
        baseScore: 3,
        stakeholderQuestions: [
          "Come viene garantita la concorrenza leale nel mercato?",
          "Esistono politiche contro pratiche anti-competitive?",
          "Come vengono gestiti i rapporti con i concorrenti?",
        ],
      },
      CP3: {
        name: "Responsabilità sociale nella catena del valore",
        description:
          "Considerare e valutare gli impatti potenziali o le conseguenze delle proprie decisioni di approvvigionamento e acquisto su altre organizzazioni nella supply chain al fine di minimizzare o evitare gli impatti negativi. Stimolare la domanda di prodotti e servizi socialmente responsabili",
        baseScore: 2,
        stakeholderQuestions: [
          "Come viene valutata la sostenibilità dei fornitori?",
          "Esistono criteri ESG nella selezione dei partner?",
          "Come viene monitorata la supply chain per aspetti sociali?",
        ],
      },
    },
  },

  "Aspetti relativi ai Consumatori": {
    code: "CO",
    priority: "MEDIUM",
    aspects: {
      CO1: {
        name: "Comunicazione commerciale onesta",
        description:
          "Fornire informazioni su prodotti e servizi in modo tale che possano essere comprese dai consumatori. Possibilità per i consumatori di prendere decisioni informate sul consumo e sugli acquisti e di confrontare le caratteristiche dei diversi prodotti e servizi",
        baseScore: 2,
        stakeholderQuestions: [
          "Come viene garantita la trasparenza nelle comunicazioni commerciali?",
          "I consumatori ricevono informazioni complete sui prodotti?",
          "Esistono meccanismi per prevenire pubblicità ingannevole?",
        ],
      },
      CO2: {
        name: "Protezione salute e sicurezza consumatori",
        description:
          "Fornitura di prodotti e servizi che siano sicuri e che non rechino rischi inaccettabili di danno se utilizzati o consumati (anche in caso di prevedibile uso improprio). Istruzioni chiare per utilizzo sicuro inclusa manutenzione",
        baseScore: 1,
        stakeholderQuestions: [
          "Come viene garantita la sicurezza dei prodotti/servizi?",
          "Esistono sistemi di controllo qualità rigorosi?",
          "Come vengono gestiti i richiami di prodotti difettosi?",
        ],
      },
      CO3: {
        name: "Consumo sostenibile",
        description:
          "Consumo di prodotti e risorse in quantità che siano in linea con lo sviluppo sostenibile. Promuovere tale modello di consumo ed offrire ai consumatori prodotti e servizi vantaggiosi per società ed ambiente, considerando intero ciclo di vita",
        baseScore: 2,
        stakeholderQuestions: [
          "Come viene promosso il consumo responsabile?",
          "I prodotti sono progettati secondo principi di sostenibilità?",
          "Esistono programmi di educazione al consumo sostenibile?",
        ],
      },
      CO4: {
        name: "Servizi e supporto ai consumatori",
        description:
          "Corretta installazione, garanzie, supporto tecnico per utilizzo, disposizione per il reso, la riparazione e la manutenzione. Capacità di rispondere alle necessità dei consumatori e di gestire e risolvere i reclami e le dispute",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali servizi post-vendita sono offerti?",
          "Come vengono gestiti reclami e dispute?",
          "Esistono garanzie adeguate sui prodotti/servizi?",
        ],
      },
      CO5: {
        name: "Protezione dati e riservatezza consumatore",
        description:
          "Tutela della privacy e della riservatezza del consumatore",
        baseScore: 1,
        stakeholderQuestions: [
          "Come vengono protetti i dati personali dei clienti?",
          "Esistono politiche di privacy chiaramente definite?",
          "Come viene garantita la conformità GDPR?",
        ],
      },
      CO6: {
        name: "Educazione e consapevolezza",
        description:
          "Educazione e consapevolezza dei consumatori circa i loro diritti e responsabilità, rendendoli più propensi ad assumere un ruolo attivo e in grado di operare scelte di acquisto più informate e di consumare in maniera responsabile",
        baseScore: 2,
        stakeholderQuestions: [
          "Esistono programmi di educazione dei consumatori?",
          "Come vengono comunicati i diritti dei clienti?",
          "Quali iniziative promuovono la consapevolezza sostenibile?",
        ],
      },
    },
  },

  "Coinvolgimento e Sviluppo della Comunità": {
    code: "SC",
    priority: "MEDIUM",
    aspects: {
      SC1: {
        name: "Coinvolgimento comunità, istruzione e cultura",
        description:
          "Interessamento solidale proattivo verso la comunità al fine di prevenire e risolvere i problemi e promuovere la collaborazione e la responsabilità civica, l'istruzione e la cultura. Creazione di ricchezza e reddito mediante programmi di imprenditoria o sviluppo fornitori locali. Promozione della salute pubblica",
        baseScore: 1,
        stakeholderQuestions: [
          "Come l'organizzazione contribuisce allo sviluppo della comunità locale?",
          "Esistono programmi di sostegno all'istruzione e cultura?",
          "Come viene promossa la salute pubblica nel territorio?",
        ],
      },
      SC2: {
        name: "Creazione occupazione e sviluppo competenze",
        description:
          "Contribuire a ridurre la povertà ed alla promozione dello sviluppo economico e sociale attraverso la creazione di nuova occupazione. Assicurare un lavoro dignitoso e produttivo attraverso lo sviluppo delle competenze",
        baseScore: 3,
        stakeholderQuestions: [
          "Quali opportunità di lavoro vengono create per la comunità?",
          "Esistono programmi di formazione per competenze locali?",
          "Come viene supportato lo sviluppo economico territoriale?",
        ],
      },
      SC3: {
        name: "Sviluppo tecnologico e accesso tecnologia",
        description:
          "Applicazione di conoscenze, competenze e tecnologie specialistiche per promuovere lo sviluppo delle risorse umane e la diffusione della tecnologia nelle comunità. Favorirne la diffusione",
        baseScore: 2,
        stakeholderQuestions: [
          "Come viene favorito l'accesso alle tecnologie?",
          "Esistono programmi di trasferimento tecnologico?",
          "Come viene supportata l'innovazione locale?",
        ],
      },
      SC4: {
        name: "Investimento sociale",
        description:
          "Investimento di risorse aziendali in iniziative e programmi volti a migliorare gli aspetti sociali della vita della comunità (es.: istruzione, formazione, cultura ecc.) in coerenza con le priorità della comunità stessa",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali investimenti sociali vengono realizzati?",
          "Come vengono identificate le priorità della comunità?",
          "Esistono partnership con organizzazioni no-profit locali?",
        ],
      },
    },
  },

  // ==================== TEMI ESRS SPECIFICI ====================

  "E1 - Cambiamenti Climatici": {
    code: "E1",
    priority: "CRITICAL",
    esrsStandard: true,
    aspects: {
      E1_1: {
        name: "Piano di transizione climatica",
        description:
          "Piano aziendale per garantire che il modello di business e la strategia siano compatibili con la transizione verso un'economia sostenibile e con la limitazione del riscaldamento globale a 1,5°C",
        baseScore: 1,
        stakeholderQuestions: [
          "L'organizzazione ha un piano di transizione climatica allineato agli Accordi di Parigi?",
          "Quali sono gli obiettivi di riduzione delle emissioni GHG (Scope 1, 2, 3)?",
          "Come viene monitorato l'avanzamento del piano di transizione?",
        ],
      },
      E1_2: {
        name: "Politiche di mitigazione e adattamento",
        description:
          "Azioni per ridurre emissioni GHG e adattarsi ai cambiamenti climatici",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali politiche di mitigazione delle emissioni sono implementate?",
          "Esistono piani di adattamento ai rischi climatici fisici?",
          "Come viene gestita la resilienza climatica?",
        ],
      },
      E1_3: {
        name: "Emissioni GHG",
        description:
          "Misurazione e rendicontazione delle emissioni di gas serra Scope 1, 2 e 3",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali sono le emissioni GHG totali (Scope 1, 2, 3) dell'organizzazione?",
          "Come vengono calcolate e verificate le emissioni?",
          "Quali sono gli obiettivi di riduzione rispetto all'anno base?",
        ],
      },
    },
  },

  "E2 - Inquinamento": {
    code: "E2",
    priority: "HIGH",
    esrsStandard: true,
    aspects: {
      E2_1: {
        name: "Emissioni inquinanti in aria",
        description:
          "Emissioni di sostanze inquinanti nell'atmosfera (NOx, SOx, PM, COV, ecc.)",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali sono le principali fonti di emissioni inquinanti in aria?",
          "Come vengono monitorate e ridotte le emissioni atmosferiche?",
          "Esistono obiettivi di riduzione delle emissioni inquinanti?",
        ],
      },
      E2_2: {
        name: "Inquinamento acque e suolo",
        description:
          "Scarichi idrici, inquinamento del suolo e gestione sostanze pericolose",
        baseScore: 2,
        stakeholderQuestions: [
          "Come vengono gestiti gli scarichi idrici e il loro impatto?",
          "Esistono rischi di contaminazione del suolo?",
          "Come vengono gestite le sostanze chimiche pericolose?",
        ],
      },
      E2_3: {
        name: "Sostanze di grande preoccupazione",
        description:
          "Gestione di sostanze estremamente preoccupanti (SVHC), microplastiche, ecc.",
        baseScore: 2,
        stakeholderQuestions: [
          "L'organizzazione utilizza sostanze SVHC o microplastiche?",
          "Esistono piani di sostituzione per sostanze pericolose?",
          "Come viene garantita la sicurezza chimica dei prodotti?",
        ],
      },
    },
  },

  "E3 - Risorse Idriche e Marine": {
    code: "E3",
    priority: "HIGH",
    esrsStandard: true,
    aspects: {
      E3_1: {
        name: "Prelievi e consumi idrici",
        description:
          "Gestione sostenibile delle risorse idriche, prelievi, consumi e intensità idrica",
        baseScore: 2,
        stakeholderQuestions: [
          "Qual è il consumo idrico totale dell'organizzazione?",
          "Da quali fonti proviene l'acqua utilizzata (rete, pozzi, superficiali)?",
          "Esistono aree con stress idrico nelle operazioni?",
        ],
      },
      E3_2: {
        name: "Scarichi idrici",
        description:
          "Gestione degli scarichi idrici e qualità dell'acqua rilasciata",
        baseScore: 2,
        stakeholderQuestions: [
          "Qual è il volume degli scarichi idrici?",
          "Come viene garantita la qualità degli scarichi?",
          "Esistono sistemi di trattamento delle acque reflue?",
        ],
      },
      E3_3: {
        name: "Risorse marine",
        description: "Impatti su oceani, mari e risorse marine",
        baseScore: 1,
        stakeholderQuestions: [
          "Le operazioni impattano su ecosistemi marini?",
          "Come vengono protette le risorse marine?",
          "Esistono politiche contro l'inquinamento marino?",
        ],
      },
    },
  },

  "E4 - Biodiversità ed Ecosistemi": {
    code: "E4",
    priority: "HIGH",
    esrsStandard: true,
    aspects: {
      E4_1: {
        name: "Driver di perdita di biodiversità",
        description:
          "Identificazione e gestione dei principali driver di perdita di biodiversità (cambiamento uso suolo, sovrasfruttamento, cambiamenti climatici, inquinamento, specie invasive)",
        baseScore: 2,
        stakeholderQuestions: [
          "Quali sono i principali impatti dell'organizzazione sulla biodiversità?",
          "Le operazioni avvengono in o vicino ad aree protette/sensibili?",
          "Come vengono mitigati gli impatti sulla biodiversità?",
        ],
      },
      E4_2: {
        name: "Stato delle specie ed ecosistemi",
        description:
          "Monitoraggio e protezione di specie ed ecosistemi impattati",
        baseScore: 2,
        stakeholderQuestions: [
          "L'organizzazione monitora lo stato della biodiversità nelle aree operative?",
          "Esistono programmi di conservazione o ripristino degli ecosistemi?",
          "Come viene valutato l'impatto su specie a rischio?",
        ],
      },
      E4_3: {
        name: "Impatti ed dipendenze",
        description: "Valutazione di impatti e dipendenze dalla biodiversità",
        baseScore: 1,
        stakeholderQuestions: [
          "Quali servizi ecosistemici sono cruciali per il business?",
          "Come viene valutata la dipendenza dalla natura?",
          "Esistono rischi legati alla perdita di biodiversità?",
        ],
      },
    },
  },

  "E5 - Economia Circolare": {
    code: "E5",
    priority: "HIGH",
    esrsStandard: true,
    aspects: {
      E5_1: {
        name: "Uso delle risorse ed economia circolare",
        description:
          "Flussi di risorse in entrata e uscita, efficienza nell'uso delle risorse",
        baseScore: 2,
        stakeholderQuestions: [
          "Quali sono i principali flussi di materiali in entrata e uscita?",
          "Quale percentuale di materiali utilizzati è riciclata o rinnovabile?",
          "Esistono programmi di efficienza nell'uso delle risorse?",
        ],
      },
      E5_2: {
        name: "Gestione rifiuti",
        description:
          "Generazione, gestione e riduzione rifiuti secondo gerarchia dei rifiuti",
        baseScore: 2,
        stakeholderQuestions: [
          "Qual è la produzione totale di rifiuti dell'organizzazione?",
          "Quale percentuale di rifiuti viene riciclata/recuperata?",
          "Esistono obiettivi di riduzione dei rifiuti e aumento del riciclo?",
        ],
      },
      E5_3: {
        name: "Ecodesign e circolarità prodotti",
        description:
          "Design circolare dei prodotti per durabilità, riparabilità, riciclabilità",
        baseScore: 2,
        stakeholderQuestions: [
          "I prodotti sono progettati secondo principi di economia circolare?",
          "Esistono programmi di take-back o riuso/ricondizionamento?",
          "Come viene garantita la durabilità e riparabilità?",
        ],
      },
    },
  },

  "S1 - Forza Lavoro Propria": {
    code: "S1",
    priority: "CRITICAL",
    esrsStandard: true,
    aspects: {
      S1_1: {
        name: "Condizioni di lavoro",
        description:
          "Salute e sicurezza, orario di lavoro, retribuzione adeguata, dialogo sociale",
        baseScore: 1,
        stakeholderQuestions: [
          "Come vengono garantite condizioni di lavoro sicure e dignitose?",
          "Qual è il tasso di incidenti e infortuni sul lavoro?",
          "Esistono politiche per l'equilibrio vita-lavoro?",
        ],
      },
      S1_2: {
        name: "Pari opportunità e non discriminazione",
        description:
          "Diversità, equità, inclusione, parità di genere, lotta alle discriminazioni",
        baseScore: 3,
        stakeholderQuestions: [
          "Qual è la composizione della forza lavoro per genere, età, diversità?",
          "Esistono gap retributivi di genere?",
          "Come vengono garantite pari opportunità e prevenute discriminazioni?",
        ],
      },
      S1_3: {
        name: "Formazione e sviluppo",
        description:
          "Investimenti in formazione, sviluppo competenze, crescita professionale",
        baseScore: 2,
        stakeholderQuestions: [
          "Quante ore medie di formazione per dipendente all'anno?",
          "Esistono programmi di upskilling e reskilling?",
          "Come viene supportato lo sviluppo di carriera?",
        ],
      },
      S1_4: {
        name: "Diritti umani sul lavoro",
        description:
          "Libertà di associazione, contrattazione collettiva, lavoro forzato, lavoro minorile",
        baseScore: 1,
        stakeholderQuestions: [
          "Come vengono tutelati i diritti fondamentali dei lavoratori?",
          "Esiste libertà di associazione sindacale?",
          "Come viene garantita l'assenza di lavoro forzato o minorile?",
        ],
      },
    },
  },

  "S2 - Lavoratori nella Catena del Valore": {
    code: "S2",
    priority: "HIGH",
    esrsStandard: true,
    aspects: {
      S2_1: {
        name: "Condizioni di lavoro nella supply chain",
        description:
          "Monitoraggio e gestione delle condizioni di lavoro nei fornitori",
        baseScore: 2,
        stakeholderQuestions: [
          "Come vengono valutate le condizioni di lavoro nei fornitori?",
          "Esistono audit sociali nella supply chain?",
          "Come viene garantito il rispetto dei diritti dei lavoratori?",
        ],
      },
      S2_2: {
        name: "Diritti umani nella catena del valore",
        description:
          "Due diligence sui diritti umani, lavoro forzato, lavoro minorile nei fornitori",
        baseScore: 1,
        stakeholderQuestions: [
          "Esiste un sistema di due diligence sui diritti umani?",
          "Come vengono identificati i rischi nella supply chain?",
          "Esistono meccanismi di rimedio per violazioni?",
        ],
      },
    },
  },

  "S3 - Comunità Interessate": {
    code: "S3",
    priority: "MEDIUM",
    esrsStandard: true,
    aspects: {
      S3_1: {
        name: "Impatti economici sulle comunità",
        description:
          "Contributo economico locale, occupazione, sviluppo territoriale",
        baseScore: 2,
        stakeholderQuestions: [
          "Qual è il contributo economico alle comunità locali?",
          "Quanti lavoratori locali vengono impiegati?",
          "Come viene supportato lo sviluppo economico territoriale?",
        ],
      },
      S3_2: {
        name: "Impatti sociali sulle comunità",
        description:
          "Diritti delle comunità, popoli indigeni, impatti sociali delle operazioni",
        baseScore: 2,
        stakeholderQuestions: [
          "Come vengono coinvolte le comunità nelle decisioni che le riguardano?",
          "Esistono impatti negativi su comunità locali o indigene?",
          "Come vengono gestiti i conflitti con le comunità?",
        ],
      },
      S3_3: {
        name: "Diritti umani delle comunità",
        description:
          "Rispetto dei diritti umani delle comunità impattate, popoli indigeni",
        baseScore: 1,
        stakeholderQuestions: [
          "Come vengono tutelati i diritti delle comunità indigene?",
          "Esistono processi di consenso libero, previo e informato?",
          "Come vengono gestiti gli impatti su diritti alla terra e risorse?",
        ],
      },
    },
  },

  "S4 - Consumatori e Utilizzatori Finali": {
    code: "S4",
    priority: "MEDIUM",
    esrsStandard: true,
    aspects: {
      S4_1: {
        name: "Informazione sui prodotti/servizi",
        description:
          "Trasparenza, etichettatura, informazioni su impatti sociali e ambientali",
        baseScore: 2,
        stakeholderQuestions: [
          "Come vengono comunicate le caratteristiche sostenibili dei prodotti?",
          "Esistono etichette o certificazioni di sostenibilità?",
          "Come viene garantita la trasparenza verso i consumatori?",
        ],
      },
      S4_2: {
        name: "Sicurezza consumatori",
        description: "Salute e sicurezza nell'uso di prodotti e servizi",
        baseScore: 1,
        stakeholderQuestions: [
          "Come viene garantita la sicurezza dei prodotti/servizi?",
          "Esistono sistemi di tracciabilità e richiamo prodotti?",
          "Come vengono gestiti incidenti di sicurezza?",
        ],
      },
      S4_3: {
        name: "Inclusione consumatori",
        description:
          "Accessibilità prodotti/servizi, inclusione persone vulnerabili",
        baseScore: 2,
        stakeholderQuestions: [
          "I prodotti/servizi sono accessibili a persone con disabilità?",
          "Come viene garantita l'inclusione di gruppi vulnerabili?",
          "Esistono politiche di accesso equo ai prodotti/servizi?",
        ],
      },
    },
  },

  "G1 - Condotta Aziendale": {
    code: "G1",
    priority: "CRITICAL",
    esrsStandard: true,
    aspects: {
      G1_1: {
        name: "Cultura aziendale e comportamento etico",
        description:
          "Codice etico, valori aziendali, integrità, protezione whistleblowing",
        baseScore: 1,
        stakeholderQuestions: [
          "Esiste un codice etico e di condotta aziendale?",
          "Come viene promossa una cultura di integrità?",
          "Esistono canali di whistleblowing protetti?",
        ],
      },
      G1_2: {
        name: "Gestione relazioni con autorità pubbliche",
        description:
          "Lobbying, contributi politici, memberships, revolving doors",
        baseScore: 2,
        stakeholderQuestions: [
          "L'organizzazione svolge attività di lobbying?",
          "Come vengono gestiti i rapporti con le autorità pubbliche?",
          "Esistono politiche su contributi politici e conflitti d'interesse?",
        ],
      },
      G1_3: {
        name: "Anticorruzione e anti-concussione",
        description:
          "Politiche anti-corruzione, formazione, casi rilevati, rimedi",
        baseScore: 1,
        stakeholderQuestions: [
          "Esistono politiche e procedure anti-corruzione?",
          "Come vengono formati dipendenti e partner su questi temi?",
          "Quanti casi di corruzione sono stati rilevati e come gestiti?",
        ],
      },
      G1_4: {
        name: "Influenza tramite associazioni di categoria",
        description:
          "Posizioni politiche attraverso associazioni di categoria, coerenza con impegni climatici",
        baseScore: 2,
        stakeholderQuestions: [
          "A quali associazioni di categoria l'organizzazione aderisce?",
          "Le posizioni delle associazioni sono allineate agli impegni aziendali?",
          "Come viene garantita la coerenza su temi climatici e sostenibilità?",
        ],
      },
    },
  },
};

/**
 * Mappatura tra nomi dei temi della matrice e nomi del framework ISO 26000
 */
const THEME_NAME_MAPPING = {
  // === TEMI ESRS AMBIENTALI (E1-E5) ===
  "Cambiamenti Climatici": "E1 - Cambiamenti Climatici",
  "Climate Change": "E1 - Cambiamenti Climatici",
  E1: "E1 - Cambiamenti Climatici",

  Inquinamento: "E2 - Inquinamento",
  Pollution: "E2 - Inquinamento",
  E2: "E2 - Inquinamento",

  "Risorse Idriche": "E3 - Risorse Idriche e Marine",
  Acqua: "E3 - Risorse Idriche e Marine",
  Water: "E3 - Risorse Idriche e Marine",
  "Risorse Marine": "E3 - Risorse Idriche e Marine",
  E3: "E3 - Risorse Idriche e Marine",

  Biodiversità: "E4 - Biodiversità ed Ecosistemi",
  Biodiversity: "E4 - Biodiversità ed Ecosistemi",
  Ecosistemi: "E4 - Biodiversità ed Ecosistemi",
  E4: "E4 - Biodiversità ed Ecosistemi",

  "Economia Circolare": "E5 - Economia Circolare",
  "Circular Economy": "E5 - Economia Circolare",
  Risorse: "E5 - Economia Circolare",
  Resources: "E5 - Economia Circolare",
  Rifiuti: "E5 - Economia Circolare",
  E5: "E5 - Economia Circolare",

  // === TEMI ESRS SOCIALI (S1-S4) ===
  "Forza Lavoro": "S1 - Forza Lavoro Propria",
  Workforce: "S1 - Forza Lavoro Propria",
  Lavoratori: "S1 - Forza Lavoro Propria",
  Workers: "S1 - Forza Lavoro Propria",
  Dipendenti: "S1 - Forza Lavoro Propria",
  S1: "S1 - Forza Lavoro Propria",

  "Catena del Valore": "S2 - Lavoratori nella Catena del Valore",
  "Supply Chain": "S2 - Lavoratori nella Catena del Valore",
  Fornitori: "S2 - Lavoratori nella Catena del Valore",
  S2: "S2 - Lavoratori nella Catena del Valore",

  Comunità: "S3 - Comunità Interessate",
  Community: "S3 - Comunità Interessate",
  Communities: "S3 - Comunità Interessate",
  "Comunità Locali": "S3 - Comunità Interessate",
  S3: "S3 - Comunità Interessate",

  Consumatori: "S4 - Consumatori e Utilizzatori Finali",
  Consumers: "S4 - Consumatori e Utilizzatori Finali",
  Clienti: "S4 - Consumatori e Utilizzatori Finali",
  Customers: "S4 - Consumatori e Utilizzatori Finali",
  S4: "S4 - Consumatori e Utilizzatori Finali",

  // === TEMI ESRS GOVERNANCE (G1) ===
  "Condotta Aziendale": "G1 - Condotta Aziendale",
  "Business Conduct": "G1 - Condotta Aziendale",
  Governance: "G1 - Condotta Aziendale",
  Etica: "G1 - Condotta Aziendale",
  Ethics: "G1 - Condotta Aziendale",
  G1: "G1 - Condotta Aziendale",

  // === FALLBACK AI TEMI ISO 26000 LEGACY ===
  "Diritti Umani": "Diritti Umani",
  "Human Rights": "Diritti Umani",

  "Pratiche del Lavoro": "Pratiche del Lavoro",
  "Labor Practices": "Pratiche del Lavoro",

  Ambiente: "Ambiente",
  Environment: "Ambiente",

  "Corrette Prassi Gestionali": "Corrette Prassi Gestionali",
  "Fair Operating Practices": "Corrette Prassi Gestionali",

  "Aspetti relativi ai Consumatori": "Aspetti relativi ai Consumatori",
  "Consumer Issues": "Aspetti relativi ai Consumatori",

  "Coinvolgimento e Sviluppo della Comunità":
    "Coinvolgimento e Sviluppo della Comunità",
  "Community Involvement": "Coinvolgimento e Sviluppo della Comunità",
};

/**
 * Funzione per generare questionario strutturato da framework ISO 26000
 */
export function generateStructuredQuestionnaire(selectedThemes = []) {
  const questionnaire = {
    title: "Questionario Materialità Strutturato ISO 26000",
    description:
      "Valutazione sistematica degli aspetti di materialità secondo framework internazionale",
    sections: [],
  };

  // Se non specificati temi, usa tutti
  // Se selectedThemes contiene oggetti con proprietà 'name', estrai i nomi
  console.log("🔍 Debug generateStructuredQuestionnaire:", {
    selectedThemes,
    availableFrameworkThemes: Object.keys(materialityFrameworkISO26000),
  });

  const themeNames =
    selectedThemes.length > 0
      ? selectedThemes
        .map((theme) => {
          const extractedName =
            typeof theme === "string"
              ? theme
              : theme.name || theme.id || theme.title || theme;

          // Applica mappatura se esiste
          const mappedName =
            THEME_NAME_MAPPING[extractedName] || extractedName;

          console.log("📝 Mapping theme:", {
            theme,
            extractedName,
            mappedName,
            exists: !!materialityFrameworkISO26000[mappedName],
          });

          return mappedName;
        })
        .filter((name) => {
          const exists = materialityFrameworkISO26000[name];
          if (!exists) {
            console.warn(
              `⚠️ Tema "${name}" non trovato nel framework ISO26000`
            );
          }
          return exists;
        })
      : Object.keys(materialityFrameworkISO26000);

  console.log("✅ Final themeNames for questionnaire:", themeNames);

  themeNames.forEach((themeName) => {
    const theme = materialityFrameworkISO26000[themeName];

    // Verifica che il tema esista
    if (!theme) {
      console.warn(`Tema non trovato nel framework ISO26000: ${themeName}`);
      return;
    }

    const section = {
      title: `${theme.code} - ${themeName}`,
      priority: theme.priority,
      questions: [],
    };

    Object.keys(theme.aspects).forEach((aspectCode) => {
      const aspect = theme.aspects[aspectCode];

      // Domande per ogni aspetto
      aspect.stakeholderQuestions.forEach((question, index) => {
        section.questions.push({
          id: `${aspectCode}_${index + 1}`,
          text: question,
          type: "rating_scale",
          scale: {
            min: 1,
            max: 5,
            labels: ["Molto basso", "Basso", "Medio", "Alto", "Molto alto"],
          },
          aspectCode,
          aspectName: aspect.name,
          baseScore: aspect.baseScore,
          required: theme.priority === "CRITICAL",
        });
      });

      // Domanda aperta per ogni aspetto
      section.questions.push({
        id: `${aspectCode}_open`,
        text: `Fornite ulteriori dettagli o commenti riguardo: ${aspect.name}`,
        type: "open_text",
        aspectCode,
        aspectName: aspect.name,
        required: false,
      });
    });

    questionnaire.sections.push(section);
  });

  return questionnaire;
}

/**
 * Calcola scoring materialità basato su risposte strutturate
 */
export function calculateMaterialityScoring(
  responses,
  framework = materialityFrameworkISO26000
) {
  const results = {
    themeScores: {},
    aspectScores: {},
    overallPriority: [],
    recommendations: [],
  };

  Object.keys(framework).forEach((themeName) => {
    const theme = framework[themeName];
    let themeTotal = 0;
    let aspectCount = 0;

    Object.keys(theme.aspects).forEach((aspectCode) => {
      const aspect = theme.aspects[aspectCode];

      // Calcola score medio per l'aspetto dalle risposte
      const aspectResponses = responses.filter(
        (r) => r.aspectCode === aspectCode && r.type === "rating_scale"
      );
      const avgScore =
        aspectResponses.length > 0
          ? aspectResponses.reduce((sum, r) => sum + r.value, 0) /
          aspectResponses.length
          : aspect.baseScore;

      // Pesa con base score
      const weightedScore = (avgScore + aspect.baseScore) / 2;

      results.aspectScores[aspectCode] = {
        name: aspect.name,
        score: weightedScore,
        responseCount: aspectResponses.length,
        priority:
          weightedScore >= 4 ? "HIGH" : weightedScore >= 3 ? "MEDIUM" : "LOW",
      };

      themeTotal += weightedScore;
      aspectCount++;
    });

    results.themeScores[themeName] = {
      code: theme.code,
      score: themeTotal / aspectCount,
      priority: theme.priority,
      aspectCount,
    };
  });

  // Genera priorità overall
  results.overallPriority = Object.keys(results.themeScores)
    .sort((a, b) => results.themeScores[b].score - results.themeScores[a].score)
    .slice(0, 5); // Top 5 temi

  // Genera raccomandazioni con soglie configurabili (usa quelle passate o default)
  const thresholds = responses.materialityConfig?.thresholdRecommendations || {
    themes: 3.0,
    aspects: 3.5
  };
  results.recommendations = generateRecommendations(results, thresholds);

  return results;
}

/**
 * Restituisce tutti i temi ESRS obbligatori dal framework
 * Utile per generare questionari completi indipendentemente dalla matrice
 */
export function getAllESRSMandatoryThemes() {
  const allThemes = Object.keys(materialityFrameworkISO26000);

  return allThemes
    .filter((themeName) => {
      const theme = materialityFrameworkISO26000[themeName];
      // Filtra solo i temi con flag esrsStandard o che iniziano con E, S, G
      return theme.esrsStandard === true || /^[ESG]\d/.test(themeName);
    })
    .map((themeName) => ({
      id: themeName,
      name: themeName,
      code: materialityFrameworkISO26000[themeName].code,
      priority: materialityFrameworkISO26000[themeName].priority,
      esrsStandard: true,
    }));
}

/**
 * Restituisce TUTTI i temi del framework (ISO26000 + ESRS)
 */
export function getAllFrameworkThemes() {
  return Object.keys(materialityFrameworkISO26000).map((themeName) => ({
    id: themeName,
    name: themeName,
    code: materialityFrameworkISO26000[themeName].code,
    priority: materialityFrameworkISO26000[themeName].priority,
    esrsStandard: materialityFrameworkISO26000[themeName].esrsStandard || false,
  }));
}

/**
 * Genera raccomandazioni basate sui punteggi, con soglie configurabili
 * @param {Object} scoringResults - Risultati scoring con themeScores e aspectScores
 * @param {Object} thresholds - Soglie configurabili { themes: 3.0, aspects: 3.5 }
 * @returns {Array} Array di raccomandazioni
 */
function generateRecommendations(scoringResults, thresholds = { themes: 3.0, aspects: 3.5 }) {
  const recs = [];

  // Temi ad alta priorità (soglia configurabile)
  const highPriorityThemes = Object.keys(scoringResults.themeScores).filter(
    (theme) => scoringResults.themeScores[theme].score >= thresholds.themes
  );

  if (highPriorityThemes.length > 0) {
    recs.push({
      type: "IMMEDIATE_ACTION",
      priority: "HIGH",
      message: `Azione immediata richiesta per: ${highPriorityThemes.join(
        ", "
      )}`,
      themes: highPriorityThemes,
      threshold: thresholds.themes,
    });
  }

  // Aspetti critici (soglia configurabile)
  const criticalAspects = Object.keys(scoringResults.aspectScores).filter(
    (aspect) => scoringResults.aspectScores[aspect].score >= thresholds.aspects
  );

  if (criticalAspects.length > 0) {
    recs.push({
      type: "CRITICAL_ASPECTS",
      priority: "HIGH",
      message: `Aspetti critici da monitorare: ${criticalAspects
        .map((a) => scoringResults.aspectScores[a].name)
        .join(", ")}`,
      aspects: criticalAspects,
      threshold: thresholds.aspects,
    });
  }

  return recs;
}
