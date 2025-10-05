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
  const themes =
    selectedThemes.length > 0
      ? selectedThemes
      : Object.keys(materialityFrameworkISO26000);

  themes.forEach((themeName) => {
    const theme = materialityFrameworkISO26000[themeName];

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

  // Genera raccomandazioni
  results.recommendations = generateRecommendations(results);

  return results;
}

function generateRecommendations(scoringResults) {
  const recs = [];

  // Temi ad alta priorità
  const highPriorityThemes = Object.keys(scoringResults.themeScores).filter(
    (theme) => scoringResults.themeScores[theme].score >= 4
  );

  if (highPriorityThemes.length > 0) {
    recs.push({
      type: "IMMEDIATE_ACTION",
      priority: "HIGH",
      message: `Azione immediata richiesta per: ${highPriorityThemes.join(
        ", "
      )}`,
      themes: highPriorityThemes,
    });
  }

  // Aspetti critici
  const criticalAspects = Object.keys(scoringResults.aspectScores).filter(
    (aspect) => scoringResults.aspectScores[aspect].score >= 4.5
  );

  if (criticalAspects.length > 0) {
    recs.push({
      type: "CRITICAL_ASPECTS",
      priority: "HIGH",
      message: `Aspetti critici da monitorare: ${criticalAspects
        .map((a) => scoringResults.aspectScores[a].name)
        .join(", ")}`,
      aspects: criticalAspects,
    });
  }

  return recs;
}
