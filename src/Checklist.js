import React, { useState } from 'react';
import { useStorage } from './storage/StorageContext';

const esrsDetails = {
  Generale: [
    "Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali",
    "Caratteristiche qualitative delle informazioni",
    "Doppia rilevanza come base per l'informativa sulla sostenibilità",
    "Dovere di diligenza",
    "Catena del valore",
    "Orizzonti temporali",
    "Redazione e presentazione delle informazioni sulla sostenibilità",
    "Struttura della dichiarazione di sostenibilità",
    "Collegamenti con altre parti della rendicontazione societaria e informazioni collegate",
    "Disposizioni transitorie"
  ],
  E1: [
    "Cambiamenti climatici",
    "Piano di transizione per la mitigazione dei cambiamenti climatici",
    "Politiche per la mitigazione e l'adattamento ai cambiamenti climatici",
    "Azioni e risorse per la mitigazione e l'adattamento ai cambiamenti climatici",
    "Obiettivi per la mitigazione e l'adattamento ai cambiamenti climatici",
    "Consumo di energia e mix energetico",
    "Emissioni di GHG",
    "Rimozione e crediti GHG",
    "Prezzi interni del carbonio",
    "Effetti finanziari potenziali derivanti dai rischi e dalle opportunità materiali dei cambiamenti climatici"
  ],
  E2: [
    "Inquinamento",
    "Politiche per la prevenzione, il controllo e la riduzione dell'inquinamento",
    "Azioni e risorse per la prevenzione, il controllo e la riduzione dell'inquinamento",
    "Obiettivi per la prevenzione, il controllo e la riduzione dell'inquinamento",
    "Inquinamento dell'aria, dell'acqua e del suolo",
    "Sostanze preoccupanti"
  ],
  E3: [
    "Acque e risorse marine",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alle acque e alle risorse marine",
    "Azioni e risorse per la gestione degli impatti materiali, rischi e opportunità legati alle acque e alle risorse marine",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alle acque e alle risorse marine",
    "Consumo di acqua"
  ],
  E4: [
    "Biodiversità ed ecosistemi",
    "Piano di transizione per la biodiversità e gli ecosistemi",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alla biodiversità e agli ecosistemi",
    "Azioni e risorse per la gestione degli impatti materiali, rischi e opportunità legati alla biodiversità e agli ecosistemi",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alla biodiversità e agli ecosistemi",
    "Pressioni sulla biodiversità e sugli ecosistemi",
    "Metriche di impatto su biodiversità ed ecosistemi"
  ],
  E5: [
    "Uso delle risorse ed economia circolare",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati all'uso delle risorse e all'economia circolare",
    "Azioni e risorse per la gestione degli impatti materiali, rischi e opportunità legati all'uso delle risorse e all'economia circolare",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati all'uso delle risorse e all'economia circolare",
    "Afflussi di risorse",
    "Deflussi di risorse e rifiuti"
  ],
  S1: [
    "Lavoro propria",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alla forza lavoro propria",
    "Processi per l'impegno con la forza lavoro propria e i rappresentanti dei lavoratori riguardo agli impatti materiali",
    "Processi per rimediare agli impatti negativi materiali e canali per la forza lavoro propria per esprimere preoccupazioni",
    "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per la forza lavoro propria",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alla forza lavoro propria",
    "Caratteristiche della forza lavoro propria dell'impresa",
    "Caratteristiche dei lavoratori non dipendenti nella forza lavoro propria dell'impresa",
    "Copertura della contrattazione collettiva e dialogo sociale",
    "Diversità",
    "Salari adeguati",
    "Protezione sociale",
    "Persone con disabilità",
    "Formazione e sviluppo delle competenze",
    "Salute e sicurezza",
    "Equilibrio tra lavoro e vita privata",
    "Salari adeguati",
    "Dialogo sociale",
    "Lavoro infantile",
    "Lavoro forzato",
    "Alloggi adeguati",
    "Privacy"
  ],
  S2: [
    "Lavoratori nella catena del valore",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati ai lavoratori nella catena del valore",
    "Processi per l'impegno con i lavoratori nella catena del valore e i loro rappresentanti riguardo agli impatti materiali",
    "Processi per rimediare agli impatti negativi materiali e canali per i lavoratori nella catena del valore per esprimere preoccupazioni",
    "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per i lavoratori nella catena del valore",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati ai lavoratori nella catena del valore"
  ],
  S3: [
    "Comunità interessate",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alle comunità interessate",
    "Processi per l'impegno con le comunità interessate riguardo agli impatti materiali",
    "Processi per rimediare agli impatti negativi materiali e canali per le comunità interessate per esprimere preoccupazioni",
    "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per le comunità interessate",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alle comunità interessate"
  ],
  S4: [
    "Consumatori e utilizzatori finali",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali",
    "Processi per l'impegno con i consumatori e gli utilizzatori finali riguardo agli impatti materiali",
    "Processi per rimediare agli impatti negativi materiali e canali per i consumatori e gli utilizzatori finali per esprimere preoccupazioni",
    "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per i consumatori e agli utilizzatori finali",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali"
  ],
  G1: [
    "Condotta delle imprese",
    "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
    "Processi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
    "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per la condotta delle imprese",
    "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
    "Cultura aziendale",
    "Gestione dei rapporti con i fornitori",
    "Formazione e sensibilizzazione su anti-corruzione e anti-bribery",
    "Incidenti di corruzione o bribery",
    "Attività di lobbying",
    "Pratiche di pagamento"
  ]
};

function Checklist({ audit, onUpdate }) {
  const [filter, setFilter] = useState('');
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { comments = {}, files = {}, completed = {}, stato } = audit;
  const storage = useStorage();

  const safeUpdate = (updates) => {
    try {
      const updatedAudit = { ...audit, ...updates };
      const auditString = JSON.stringify(updatedAudit);
      localStorage.setItem('audits', auditString);
      onUpdate(updatedAudit);
      setErrorMessage('');
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        setErrorMessage('Limite di memoria del browser superato. Esporta i dati e svuota la cache o usa un backend.');
      } else {
        setErrorMessage('Errore durante il salvataggio: ' + e.message);
      }
    }
  };

  const handleCommentChange = (category, item, value) => {
    const key = `${category}-${item}`;
    safeUpdate({
      comments: { ...comments, [key]: value }
    });
  };

  //const handleFileUpload = (key, event) => {
  //  const newFiles = event.target.files;
  //  const currentFiles = files[key] || [];
  //  const newFileArray = [...currentFiles];
//
  //  for (let i = 0; i < newFiles.length; i++) {
  //    const file = newFiles[i];
  //    if (newFileArray.length >= 5) {
  //      alert('Raggiunto il limite di 5 file per item. Rimuovi un file prima di aggiungerne altri.');
  //      return;
  //    }
  //    const reader = new FileReader();
  //    reader.onloadend = () => {
  //      newFileArray.push({
  //        name: file.name,
  //        type: file.type,
  //        data: reader.result
  //      });
  //      safeUpdate({
  //        files: { ...files, [key]: newFileArray }
  //      });
  //    };
  //    reader.readAsDataURL(file);
  //  }
  //};

  const handleFileUploadFS = async (key, event) => {
    if (!storage.ready()) {
      alert('Seleziona prima la cartella audit');
      return;
    }
    const list = [...(files[key] ?? [])];
    for (const file of event.target.files) {
      if (list.length >= 5) {
        alert('Limite 5 file per item');
        break;
      }
      const meta = await storage.saveEvidence(key, file);
      list.push({ name: meta.name, type: meta.type, path: meta.path });
    }
    safeUpdate({ files: { ...files, [key]: list } });
  };

  const removeFile = (key, index) => {
    const currentFiles = files[key] || [];
    const newFileArray = currentFiles.filter((_, i) => i !== index);
    safeUpdate({
      files: { ...files, [key]: newFileArray }
    });
  };

  const handleCompletedChange = (category, item) => {
    const key = `${category}-${item}`;
    safeUpdate({
      completed: { ...completed, [key]: !completed[key] }
    });
  };

  const exportSelections = () => {
    const selections = Object.keys(comments).filter(key => {
      const comment = comments[key] || '';
      return comment.trim().length > 0;
    }).map(key => {
      const [category, item] = key.split('-');
      return {
        category,
        item,
        comment: comments[key] || '',
        files: files[key] || [],
        terminato: !!completed[key]
      };
    });
    const fileName = `audit_${audit.azienda}_${audit.id}_${new Date().toISOString()}.json`;
    const dataStr = JSON.stringify({
      azienda: audit.azienda,
      dimensione: audit.dimensione,
      dataAvvio: audit.dataAvvio,
      stato: audit.stato,
      selections
    }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    safeUpdate({
      exportHistory: [...(audit.exportHistory || []), { fileName, dataExport: new Date().toISOString() }]
    });
  };

  const exportSelectionsFS = async () => {
    if (!storage.ready()) {
      alert('Seleziona la cartella audit');
      return;
    }
    const selections = Object.keys(comments).map(key => {
      const [category, item] = key.split('-');
      return {
        category,
        item,
        comment: (comments[key] ?? '').trim(),
        files: (files[key] ?? []).map(f => ({ name: f.name, type: f.type, path: f.path })),
        completed: !!completed[key]
      };
    });
    const payload = {
      meta: {
        azienda: audit.azienda,
        id: audit.id,
        dimensione: audit.dimensione,
        dataAvvio: audit.dataAvvio,
        stato: audit.stato,
        esrsVersion: 'ESRS 2024-12',
        exportedAt: new Date().toISOString()
      },
      selections
    };
    const { fileName } = await storage.saveExport(payload);
    safeUpdate({
      exportHistory: [...(audit.exportHistory ?? []), { fileName, dataExport: new Date().toISOString() }]
    });
    alert(`Export salvato: ${fileName}`);
  };

 const checkFileAccess = async (file) => {
  try {
    const handle = await window.showDirectoryPicker(); // oppure usa handle già salvato
    const fileHandle = await handle.getFileHandle(file.path, { create: false });
    await fileHandle.getFile(); // verifica accesso
    return file;
  } catch (error) {
    return { ...file, status: "non trovato - spostato" };
  }
};

const handleImportJSON = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      const importedSelections = importedData.selections ?? [];
      const newComments = {};
      const newFiles = {};
      const newCompleted = {};

      for (const s of importedSelections) {
        const key = `${s.category}-${s.item}`;
        newComments[key] = s.comment;
        newCompleted[key] = s.terminato;

        const checkedFiles = await Promise.all(
          (s.files ?? []).map(checkFileAccess)
        );
        newFiles[key] = checkedFiles;
      }

      safeUpdate({
        comments: newComments,
        files: newFiles,
        completed: newCompleted
      });

      alert("Dati importati con verifica accessibilità file.");
    } catch (error) {
      alert("Errore durante l'importazione del file JSON: " + error.message);
    }
  };

  reader.readAsText(file);
};

  const handleCloseAudit = () => {
    if (window.confirm("Vuoi chiudere definitivamente questo audit?")) {
      safeUpdate({ stato: 'chiuso' });
    }
  };

  const pickAuditDirectory = async () => {
    try {
      await storage.initAuditTree({ id: audit.id });
      alert('Cartella audit collegata.');
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const generateReport = () => {
    const selections = Object.keys(comments).filter(key => {
      const comment = comments[key] || '';
      return comment.trim().length > 0;
    }).map(key => {
      const [category, item] = key.split('-');
      return {
        category,
        item,
        comment: comments[key] || 'Nessun commento',
        files: files[key] || [],
        terminato: !!completed[key]
      };
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report ESG - ${audit.azienda}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Times New Roman', Times, serif; padding: 20px; }
          h1 { font-size: 24pt; color: #000; }
          h2 { font-size: 18pt; color: #333; margin-top: 20px; }
          h3 { font-size: 14pt; color: #555; margin-top: 15px; }
          p { font-size: 12pt; margin: 5px 0; }
          img { max-width: 100%; height: auto; border: 1px solid #ccc; margin: 5px 0; }
          .section { margin-bottom: 20px; page-break-inside: avoid; }
          @media print { img { max-width: 80%; } }
        </style>
      </head>
      <body>
        <h1>Report ESG - ${audit.azienda} (${audit.dimensione})</h1>
        <p><b>Stato Audit:</b> ${audit.stato}</p>
        <p><b>Data Avvio:</b> ${audit.dataAvvio}</p>
        ${Object.keys(esrsDetails).map(category => `
          <div class="section">
            <h2>${category}</h2>
            ${esrsDetails[category].map(item => {
              const data = selections.find(s => s.item === item && s.category === category);
              return data ? `
                <div>
                  <h3>${item}</h3>
                  <p><b>Terminato:</b> ${data.terminato ? 'Sì' : 'No'}</p>
                  <p><b>Commento:</b> ${data.comment.replace(/\n/g, '<br>')}</p>
                  ${data.files.map((file, idx) => file.path ? `
                    <p><a href="#" onclick="alert('File salvato in ${file.path}. Apri la cartella audit per visualizzarlo.');">${file.name}</a></p>
                  ` : `
                    <img src="${file.data}" alt="${file.name}" style="max-width: 200px;">
                  `).join('')}
                </div>
              ` : '';
            }).join('')}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${audit.azienda}_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    alert('Il report è stato scaricato come HTML. Apri il file con Microsoft Word per salvarlo come .docx.');
  };

  const filteredCategories = Object.keys(esrsDetails).filter(category =>
    category.toLowerCase().includes(filter.toLowerCase()) ||
    esrsDetails[category].some(item => item.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div>
      <h2>Checklist ESG – {audit.azienda} ({audit.dimensione})</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <input
        type="text"
        placeholder="Filtra categorie o domande..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ margin: '10px', padding: '5px' }}
      />
      <label style={{ marginLeft: 12 }}>
        <input
          type="checkbox"
          checked={showOnlyOpen}
          onChange={(e) => setShowOnlyOpen(e.target.checked)}
        />
        Mostra solo punti aperti
      </label>
      <button onClick={exportSelectionsFS} style={{ margin: '10px' }}>
        Salva Export in cartella
      </button>
      <button onClick={exportSelections} style={{ margin: '10px' }}>
        Esporta come JSON
      </button>
      <input type="file" accept=".json" onChange={handleImportJSON} style={{ margin: '10px' }} />
      <label style={{ marginLeft: 8 }}>Import JSON</label>
      <button onClick={generateReport} style={{ margin: '10px' }}>Genera Report HTML</button>
      {audit.stato === 'in corso' && (
        <button onClick={handleCloseAudit} style={{ margin: '10px', background: 'orange' }}>
          Chiudi audit
        </button>
      )}
      <button onClick={() => { localStorage.clear(); alert('localStorage svuotato!'); }} style={{ margin: '10px', background: '#ff4444' }}>
        Svuota localStorage
      </button>
      <button onClick={pickAuditDirectory} style={{ margin: '10px', background: '#0078d4', color: '#fff' }}>
        Seleziona cartella audit…
      </button>

      {filteredCategories.map((category, categoryIndex) => (
        <div key={category}>
          <h3>{category}</h3>
          <ol start={categoryIndex * 10 + 1}>
            {esrsDetails[category]
              .filter(item => !showOnlyOpen || !completed[`${category}-${item}`])
              .map((item, itemIndex) => {
                const key = `${category}-${item}`;
                return (
                  <li key={`${category}-${itemIndex}-${item}`} value={itemIndex + 1}>
                    {item}
                    <textarea
                      placeholder="Aggiungi evidenze..."
                      value={comments[key] || ''}
                      onChange={e => handleCommentChange(category, item, e.target.value)}
                      style={{ display: 'block', margin: '5px 0', width: '300px' }}
                      disabled={stato === 'chiuso'}
                    />
                    <input
                      type="file"
                      accept="image/*,*/*"
                      multiple
                      onChange={e => handleFileUploadFS(key, e)}
                      style={{ margin: '5px 0' }}
                      disabled={stato === 'chiuso'}
                    />
                    {(files[key] || []).map((file, index) => (
                      <div key={index}>
                        {file.path ? (
                          <>
                            <button
                              type="button"
                              onClick={() => alert(`File salvato in ${file.path}. Apri la cartella audit per visualizzarlo.`)}
                              style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                            >
                              {file.name}
                            </button>
                            {file.status === "non trovato - spostato" && (
                              <span style={{ color: 'red', marginLeft: '8px' }}>⚠️ {file.status}</span>
                            )}
                          </>
                        ) : (
                          file.type && file.type.startsWith('image/') ? (
                            <img src={file.data} alt={file.name} style={{ maxWidth: '200px', margin: '5px' }} />
                          ) : (
                            <a href={file.data} download={file.name}>{file.name}</a>
                          )
                        )}
                        <button onClick={() => removeFile(key, index)} disabled={stato === 'chiuso'}>Rimuovi</button>
                      </div>
                    ))}
                    <label style={{ marginLeft: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!completed[key]}
                        onChange={() => handleCompletedChange(category, item)}
                        disabled={stato === 'chiuso'}
                      /> Terminato
                    </label>
                  </li>
                );
              })}
          </ol>
        </div>
      ))}
      <div style={{ marginTop: 24 }}>
        <b>Export precedenti:</b>
        <ul>
          {(audit.exportHistory || []).map(e => (
            <li key={e.fileName}>{e.fileName} ({e.dataExport})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Checklist;