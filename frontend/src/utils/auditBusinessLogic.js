// Funzioni di business logic per audit ESRS

// Calcolo automatico della dimensione aziendale
export function calcolaDimensioneAzienda({ fatturato, dipendenti, attivo }) {
  // Soglie di esempio, da personalizzare secondo normativa
  if (fatturato < 700000 && dipendenti < 10 && attivo < 350000) return "Micro";
  if (fatturato < 8000000 && dipendenti < 50 && attivo < 4000000)
    return "Piccola";
  if (fatturato < 40000000 && dipendenti < 250 && attivo < 20000000)
    return "Media";
  return "Grande";
}

// Funzione per esportare selezioni in formato JSON
// Altre funzioni di business logic possono essere aggiunte qui
