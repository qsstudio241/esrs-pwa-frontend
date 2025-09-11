import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

// Funzione per caricare il template Word
async function loadTemplate() {
  try {
    // Per ora useremo un template minimale hardcoded
    // Più avanti lo caricheremo da un file vero
    const response = await fetch('/templates/template-bilancio.docx');
    if (!response.ok) {
      throw new Error('Template non trovato');
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.log('Template non trovato, uso template base');
    return null;
  }
}

// Funzione per generare il documento Word
export async function generateWordReport(bilancioData) {
  try {
    const templateBuffer = await loadTemplate();
    
    if (!templateBuffer) {
      // Se non c'è template, creiamo un documento semplice
      await generateSimpleWordReport(bilancioData);
      return;
    }

    // Usa il template per generare il documento
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Prepara i dati per il template
    const templateData = prepareTemplateData(bilancioData);

    // Inserisce i dati nel template
    doc.setData(templateData);

    try {
      doc.render();
    } catch (error) {
      console.error('Errore nella generazione del documento:', error);
      throw error;
    }

    // Genera il file finale
    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Salva il file
    const fileName = `bilancio-sostenibilita-${new Date().getFullYear()}.docx`;
    saveAs(output, fileName);

  } catch (error) {
    console.error('Errore nella generazione del report Word:', error);
    alert('Errore nella generazione del documento Word: ' + error.message);
  }
}

// Funzione per preparare i dati per il template
function prepareTemplateData(bilancioData) {
  const now = new Date();
  
  return {
    // Dati generali
    azienda: bilancioData.azienda || 'Nome Azienda',
    anno: bilancioData.anno || now.getFullYear(),
    data: now.toLocaleDateString('it-IT'),
    
    // Dati ESG (esempio - adatta ai tuoi dati reali)
    obiettivi: bilancioData.obiettivi || 'Da definire',
    politiche: bilancioData.politiche || 'Da definire',
    
    // Checklist (se esiste)
    checklist: prepareChecklistData(bilancioData.checklist),
    
    // Altri dati che hai nell'app
    ...bilancioData
  };
}

// Prepara i dati della checklist per il template
function prepareChecklistData(checklist) {
  if (!checklist || Object.keys(checklist).length === 0) {
    return 'Nessun elemento nella checklist';
  }

  let checklistText = '';
  Object.entries(checklist).forEach(([key, item]) => {
    const status = item.completed ? '[✓]' : '[ ]';
    checklistText += `${status} ${item.label || key}\n`;
    
    if (item.note) {
      checklistText += `    Note: ${item.note}\n`;
    }
  });

  return checklistText;
}

// Fallback: genera un documento Word semplice senza template
async function generateSimpleWordReport(bilancioData) {
  // Per ora creiamo un documento di testo semplice
  // Più avanti implementeremo un documento Word vero anche senza template
  
  const content = `BILANCIO DI SOSTENIBILITÀ
========================

Azienda: ${bilancioData.azienda || 'Nome Azienda'}
Anno di riferimento: ${bilancioData.anno || new Date().getFullYear()}
Data compilazione: ${new Date().toLocaleDateString('it-IT')}

CHECKLIST VERIFICHE:
${prepareChecklistData(bilancioData.checklist)}

DATI RACCOLTI:
${JSON.stringify(bilancioData, null, 2)}
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const fileName = `bilancio-sostenibilita-${new Date().getFullYear()}.txt`;
  saveAs(blob, fileName);
  
  console.log('Generato documento di testo (template Word non disponibile)');
}