import React, { useState } from 'react';

const esrsDetails = {
  // [Mantenere le categorie e domande come nel tuo codice originale]
 Generale: [
    "Le conoscenze sulla sostenibilità sono sufficienti per applicarla in azienda?",
    "L’azienda ha avviato azioni concrete e dimostrabili per la sostenibilità?",
    "L’azienda possiede certificazioni di qualità, ambientali o sociali?",
    "L’azienda ha un bilancio di sostenibilità che rendiconta impatti ambientali, economici e sociali?",
    "Gli stakeholder chiedono informazioni sulla sostenibilità?",
    "Sono noti e applicati i 17 SDGs dell’Agenda ONU 2030?",
    "L’azienda ha in programma di implementare o aumentare la sostenibilità nei prossimi 12/24 mesi?",
    "Anche gli istituti finanziari considerano la gestione della sostenibilità per l’accesso al credito?",
    "L’azienda ha ricevuto richieste di informazioni sulla sostenibilità da stakeholder?"
  ],
  Ambientale: [
    "Sono state adottate azioni per ridurre le emissioni di CO2?",
    "Sono stati introdotti strumenti per ridurre il consumo idrico?",
    "Sono state realizzate iniziative per ridurre rifiuti e materiali di scarto?",
    "Sono presenti politiche di acquisto green?",
    "L’azienda produce o utilizza energia rinnovabile?",
    "Sono presenti spazi verdi o azioni per la biodiversità?",
    "Sono promossi programmi di formazione ambientale?",
    "L’azienda ha un piano di gestione della mobilità per ridurre l’impatto dei trasporti?",
    "Sono adottate politiche per favorire mezzi di trasporto a basso impatto?"
  ],
  Sociale: [
    "Sono stati assunti nuovi dipendenti negli ultimi due anni?",
    "Sono promosse azioni per l’inserimento dei giovani?",
    "L’azienda ha introdotto flessibilità di orario?",
    "Sono state sviluppate flessibilità con imprese locali per i dipendenti?",
    "Esiste un piano di welfare aziendale?",
    "Sono realizzate iniziative per salute e sicurezza oltre gli obblighi di legge?",
    "L’azienda adotta lo smart working?",
    "I dipendenti partecipano a corsi di formazione oltre quelli obbligatori?",
    "Sono previste forme incentivanti per la formazione extra-orario?",
    "L’azienda ha un codice etico pubblico?",
    "Sono in atto azioni di incentivazione verso i dipendenti in ambito sostenibilità?",
    "L’azienda ha un piano di sviluppo carriera?",
    "Sono adottate azioni di solidarietà sociale e limitazione degli sprechi?",
    "Sono state messe in atto iniziative per garantire la parità di genere?",
    "L’azienda ha intrapreso il percorso di certificazione per la parità di genere?"
  ],
  Governance: [
    "Esiste un modello di gestione del rischio aggiornato?",
    "Sono presenti azioni per la cultura dell’equità di genere?",
    "L’azienda partecipa a partnership pubblico-private per la sostenibilità?",
    "Il titolare o i rappresentanti hanno svolto corsi di gestione aziendale?",
    "Sono in atto processi di digitalizzazione?",
    "Sono presenti procedure di trasparenza, rendicontazione e risk assessment?",
    "L’azienda monitora i rischi climatici, di compliance, privacy, concorrenza?",
    "Sono implementate procedure di whistleblowing e prevenzione della corruzione?",
    "La governance coinvolge attivamente gli stakeholder nelle decisioni strategiche?"
  ]
};

function Checklist({ audit, onUpdate }) {
  const [filter, setFilter] = useState('');
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { checklist = {}, comments = {}, files = {}, completed = {}, stato } = audit;

  // Funzione per aggiornare i dati con gestione dell'errore
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

  // [Mantenere handleCheckboxChange, handleCommentChange, handleFileUpload, removeFile, handleCompletedChange come nel codice precedente]

  const handleCommentChange = (category, item, value) => {
    const key = `${category}-${item}`;
    safeUpdate({
      comments: { ...comments, [key]: value }
    });
  };

  const handleFileUpload = (category, item, event) => {
    const newFiles = event.target.files;
    const key = `${category}-${item}`;
    const currentFiles = files[key] || [];
    const newFileArray = [...currentFiles];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (newFileArray.length >= 5) { // Limite arbitrario per evitare overload
        alert('Raggiunto il limite di 5 file per item. Rimuovi un file prima di aggiungerne altri.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        newFileArray.push({
          name: file.name,
          type: file.type,
          data: reader.result // Base64, ma limitato
        });
        safeUpdate({
          files: { ...files, [key]: newFileArray }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (category, item, index) => {
    const key = `${category}-${item}`;
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

  // Export JSON
  const exportSelections = () => {
    const selections = Object.keys(checklist).map(key => {
      const [category, item] = key.split('-');
      return {
        category,
        item,
        checked: !!checklist[key],
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

  // Import JSON
  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedData = JSON.parse(e.target.result);
        const importedSelections = importedData.selections || [];
        const newChecklist = {};
        const newComments = {};
        const newFiles = {};
        const newCompleted = {};

        importedSelections.forEach(s => {
          const key = `${s.category}-${s.item}`;
          newChecklist[key] = s.checked;
          newComments[key] = s.comment;
          newFiles[key] = s.files || [];
          newCompleted[key] = s.terminato;
        });

        safeUpdate({
          checklist: newChecklist,
          comments: newComments,
          files: newFiles,
          completed: newCompleted
        });
        alert('Dati importati con successo!');
      };
      reader.readAsText(file);
    }
  };

  // Chiusura audit
  const handleCloseAudit = () => {
    if (window.confirm("Vuoi chiudere definitivamente questo audit?")) {
      safeUpdate({ stato: 'chiuso' });
    }
  };

  // Definizione di filteredCategories per il filtro dinamico
  const filteredCategories = Object.keys(esrsDetails).filter(category =>
    category.toLowerCase().includes(filter.toLowerCase()) ||
    esrsDetails[category].some(item => item.toLowerCase().includes(filter.toLowerCase()))
  );

  // Generate Report (mantenuto come prima)
  const generateReport = () => {
    const selections = Object.keys(checklist).map(key => {
      const [category, item] = key.split('-');
      return {
        category,
        item,
        checked: !!checklist[key],
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
                  <p><b>Completato:</b> ${data.checked ? 'Sì' : 'No'}</p>
                  <p><b>Terminato:</b> ${data.terminato ? 'Sì' : 'No'}</p>
                  <p><b>Commento:</b> ${data.comment.replace(/\n/g, '<br>')}</p>
                  ${data.files.map((file, idx) => file.type.startsWith('image/') ? `
                    <img src="${file.data}" alt="${file.name}" style="max-width: 200px;">
                  ` : `<p><a href="${file.data}" download="${file.name}">File: ${file.name}</a></p>`).join('')}
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

  return (
    <div>
      <h2>Checklist ESG – {audit.azienda} ({audit.dimensione})</h2>
      <p>Stato audit: <b>{audit.stato}</b></p>
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
          onChange={e => setShowOnlyOpen(e.target.checked)}
        />
        Mostra solo punti aperti
      </label>
      <button onClick={exportSelections} style={{ margin: '10px' }}>Export Selections</button>
      <input type="file" accept=".json" onChange={handleImportJSON} style={{ margin: '10px' }} />
      <label style={{ marginLeft: 8 }}>Import JSON</label>
      <button onClick={generateReport} style={{ margin: '10px' }}>Genera Report HTML</button>
      {audit.stato === 'in corso' && (
        <button onClick={handleCloseAudit} style={{ margin: '10px', background: 'orange' }}>
          Chiudi audit
        </button>
      )}
      {filteredCategories.map(category => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {esrsDetails[category]
              .filter(item => !showOnlyOpen || !completed[`${category}-${item}`])
              .map(item => {
                const key = `${category}-${item}`;
                return (
                  <li key={item}>
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
                      onChange={e => handleFileUpload(category, item, e)}
                      style={{ margin: '5px 0' }}
                      disabled={stato === 'chiuso'}
                    />
                    {(files[key] || []).map((file, index) => (
                      <div key={index}>
                        {file.type.startsWith('image/') ? (
                          <img src={file.data} alt={file.name} style={{ maxWidth: '200px', margin: '5px' }} />
                        ) : (
                          <a href={file.data} download={file.name}>{file.name}</a>
                        )}
                        <button onClick={() => removeFile(category, item, index)} disabled={stato === 'chiuso'}>Rimuovi</button>
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
          </ul>
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