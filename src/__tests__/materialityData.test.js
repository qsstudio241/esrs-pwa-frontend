/**
 * Test per le funzionalità di materialità e report Word
 */

import {
  getSampleMaterialityData,
  generateScatterChartConfig,
  heraMaterialityData,
} from "../utils/materialitySampleData";

describe("Materiality Sample Data", () => {
  test("should provide HERA materiality data", () => {
    const data = getSampleMaterialityData("energy");

    expect(data).toBeDefined();
    expect(data.companyInfo.name).toBe("HERA Spa");
    expect(data.topics).toHaveLength(10);
    expect(data.metadata.methodology).toBe("PDR 134:2022");

    // Verifica distribuzione quadranti
    const criticalTopics = data.topics.filter((t) => t.quadrant === "critical");
    const impactTopics = data.topics.filter(
      (t) => t.quadrant === "impact-focus"
    );
    const financialTopics = data.topics.filter(
      (t) => t.quadrant === "financial-relevance"
    );
    const monitoringTopics = data.topics.filter(
      (t) => t.quadrant === "monitoring"
    );

    expect(criticalTopics.length).toBe(3); // Transizione energetica, Economia circolare, Gestione idrica
    expect(impactTopics.length).toBe(2); // Biodiversità, Sicurezza lavoratori
    expect(financialTopics.length).toBe(2); // Innovazione digitale, Compliance
    expect(monitoringTopics.length).toBe(3); // Coinvolgimento comunità, Supply chain, Soddisfazione clienti
  });

  test("should provide ENEL materiality data", () => {
    const data = getSampleMaterialityData("electricity");

    expect(data).toBeDefined();
    expect(data.companyInfo.name).toBe("ENEL SpA");
    expect(data.topics.length).toBe(6);
    expect(data.companyInfo.employees).toBe(64000);
    expect(data.companyInfo.revenue).toBe(85700000000); // 85.7 miliardi
  });

  test("should generate scatter chart configuration", () => {
    const chartConfig = generateScatterChartConfig(heraMaterialityData);

    expect(chartConfig).toBeDefined();
    expect(chartConfig.title).toContain("HERA Spa");
    expect(chartConfig.series).toHaveLength(4); // 4 quadranti

    // Verifica assi
    expect(chartConfig.xAxis.title).toBe("Rilevanza Finanziaria (Outside-in)");
    expect(chartConfig.yAxis.title).toBe(
      "Impatto su Sostenibilità (Inside-out)"
    );
    expect(chartConfig.xAxis.max).toBe(5);
    expect(chartConfig.yAxis.max).toBe(5);

    // Verifica soglie
    expect(chartConfig.thresholdLines.horizontal).toBe(
      heraMaterialityData.metadata.threshold
    );
    expect(chartConfig.thresholdLines.vertical).toBe(
      heraMaterialityData.metadata.threshold
    );

    // Verifica statistiche
    expect(chartConfig.stats.totalTopics).toBe(
      heraMaterialityData.topics.length
    );
    expect(chartConfig.stats.criticalTopics).toBe(3);
    expect(parseFloat(chartConfig.stats.avgImpactScore)).toBeGreaterThan(3.0);
    expect(parseFloat(chartConfig.stats.avgFinancialScore)).toBeGreaterThan(
      3.0
    );

    // Verifica etichette quadranti
    expect(chartConfig.quadrantLabels).toHaveLength(4);
    expect(
      chartConfig.quadrantLabels.find((q) => q.text === "CRITICO")
    ).toBeDefined();
    expect(
      chartConfig.quadrantLabels.find((q) => q.text === "FOCUS IMPATTO")
    ).toBeDefined();
    expect(
      chartConfig.quadrantLabels.find((q) => q.text === "RILEVANZA FINANZIARIA")
    ).toBeDefined();
    expect(
      chartConfig.quadrantLabels.find((q) => q.text === "MONITORAGGIO")
    ).toBeDefined();
  });

  test("should validate topic scoring within bounds", () => {
    heraMaterialityData.topics.forEach((topic) => {
      expect(topic.impactScore).toBeGreaterThanOrEqual(0);
      expect(topic.impactScore).toBeLessThanOrEqual(5);
      expect(topic.financialScore).toBeGreaterThanOrEqual(0);
      expect(topic.financialScore).toBeLessThanOrEqual(5);
      expect(topic.quadrant).toBeDefined();
      expect([
        "critical",
        "impact-focus",
        "financial-relevance",
        "monitoring",
      ]).toContain(topic.quadrant);
    });

    // Test specifici per quadranti critici
    const criticalTopics = heraMaterialityData.topics.filter(
      (t) => t.quadrant === "critical"
    );
    const threshold = heraMaterialityData.metadata.threshold;

    criticalTopics.forEach((topic) => {
      expect(topic.impactScore).toBeGreaterThanOrEqual(threshold);
      expect(topic.financialScore).toBeGreaterThanOrEqual(threshold);
    });
  });

  test("should have realistic stakeholder feedback data", () => {
    const topicsWithFeedback = heraMaterialityData.topics.filter(
      (t) => t.stakeholderFeedback
    );

    expect(topicsWithFeedback.length).toBeGreaterThan(0);

    topicsWithFeedback.forEach((topic) => {
      expect(topic.stakeholderFeedback.priority).toBeGreaterThanOrEqual(1);
      expect(topic.stakeholderFeedback.priority).toBeLessThanOrEqual(5);
      expect(topic.stakeholderFeedback.responses).toBeGreaterThan(0);
      expect(topic.stakeholderFeedback.sentiment).toBeTruthy();
      expect(typeof topic.stakeholderFeedback.sentiment).toBe("string");
    });
  });

  test("should generate proper chart series data", () => {
    const chartConfig = generateScatterChartConfig(heraMaterialityData);

    chartConfig.series.forEach((series) => {
      expect(series.name).toBeTruthy();
      expect(series.color).toMatch(/^#[0-9A-F]{6}$/i); // Valid hex color
      expect(Array.isArray(series.data)).toBe(true);

      series.data.forEach((point) => {
        expect(typeof point.x).toBe("number");
        expect(typeof point.y).toBe("number");
        expect(point.name).toBeTruthy();
        expect(point.category).toBeTruthy();
        expect(point.description).toBeTruthy();
      });
    });
  });
});
