import React, { useState } from 'react';

const esrsDetails = {
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
    "Sono state sviluppate convenzioni con imprese locali per i dipendenti?",
    "Esiste un piano di welfare aziendale?",
    "Sono realizzate iniziative per salute e sicurezza oltre gli obblighi di legge?",
    "L’azienda adotta lo smart working?",
    "I dipendenti partecipano a corsi di formazione oltre quelli obbligatori?",
    "Sono previste forme incentivanti per la formazione extra-orario?",
    "L’azienda ha un codice etico pubblico?",
    "Sono adottate azioni di incentivazione verso i dipendenti in ambito sostenibilità?",
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

  const { checklist = {}, comments = {}, photos = {}, completed = {}, stato } = audit;

  // Filtra categorie e domande
  const filteredCategories = Object.keys(esrsDetails).filter(category =>
    category.toLowerCase().includes(filter.toLowerCase()) ||
    esrsDetails[category].some(item =>
      item.toLowerCase().includes(filter.toLowerCase())
    )
  );

  // Funzioni di update
  const handleCheckboxChange = (category, item) => {
    const key = `${category}-${item}`;
    onUpdate({
      checklist: { ...checklist, [key]: !checklist[key] }
    });
  };

  const handleCommentChange = (category, item, value) => {
    const key = `${category}-${item}`;
    onUpdate({
      comments: { ...comments, [key]: value }
    });
  };

  const handlePhotoUpload = (category, item, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        const key = `${category}-${item}`;
        onUpdate({
          photos: { ...photos, [key]: reader.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestione flag "terminato"
  const handleCompletedChange = (category, item) => {
    const key = `${category}-${item}`;
    onUpdate({
      completed: { ...completed, [key]: !completed[key] }
    });
  };

  // Export JSON
  const exportSelections = () => {
    const selections = Object.keys(checklist)
      .map(key => {
        const [category, item] = key.split('-');
        return {
          category,
          item,
          checked: !!checklist[key],
          comment: comments[key] || '',
          photo: photos[key] || '',
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
    // Aggiorna la history export
    onUpdate({
      exportHistory: [...(audit.exportHistory || []), { fileName, dataExport: new Date().toISOString() }]
    });
  };

  // Chiusura audit
  const handleCloseAudit = () => {
    if (window.confirm("Vuoi chiudere definitivamente questo audit?")) {
      onUpdate({ stato: 'chiuso' });
    }
  };
const generateReport = () => {
  // Costruisci la tabella delle risposte
  const selections = Object.keys(checklist).map(key => {
    const [category, item] = key.split('-');
    return {
      category,
      item,
      checked: !!checklist[key],
      comment: comments[key] || '',
      photo: photos[key] || '',
      terminato: !!completed[key]
    };
  });

  // Costruisci il corpo HTML
  let html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Report Audit ESG - ${audit.azienda}</title>
      <style>
        body { font-family: Arial; }
        h1 { color: #1a4d8f; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 6px; }
        th { background: #f0f0f0; }
        img { max-width: 200px; }
      </style>
    </head>
    <body>
      <h1>Report Audit ESG</h1>
      <p><b>Azienda:</b> ${audit.azienda}</p>
      <p><b>Dimensione:</b> ${audit.dimensione}</p>
      <p><b>Data avvio:</b> ${audit.dataAvvio}</p>
      <p><b>Stato audit:</b> ${audit.stato}</p>
      <table>
        <tr>
          <th>Categoria</th>
          <th>Domanda</th>
          <th>Completata</th>
          <th>Risposta</th>
          <th>Evidenze</th>
          <th>Foto</th>
        </tr>
        ${selections.map(sel => `
          <tr>
            <td>${sel.category}</td>
            <td>${sel.item}</td>
            <td>${sel.terminato ? '✔️' : ''}</td>
            <td>${sel.checked ? '✔️' : ''}</td>
            <td>${sel.comment.replace(/\n/g, "<br/>")}</td>
            <td>${sel.photo ? `<img src="${sel.photo}" alt="evidenza"/>` : ''}</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;

  // Download diretto
  const blob = new Blob([html], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `report_audit_${audit.azienda}_${audit.id}.html`;
  link.click();
  window.URL.revokeObjectURL(url);
};

  return (
    <div>
      <h2>Checklist ESG – {audit.azienda} ({audit.dimensione})</h2>
      <p>Stato audit: <b>{audit.stato}</b></p>
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
                    <input
                      type="checkbox"
                      checked={!!checklist[key]}
                      onChange={() => handleCheckboxChange(category, item)}
                      disabled={stato === 'chiuso'}
                    />
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
                      accept="image/*"
                      onChange={e => handlePhotoUpload(category, item, e)}
                      style={{ margin: '5px 0' }}
                      disabled={stato === 'chiuso'}
                    />
                    {photos[key] && (
                      <img src={photos[key]} alt="Evidence" style={{ maxWidth: '200px', margin: '5px' }} />
                    )}
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
