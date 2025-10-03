import { PredictionEngine, predictPregnancy } from "cyclia";

// Пример 1: Прогнозирование беременности по дате последней менструации
const lastPeriodDate = new Date("2025-01-15");
const pregnancyPrediction = predictPregnancy(lastPeriodDate);

console.log("=== Прогноз беременности ===");
console.log("Дата последней менструации:", lastPeriodDate.toISOString().split('T')[0]);
console.log("Предполагаемая дата родов:", pregnancyPrediction.dueDate.toISOString().split('T')[0]);
console.log("Текущая неделя:", pregnancyPrediction.currentWeek);
console.log("Текущий триместр:", pregnancyPrediction.currentTrimester);
console.log("Дней до родов:", pregnancyPrediction.daysRemaining);
console.log("Вехи развития:", pregnancyPrediction.milestones);

// Пример 2: Использование через PredictionEngine
const engine = new PredictionEngine({ strategy: "wma" });

// История менструальных циклов
const history = {
  periodStarts: [
    { date: "2024-12-01" },
    { date: "2024-12-29" }, // 28 дней
    { date: "2025-01-26" }, // 28 дней
    { date: "2025-02-23" }, // 28 дней
    { date: "2025-03-23" }, // 28 дней
  ],
};

// Прогнозирование беременности на основе истории
try {
  const pregnancyFromHistory = engine.predictPregnancyFromHistory(history);
  
  console.log("\n=== Прогноз беременности из истории ===");
  console.log("Предполагаемая дата родов:", pregnancyFromHistory.dueDate.toISOString().split('T')[0]);
  console.log("Текущая неделя:", pregnancyFromHistory.currentWeek);
  console.log("Текущий триместр:", pregnancyFromHistory.currentTrimester);
  console.log("Дней до родов:", pregnancyFromHistory.daysRemaining);
  console.log("Вехи развития:", pregnancyFromHistory.milestones);
} catch (error) {
  console.error("Ошибка при прогнозировании беременности:", error.message);
}

// Пример 3: Комплексный анализ с прогнозами циклов и беременности
console.log("\n=== Комплексный анализ ===");

// Анализ истории циклов
const summary = engine.analyze(history);
console.log("Анализ циклов:");
console.log("- Размер выборки:", summary.sampleSize);
console.log("- Средний цикл:", summary.averageCycle?.toFixed(1), "дней");
console.log("- Регулярность:", summary.irregular ? "Нерегулярный" : "Регулярный");
console.log("- Качество данных:", summary.dataQuality);

// Прогноз следующей менструации
const nextPeriod = engine.predictNextPeriod(history);
console.log("\nПрогноз следующей менструации:");
console.log("- Вероятная дата:", nextPeriod.likely);
console.log("- Окно прогноза:", nextPeriod.window?.start, "-", nextPeriod.window?.end);
console.log("- Уверенность:", Math.round(nextPeriod.confidence * 100) + "%");

// Прогноз овуляции
const ovulation = engine.predictOvulation(history);
console.log("\nПрогноз овуляции:");
console.log("- Вероятная дата:", ovulation.likely);
console.log("- Уверенность:", Math.round(ovulation.confidence * 100) + "%");

// Фертильное окно
const fertile = engine.predictFertileWindow(history);
console.log("\nФертильное окно:");
console.log("- Период:", fertile.start, "-", fertile.end);
console.log("- Пик фертильности:", fertile.peak);
console.log("- Уверенность:", Math.round(fertile.confidence * 100) + "%");
