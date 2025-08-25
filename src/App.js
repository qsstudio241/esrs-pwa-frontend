import React, { useState, useEffect } from 'react';
import Checklist from './Checklist';

// Utility per generare un ID univoco
const generateId = () => 'audit_' + Date.now();

function AuditSelector({ audits, onSelectAudit, onCreateAudit, showClosed, setShowClosed }) {
  const [azienda, setAzienda] = useState('');
  const [dimensione, setDimensione] = useState('Micro');
  const [showNew, setShowNew] = useState(false);

  const auditsToShow = audits.filter(a => showClosed || a.stato === 'in corso');

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Seleziona audit</h2>
      <select onChange={e => onSelectAudit(e.target.value)} value="">
        <option value="">-- Seleziona --</option>
        {auditsToShow.map(a => (
          <option key={a.id} value={a.id}>
            {a.azienda} ({a.dimensione}) - {a.stato}
          </option>
        ))}
      </select>
      <label style={{ marginLeft: 12 }}>
        <input
          type="checkbox"
          checked={showClosed}
          onChange={e => setShowClosed(e.target.checked)}
        />
        Mostra anche audit chiusi
      </label>
      <button style={{ marginLeft: 12 }} onClick={() => setShowNew(!showNew)}>
        Nuovo audit
      </button>
      {showNew && (
        <div style={{ marginTop: 12 }}>
          <input
            placeholder="Nome azienda"
            value={azienda}
            onChange={e => setAzienda(e.target.value)}
          />
          <select value={dimensione} onChange={e => setDimensione(e.target.value)}>
            <option value="Micro">Micro</option>
            <option value="Piccola">Piccola</option>
            <option value="Media">Media</option>
            <option value="Grande">Grande</option>
          </select>
          <button
            onClick={() => {
              if (azienda) {
                onCreateAudit({
                  id: generateId(),
                  azienda,
                  dimensione,
                  stato: 'in corso',
                  dataAvvio: new Date().toISOString(),
                  checklist: {},
                  comments: {},
                  photos: {},
                  exportHistory: [],
                });
                setAzienda('');
                setShowNew(false);
              }
            }}
          >
            Crea
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [audits, setAudits] = useState(() => {
    const saved = localStorage.getItem('audits');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentAuditId, setCurrentAuditId] = useState('');
  const [showClosed, setShowClosed] = useState(false);

  useEffect(() => {
    localStorage.setItem('audits', JSON.stringify(audits));
  }, [audits]);

  const currentAudit = audits.find(a => a.id === currentAuditId);

  const handleSelectAudit = (id) => setCurrentAuditId(id);

  const handleCreateAudit = (newAudit) => {
    setAudits(prev => [...prev, newAudit]);
    setCurrentAuditId(newAudit.id);
  };

  const updateCurrentAudit = (data) => {
    setAudits(prev =>
      prev.map(a =>
        a.id === currentAuditId ? { ...a, ...data } : a
      )
    );
  };

  return (
    <div className="App">
      <AuditSelector
        audits={audits}
        onSelectAudit={handleSelectAudit}
        onCreateAudit={handleCreateAudit}
        showClosed={showClosed}
        setShowClosed={setShowClosed}
      />
      {currentAudit && (
        <Checklist
          audit={currentAudit}
          onUpdate={updateCurrentAudit}
        />
      )}
    </div>
  );
}

export default App;
