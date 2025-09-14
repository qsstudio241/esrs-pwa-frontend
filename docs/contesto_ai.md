# Contesto Progetto ESRS PWA - Prompt per AI/Training

## 🎯 Scopo del Progetto

Realizzare una piattaforma web progressiva (PWA) che consenta ad aziende, consulenti e auditor di gestire in modo digitale e strutturato il processo di audit ESG/ESRS. Il progetto mira a:

- Digitalizzare la raccolta e la verifica delle evidenze di sostenibilità
- Automatizzare la generazione di report professionali conformi agli standard ESRS
- Facilitare la collaborazione tra stakeholder e la tracciabilità delle attività
- Supportare la conformità normativa e la preparazione del Bilancio di Sostenibilità

## 🤖 Come deve agire l'AI

L'agente AI deve:

- Analizzare il contesto e lo stato del progetto prima di agire
- Proporre e implementare soluzioni robuste e professionali, seguendo best practice
- Espandere la checklist ESRS in modo conforme agli standard ufficiali
- Migliorare la generazione dei report Word, includendo template personalizzati, evidenze, grafici e sezioni strutturate
- Automatizzare la gestione delle directory e dei file, evitando duplicazioni e garantendo la tracciabilità
- Fornire spiegazioni chiare per ogni modifica e aggiornare la documentazione di progetto
- Conservare la memoria storica e facilitare il riavvio del lavoro o il training AI futuro

## 📋 Obiettivi

- Sviluppo PWA React per audit ESG/ESRS
- Gestione audit, raccolta evidenze, generazione report Word
- Struttura directory automatica per cliente
- Output: report audit professionale + generatore bilancio finale

## 🏗️ Stato Attuale

- Checklist ESRS con 45 elementi (Generale, E1, E2, S1, S4, G1)
- Flusso audit robusto: creazione, selezione, export, report
- Report Word professionale con executive summary, gap analysis, action plan, raccomandazioni, evidenze integrate
- File System Access API con fallback localStorage
- Bug directory duplicata risolto
- Prossimi step: ampliamento checklist (E3, E4, E5, S2, S3, G2-G5), template Word personalizzato, generatore bilancio finale

## 📁 Struttura Directory

```
[NomeCliente]/2025_ESRS_Bilancio/
├── Evidenze/
│   ├── E1/ (Climate Change)
│   ├── E2/ (Pollution)
│   ├── S1/ (Workforce)
│   ├── S4/ (Consumers)
│   ├── G1/ (Business Conduct)
│   └── Generale/
├── Export/
└── Report/
```

## 🔄 Flussi Testati

- Nuovo audit: input nome cliente, dimensione, struttura directory, checklist dinamica
- Audit esistente: export, report, gestione evidenze
- Messaggi e feedback utente verificati
- Gestione errori robusta

## 📝 Prompt di Riavvio/Training AI

```
Sto lavorando su una PWA React per audit ESRS/ESG, repository: esrs-pwa-frontend.
Obiettivi: gestione audit, raccolta evidenze, generazione report Word, struttura directory automatica per cliente.
Stato attuale:
- Checklist ESRS con 45 elementi (Generale, E1, E2, S1, S4, G1)
- Flusso audit robusto: creazione, selezione, export, report
- Report Word professionale con executive summary, gap analysis, action plan, raccomandazioni, evidenze integrate
- File System Access API con fallback localStorage
- Bug directory duplicata risolto
- Prossimi step: ampliamento checklist (E3, E4, E5, S2, S3, G2-G5), template Word personalizzato, generatore bilancio finale
Flussi testati:
- Nuovo audit: input nome cliente, dimensione, struttura directory, checklist dinamica
- Audit esistente: export, report, gestione evidenze
- Messaggi e feedback utente verificati

Prompt per training AI:
[Incolla qui il riassunto sopra + la tua richiesta specifica]
```

## 📚 Note

- Aggiorna questo file ad ogni milestone
- Usa come base per prompt futuri o per training AI
- Versiona il file per conservare la memoria storica
