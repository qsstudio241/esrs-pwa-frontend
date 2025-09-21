import esrsDetails from "../data/esrsDetails";

function findItemId(category, labelStartsWith) {
  const items = esrsDetails[category] || [];
  const lower = labelStartsWith.toLowerCase();
  const found = items.find((it) =>
    (it.item || "").toLowerCase().startsWith(lower)
  );
  return found ? found.itemId : null;
}

// Schema fields: { key, label, type: 'bool'|'number'|'enum'|'text'|'date', required?, min?, max?, unit?, enum? }
// Custom checks per item implement normative consistency.
export function getKpiSchemasGenerale() {
  const idDoppia = findItemId("Generale", "Doppia rilevanza come base");
  const idCatena = findItemId("Generale", "Catena del valore");
  const idOrizzonti = findItemId("Generale", "Orizzonti temporali");

  const schemas = {};
  if (idDoppia) {
    schemas[idDoppia] = {
      title: "Doppia rilevanza",
      fields: [
        {
          key: "valutazione_materialita_eseguita",
          label: "Valutazione materialità eseguita",
          type: "bool",
          required: true,
        },
        {
          key: "coinvolgimento_stakeholder",
          label: "Coinvolgimento stakeholder svolto",
          type: "bool",
          required: true,
        },
        {
          key: "metodologia",
          label: "Metodologia",
          type: "enum",
          enum: ["ESRS/CSRD", "Proprietaria", "Altro"],
          required: false,
        },
        { key: "data", label: "Data valutazione", type: "date" },
      ],
      checks: [
        {
          code: "DM_REQUIRED",
          message:
            "La doppia materialità deve essere eseguita e coinvolgere gli stakeholder",
          test: (inputs) =>
            !!inputs.valutazione_materialita_eseguita &&
            !!inputs.coinvolgimento_stakeholder,
        },
      ],
    };
  }

  if (idCatena) {
    schemas[idCatena] = {
      title: "Catena del valore",
      fields: [
        {
          key: "confini_reporting_definiti",
          label: "Confini di reporting definiti",
          type: "bool",
          required: true,
        },
        {
          key: "copertura_upstream",
          label: "Copertura upstream",
          type: "number",
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "copertura_downstream",
          label: "Copertura downstream",
          type: "number",
          min: 0,
          max: 100,
          unit: "%",
        },
      ],
      checks: [
        {
          code: "BOUNDARIES_REQUIRED",
          message: "Definisci i confini di reporting",
          test: (i) => !!i.confini_reporting_definiti,
        },
        {
          code: "COVERAGE_MIN",
          message:
            "Copertura upstream e downstream attesa >= 80% (valore indicativo per test)",
          test: (i) =>
            (i.copertura_upstream ?? 0) >= 80 &&
            (i.copertura_downstream ?? 0) >= 80,
        },
      ],
    };
  }

  if (idOrizzonti) {
    schemas[idOrizzonti] = {
      title: "Orizzonti temporali",
      fields: [
        {
          key: "orizzonte_breve_anni",
          label: "Breve (anni)",
          type: "number",
          min: 1,
          max: 3,
          required: true,
        },
        {
          key: "orizzonte_medio_anni",
          label: "Medio (anni)",
          type: "number",
          min: 3,
          max: 10,
          required: true,
        },
        {
          key: "orizzonte_lungo_anni",
          label: "Lungo (anni)",
          type: "number",
          min: 10,
          required: true,
        },
      ],
      checks: [
        {
          code: "RANGE_VALID",
          message:
            "Gli orizzonti devono essere crescenti: breve < medio < lungo",
          test: (i) =>
            i.orizzonte_breve_anni < i.orizzonte_medio_anni &&
            i.orizzonte_medio_anni < i.orizzonte_lungo_anni,
        },
      ],
    };
  }

  return schemas;
}
